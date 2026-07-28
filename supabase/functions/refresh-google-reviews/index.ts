import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_maps";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const GOOGLE_MAPS_API_KEY = Deno.env.get("GOOGLE_MAPS_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!LOVABLE_API_KEY || !GOOGLE_MAPS_API_KEY) {
      throw new Error("Missing connector credentials");
    }

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    const { data: rows, error: readErr } = await admin
      .from("site_settings")
      .select("id, setting_key, setting_value")
      .in("setting_key", ["google_place_id", "google_rating", "google_review_count"]);
    if (readErr) throw readErr;

    const bySetting = Object.fromEntries((rows ?? []).map((r) => [r.setting_key, r]));
    const placeId = bySetting.google_place_id?.setting_value?.trim();
    if (!placeId) throw new Error("google_place_id is not set in site_settings");

    const res = await fetch(`${GATEWAY_URL}/places/v1/places/${placeId}`, {
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": "rating,userRatingCount",
      },
    });
    const body = await res.text();
    if (!res.ok) {
      console.error(`Places API failed [${res.status}]: ${body}`);
      return new Response(
        JSON.stringify({ error: "places_api_failed", status: res.status, details: body }),
        { status: res.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const parsed = JSON.parse(body) as { rating?: number; userRatingCount?: number };
    const rating = parsed.rating != null ? String(parsed.rating) : null;
    const count = parsed.userRatingCount != null ? String(parsed.userRatingCount) : null;

    const updates: Promise<unknown>[] = [];
    if (rating && bySetting.google_rating) {
      updates.push(
        admin.from("site_settings").update({ setting_value: rating }).eq("id", bySetting.google_rating.id),
      );
    }
    if (count && bySetting.google_review_count) {
      updates.push(
        admin.from("site_settings").update({ setting_value: count }).eq("id", bySetting.google_review_count.id),
      );
    }
    await Promise.all(updates);

    return new Response(
      JSON.stringify({ ok: true, place_id: placeId, rating, review_count: count }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("refresh-google-reviews error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
