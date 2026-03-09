import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, IndianRupee, Users, UserPlus, GraduationCap, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/partner/dashboard" },
  { icon: IndianRupee, label: "Commissions", path: "/partner/commissions" },
  { icon: Users, label: "Clients", path: "/partner/clients" },
  { icon: UserPlus, label: "Leads", path: "/partner/leads" },
  { icon: GraduationCap, label: "Academy", path: "/partner/academy" },
  { icon: Megaphone, label: "Toolkit", path: "/partner/toolkit" },
];

const PartnerSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-full shrink-0 lg:w-56">
      <nav className="flex gap-1 overflow-x-auto lg:flex-col">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default PartnerSidebar;
