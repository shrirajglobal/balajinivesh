import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TestRequest {
  provider_key: string;
  category: string;
}

interface TestResult {
  success: boolean;
  message: string;
}

async function testLovableAi(): Promise<TestResult> {
  const key = Deno.env.get("LOVABLE_API_KEY");
  if (!key) return { success: false, message: "LOVABLE_API_KEY secret missing" };
  try {
    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "user", content: "ping" }],
        max_tokens: 5,
      }),
    });
    if (r.ok) return { success: true, message: "Lovable AI responded successfully" };
    if (r.status === 429) return { success: false, message: "Rate limited (429)" };
    if (r.status === 402) return { success: false, message: "Credits required (402)" };
    return { success: false, message: `HTTP ${r.status}` };
  } catch (e) {
    return { success: false, message: e instanceof Error ? e.message : "Network error" };
  }
}

async function testGenericKey(envVar: string, label: string): Promise<TestResult> {
  const v = Deno.env.get(envVar);
  if (!v) return { success: false, message: `${envVar} not configured` };
  if (v.length < 8) return { success: false, message: `${envVar} looks too short` };
  return { success: true, message: `${label} secret detected (${v.length} chars)` };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = (await req.json()) as TestRequest;
    let result: TestResult;

    switch (body.provider_key) {
      case "lovable_ai":
        result = await testLovableAi();
        break;
      case "openai":
        result = await testGenericKey("OPENAI_API_KEY", "OpenAI");
        break;
      case "anthropic":
        result = await testGenericKey("ANTHROPIC_API_KEY", "Anthropic Claude");
        break;
      case "perplexity":
        result = await testGenericKey("PERPLEXITY_API_KEY", "Perplexity");
        break;
      case "alpha_vantage":
        result = await testGenericKey("ALPHA_VANTAGE_API_KEY", "Alpha Vantage");
        break;
      case "resend":
        result = await testGenericKey("RESEND_API_KEY", "Resend");
        break;
      case "twilio":
        result = await testGenericKey("TWILIO_API_KEY", "Twilio");
        break;
      case "nse_india":
      case "ga4":
      case "gtm":
      case "search_console":
        result = { success: true, message: "No API key required — configuration only" };
        break;
      default:
        result = { success: false, message: `Unknown provider: ${body.provider_key}` };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, message: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
