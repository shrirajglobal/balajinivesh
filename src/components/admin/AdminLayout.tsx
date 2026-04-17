import { Link, useLocation, Outlet } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FileText,
  Wallet,
  BarChart3,
  UsersRound,
  Gift,
  GraduationCap,
  ClipboardList,
  Settings,
  Upload,
  Shield,
  Plug,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { title: "Partner Applications", path: "/admin/partners", icon: ClipboardList },
  { title: "Active Partners", path: "/admin/partners/active", icon: UserCheck },
  { title: "RTA Uploads", path: "/admin/rta-upload", icon: Upload },
  { title: "Clients", path: "/admin/clients", icon: UsersRound },
  { title: "Commissions", path: "/admin/commissions", icon: Wallet },
  { title: "AUM Data", path: "/admin/aum", icon: BarChart3 },
  { title: "Users", path: "/admin/users", icon: Users },
  { title: "Gift Claims", path: "/admin/gifts", icon: Gift },
  { title: "Certificates", path: "/admin/certificates", icon: GraduationCap },
  { title: "Leads", path: "/admin/leads", icon: FileText },
  { title: "Integrations", path: "/admin/integrations", icon: Plug },
  { title: "Site Settings", path: "/admin/site-settings", icon: Globe },
  { title: "Settings", path: "/admin/settings", icon: Settings },
];

function AdminSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <Shield className="mr-2 h-4 w-4" />
            {!collapsed && "Admin Panel"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent",
                        isActive(item.path)
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

const AdminLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-[calc(100vh-4rem)] flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b border-border px-4">
            <SidebarTrigger className="mr-4" />
            <h2 className="font-display text-sm font-semibold text-foreground">Super Admin</h2>
          </header>
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
