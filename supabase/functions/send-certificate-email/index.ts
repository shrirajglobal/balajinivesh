import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_email, user_name, segment, certificate_number } = await req.json();

    const segmentLabel = segment === "homemakers" 
      ? "Financial Education for Homemakers" 
      : "Financial Education for Young Minds";

    // Log the certificate issuance (email sending can be configured later)
    console.log(`Certificate issued: ${certificate_number} for ${user_email} (${user_name}) - ${segmentLabel}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Certificate ${certificate_number} issued for ${user_email}`,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process certificate" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
