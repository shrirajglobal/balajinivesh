// Public endpoint: accepts an email signup, creates a pending subscriber row,
// and emails a one-tap confirmation link (double opt-in).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { sendEmail, wrapEmailHtml } from "../_shared/resend.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body.email ?? "").trim().toLowerCase();
    const name = body.name ? String(body.name).trim().slice(0, 80) : null;
    const source = String(body.source ?? "footer").slice(0, 40);
    const language = ["en", "hi", "bn"].includes(body.language) ? body.language : "en";

    if (!isEmail(email)) {
      return new Response(JSON.stringify({ error: "Please enter a valid email" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    // Idempotent upsert — if already confirmed, just no-op politely.
    const { data: existing } = await supabase
      .from("subscribers")
      .select("id, status, confirmation_token")
      .eq("email", email)
      .maybeSingle();

    let confirmationToken: string;
    let subscriberId: string;

    if (existing) {
      if (existing.status === "confirmed") {
        return new Response(JSON.stringify({
          ok: true, alreadyConfirmed: true,
          message: "You're already subscribed. Thanks!",
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      confirmationToken = existing.confirmation_token;
      subscriberId = existing.id;
      // Refresh metadata
      await supabase.from("subscribers").update({ name, source, language, status: "pending" }).eq("id", subscriberId);
    } else {
      const { data: inserted, error } = await supabase
        .from("subscribers")
        .insert({ email, name, source, language, status: "pending" })
        .select("id, confirmation_token")
        .single();
      if (error) throw error;
      confirmationToken = inserted.confirmation_token;
      subscriberId = inserted.id;
    }

    // Build confirmation URL pointing back to the public app
    const origin = req.headers.get("origin") ?? body.origin ?? "https://balajinivesh.studydna.in";
    const confirmUrl = `${origin}/subscribe/confirm?token=${confirmationToken}`;

    // Send opt-in email
    const greeting = name ? `Hi ${name},` : "Hi there,";
    const subject = "Confirm your subscription to Balaji Nivesh";
    const html = wrapEmailHtml(
      `<h2 style="margin:0 0 12px;font-size:20px;color:#0f172a">One last step</h2>
       <p style="margin:0 0 16px;line-height:1.55">${greeting}</p>
       <p style="margin:0 0 20px;line-height:1.55">Thanks for subscribing to <strong>Samajhne Wali Khabar</strong> — your daily, easy-to-understand market update from Balaji Nivesh.</p>
       <p style="margin:0 0 20px;line-height:1.55">Please confirm your email so we can start sending you updates:</p>
       <p style="margin:0 0 24px"><a href="${confirmUrl}" style="display:inline-block;background:#ea7c2f;color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:600">Confirm my email</a></p>
       <p style="margin:0;color:#6b7280;font-size:12px;line-height:1.55">If the button does not work, paste this link into your browser:<br><span style="word-break:break-all;color:#1d4ed8">${confirmUrl}</span></p>`,
      `You're receiving this because someone signed up <strong>${email}</strong> on balajinivesh.studydna.in. If this wasn't you, simply ignore this message — no list will ever include you without confirmation.`
    );

    const send = await sendEmail({ to: email, subject, html });

    return new Response(JSON.stringify({
      ok: true,
      subscriberId,
      simulated: send.simulated ?? false,
      message: send.simulated
        ? "Subscribed. (Confirmation email is simulated — add a Resend key in Integrations to enable real sending.)"
        : "Almost done! Check your inbox to confirm.",
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("[subscribe-newsletter]", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
