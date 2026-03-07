import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/logo.jpeg";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const { t, language, setLanguage } = useLanguage();

  const navItems = [
    { label: t("nav.home"), path: "/" },
    {
      label: t("nav.investmentSolutions"),
      path: "/solutions",
      children: [
        { label: t("nav.mutualFunds"), path: "/solutions/mutual-funds" },
        { label: t("nav.bonds"), path: "/solutions/bonds" },
        { label: t("nav.insurance"), path: "/solutions/insurance" },
        { label: t("nav.ipo"), path: "/solutions/ipo" },
        { label: t("nav.fixedDeposits"), path: "/solutions/fixed-deposits" },
      ],
    },
    { label: t("nav.toolsCalculators"), path: "/calculators" },
    { label: t("nav.education"), path: "/education" },
    { label: t("nav.marketInsights"), path: "/insights" },
    { label: t("nav.about"), path: "/about" },
  ];

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between lg:h-18">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Balaji Nivesh" className="h-10 w-auto" />
          <span className="hidden font-display text-lg font-bold text-foreground sm:inline-block">
            Balaji <span className="text-secondary">Nivesh</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button
                  className={cn(
                    "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                    isActive(item.path) ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                {dropdownOpen && (
                  <div className="absolute left-0 top-full pt-1">
                    <div className="min-w-[200px] rounded-lg border border-border bg-card p-2 shadow-lg">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                  isActive(item.path) ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* Language Toggle + CTA + Mobile Toggle */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <div className="flex items-center rounded-full border border-border bg-card text-xs font-medium">
            <button
              onClick={() => setLanguage("en")}
              className={cn(
                "rounded-full px-2.5 py-1 transition-colors",
                language === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("hi")}
              className={cn(
                "rounded-full px-2.5 py-1 transition-colors",
                language === "hi" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              हिं
            </button>
          </div>
          <Button asChild className="hidden sm:inline-flex">
            <Link to="/contact">{t("nav.freeHealthCheck")}</Link>
          </Button>
          <button
            className="inline-flex items-center justify-center rounded-md p-2 text-foreground lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="container flex flex-col gap-1 py-4">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <p className="px-3 py-2 text-sm font-semibold text-foreground">{item.label}</p>
                  {item.children.map((child) => (
                    <Link
                      key={child.path}
                      to={child.path}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-md px-6 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium hover:bg-accent",
                    isActive(item.path) ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              )
            )}
            <Button asChild className="mt-2">
              <Link to="/contact" onClick={() => setMobileOpen(false)}>
                {t("nav.freeHealthCheck")}
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
