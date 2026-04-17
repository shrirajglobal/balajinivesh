// Shared Resend dispatcher for Phase 5 (newsletter + opt-in confirmations).
// Reads the Resend API key from the integration_settings hub OR the RESEND_API_KEY env.
// Falls back gracefully so the function still records what *would* be sent.

import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

interface SendEmailArgs {
  to: string;
  subject: string;
  html: string;
  fromName?: string;
}

interface SendResult {
  ok: boolean;
  id?: string;
  error?: string;
  simulated?: boolean;
}

let cachedKey: string | null | undefined = undefined; // undefined = not yet looked up
let cachedFromAddress: string | null = null;

const PROJECT_REF = Deno.env.get("SUPABASE_URL")?.match(/https:\/\/(.*?)\.supabase\.co/)?.[1] ?? "";

/** Build a Supabase service-role client for reading integration settings. */
const adminClient = (): SupabaseClient => {
  const url = Deno.env.get("SUPABASE_URL")!;
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  return createClient(url, key, { auth: { persistSession: false } });
};

/** Resolve the active Resend API key from the integration hub or env. */
const resolveKey = async (): Promise<string | null> => {
  if (cachedKey !== undefined) return cachedKey;
  // 1) Direct env override (works without integration row)
  const envKey = Deno.env.get("RESEND_API_KEY");
  if (envKey) {
    cachedKey = envKey;
    cachedFromAddress = Deno.env.get("RESEND_FROM_ADDRESS") || "Balaji Nivesh <onboarding@resend.dev>";
    return cachedKey;
  }
  // 2) Integration settings (Resend provider, default + enabled)
  try {
    const sb = adminClient();
    const { data } = await sb
      .from("integration_settings")
      .select("config, secret_names")
      .eq("category", "email")
      .eq("provider_key", "resend")
      .eq("enabled", true)
      .order("is_default", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data) {
      const cfg = (data.config ?? {}) as Record<string, string>;
      cachedFromAddress = cfg.from_address ?? "Balaji Nivesh <onboarding@resend.dev>";
      // The secret value is stored in Supabase secrets keyed by name listed in secret_names
      const secretName = (data.secret_names ?? [])[0];
      if (secretName) {
        const secret = Deno.env.get(secretName);
        if (secret) {
          cachedKey = secret;
          return cachedKey;
        }
      }
    }
  } catch (e) {
    console.warn("[resend] integration lookup failed:", (e as Error).message);
  }
  cachedKey = null;
  return null;
};

/** Send a single email via Resend. Returns { ok, simulated } if no key configured. */
export const sendEmail = async ({ to, subject, html, fromName }: SendEmailArgs): Promise<SendResult> => {
  const key = await resolveKey();
  const from = fromName
    ? `${fromName} <${(cachedFromAddress ?? "onboarding@resend.dev").replace(/^.*</, "").replace(/>$/, "")}>`
    : (cachedFromAddress ?? "Balaji Nivesh <onboarding@resend.dev>");

  if (!key) {
    console.log(`[resend:simulated] to=${to} subject="${subject}" project=${PROJECT_REF}`);
    return { ok: true, simulated: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({ from, to: [to], subject, html }),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error("[resend] send failed:", res.status, errText);
      return { ok: false, error: errText };
    }
    const json = await res.json();
    return { ok: true, id: json.id };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
};

export const wrapEmailHtml = (innerHtml: string, footer: string): string => `
<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Balaji Nivesh</title></head>
<body style="margin:0;padding:0;background:#f6f7f9;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1f2937">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f7f9;padding:24px 0">
    <tr><td align="center">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.05)">
        <tr><td style="padding:24px 28px;background:linear-gradient(135deg,#fff6ee,#eef4ff);border-bottom:1px solid #eef0f3">
          <strong style="font-size:18px;color:#0f172a">Balaji <span style="color:#1d4ed8">Nivesh</span></strong>
          <div style="font-size:11px;color:#6b7280;margin-top:2px">AMFI-registered Mutual Fund Distributor</div>
        </td></tr>
        <tr><td style="padding:28px">${innerHtml}</td></tr>
        <tr><td style="padding:18px 28px;background:#f8fafc;font-size:11px;color:#6b7280;border-top:1px solid #eef0f3;line-height:1.5">
          ${footer}<br><br>
          <strong>Disclaimer:</strong> Mutual fund investments are subject to market risks. Read all scheme-related documents carefully. Balaji Nivesh is an AMFI-registered Mutual Fund Distributor, not a SEBI-registered Investment Advisor.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
