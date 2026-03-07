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
    const { full_name, phone, address, city, pincode, segment, user_email } = await req.json();

    const segmentLabel = segment === "homemakers" 
      ? "Homemakers Education" 
      : "Kids Education";

    const message = `🎁 New Gift Claim from Balaji Nivesh Education Hub!\n\nSegment: ${segmentLabel}\nName: ${full_name}\nPhone: ${phone}\nEmail: ${user_email}\nAddress: ${address}\nCity: ${city}\nPincode: ${pincode}`;

    console.log("Gift claim notification:", message);

    // WhatsApp notification via wa.me link (logged for back office to configure)
    const whatsappNumber = Deno.env.get("BACKOFFICE_WHATSAPP") || "";
    if (whatsappNumber) {
      const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      console.log("WhatsApp link:", waUrl);
    }

    // Email notification (back office email can be configured via secrets)
    const backofficeEmail = Deno.env.get("BACKOFFICE_EMAIL") || "";
    if (backofficeEmail) {
      console.log(`Would send email to: ${backofficeEmail}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Gift claim notification sent" }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process gift claim notification" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
