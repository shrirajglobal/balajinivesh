import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, UserPlus, GraduationCap, Megaphone, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const PartnerSidebar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: "Home", path: "/partner/dashboard", group: "" },
    { icon: UserPlus, label: "Leads", path: "/partner/leads", group: "" },
    { icon: GraduationCap, label: "Academy", path: "/partner/academy", group: "" },
    { icon: Megaphone, label: "Toolkit", path: "/partner/toolkit", group: "" },
  ];

  return (
    <aside className="w-full shrink-0 lg:w-56">
      <nav className="grid grid-cols-4 gap-1 pb-2 lg:flex lg:flex-col lg:pb-0" aria-label="Distributor portal">
        {navItems.map((item, index) => {
          const active = location.pathname === item.path;
          return (
            <div key={item.path}>
              {item.group && (index === 0 || navItems[index - 1].group !== item.group) && <p className="hidden px-3 pb-1 pt-4 text-xs font-semibold uppercase text-muted-foreground lg:block">{item.group}</p>}
              <Link
                to={item.path}
                className={cn(
                    "flex min-w-0 flex-col items-center gap-1 rounded-lg px-1 py-2 text-xs font-medium transition-colors lg:flex-row lg:gap-2 lg:px-3 lg:py-2.5 lg:text-sm",
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
      <div className="mt-5 hidden border-t border-border pt-4 lg:block">
        <p className="truncate px-3 text-xs text-muted-foreground">{user?.email}</p>
        <p className="mt-1 px-3 text-xs font-medium text-brand-green">Active distributor</p>
        <Button variant="ghost" size="sm" className="mt-2 w-full justify-start text-muted-foreground" onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </Button>
      </div>
    </aside>
  );
};

export default PartnerSidebar;
