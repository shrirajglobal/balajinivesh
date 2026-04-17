// Validates a confirmation_token and flips the subscriber to status='confirmed'.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    let token = "";
    if (req.method === "GET") {
      token = new URL(req.url).searchParams.get("token") ?? "";
    } else {
      const body = await req.json().catch(() => ({}));
      token = body.token ?? "";
    }
    if (!token || token.length < 16) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    const { data: sub, error } = await supabase
      .from("subscribers")
      .select("id, email, status")
      .eq("confirmation_token", token)
      .maybeSingle();

    if (error) throw error;
    if (!sub) {
      return new Response(JSON.stringify({ error: "Token not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (sub.status !== "confirmed") {
      const { error: updateError } = await supabase
        .from("subscribers")
        .update({ status: "confirmed", confirmed_at: new Date().toISOString() })
        .eq("id", sub.id);
      if (updateError) throw updateError;
    }

    return new Response(JSON.stringify({ ok: true, email: sub.email, alreadyConfirmed: sub.status === "confirmed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
