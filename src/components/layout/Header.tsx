import { useState, useCallback, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu, X, ChevronDown, ChevronRight, Shield, LogIn, LogOut, Globe,
  LayoutDashboard, Calculator, Briefcase, GraduationCap, Newspaper,
  TrendingUp, Video, MessagesSquare, MapPin, MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage, LANGUAGE_LABELS, type Language } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useWhatsAppContactHref } from "@/lib/whatsapp";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.jpeg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type MegaColumn = {
  title: string;
  items: { label: string; path: string; icon?: any; desc?: string }[];
};
type NavItem =
  | { label: string; path: string; mega?: undefined }
  | { label: string; path: string; mega: MegaColumn[] };

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileSubOpen, setMobileSubOpen] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPartner, setIsPartner] = useState(false);
  const location = useLocation();
  const { t, language, setLanguage } = useLanguage();
  const { user, signOut } = useAuth();
  const { data: settings } = useSiteSettings();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const whatsappNumber = (settings?.map.contact_whatsapp || settings?.map.contact_phone || "").replace(/[^\d]/g, "");
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi Balaji Nivesh, I'd like to talk to an advisor.")}`
    : "/contact";

  useEffect(() => {
    if (!user) { setIsAdmin(false); setIsPartner(false); return; }
    supabase.rpc("has_role", { _user_id: user.id, _role: "admin" }).then(({ data }) => setIsAdmin(!!data));
    supabase.rpc("has_role", { _user_id: user.id, _role: "partner" }).then(({ data }) => setIsPartner(!!data));
  }, [user]);

  useEffect(() => {
    setMobileOpen(false);
    setMobileSubOpen(null);
    setOpenMenu(null);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const toggleMobile = useCallback(() => setMobileOpen((prev) => !prev), []);

  const handleEnter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };
  const handleLeave = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };

  const navItems: NavItem[] = [
    {
      label: "Invest",
      path: "/solutions",
      mega: [
        {
          title: "Solutions",
          items: [
            { label: t("nav.mutualFunds"), path: "/solutions/mutual-funds", icon: Briefcase, desc: "SIPs, ELSS, debt & hybrid funds" },
            { label: t("nav.bonds"), path: "/solutions/bonds", icon: Briefcase, desc: "Govt & corporate bonds" },
            { label: t("nav.insurance"), path: "/solutions/insurance", icon: Shield, desc: "Term & health protection" },
            { label: t("nav.ipo"), path: "/solutions/ipo", icon: TrendingUp, desc: "Primary market access" },
            { label: t("nav.fixedDeposits"), path: "/solutions/fixed-deposits", icon: Briefcase, desc: "Corporate FDs" },
          ],
        },
        {
          title: "Plan & Calculate",
          items: [
            { label: "All Calculators", path: "/calculators", icon: Calculator, desc: "SIP, lumpsum, retirement & more" },
            { label: "Financial Health Check", path: "/tools/health-check", icon: Shield, desc: "Score your finances in 2 min" },
            { label: "Risk Profile", path: "/tools/risk-profile", icon: TrendingUp, desc: "Find your investor personality" },
            { label: "Goal Visualizer", path: "/tools/sip-goal", icon: Calculator, desc: "Plan for a specific dream" },
          ],
        },
      ],
    },
    {
      label: "Learn",
      path: "/education",
      mega: [
        {
          title: "Education Hub",
          items: [
            { label: "Investor Education", path: "/education", icon: GraduationCap, desc: "Modules for every level" },
            { label: "For Homemakers", path: "/education/homemakers", icon: GraduationCap, desc: "Money basics, made simple" },
            { label: "For Kids", path: "/education/kids", icon: GraduationCap, desc: "Fun money lessons" },
            { label: "Community Forum", path: "/forum", icon: MessagesSquare, desc: "Ask, discuss, share" },
          ],
        },
        {
          title: "Insights & Stories",
          items: [
            { label: "Blog", path: "/blog", icon: Newspaper, desc: "Guides & explainers" },
            { label: "Market Updates", path: "/market-updates", icon: TrendingUp, desc: "Daily & weekly briefs" },
            { label: "Videos", path: "/videos", icon: Video, desc: "Watch & learn" },
          ],
        },
      ],
    },
    { label: "Find an Advisor", path: "/locator" },
    { label: t("partner.navPartner"), path: "/partner" },
    { label: t("nav.about"), path: "/about" },
  ];

  const isActive = (path: string) => location.pathname === path || (path !== "/" && location.pathname.startsWith(path + "/"));

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="bg-primary/5 text-center text-xs leading-tight text-muted-foreground">
        <div className="container px-4 py-1.5">
          <span className="font-medium text-foreground">Balaji Nivesh Private Limited</span> · AMFI-registered Mutual Fund Distributor · ARN – 173142 · <span className="italic hidden sm:inline">Not a SEBI-registered Investment Adviser</span>
        </div>
      </div>
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
            item.mega ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => handleEnter(item.label)}
                onMouseLeave={handleLeave}
              >
                <button
                  className={cn(
                    "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
                    isActive(item.path) ? "text-primary" : "text-muted-foreground"
                  )}
                  aria-expanded={openMenu === item.label}
                  aria-haspopup="true"
                >
                  {item.label}
                  <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", openMenu === item.label && "rotate-180")} />
                </button>
                {openMenu === item.label && (
                  <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2">
                    <div className="grid w-[640px] grid-cols-2 gap-1 rounded-xl border border-border bg-card p-2 shadow-2xl shadow-foreground/10">
                      {item.mega.map((col) => (
                        <div key={col.title} className="p-2">
                          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">{col.title}</p>
                          {col.items.map((child) => (
                            <Link
                              key={child.path}
                              to={child.path}
                              className={cn(
                                "flex items-start gap-3 rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-accent",
                                isActive(child.path) && "bg-accent/50"
                              )}
                            >
                              {child.icon && (
                                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand-orange-light text-primary">
                                  <child.icon className="h-3.5 w-3.5" />
                                </span>
                              )}
                              <span className="min-w-0">
                                <span className="block font-medium text-foreground">{child.label}</span>
                                {child.desc && <span className="block text-xs text-muted-foreground">{child.desc}</span>}
                              </span>
                            </Link>
                          ))}
                        </div>
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
            <Link to="/admin" className={cn("flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary", isActive("/admin") ? "text-primary" : "text-muted-foreground")}>
              <Shield className="h-3.5 w-3.5" />Admin
            </Link>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3">
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
            <Button asChild size="sm" variant="ghost" className="hidden sm:inline-flex">
              <Link to="/auth" className="flex items-center gap-1.5">
                <LogIn className="h-4 w-4" /> Login
              </Link>
            </Button>
          )}

          <Button asChild size="sm" className="hidden sm:inline-flex bg-brand-green hover:bg-brand-green/90 text-white">
            <a href={whatsappHref} target={whatsappNumber ? "_blank" : undefined} rel="noopener noreferrer" className="flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4" />
              Talk to us
            </a>
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

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="fixed inset-x-0 top-14 bottom-0 z-50 overflow-y-auto overscroll-contain border-t border-border bg-background sm:top-16 lg:hidden">
          <nav className="container flex flex-col gap-1 py-4 pb-24">
            {navItems.map((item) =>
              item.mega ? (
                <div key={item.label}>
                  <button
                    onClick={() => setMobileSubOpen(mobileSubOpen === item.label ? null : item.label)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold text-foreground active:bg-accent"
                  >
                    {item.label}
                    <ChevronRight className={cn("h-4 w-4 text-muted-foreground transition-transform", mobileSubOpen === item.label && "rotate-90")} />
                  </button>
                  {mobileSubOpen === item.label && (
                    <div className="ml-3 space-y-3 border-l-2 border-border pl-3 py-2">
                      {item.mega.map((col) => (
                        <div key={col.title}>
                          <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">{col.title}</p>
                          {col.items.map((child) => (
                            <Link
                              key={child.path}
                              to={child.path}
                              className={cn(
                                "block rounded-lg px-3 py-2.5 text-sm transition-colors active:bg-accent",
                                isActive(child.path) ? "text-primary font-medium" : "text-muted-foreground"
                              )}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "rounded-lg px-3 py-3 text-sm font-medium transition-colors active:bg-accent flex items-center gap-2",
                    isActive(item.path) ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.path === "/locator" && <MapPin className="h-4 w-4" />}
                  {item.label}
                </Link>
              )
            )}
            {isAdmin && (
              <Link to="/admin" className={cn("flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium transition-colors active:bg-accent", isActive("/admin") ? "text-primary" : "text-muted-foreground")}>
                <Shield className="h-4 w-4" /> Admin Panel
              </Link>
            )}
            {isPartner && (
              <Link to="/partner/dashboard" className={cn("flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium transition-colors active:bg-accent", isActive("/partner") ? "text-primary" : "text-muted-foreground")}>
                <LayoutDashboard className="h-4 w-4" /> Partner Portal
              </Link>
            )}
            <div className="mt-4 px-3 flex flex-col gap-2">
              <Button asChild className="w-full bg-brand-green hover:bg-brand-green/90 text-white">
                <a href={whatsappHref} target={whatsappNumber ? "_blank" : undefined} rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                  <MessageCircle className="h-4 w-4" /> Talk to us on WhatsApp
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/contact">Book a free call</Link>
              </Button>
              {user ? (
                <Button variant="ghost" className="w-full flex items-center gap-2" onClick={() => signOut()}>
                  <LogOut className="h-4 w-4" /> Sign Out
                </Button>
              ) : (
                <Button asChild variant="ghost" className="w-full">
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
