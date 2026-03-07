import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/logo.jpeg";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="container py-12 lg:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Balaji Nivesh" className="h-10 w-auto" />
              <span className="font-display text-lg font-bold text-foreground">
                Balaji <span className="text-secondary">Nivesh</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">{t("footer.tagline")}</p>
            <p className="text-xs font-medium text-muted-foreground">{t("footer.arn")}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-display text-sm font-semibold text-foreground">{t("footer.quickLinks")}</h4>
            <ul className="space-y-2.5">
              {[
                { label: t("footer.aboutUs"), path: "/about" },
                { label: t("footer.investmentSolutions"), path: "/solutions/mutual-funds" },
                { label: t("footer.toolsCalculators"), path: "/calculators" },
                { label: t("footer.investorEducation"), path: "/education" },
                { label: t("footer.contactUs"), path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="mb-4 font-display text-sm font-semibold text-foreground">{t("footer.solutions")}</h4>
            <ul className="space-y-2.5">
              {[
                { label: t("nav.mutualFunds"), path: "/solutions/mutual-funds" },
                { label: t("nav.bonds"), path: "/solutions/bonds" },
                { label: t("nav.insurance"), path: "/solutions/insurance" },
                { label: t("nav.ipo"), path: "/solutions/ipo" },
                { label: t("nav.fixedDeposits"), path: "/solutions/fixed-deposits" },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-display text-sm font-semibold text-foreground">{t("footer.contactUs")}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>+91 XXXXX XXXXX</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>info@balajinivesh.com</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>No 320, 1 R N Mukherjee Road, 3rd Floor, Kolkata, West Bengal 700001</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimers */}
        <div className="mt-10 border-t border-border pt-6">
          <p className="text-xs leading-relaxed text-muted-foreground">
            <strong>{t("footer.disclaimerLink")}:</strong> {t("footer.disclaimer")}
          </p>
          <div className="mt-4 flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
            <p>{t("footer.copyright").replace("{year}", new Date().getFullYear().toString())}</p>
            <div className="flex gap-4">
              <Link to="/privacy" className="hover:text-primary">{t("footer.privacyPolicy")}</Link>
              <Link to="/terms" className="hover:text-primary">{t("footer.termsOfUse")}</Link>
              <Link to="/disclaimer" className="hover:text-primary">{t("footer.disclaimerLink")}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
