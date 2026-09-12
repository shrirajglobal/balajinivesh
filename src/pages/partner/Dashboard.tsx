import { useEffect, useState } from "react";
import { ArrowRight, BookOpenCheck, CalendarClock, Plus, TrendingUp, Users, IndianRupee, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import PartnerLayout from "@/components/partner/PartnerLayout";
import StatsCard from "@/components/partner/StatsCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState({ aum: 0, commission: 0, clients: 0, leads: 0, followUps: 0, chapters: 0 });

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      const { data: partner } = await supabase.from("partners").select("id").eq("user_id", user.id).maybeSingle();
      if (!partner) return;

      const today = new Date().toISOString().slice(0, 10);
      const [aumRes, commRes, clientRes, leadRes, followUpRes, chapterRes] = await Promise.all([
        supabase.from("partner_aum_data").select("aum_amount").eq("partner_id", partner.id),
        supabase.from("partner_commissions").select("commission_amount").eq("partner_id", partner.id),
        supabase.from("partner_clients").select("id", { count: "exact", head: true }).eq("partner_id", partner.id),
        supabase.from("partner_leads").select("id", { count: "exact", head: true }).eq("partner_id", partner.id),
        supabase.from("partner_leads").select("id", { count: "exact", head: true }).eq("partner_id", partner.id).lte("next_follow_up_date", today).not("status", "eq", "converted"),
        supabase.from("partner_chapter_progress").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      ]);

      setStats({
        aum: (aumRes.data || []).reduce((s, r) => s + Number(r.aum_amount), 0),
        commission: (commRes.data || []).reduce((s, r) => s + Number(r.commission_amount), 0),
        clients: clientRes.count || 0,
        leads: leadRes.count || 0,
        followUps: followUpRes.count || 0,
        chapters: chapterRes.count || 0,
      });
    };
    fetchStats();
  }, [user]);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <PartnerLayout>
       <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
         <div><p className="text-sm font-semibold text-primary">Distributor Learning &amp; CRM</p><h1 className="font-display text-2xl font-bold text-foreground">Your next best actions</h1><p className="mt-1 text-muted-foreground">Learn consistently and keep every lead moving forward.</p></div>
         <Button asChild><Link to="/partner/leads"><Plus className="mr-2 h-4 w-4" />Add a lead</Link></Button>
       </div>

       <div className="mt-8 grid gap-4 md:grid-cols-2">
         <Card className="border-primary/20"><CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-lg"><BookOpenCheck className="h-5 w-5 text-primary" />Continue learning</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">You have completed {stats.chapters} academy chapter{stats.chapters === 1 ? "" : "s"}.</p><Button asChild variant="outline" className="mt-4"><Link to="/partner/academy">Open Academy <ArrowRight className="ml-2 h-4 w-4" /></Link></Button></CardContent></Card>
         <Card className="border-secondary/20"><CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-lg"><CalendarClock className="h-5 w-5 text-secondary" />Work your leads</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">{stats.followUps} follow-up{stats.followUps === 1 ? " is" : "s are"} due or overdue.</p><Button asChild variant="outline" className="mt-4"><Link to="/partner/leads">Review follow-ups <ArrowRight className="ml-2 h-4 w-4" /></Link></Button></CardContent></Card>
       </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={TrendingUp} title={t("partnerDash.totalAUM")} value={fmt(stats.aum)} />
        <StatsCard icon={IndianRupee} title={t("partnerDash.totalCommission")} value={fmt(stats.commission)} />
        <StatsCard icon={Users} title={t("partnerDash.clients")} value={String(stats.clients)} />
        <StatsCard icon={FileText} title={t("partnerDash.leads")} value={String(stats.leads)} />
      </div>

       <div className="mt-8 rounded-lg border border-border bg-card p-6"><p className="text-sm text-muted-foreground">{t("partnerDash.dataNote")}</p></div>
    </PartnerLayout>
  );
};

export default Dashboard;
