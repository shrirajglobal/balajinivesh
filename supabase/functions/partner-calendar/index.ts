import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const GATEWAY_BASE_URL = "https://connector-gateway.lovable.dev";
const CONNECTOR_ID = "google_calendar";
const SCOPES = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/calendar.events",
];

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

// Server-only credentials. Never exposed to the browser.
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY") ?? "";
const CLIENT_API_KEY =
  Deno.env.get("GOOGLE_CALENDAR_APP_USER_CONNECTOR_CLIENT_API_KEY") ?? "";

const gatewayHeaders = (connectionKey?: string) => {
  const h: Record<string, string> = {
    Authorization: `Bearer ${LOVABLE_API_KEY}`,
    "X-Connection-Api-Key": CLIENT_API_KEY,
    "Content-Type": "application/json",
  };
  if (connectionKey) {
    h["X-App-User-Connection-Key"] = connectionKey;
    h["X-Connection-Key"] = connectionKey;
  }
  return h;
};

/** Call the Google Calendar API on behalf of one app user, through the gateway. */
async function callAsAppUser(
  connectionKey: string,
  path: string,
  init: RequestInit = {},
) {
  const res = await fetch(`${GATEWAY_BASE_URL}/${CONNECTOR_ID}${path}`, {
    ...init,
    headers: { ...gatewayHeaders(connectionKey), ...(init.headers ?? {}) },
  });
  const text = await res.text();
  return { ok: res.ok, status: res.status, text };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    if (!LOVABLE_API_KEY || !CLIENT_API_KEY) {
      return json(
        {
          error: "connector_not_configured",
          message:
            "Google Calendar connector is not configured for this project yet.",
        },
        503,
      );
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);

    const anon = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: claimsData, error: claimsErr } = await anon.auth.getClaims(
      authHeader.replace("Bearer ", ""),
    );
    if (claimsErr || !claimsData?.claims?.sub) return json({ error: "Unauthorized" }, 401);
    const userId = claimsData.claims.sub as string;

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Ownership check #1: the caller must be a partner.
    const { data: partner } = await admin
      .from("partners")
      .select("id, user_id")
      .eq("user_id", userId)
      .maybeSingle();
    if (!partner) return json({ error: "not_a_partner" }, 403);

    const body = (await req.json().catch(() => ({}))) as {
      action?: string;
      lead_id?: string;
      return_url?: string;
    };
    const action = body.action ?? "status";

    // Ownership check #2: only ever read this partner's own connection row.
    const { data: conn } = await admin
      .from("partner_google_connections")
      .select("*")
      .eq("partner_id", partner.id)
      .eq("user_id", userId)
      .maybeSingle();

    if (action === "status") {
      return json({
        connected: !!conn?.connection_key,
        google_email: conn?.google_email ?? null,
      });
    }

    if (action === "connect") {
      const res = await fetch(
        `${GATEWAY_BASE_URL}/api/v1/app-users/oauth2/authorize`,
        {
          method: "POST",
          headers: gatewayHeaders(),
          body: JSON.stringify({
            connector_id: CONNECTOR_ID,
            app_user_id: userId,
            credentials_configuration: { scopes: SCOPES },
            ...(conn?.connection_key ? { connection_key: conn.connection_key } : {}),
            ...(body.return_url ? { return_url: body.return_url } : {}),
          }),
        },
      );
      const text = await res.text();
      if (!res.ok) {
        console.error(`authorize failed [${res.status}]: ${text}`);
        return json({ error: "authorize_failed", status: res.status, details: text }, res.status);
      }
      const parsed = JSON.parse(text) as {
        authorization_url?: string;
        url?: string;
        connection_key?: string;
      };
      const authorizationUrl = parsed.authorization_url ?? parsed.url;
      const connectionKey = parsed.connection_key ?? conn?.connection_key ?? null;
      if (connectionKey) {
        await admin.from("partner_google_connections").upsert(
          {
            partner_id: partner.id,
            user_id: userId,
            connection_key: connectionKey,
            connected_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "partner_id" },
        );
      }
      return json({ authorization_url: authorizationUrl });
    }

    if (action === "disconnect") {
      if (conn?.connection_key) {
        try {
          await fetch(
            `${GATEWAY_BASE_URL}/api/v1/app-users/connections/${conn.connection_key}`,
            { method: "DELETE", headers: gatewayHeaders(conn.connection_key) },
          );
        } catch (e) {
          console.error("gateway revoke failed:", e);
        }
      }
      await admin
        .from("partner_google_connections")
        .delete()
        .eq("partner_id", partner.id)
        .eq("user_id", userId);
      return json({ connected: false });
    }

    if (action === "refresh_profile") {
      if (!conn?.connection_key) return json({ connected: false });
      const me = await callAsAppUser(conn.connection_key, "/calendar/v3/users/me/calendarList/primary");
      if (!me.ok) {
        console.error(`calendarList failed [${me.status}]: ${me.text}`);
        return json({ connected: false, status: me.status, details: me.text });
      }
      const cal = JSON.parse(me.text) as { id?: string; summary?: string };
      const email = cal.id ?? null;
      await admin
        .from("partner_google_connections")
        .update({ google_email: email, updated_at: new Date().toISOString() })
        .eq("partner_id", partner.id)
        .eq("user_id", userId);
      return json({ connected: true, google_email: email });
    }

    if (action === "sync_lead") {
      if (!body.lead_id) return json({ error: "lead_id required" }, 400);
      if (!conn?.connection_key) return json({ error: "not_connected" }, 409);

      // Ownership check #3: the lead must belong to this partner.
      const { data: lead } = await admin
        .from("partner_leads")
        .select("id, partner_id, name, phone, notes, source, next_follow_up_date, google_event_id")
        .eq("id", body.lead_id)
        .eq("partner_id", partner.id)
        .maybeSingle();
      if (!lead) return json({ error: "lead_not_found" }, 404);

      // Follow-up cleared → delete the event if one exists.
      if (!lead.next_follow_up_date) {
        if (lead.google_event_id) {
          await callAsAppUser(
            conn.connection_key,
            `/calendar/v3/calendars/primary/events/${lead.google_event_id}`,
            { method: "DELETE" },
          );
          await admin.from("partner_leads").update({ google_event_id: null }).eq("id", lead.id);
        }
        return json({ ok: true, cleared: true });
      }

      // Default 10:00 IST, 30 minutes.
      const start = `${lead.next_follow_up_date}T10:00:00`;
      const end = `${lead.next_follow_up_date}T10:30:00`;
      const descriptionLines = [
        lead.phone ? `Phone: ${lead.phone}` : null,
        lead.source ? `Source: ${lead.source}` : null,
        lead.notes ? `Notes: ${lead.notes}` : null,
        "Created from Balaji Nivesh Partner CRM.",
      ].filter(Boolean);

      const event = {
        summary: `Follow up: ${lead.name}`,
        description: descriptionLines.join("\n"),
        start: { dateTime: start, timeZone: "Asia/Kolkata" },
        end: { dateTime: end, timeZone: "Asia/Kolkata" },
        reminders: { useDefault: false, overrides: [{ method: "popup", minutes: 30 }] },
      };

      const path = lead.google_event_id
        ? `/calendar/v3/calendars/primary/events/${lead.google_event_id}`
        : "/calendar/v3/calendars/primary/events";
      let res = await callAsAppUser(conn.connection_key, path, {
        method: lead.google_event_id ? "PATCH" : "POST",
        body: JSON.stringify(event),
      });

      // Event was deleted on Google's side → recreate instead of failing.
      if (!res.ok && lead.google_event_id && (res.status === 404 || res.status === 410)) {
        res = await callAsAppUser(conn.connection_key, "/calendar/v3/calendars/primary/events", {
          method: "POST",
          body: JSON.stringify(event),
        });
      }

      if (!res.ok) {
        console.error(`calendar sync failed [${res.status}]: ${res.text}`);
        return json(
          { error: "calendar_sync_failed", status: res.status, details: res.text },
          res.status,
        );
      }

      const created = JSON.parse(res.text) as { id?: string; htmlLink?: string };
      if (created.id && created.id !== lead.google_event_id) {
        await admin
          .from("partner_leads")
          .update({ google_event_id: created.id })
          .eq("id", lead.id)
          .eq("partner_id", partner.id);
      }
      return json({ ok: true, event_id: created.id, link: created.htmlLink });
    }

    return json({ error: "unknown_action" }, 400);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("partner-calendar error:", msg);
    return json({ error: msg }, 500);
  }
});
