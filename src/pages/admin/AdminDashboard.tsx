import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, ClipboardList, Gift, BarChart3, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

interface Stats {
  totalUsers: number;
  pendingApplications: number;
  activePartners: number;
  pendingGifts: number;
  totalAUM: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [profiles, pendingApps, partners, gifts, aum] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("partner_applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("partners").select("id", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("gift_claims").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("partner_aum_data").select("aum_amount"),
      ]);

      const totalAUM = (aum.data || []).reduce((sum, r) => sum + Number(r.aum_amount), 0);

      setStats({
        totalUsers: profiles.count || 0,
        pendingApplications: pendingApps.count || 0,
        activePartners: partners.count || 0,
        pendingGifts: gifts.count || 0,
        totalAUM,
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const cards = [
    { title: "Total Users", value: stats!.totalUsers, icon: Users, link: "/admin/users", color: "text-blue-600" },
    { title: "Pending Applications", value: stats!.pendingApplications, icon: ClipboardList, link: "/admin/partners", color: "text-orange-600" },
    { title: "Active Partners", value: stats!.activePartners, icon: UserCheck, link: "/admin/partners/active", color: "text-green-600" },
    { title: "Pending Gift Claims", value: stats!.pendingGifts, icon: Gift, link: "/admin/gifts", color: "text-purple-600" },
    { title: "Total AUM", value: `₹${(stats!.totalAUM / 100000).toFixed(2)}L`, icon: BarChart3, link: "/admin/aum", color: "text-primary" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Overview of your platform</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((c) => (
          <Link key={c.title} to={c.link}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{c.title}</CardTitle>
                <c.icon className={`h-5 w-5 ${c.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{c.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
