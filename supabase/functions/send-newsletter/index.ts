// Admin endpoint: sends a campaign to all confirmed subscribers.
// Validates JWT + admin role in code (no auth-jwt verification at gateway level).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { sendEmail, wrapEmailHtml } from "../_shared/resend.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const jwt = authHeader.replace(/^Bearer\s+/i, "");
    if (!jwt) return json({ error: "Unauthorized" }, 401);

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: `Bearer ${jwt}` } } }
    );
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return json({ error: "Invalid session" }, 401);

    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );
    const { data: roleCheck } = await adminClient.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!roleCheck) return json({ error: "Admin access required" }, 403);

    const body = await req.json().catch(() => ({}));
    const { campaignId, testEmail } = body;
    if (!campaignId) return json({ error: "campaignId required" }, 400);

    const { data: campaign, error: cErr } = await adminClient
      .from("newsletter_campaigns").select("*").eq("id", campaignId).maybeSingle();
    if (cErr || !campaign) return json({ error: "Campaign not found" }, 404);

    // Test mode — send a single email to the requesting admin or override
    if (testEmail) {
      const html = wrapEmailHtml(campaign.html_body, "This is a TEST send. Production recipients are not affected.");
      const res = await sendEmail({ to: testEmail, subject: `[TEST] ${campaign.subject}`, html });
      return json({ ok: res.ok, simulated: res.simulated, error: res.error });
    }

    if (campaign.status === "sent") return json({ error: "Campaign already sent" }, 400);

    // Get confirmed subscribers
    const { data: subs, error: sErr } = await adminClient
      .from("subscribers")
      .select("id, email, name, unsubscribe_token")
      .eq("status", "confirmed");
    if (sErr) throw sErr;
    if (!subs || subs.length === 0) {
      return json({ error: "No confirmed subscribers to send to" }, 400);
    }

    await adminClient.from("newsletter_campaigns")
      .update({ status: "sending", recipient_count: subs.length })
      .eq("id", campaignId);

    let sentCount = 0;
    let failedCount = 0;

    // Sequential to respect Resend free-tier rate limits
    for (const sub of subs) {
      const unsubUrl = `https://balajinivesh.studydna.in/subscribe/unsubscribe?token=${sub.unsubscribe_token}`;
      const greeting = sub.name ? `Hi ${sub.name},` : "Hi there,";
      const innerHtml = `<p style="margin:0 0 14px;color:#374151">${greeting}</p>${campaign.html_body}`;
      const footer = `Don't want these emails? <a href="${unsubUrl}" style="color:#1d4ed8">Unsubscribe in one tap</a>.`;
      const html = wrapEmailHtml(innerHtml, footer);

      const result = await sendEmail({ to: sub.email, subject: campaign.subject, html });

      await adminClient.from("newsletter_sends").insert({
        campaign_id: campaignId,
        subscriber_id: sub.id,
        email: sub.email,
        status: result.ok ? "sent" : "failed",
        error_message: result.error ?? null,
      });

      if (result.ok) sentCount++;
      else failedCount++;
    }

    await adminClient.from("newsletter_campaigns")
      .update({ status: "sent", sent_at: new Date().toISOString(), recipient_count: sentCount })
      .eq("id", campaignId);

    return json({ ok: true, sent: sentCount, failed: failedCount });
  } catch (e) {
    console.error("[send-newsletter]", e);
    return json({ error: (e as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
