import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { supabase } from "@/integrations/supabase/client";
import { useWhatsAppContactHref } from "@/lib/whatsapp";
import HeroBanner from "@/components/layout/HeroBanner";
import SEO from "@/components/seo/SEO";

const INTEREST_OPTIONS = [
  "Start a SIP",
  "Retirement planning",
  "Tax-saving (ELSS)",
  "Child's education planning",
  "Insurance review",
  "Lumpsum investment",
  "Become a partner",
  "Something else",
];

const Contact = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { data: settings } = useSiteSettings();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const waNumber = (settings?.map.contact_whatsapp || settings?.map.contact_phone || "").replace(/[^\d]/g, "");
  const waHref = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent("Hi Balaji Nivesh, I'd like to book a free 15-min call.")}`
    : "#";
  const phoneDisplay = settings?.map.contact_phone || "+91 93300 79717";
  const emailDisplay = settings?.map.contact_email || "info@balajinivesh.com";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !/^\+?\d[\d\s-]{7,}$/.test(phone)) {
      toast({ title: "Check your details", description: "Please enter your name and a valid mobile number." });
      return;
    }
    setIsSubmitting(true);
    try {
      await supabase.from("contact_submissions").insert({
        name: name.trim(),
        email: email.trim() || `lead-${phone.replace(/\D/g, "")}@no-email.local`,
        phone: phone.trim(),
        subject: interest || "General enquiry",
        message: message.trim() || `Interested in: ${interest || "general consultation"}`,
        source: "contact_page",
      });
      toast({ title: "We'll be in touch!", description: "An advisor will WhatsApp you within one business day." });
      setName(""); setPhone(""); setEmail(""); setInterest(""); setMessage("");
    } catch {
      toast({ title: "Something went wrong", description: "Please try WhatsApp or call us directly." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <SEO
        title="Contact Balaji Nivesh — Talk to an AMFI-Registered MFD"
        description="Reach Balaji Nivesh for SIP, mutual fund, insurance and financial planning queries. Call, WhatsApp or book a free 15-min consultation."
      />
      <HeroBanner>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-4xl font-extrabold text-foreground sm:text-5xl">{t("contact.title")}</h1>
          <p className="mt-4 text-lg text-muted-foreground">Free 15-min call · No fees · No pressure · SEBI-compliant</p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-brand-green hover:bg-brand-green/90 text-white w-full sm:w-auto">
              <a href={waHref} target={waNumber ? "_blank" : undefined} rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp us now
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <a href={`tel:${phoneDisplay.replace(/\s+/g, "")}`}>
                <Phone className="mr-2 h-5 w-5" /> Call {phoneDisplay}
              </a>
            </Button>
          </div>
        </motion.div>
      </HeroBanner>

      <section className="py-12 lg:py-16">
        <div className="container">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <Card className="border-border/60">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="font-display text-xl font-bold text-foreground">Prefer we call you back?</h2>
                  <p className="mt-2 text-sm text-muted-foreground">Just your name + number is enough. We'll WhatsApp you within one business day.</p>
                  <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your name *</Label>
                        <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Priya Sharma" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Mobile number *</Label>
                        <Input id="phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="interest">What do you need help with?</Label>
                      <Select value={interest} onValueChange={setInterest}>
                        <SelectTrigger id="interest"><SelectValue placeholder="Select a topic (optional)" /></SelectTrigger>
                        <SelectContent>
                          {INTEREST_OPTIONS.map((opt) => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email <span className="text-muted-foreground font-normal">(optional)</span></Label>
                      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Anything else? <span className="text-muted-foreground font-normal">(optional)</span></Label>
                      <Input id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="e.g. I want to start ₹5,000/month SIP" />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting} size="lg">
                      {isSubmitting ? "Sending..." : (<>Request a call back <Send className="ml-1 h-4 w-4" /></>)}
                    </Button>
                    <p className="text-xs text-muted-foreground">{t("contact.formDisclaimer")}</p>
                  </form>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6 lg:col-span-2">
              <Card className="border-brand-green/30 bg-brand-green-light/40">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-green text-white"><MessageCircle className="h-5 w-5" /></div>
                  <div className="flex-1">
                    <h3 className="font-display text-sm font-semibold text-foreground">WhatsApp (fastest)</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Most clients prefer WhatsApp. Tap and chat — no forms.</p>
                    <Button asChild size="sm" className="mt-2 bg-brand-green hover:bg-brand-green/90 text-white">
                      <a href={waHref} target={waNumber ? "_blank" : undefined} rel="noopener noreferrer">Open WhatsApp</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-orange-light text-primary"><Phone className="h-5 w-5" /></div>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-foreground">{t("contact.callUs")}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{phoneDisplay}</p>
                    <p className="text-xs text-muted-foreground">{t("contact.monSat")}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-blue-light text-secondary"><Mail className="h-5 w-5" /></div>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-foreground">{t("contact.emailUs")}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{emailDisplay}</p>
                    <p className="text-xs text-muted-foreground">{t("contact.respondTime")}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-green-light text-brand-green"><MapPin className="h-5 w-5" /></div>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-foreground">{t("contact.visitUs")}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">1 R. N. Mukherjee Road<br />3rd Floor, Room No. 320<br />Kolkata, West Bengal – 700001</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/60 overflow-hidden">
                <div className="aspect-[4/3] w-full">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.1!2d88.3488!3d22.5726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDM0JzIxLjQiTiA4OMKwMjAnNTUuNyJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin&q=320+R+N+Mukherjee+Road+Kolkata+700001"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Balaji Nivesh Office Location"
                  />
                </div>
              </Card>
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <p className="text-xs leading-relaxed text-muted-foreground"><strong>Note:</strong> {t("contact.note")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
