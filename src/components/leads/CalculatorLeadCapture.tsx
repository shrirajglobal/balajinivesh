import { useState } from "react";
import { MessageCircle, Phone, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { supabase } from "@/integrations/supabase/client";
import { useWhatsAppContactHref } from "@/lib/whatsapp";

interface Props {
  /** Short context to pre-fill the lead, e.g. "SIP of ₹10,000/month for 10 years" */
  context: string;
  /** Source tag, e.g. "sip-calculator" — saved on the lead */
  source: string;
  /** Heading shown above the form */
  title?: string;
  /** Body line under the heading */
  subtitle?: string;
}

/**
 * Calculator → Lead capture micro-ask.
 * One field (phone), one optional checkbox (WhatsApp consent).
 * Highest-ROI conversion surface on research traffic.
 */
const CalculatorLeadCapture = ({
  context,
  source,
  title = "Want a personalised plan?",
  subtitle = "Get this calculation as a free PDF and a 15-min call with our SEBI-compliant advisor. No fees, no pressure.",
}: Props) => {
  const { toast } = useToast();
  const { data: settings } = useSiteSettings();
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [whatsappOk, setWhatsappOk] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const waHref = useWhatsAppContactHref(`Hi Balaji Nivesh, I just calculated: ${context}. Can you help me start?`);
  const callHref = settings?.map.contact_phone ? `tel:${settings.map.contact_phone.replace(/\s+/g, "")}` : "/contact";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\+?\d[\d\s-]{7,}$/.test(phone)) {
      toast({ title: "Invalid phone", description: "Please enter a valid mobile number." });
      return;
    }
    setSubmitting(true);
    try {
      await supabase.from("contact_submissions").insert({
        name: "Calculator lead",
        email: email.trim() || `lead-${phone.replace(/\D/g, "")}@no-email.local`,
        phone: phone.trim(),
        subject: `Calculator: ${source}`,
        message: `${context}\nWhatsApp consent: ${whatsappOk ? "yes" : "no"}`,
        source,
      });
      setSent(true);
      toast({ title: "Got it!", description: "Our advisor will reach out shortly." });
    } catch {
      setSent(true);
      toast({ title: "Thanks!", description: "We'll be in touch shortly." });
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <Card className="border-brand-green/30 bg-brand-green-light/40">
        <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
          <CheckCircle2 className="h-10 w-10 text-brand-green" />
          <h3 className="font-display text-lg font-bold text-foreground">You're on the list</h3>
          <p className="text-sm text-muted-foreground">
            Our advisor will reach out on WhatsApp within one business day. Want to talk now?
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            <Button asChild size="sm" className="bg-brand-green hover:bg-brand-green/90 text-white">
              <a href={waHref} target={waNumber ? "_blank" : undefined} rel="noopener noreferrer">
                <MessageCircle className="mr-1.5 h-4 w-4" /> WhatsApp now
              </a>
            </Button>
            <Button asChild size="sm" variant="outline">
              <a href={callHref}><Phone className="mr-1.5 h-4 w-4" /> Call now</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-brand-orange-light to-brand-blue-light/40">
      <CardContent className="p-5 sm:p-6">
        <div className="grid gap-5 sm:grid-cols-2 sm:items-center">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground sm:text-xl">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
            <p className="mt-3 inline-block rounded-md bg-background/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              {context}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="tel"
              placeholder="Your mobile number *"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="bg-background"
            />
            <Input
              type="email"
              placeholder="Email (optional, for PDF report)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background"
            />
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Sending..." : "Get my personalised plan"}
            </Button>
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
              <Checkbox checked={whatsappOk} onCheckedChange={(v) => setWhatsappOk(v === true)} />
              Reach me on WhatsApp (preferred)
            </label>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
              <a href={waHref} target={waNumber ? "_blank" : undefined} rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-brand-green hover:underline">
                <MessageCircle className="h-3.5 w-3.5" /> Or WhatsApp directly
              </a>
              <span className="text-muted-foreground">·</span>
              <a href={callHref} className="inline-flex items-center gap-1 font-semibold text-secondary hover:underline">
                <Phone className="h-3.5 w-3.5" /> Call us
              </a>
              <span className="text-muted-foreground">·</span>
              <a href={`mailto:${settings?.map.contact_email || "info@balajinivesh.com"}`} className="inline-flex items-center gap-1 font-semibold text-foreground hover:underline">
                <Mail className="h-3.5 w-3.5" /> Email
              </a>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalculatorLeadCapture;
