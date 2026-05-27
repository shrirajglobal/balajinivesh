import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import HeroBanner from "@/components/layout/HeroBanner";
import SEO from "@/components/seo/SEO";

const Contact = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast({ title: t("contact.toastTitle"), description: t("contact.toastDesc") });
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div>
      <SEO
        title="Contact Balaji Nivesh — Talk to an AMFI-Registered MFD"
        description="Reach Balaji Nivesh for SIP, mutual fund, insurance and financial planning queries. Call, email or visit our office — we typically reply within one business day."
      />
      <HeroBanner>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-4xl font-extrabold text-foreground sm:text-5xl">{t("contact.title")}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{t("contact.subtitle")}</p>
        </motion.div>
      </HeroBanner>

      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <Card className="border-border/60">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="font-display text-xl font-bold text-foreground">{t("contact.formTitle")}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{t("contact.formSubtitle")}</p>
                  <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t("contact.fullName")}</Label>
                        <Input id="name" required placeholder={t("contact.fullName")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t("contact.phone")}</Label>
                        <Input id="phone" type="tel" required placeholder="+91 XXXXX XXXXX" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t("contact.email")}</Label>
                      <Input id="email" type="email" required placeholder="your@email.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="interest">{t("contact.interest")}</Label>
                      <Input id="interest" placeholder={t("contact.interestPlaceholder")} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">{t("contact.message")}</Label>
                      <Textarea id="message" rows={4} placeholder={t("contact.messagePlaceholder")} />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? t("contact.sending") : (<>{t("contact.sendMessage")} <Send className="ml-1 h-4 w-4" /></>)}
                    </Button>
                    <p className="text-xs text-muted-foreground">{t("contact.formDisclaimer")}</p>
                  </form>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6 lg:col-span-2">
              <Card className="border-border/60">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-orange-light text-primary"><Phone className="h-5 w-5" /></div>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-foreground">{t("contact.callUs")}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">+91 XXXXX XXXXX</p>
                    <p className="text-xs text-muted-foreground">{t("contact.monSat")}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-blue-light text-secondary"><Mail className="h-5 w-5" /></div>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-foreground">{t("contact.emailUs")}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">info@balajinivesh.com</p>
                    <p className="text-xs text-muted-foreground">{t("contact.respondTime")}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-green-light text-brand-green"><MapPin className="h-5 w-5" /></div>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-foreground">{t("contact.visitUs")}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">No 320, 1 R N Mukherjee Road<br />3rd Floor Room, Kolkata<br />West Bengal 700001</p>
                  </div>
                </CardContent>
              </Card>
              {/* Google Maps Embed */}
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
