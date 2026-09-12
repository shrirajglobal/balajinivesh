import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpenCheck, CalendarClock, Flame, MessageCircle, Phone, Plus, Target, Users, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import PartnerLayout from "@/components/partner/PartnerLayout";
import StatsCard from "@/components/partner/StatsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LeadSummary {
  id: string;
  name: string;
  phone: string | null;
  status: string;
  priority: string;
  next_follow_up_date: string | null;
  updated_at: string;
}

const closedStatuses = ["converted", "not_interested"];

const Dashboard = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<LeadSummary[]>([]);
  const [chapters, setChapters] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      const { data: partner } = await supabase.from("partners").select("id").eq("user_id", user.id).maybeSingle();
      if (!partner) return;

      const [leadRes, chapterRes] = await Promise.all([
        supabase.from("partner_leads").select("id,name,phone,status,priority,next_follow_up_date,updated_at").eq("partner_id", partner.id),
        supabase.from("partner_chapter_progress").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      ]);
      setLeads((leadRes.data || []) as LeadSummary[]);
      setChapters(chapterRes.count || 0);
    };
    fetchStats();
  }, [user]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date();
    const active = leads.filter((lead) => !closedStatuses.includes(lead.status));
    const followUps = active.filter((lead) => lead.next_follow_up_date && lead.next_follow_up_date <= today);
    const hot = active.filter((lead) => lead.priority === "hot");
    const converted = leads.filter((lead) => {
      const updated = new Date(lead.updated_at);
      return lead.status === "converted" && updated.getFullYear() === now.getFullYear() && updated.getMonth() === now.getMonth();
    });
    return { active: active.length, followUps, hot: hot.length, converted: converted.length };
  }, [leads]);

  const urgentFollowUps = useMemo(() => [...stats.followUps]
    .sort((a, b) => (a.next_follow_up_date || "").localeCompare(b.next_follow_up_date || ""))
    .slice(0, 3), [stats.followUps]);

  const whatsappHref = (lead: LeadSummary) => {
    const digits = (lead.phone || "").replace(/[^\d]/g, "");
    const number = digits.length === 10 ? `91${digits}` : digits;
    return `https://wa.me/${number}?text=${encodeURIComponent(`Hi ${lead.name}, following up on our conversation.`)}`;
  };

  return (
    <PartnerLayout>
       <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
         <div><p className="text-sm font-semibold text-primary">Distributor Portal</p><h1 className="font-display text-2xl font-bold text-foreground">Today’s lead priorities</h1><p className="mt-1 text-muted-foreground">Start with due follow-ups, then continue your learning.</p></div>
         <Button asChild><Link to="/partner/leads"><Plus className="mr-2 h-4 w-4" />Add a lead</Link></Button>
       </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={CalendarClock} title="Due follow-ups" value={String(stats.followUps.length)} />
        <StatsCard icon={Flame} title="Hot leads" value={String(stats.hot)} />
        <StatsCard icon={Users} title="Active leads" value={String(stats.active)} />
        <StatsCard icon={Target} title="Converted this month" value={String(stats.converted)} />
      </div>

      <section className="mt-8" aria-labelledby="urgent-follow-ups">
        <div className="flex items-center justify-between gap-3">
          <h2 id="urgent-follow-ups" className="font-display text-xl font-bold text-foreground">Follow up now</h2>
          <Button asChild variant="ghost" size="sm"><Link to="/partner/leads">View all <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
        </div>
        {urgentFollowUps.length > 0 ? (
          <div className="mt-3 divide-y divide-border rounded-lg border border-border bg-card">
            {urgentFollowUps.map((lead) => (
              <div key={lead.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div><p className="font-semibold text-foreground">{lead.name}</p><p className="text-sm text-muted-foreground">Follow-up {lead.next_follow_up_date}</p></div>
                <div className="flex gap-2">
                  {lead.phone && <Button asChild variant="outline" size="icon" aria-label={`Call ${lead.name}`}><a href={`tel:${lead.phone}`}><Phone className="h-4 w-4" /></a></Button>}
                  {lead.phone && <Button asChild variant="outline" size="icon" aria-label={`WhatsApp ${lead.name}`}><a href={whatsappHref(lead)} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-4 w-4" /></a></Button>}
                  <Button asChild size="sm"><Link to="/partner/leads">Open lead</Link></Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-3 rounded-lg border border-border bg-card p-6"><p className="font-medium text-foreground">No follow-ups are due.</p><p className="mt-1 text-sm text-muted-foreground">Add a lead or schedule the next follow-up to keep your pipeline moving.</p><Button asChild className="mt-4" variant="outline"><Link to="/partner/leads"><Plus className="mr-2 h-4 w-4" />Add your first lead</Link></Button></div>
        )}
      </section>

      <div className="mt-8 grid gap-4 md:grid-cols-[2fr_1fr]">
        <Card className="border-primary/20"><CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-lg"><BookOpenCheck className="h-5 w-5 text-primary" />Continue learning</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">You have completed {chapters} Academy chapter{chapters === 1 ? "" : "s"}.</p><Button asChild variant="outline" className="mt-4"><Link to="/partner/academy">Continue in Academy <ArrowRight className="ml-2 h-4 w-4" /></Link></Button></CardContent></Card>
        <Card><CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-lg"><Wrench className="h-5 w-5 text-secondary" />Toolkit</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Request practical distributor resources.</p><Button asChild variant="ghost" className="mt-4 px-0"><Link to="/partner/toolkit">Open Toolkit <ArrowRight className="ml-2 h-4 w-4" /></Link></Button></CardContent></Card>
      </div>
    </PartnerLayout>
  );
};

export default Dashboard;
