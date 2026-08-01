import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { conversation_id, session_id, lead_name, lead_phone, lead_action } = await req.json();
    if (!conversation_id || !session_id || !lead_name || !lead_phone) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Verify the session_id actually owns this conversation before updating.
    const { data: conv } = await admin
      .from("chat_conversations")
      .select("id, session_id")
      .eq("id", conversation_id)
      .maybeSingle();
    if (!conv || conv.session_id !== session_id) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await admin
      .from("chat_conversations")
      .update({
        lead_name: String(lead_name).slice(0, 80),
        lead_phone: String(lead_phone).replace(/\D/g, "").slice(0, 15),
        lead_captured_at: new Date().toISOString(),
        lead_action: lead_action ?? null,
      })
      .eq("id", conversation_id);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
