import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, IndianRupee, Users, UserPlus, GraduationCap, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

const PartnerSidebar = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { icon: LayoutDashboard, label: "Home", path: "/partner/dashboard", group: "" },
    { icon: UserPlus, label: "Leads", path: "/partner/leads", group: "CRM" },
    { icon: Users, label: "Clients", path: "/partner/clients", group: "CRM" },
    { icon: GraduationCap, label: "Academy", path: "/partner/academy", group: "Learning" },
    { icon: IndianRupee, label: "Commissions", path: "/partner/commissions", group: "Business" },
    { icon: Megaphone, label: "Toolkit", path: "/partner/toolkit", group: "Business" },
  ];

  return (
    <aside className="w-full shrink-0 lg:w-56">
      <nav className="flex gap-1 overflow-x-auto pb-2 scrollbar-thin lg:flex-col lg:pb-0">
        {navItems.map((item, index) => {
          const active = location.pathname === item.path;
          return (
            <div key={item.path}>
              {item.group && (index === 0 || navItems[index - 1].group !== item.group) && <p className="hidden px-3 pb-1 pt-4 text-xs font-semibold uppercase text-muted-foreground lg:block">{item.group}</p>}
              <Link
                to={item.path}
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default PartnerSidebar;
