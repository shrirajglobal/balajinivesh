import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ParsedRow {
  partner_arn: string;
  client_name: string;
  folio_number: string;
  pan_number: string;
  amc_name: string;
  scheme_name: string;
  aum_amount: number;
  commission_amount: number;
}

function parseCSV(text: string): ParsedRow[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];

  // Normalize headers: lowercase, trim, replace spaces/special chars with underscore
  const rawHeaders = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/[^a-z0-9]/g, "_"));

  // Map common header variations to our expected field names
  const headerMap: Record<string, string> = {};
  for (const h of rawHeaders) {
    if (h.includes("arn") || h.includes("distributor_code") || h.includes("partner_code")) headerMap[h] = "partner_arn";
    else if (h.includes("investor") || h.includes("client_name") || h.includes("investor_name")) headerMap[h] = "client_name";
    else if (h.includes("folio")) headerMap[h] = "folio_number";
    else if (h.includes("pan")) headerMap[h] = "pan_number";
    else if (h.includes("amc") || h.includes("fund_house")) headerMap[h] = "amc_name";
    else if (h.includes("scheme")) headerMap[h] = "scheme_name";
    else if (h.includes("aum") || h.includes("market_value") || h.includes("current_value") || h.includes("nav_value")) headerMap[h] = "aum_amount";
    else if (h.includes("commission") || h.includes("brokerage")) headerMap[h] = "commission_amount";
  }

  const rows: ParsedRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parse (handles basic quoted fields)
    const values = parseCSVLine(line);
    if (values.length !== rawHeaders.length) continue;

    const record: Record<string, string> = {};
    rawHeaders.forEach((h, idx) => {
      const mapped = headerMap[h];
      if (mapped) record[mapped] = values[idx]?.trim() || "";
    });

    // Skip rows without essential data
    if (!record.partner_arn && !record.client_name) continue;

    rows.push({
      partner_arn: record.partner_arn || "",
      client_name: record.client_name || "",
      folio_number: record.folio_number || "",
      pan_number: record.pan_number || "",
      amc_name: record.amc_name || "Unknown AMC",
      scheme_name: record.scheme_name || "Unknown Scheme",
      aum_amount: parseFloat(record.aum_amount?.replace(/,/g, "") || "0") || 0,
      commission_amount: parseFloat(record.commission_amount?.replace(/,/g, "") || "0") || 0,
    });
  }

  return rows;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get user from token
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized", details: userError?.message }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Check admin role using service client (to bypass RLS on user_roles)
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: roleData } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Admin access required" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const body = await req.json();
    const { upload_id, file_path, month_year } = body;

    if (!upload_id || !file_path || !month_year) {
      return new Response(JSON.stringify({ error: "Missing upload_id, file_path, or month_year" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Download file from storage
    const { data: fileData, error: downloadError } = await adminClient.storage
      .from("rta-statements")
      .download(file_path);

    if (downloadError || !fileData) {
      await adminClient.from("rta_uploads").update({ status: "failed" }).eq("id", upload_id);
      return new Response(JSON.stringify({ error: "Failed to download file", details: downloadError?.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const text = await fileData.text();
    const rows = parseCSV(text);

    if (rows.length === 0) {
      await adminClient.from("rta_uploads").update({ status: "failed", records_processed: 0 }).eq("id", upload_id);
      return new Response(JSON.stringify({ error: "No valid data rows found. Check CSV headers." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Get all partners by ARN
    const { data: partners } = await adminClient.from("partners").select("id, arn_number");
    const arnToPartner = new Map<string, string>();
    (partners || []).forEach((p) => {
      if (p.arn_number) {
        // Store multiple variations of ARN for matching
        const arn = p.arn_number.trim().toUpperCase();
        arnToPartner.set(arn, p.id);
        // Also store without "ARN-" prefix if present
        if (arn.startsWith("ARN-")) {
          arnToPartner.set(arn.substring(4), p.id);
        }
        // Also store with "ARN-" prefix if not present
        if (!arn.startsWith("ARN-") && !arn.startsWith("ARN")) {
          arnToPartner.set(`ARN-${arn}`, p.id);
        }
      }
    });

    let recordsProcessed = 0;
    const unmatchedArns = new Set<string>();

    for (const row of rows) {
      const rowArn = row.partner_arn.trim().toUpperCase();
      const partnerId = arnToPartner.get(rowArn) || 
        arnToPartner.get(rowArn.replace(/^ARN-?/, "")) ||
        arnToPartner.get(`ARN-${rowArn.replace(/^ARN-?/, "")}`);
      
      if (!partnerId) {
        if (row.partner_arn) unmatchedArns.add(row.partner_arn);
        continue;
      }

      // Upsert client
      let clientId: string | null = null;
      if (row.client_name) {
        const { data: existingClient } = await adminClient
          .from("partner_clients")
          .select("id")
          .eq("partner_id", partnerId)
          .eq("client_name", row.client_name)
          .maybeSingle();

        if (existingClient) {
          clientId = existingClient.id;
          // Update folio/PAN if provided
          if (row.folio_number || row.pan_number) {
            const updates: Record<string, string> = {};
            if (row.folio_number) updates.folio_number = row.folio_number;
            if (row.pan_number) updates.pan_number = row.pan_number;
            await adminClient.from("partner_clients").update(updates).eq("id", clientId);
          }
        } else {
          const { data: newClient } = await adminClient
            .from("partner_clients")
            .insert({
              partner_id: partnerId,
              client_name: row.client_name,
              folio_number: row.folio_number || null,
              pan_number: row.pan_number || null,
            })
            .select("id")
            .single();
          clientId = newClient?.id || null;
        }
      }

      // Insert AUM data
      if (row.aum_amount > 0) {
        await adminClient.from("partner_aum_data").insert({
          partner_id: partnerId,
          client_id: clientId,
          amc_name: row.amc_name,
          scheme_name: row.scheme_name,
          aum_amount: row.aum_amount,
          month_year: month_year,
        });
      }

      // Aggregate commission per AMC (insert per row)
      if (row.commission_amount > 0) {
        // Check if commission record exists for this partner/amc/month
        const { data: existingComm } = await adminClient
          .from("partner_commissions")
          .select("id, commission_amount")
          .eq("partner_id", partnerId)
          .eq("amc_name", row.amc_name)
          .eq("month_year", month_year)
          .maybeSingle();

        if (existingComm) {
          await adminClient
            .from("partner_commissions")
            .update({ commission_amount: Number(existingComm.commission_amount) + row.commission_amount })
            .eq("id", existingComm.id);
        } else {
          await adminClient.from("partner_commissions").insert({
            partner_id: partnerId,
            amc_name: row.amc_name,
            month_year: month_year,
            commission_amount: row.commission_amount,
            status: "pending",
          });
        }
      }

      recordsProcessed++;
    }

    // Update upload status
    await adminClient.from("rta_uploads").update({
      status: "completed",
      records_processed: recordsProcessed,
    }).eq("id", upload_id);

    return new Response(
      JSON.stringify({
        success: true,
        records_processed: recordsProcessed,
        total_rows: rows.length,
        unmatched_arns: Array.from(unmatchedArns),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
