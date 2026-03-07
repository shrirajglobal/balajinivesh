import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const Footer = () => {
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
            <p className="text-sm leading-relaxed text-muted-foreground">
              Your trusted partner for financial planning and investment distribution. AMFI registered mutual fund distributor.
            </p>
            <p className="text-xs font-medium text-muted-foreground">
              ARN - XXXXXX | AMFI Registered
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-display text-sm font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: "About Us", path: "/about" },
                { label: "Investment Solutions", path: "/solutions/mutual-funds" },
                { label: "Tools & Calculators", path: "/calculators" },
                { label: "Investor Education", path: "/education" },
                { label: "Contact Us", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="mb-4 font-display text-sm font-semibold text-foreground">Solutions</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Mutual Funds", path: "/solutions/mutual-funds" },
                { label: "Bonds", path: "/solutions/bonds" },
                { label: "Insurance", path: "/solutions/insurance" },
                { label: "IPO", path: "/solutions/ipo" },
                { label: "Fixed Deposits", path: "/solutions/fixed-deposits" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-display text-sm font-semibold text-foreground">Contact Us</h4>
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
                <span>Your Office Address, City, State, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimers */}
        <div className="mt-10 border-t border-border pt-6">
          <p className="text-xs leading-relaxed text-muted-foreground">
            <strong>Disclaimer:</strong> Mutual fund investments are subject to market risks. Read all scheme-related documents carefully before investing. Past performance is not indicative of future results. The information provided on this platform is for educational purposes only and should not be construed as investment advice. Balaji Nivesh is an AMFI registered mutual fund distributor and does not provide investment advisory services as defined under SEBI (Investment Advisers) Regulations, 2013.
          </p>
          <div className="mt-4 flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
            <p>© {new Date().getFullYear()} Balaji Nivesh. All rights reserved.</p>
            <div className="flex gap-4">
              <Link to="/privacy" className="hover:text-primary">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-primary">Terms of Use</Link>
              <Link to="/disclaimer" className="hover:text-primary">Disclaimer</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
