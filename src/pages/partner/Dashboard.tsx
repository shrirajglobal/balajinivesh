import { useEffect, useState } from "react";
import { TrendingUp, Users, IndianRupee, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import PartnerLayout from "@/components/partner/PartnerLayout";
import StatsCard from "@/components/partner/StatsCard";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ aum: 0, commission: 0, clients: 0, leads: 0 });

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      // Get partner record
      const { data: partner } = await supabase
        .from("partners")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!partner) return;

      const [aumRes, commRes, clientRes, leadRes] = await Promise.all([
        supabase.from("partner_aum_data").select("aum_amount").eq("partner_id", partner.id),
        supabase.from("partner_commissions").select("commission_amount").eq("partner_id", partner.id),
        supabase.from("partner_clients").select("id", { count: "exact", head: true }).eq("partner_id", partner.id),
        supabase.from("partner_leads").select("id", { count: "exact", head: true }).eq("partner_id", partner.id),
      ]);

      const totalAum = (aumRes.data || []).reduce((s, r) => s + Number(r.aum_amount), 0);
      const totalComm = (commRes.data || []).reduce((s, r) => s + Number(r.commission_amount), 0);

      setStats({
        aum: totalAum,
        commission: totalComm,
        clients: clientRes.count || 0,
        leads: leadRes.count || 0,
      });
    };
    fetchStats();
  }, [user]);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <PartnerLayout>
      <h1 className="font-display text-2xl font-bold text-foreground">Partner Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Welcome back! Here's your business overview.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={TrendingUp} title="Total AUM" value={fmt(stats.aum)} />
        <StatsCard icon={IndianRupee} title="Total Commission" value={fmt(stats.commission)} />
        <StatsCard icon={Users} title="Clients" value={String(stats.clients)} />
        <StatsCard icon={FileText} title="Leads" value={String(stats.leads)} />
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          Your dashboard data is updated monthly when admin uploads the latest RTA statements. Contact your relationship manager for any queries.
        </p>
      </div>
    </PartnerLayout>
  );
};

export default Dashboard;
