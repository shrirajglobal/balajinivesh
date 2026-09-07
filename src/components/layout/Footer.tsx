import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import SebiDisclaimer from "@/components/compliance/SebiDisclaimer";
import NewsletterSignup from "@/components/newsletter/NewsletterSignup";
import logo from "@/assets/logo.jpeg";
import { useArnIdentity } from "@/lib/arn";


const Footer = () => {
  const { t } = useLanguage();
  const { data: settings } = useSiteSettings();
  const arnIdentity = useArnIdentity();

  const contactPhone = settings?.map.contact_phone || "+91 93300 79717";
  const contactEmail = settings?.map.contact_email || "infobalajinivesh@gmail.com";

  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="container py-10 pb-28 sm:py-12 sm:pb-12 lg:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Balaji Nivesh" className="h-9 w-auto sm:h-10" />
              <span className="font-display text-base font-bold text-foreground sm:text-lg">
                Balaji <span className="text-secondary">Nivesh</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">{t("footer.tagline")}</p>
            <p className="text-xs font-medium text-muted-foreground">{arnLine}</p>
            <div className="pt-2">
              <h4 className="mb-2 font-display text-sm font-semibold text-foreground">
                Daily market updates in your inbox
              </h4>
              <NewsletterSignup source="footer" variant="inline" bare />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-3 font-display text-sm font-semibold text-foreground sm:mb-4">{t("footer.quickLinks")}</h4>
            <ul className="space-y-2">
              {[
                { label: t("footer.aboutUs"), path: "/about" },
                { label: t("footer.investmentSolutions"), path: "/solutions/mutual-funds" },
                { label: t("footer.toolsCalculators"), path: "/calculators" },
                { label: t("footer.investorEducation"), path: "/education" },
                { label: t("partner.becomePartner"), path: "/partner" },
                { label: t("footer.contactUs"), path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="inline-block py-0.5 text-sm text-muted-foreground transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="mb-3 font-display text-sm font-semibold text-foreground sm:mb-4">{t("footer.solutions")}</h4>
            <ul className="space-y-2">
              {[
                { label: t("nav.mutualFunds"), path: "/solutions/mutual-funds" },
                { label: t("nav.sif"), path: "/solutions/sif" },
                { label: t("nav.aif"), path: "/solutions/aif" },
                { label: t("nav.pms"), path: "/solutions/pms" },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="inline-block py-0.5 text-sm text-muted-foreground transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-3 font-display text-sm font-semibold text-foreground sm:mb-4">{t("footer.contactUs")}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{contactPhone}</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="break-all">{contactEmail}</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>1 R. N. Mukherjee Road, 3rd Floor, Room No. 320, Kolkata, West Bengal – 700001</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimers */}
        <div className="mt-8 border-t border-border pt-6 sm:mt-10">
          <SebiDisclaimer variant="compact" className="mb-4" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            <strong>{t("footer.disclaimerLink")}:</strong> {t("footer.disclaimer")}
          </p>

          {/* Statutory notice strip: SEBI SCORES + SEBI FILINGS + ARN/AMFI status */}
          <div className="mt-4 rounded-md border border-border bg-muted/70 p-3 text-center text-xs leading-relaxed text-foreground/90">
            <p className="font-medium">
              AMFI Registered Mutual Fund Distributor
              {arnNumber && <span> | ARN NO: {arnNumber}</span>}
              {arnHolder && <span> | ARN Holder: {arnHolder}</span>}
            </p>
            <p className="mt-1.5">
              Please write to SEBI - SCORES for any grievances related to Mutual Fund and Capital Market:{" "}
              <a
                href="https://scores.sebi.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                scores.sebi.gov.in
              </a>
            </p>
            <p className="mt-1">
              Please go to SEBI - FILINGS for any Mutual Funds Draft, SAI, SID & KIM:{" "}
              <a
                href="https://www.sebi.gov.in/filings/mutual-funds.html"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                sebi.gov.in/filings/mutual-funds.html
              </a>
            </p>
          </div>

          <div className="mt-4 flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row sm:gap-2">
            <p>{t("footer.copyright").replace("{year}", new Date().getFullYear().toString())}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/privacy" className="hover:text-primary">{t("footer.privacyPolicy")}</Link>
              <Link to="/terms" className="hover:text-primary">{t("footer.termsOfUse")}</Link>
              <Link to="/disclaimer" className="hover:text-primary">{t("footer.disclaimerLink")}</Link>
              <Link to="/commission-disclosure" className="hover:text-primary">Commission Disclosure</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
