import { useState, useCallback, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronRight, Shield, LogIn, LogOut, Globe, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage, LANGUAGE_LABELS, type Language } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.jpeg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileSubOpen, setMobileSubOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPartner, setIsPartner] = useState(false);
  const location = useLocation();
  const { t, language, setLanguage } = useLanguage();
  const { user, signOut } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check roles
  useEffect(() => {
    if (!user) { setIsAdmin(false); setIsPartner(false); return; }
    supabase.rpc("has_role", { _user_id: user.id, _role: "admin" }).then(({ data }) => setIsAdmin(!!data));
    supabase.rpc("has_role", { _user_id: user.id, _role: "partner" }).then(({ data }) => setIsPartner(!!data));
  }, [user]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setMobileSubOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const toggleMobile = useCallback(() => setMobileOpen((prev) => !prev), []);

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
    { label: "Blog", path: "/blog" },
    { label: "Market Updates", path: "/market-updates" },
    { label: t("partner.navPartner"), path: "/partner" },
    { label: t("nav.about"), path: "/about" },
  ];

  const isActive = (path: string) => location.pathname === path || (path !== "/" && location.pathname.startsWith(path + "/"));

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-14 items-center justify-between sm:h-16 lg:h-18">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="Balaji Nivesh" className="h-8 w-auto sm:h-10" />
          <span className="hidden font-display text-base font-bold text-foreground sm:inline-block sm:text-lg">
            Balaji <span className="text-secondary">Nivesh</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {navItems.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                ref={dropdownRef}
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button
                  className={cn(
                    "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                    isActive(item.path) ? "text-primary" : "text-muted-foreground"
                  )}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  {item.label}
                  <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", dropdownOpen && "rotate-180")} />
                </button>
                {dropdownOpen && (
                  <div className="absolute left-0 top-full pt-1">
                    <div className="min-w-[220px] rounded-lg border border-border bg-card p-1.5 shadow-xl shadow-foreground/5">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={cn(
                            "flex items-center rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                            isActive(child.path) ? "text-primary bg-accent/50" : "text-muted-foreground"
                          )}
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
          {isAdmin && (
            <Link
              to="/admin"
              className={cn(
                "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                isActive("/admin") ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Shield className="h-3.5 w-3.5" />
              Admin
            </Link>
          )}
        </nav>

        {/* Right side: Language + CTA + Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Toggle (EN / हिं / বাং) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-semibold text-foreground transition-colors hover:border-primary/40"
                aria-label="Change language"
              >
                <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                {LANGUAGE_LABELS[language]}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              {(Object.keys(LANGUAGE_LABELS) as Language[]).map((lang) => (
                <DropdownMenuItem
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={cn("cursor-pointer", language === lang && "bg-accent text-primary font-semibold")}
                >
                  {LANGUAGE_LABELS[lang]}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {lang === "en" ? "English" : lang === "hi" ? "हिन्दी" : "বাংলা"}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Login / User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hidden h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold sm:inline-flex">
                  {user.email?.charAt(0).toUpperCase() || "U"}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-xs text-muted-foreground truncate">{user.email}</div>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex items-center gap-2 cursor-pointer">
                      <Shield className="h-4 w-4" /> Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                {isPartner && (
                  <DropdownMenuItem asChild>
                    <Link to="/partner/dashboard" className="flex items-center gap-2 cursor-pointer">
                      <LayoutDashboard className="h-4 w-4" /> Partner Portal
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="flex items-center gap-2 cursor-pointer text-destructive">
                  <LogOut className="h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex">
              <Link to="/auth" className="flex items-center gap-1.5">
                <LogIn className="h-4 w-4" /> Login
              </Link>
            </Button>
          )}

          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/contact">{t("nav.freeHealthCheck")}</Link>
          </Button>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent lg:hidden"
            onClick={toggleMobile}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav — full screen overlay */}
      {mobileOpen && (
        <div className="fixed inset-x-0 top-14 bottom-0 z-50 overflow-y-auto overscroll-contain border-t border-border bg-background sm:top-16 lg:hidden">
          <nav className="container flex flex-col gap-1 py-4 pb-24">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <button
                    onClick={() => setMobileSubOpen(!mobileSubOpen)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold text-foreground active:bg-accent"
                  >
                    {item.label}
                    <ChevronRight className={cn("h-4 w-4 text-muted-foreground transition-transform", mobileSubOpen && "rotate-90")} />
                  </button>
                  {mobileSubOpen && (
                    <div className="ml-3 border-l-2 border-border pl-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={cn(
                            "block rounded-lg px-3 py-3 text-sm transition-colors active:bg-accent",
                            isActive(child.path) ? "text-primary font-medium" : "text-muted-foreground"
                          )}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "rounded-lg px-3 py-3 text-sm font-medium transition-colors active:bg-accent",
                    isActive(item.path) ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              )
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium transition-colors active:bg-accent",
                  isActive("/admin") ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Shield className="h-4 w-4" />
                Admin Panel
              </Link>
            )}
            {isPartner && (
              <Link
                to="/partner/dashboard"
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium transition-colors active:bg-accent",
                  isActive("/partner") ? "text-primary" : "text-muted-foreground"
                )}
              >
                <LayoutDashboard className="h-4 w-4" />
                Partner Portal
              </Link>
            )}
            <div className="mt-4 px-3 flex flex-col gap-2">
              <Button asChild className="w-full">
                <Link to="/contact">{t("nav.freeHealthCheck")}</Link>
              </Button>
              {user ? (
                <Button variant="outline" className="w-full flex items-center gap-2" onClick={() => signOut()}>
                  <LogOut className="h-4 w-4" /> Sign Out
                </Button>
              ) : (
                <Button asChild variant="outline" className="w-full">
                  <Link to="/auth" className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" /> Login
                  </Link>
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
