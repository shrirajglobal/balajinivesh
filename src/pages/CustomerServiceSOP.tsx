import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useArnIdentity } from "@/lib/arn";
import { useWhatsAppContactHref } from "@/lib/whatsapp";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const CustomerServiceSOP = () => {
  const identity = useArnIdentity();
  const { data: settings } = useSiteSettings();
  const phone = settings?.map.contact_phone || "+91 93300 79717";
  const email = settings?.map.contact_email || "infobalajinivesh@gmail.com";
  const whatsapp = useWhatsAppContactHref("Hello Balaji Nivesh, I would like to raise a service request or complaint. My name is: ");

  return (
    <div className="container max-w-5xl py-12 lg:py-16">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase text-primary">Investor support</p>
        <h1 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">Customer Service &amp; Grievance Process</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">If you have a question or concern about a mutual fund investment serviced through Balaji Nivesh, tell us what happened. We will review it, coordinate with the relevant AMC or registrar where needed, and keep you informed.</p>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{identity.entityName}<br />{identity.credentialLine}</p>
      </div>

      <section className="mt-12 border-t border-border pt-8" aria-labelledby="contact-heading">
        <h2 id="contact-heading" className="font-display text-2xl font-semibold text-foreground">1. Contact our team</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Mr Ashish Khandelwal is the designated contact for investor grievances. You can reach the team directly using any of these channels.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild><a href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle /> WhatsApp a complaint</a></Button>
          <Button asChild variant="outline"><a href={`tel:${phone.replace(/[^+\d]/g, "")}`}><Phone /> Call {phone}</a></Button>
          <Button asChild variant="outline"><a href={`mailto:${email}?subject=${encodeURIComponent("Investor grievance — Balaji Nivesh")}`}><Mail /> Email the team</a></Button>
        </div>
        <p className="mt-4 break-all text-sm text-muted-foreground">Email: <a className="text-primary underline-offset-4 hover:underline" href={`mailto:${email}`}>{email}</a></p>
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">Please include your name, a way to contact you, the AMC and folio number (if relevant), the date and nature of the issue, and any reference number or supporting documents. Share sensitive documents only through a channel you trust; do not send passwords, OTPs, or full payment-card details.</p>
      </section>

      <section className="mt-12 border-t border-border pt-8" aria-labelledby="process-heading">
        <h2 id="process-heading" className="font-display text-2xl font-semibold text-foreground">2. What happens next</h2>
        <ol className="mt-5 grid gap-5 md:grid-cols-3">
          {[
            ["We receive your concern", "Our team reviews your message and may ask for missing details to identify the investment or request."],
            ["We investigate", "Where the issue relates to an AMC, registrar or transaction, we coordinate with the relevant party and update you on progress."],
            ["We respond", "We explain the outcome or next step through the contact channel you provided. Keep a copy of your correspondence and any reference number."],
          ].map(([title, text], i) => (
            <li key={title} className="border-l-2 border-primary pl-4">
              <p className="text-sm font-semibold text-primary">Step {i + 1}</p>
              <h3 className="mt-1 font-display text-base font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm text-muted-foreground">If the matter remains unresolved or you are dissatisfied with the response, you can use the applicable AMC or regulatory grievance channels below. Applicable timelines are set by those channels and may change; check their current instructions.</p>
      </section>

      <section className="mt-12 border-t border-border pt-8" aria-labelledby="escalation-heading">
        <h2 id="escalation-heading" className="font-display text-2xl font-semibold text-foreground">3. Escalation options</h2>
        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          <div className="border-t border-secondary pt-4">
            <h3 className="font-display text-lg font-semibold text-foreground">AMC / registrar</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">For scheme, folio or transaction issues, you may also contact the concerned AMC or registrar directly. Your account statement or the AMC’s website will show its service channels.</p>
          </div>
          <div className="border-t border-secondary pt-4">
            <h3 className="font-display text-lg font-semibold text-foreground">SEBI SCORES</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">If your complaint is not addressed satisfactorily through the concerned entity, use SEBI’s online complaint redressal platform. Follow the portal’s current eligibility and escalation instructions.</p>
            <a href="https://scores.sebi.gov.in/" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">Visit SEBI SCORES <ArrowUpRight className="h-4 w-4" /></a>
          </div>
          <div className="border-t border-secondary pt-4">
            <h3 className="font-display text-lg font-semibold text-foreground">SMART ODR</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">For eligible unresolved disputes, the Securities Market Approach for Resolution through Technology portal offers an online dispute resolution path. Check the portal for the current process.</p>
            <a href="https://smartodr.in/" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">Visit SMART ODR <ArrowUpRight className="h-4 w-4" /></a>
          </div>
          <div className="border-t border-secondary pt-4">
            <h3 className="font-display text-lg font-semibold text-foreground">More investor information</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">See <Link className="text-primary hover:underline" to="/amc-details">the AMC directory</Link> for general fund-house information, or <Link className="text-primary hover:underline" to="/contact">contact Balaji Nivesh</Link> for a non-grievance enquiry.</p>
          </div>
        </div>
      </section>
      <p className="mt-12 border-t border-border pt-6 text-xs text-muted-foreground">Mutual Fund investments are subject to market risks. Read all scheme related documents carefully.</p>
    </div>
  );
};

export default CustomerServiceSOP;