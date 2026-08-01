import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import PartnerLayout from "@/components/partner/PartnerLayout";
import StatsCard from "@/components/partner/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Loader2, Phone, MessageCircle, CheckCircle2, Search, Users, Flame, CalendarClock, Trophy, CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import GoogleCalendarConnect from "@/components/partner/GoogleCalendarConnect";


type Priority = "hot" | "warm" | "cold";
type Status = "new" | "contacted" | "interested" | "meeting_scheduled" | "converted" | "not_interested";
type ActivityType = "note" | "call" | "whatsapp" | "meeting" | "status_change";

interface Lead {
  id: string;
  partner_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  status: Status;
  priority: Priority;
  source: string | null;
  expected_investment_amount: number | null;
  next_follow_up_date: string | null;
  last_contacted_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface Activity {
  id: string;
  lead_id: string;
  activity_type: ActivityType;
  content: string;
  created_at: string;
}

const STATUSES: Status[] = ["new", "contacted", "interested", "meeting_scheduled", "converted", "not_interested"];
const PRIORITIES: Priority[] = ["hot", "warm", "cold"];
const SOURCES = ["Referral", "Website/Calculator", "Walk-in", "Social Media", "Existing Client", "Other"];

const CLOSED_STATUSES: Status[] = ["converted", "not_interested"];

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(10).max(15).optional().or(z.literal("")),
  email: z.string().trim().email().optional().or(z.literal("")),
  notes: z.string().max(500).optional().or(z.literal("")),
  priority: z.enum(["hot", "warm", "cold"]).default("warm"),
  source: z.string().optional().or(z.literal("")),
  expected_investment_amount: z.string().optional().or(z.literal("")),
  next_follow_up_date: z.string().optional().or(z.literal("")),
});

const fmtINR = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const toISODate = (d: Date) => format(d, "yyyy-MM-dd");
const isSameMonth = (iso: string) => { const d = new Date(iso); const n = new Date(); return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth(); };
const daysDiff = (isoDate: string) => Math.floor((startOfToday().getTime() - new Date(isoDate + "T00:00:00").getTime()) / 86400000);

const priorityBadge = (p: Priority) => {
  if (p === "hot") return "bg-red-100 text-red-700";
  if (p === "warm") return "bg-amber-100 text-amber-700";
  return "bg-blue-100 text-blue-700";
};

const priorityRank = (p: Priority) => (p === "hot" ? 0 : p === "warm" ? 1 : 2);

const Leads = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | Priority>("all");
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [noteText, setNoteText] = useState("");
  const [calendarConnected, setCalendarConnected] = useState(false);


  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", email: "", notes: "", priority: "warm", source: "", expected_investment_amount: "", next_follow_up_date: "" },
  });

  const localeCode = language === "hi" ? "hi-IN" : language === "bn" ? "bn-IN" : "en-IN";

  const fetchLeads = async (pid: string) => {
    const { data } = await supabase
      .from("partner_leads")
      .select("*")
      .eq("partner_id", pid)
      .order("created_at", { ascending: false });
    setLeads((data || []) as Lead[]);
  };

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: partner } = await supabase.from("partners").select("id").eq("user_id", user.id).maybeSingle();
      if (!partner) return;
      setPartnerId(partner.id);
      await fetchLeads(partner.id);
    })();
  }, [user]);

  const fetchActivities = async (leadId: string) => {
    const { data } = await supabase
      .from("partner_lead_activities")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false });
    setActivities((data || []) as Activity[]);
  };

  const openLead = async (lead: Lead) => {
    setActiveLead(lead);
    setNoteText("");
    await fetchActivities(lead.id);
  };

  const logActivity = async (leadId: string, type: ActivityType, content: string) => {
    if (!partnerId) return;
    await supabase.from("partner_lead_activities").insert({
      lead_id: leadId,
      partner_id: partnerId,
      activity_type: type,
      content,
    });
  };

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (!partnerId) return;
    setLoading(true);
    const payload: any = {
      partner_id: partnerId,
      name: data.name,
      phone: data.phone || null,
      email: data.email || null,
      notes: data.notes || null,
      priority: data.priority,
      source: data.source || null,
      expected_investment_amount: data.expected_investment_amount ? Number(data.expected_investment_amount) : null,
      next_follow_up_date: data.next_follow_up_date || null,
    };
    const { error } = await supabase.from("partner_leads").insert(payload);
    setLoading(false);
    if (error) { toast({ title: t("partnerLeads.errorTitle"), description: t("partnerLeads.errorDesc"), variant: "destructive" }); return; }
    toast({ title: t("partnerLeads.successTitle") });
    setOpen(false);
    form.reset();
    await fetchLeads(partnerId);
  };

  const updateLead = async (lead: Lead, patch: Partial<Lead>, activityContent?: string, activityType: ActivityType = "status_change") => {
    const { error } = await supabase.from("partner_leads").update(patch).eq("id", lead.id);
    if (error) { toast({ title: t("partnerLeads.errorTitle"), description: error.message, variant: "destructive" }); return; }
    if (activityContent) await logActivity(lead.id, activityType, activityContent);
    if (partnerId) await fetchLeads(partnerId);
    if (activeLead?.id === lead.id) {
      const updated = { ...lead, ...patch } as Lead;
      setActiveLead(updated);
      await fetchActivities(lead.id);
    }
    toast({ title: t("partnerLeads.updated") });
  };

  const handleStatusChange = (lead: Lead, next: Status) => {
    if (lead.status === next) return;
    const label = (s: Status) => t(`partnerLeads.status${s.split("_").map(w => w[0].toUpperCase() + w.slice(1)).join("")}`);
    updateLead(lead, { status: next }, `${label(lead.status)} → ${label(next)}`, "status_change");
  };

  const handlePriorityChange = (lead: Lead, next: Priority) => {
    if (lead.priority === next) return;
    updateLead(lead, { priority: next }, `Priority: ${lead.priority} → ${next}`, "status_change");
  };

  const syncToCalendar = async (leadId: string, cleared: boolean) => {
    if (!calendarConnected) {
      toast({
        title: "Google Calendar not connected",
        description: "Connect your Google Calendar to get follow-up reminders automatically.",
      });
      return;
    }
    const { data, error } = await supabase.functions.invoke("partner-calendar", {
      body: { action: "sync_lead", lead_id: leadId },
    });
    if (error || (data as { error?: string } | null)?.error) {
      toast({ title: "Could not sync to Google Calendar", variant: "destructive" });
      return;
    }
    toast({ title: cleared ? "Calendar reminder removed" : "Synced to Google Calendar" });
  };

  const handleFollowUpChange = async (lead: Lead, next: Date | undefined) => {
    const iso = next ? toISODate(next) : null;
    if (iso === lead.next_follow_up_date) return;
    await updateLead(lead, { next_follow_up_date: iso }, `Next follow-up: ${iso || "cleared"}`, "status_change");
    void syncToCalendar(lead.id, !iso);
  };


  const markContacted = async (lead: Lead) => {
    await updateLead(lead, { last_contacted_at: new Date().toISOString() }, "Marked as contacted", "call");
  };

  const addNote = async () => {
    if (!activeLead || !noteText.trim()) return;
    await logActivity(activeLead.id, "note", noteText.trim());
    setNoteText("");
    await fetchActivities(activeLead.id);
  };

  // Derived data
  const stats = useMemo(() => {
    const today = toISODate(startOfToday());
    const total = leads.length;
    const hot = leads.filter(l => l.priority === "hot").length;
    const followUps = leads.filter(l => l.next_follow_up_date && l.next_follow_up_date <= today && !CLOSED_STATUSES.includes(l.status)).length;
    const converted = leads.filter(l => l.status === "converted" && isSameMonth(l.updated_at)).length;
    return { total, hot, followUps, converted };
  }, [leads]);

  const todaysFollowUps = useMemo(() => {
    const today = toISODate(startOfToday());
    return leads
      .filter(l => l.next_follow_up_date && l.next_follow_up_date <= today && !CLOSED_STATUSES.includes(l.status))
      .sort((a, b) => (a.next_follow_up_date! < b.next_follow_up_date! ? -1 : 1));
  }, [leads]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = leads.filter(l => {
      if (q && !(l.name.toLowerCase().includes(q) || (l.phone || "").toLowerCase().includes(q) || (l.email || "").toLowerCase().includes(q))) return false;
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (priorityFilter !== "all" && l.priority !== priorityFilter) return false;
      return true;
    });
    return rows.sort((a, b) => {
      const p = priorityRank(a.priority) - priorityRank(b.priority);
      if (p !== 0) return p;
      const af = a.next_follow_up_date || "9999-12-31";
      const bf = b.next_follow_up_date || "9999-12-31";
      if (af !== bf) return af < bf ? -1 : 1;
      return a.created_at < b.created_at ? 1 : -1;
    });
  }, [leads, search, statusFilter, priorityFilter]);

  const waHrefForLead = (lead: Lead) => {
    if (!lead.phone) return "#";
    const digits = lead.phone.replace(/[^\d]/g, "");
    const number = digits.length === 10 ? `91${digits}` : digits;
    const msg = t("partnerLeads.waMessage").replace("{name}", lead.name);
    return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
  };

  const statusLabel = (s: Status) => t(`partnerLeads.status${s.split("_").map(w => w[0].toUpperCase() + w.slice(1)).join("")}`);
  const priorityLabel = (p: Priority) => t(`partnerLeads.priority${p[0].toUpperCase() + p.slice(1)}`);

  return (
    <PartnerLayout>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">{t("partnerLeads.title")}</h1>
          <p className="mt-1 text-muted-foreground">{t("partnerLeads.subtitle")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <GoogleCalendarConnect onStatusChange={setCalendarConnected} />
        {partnerId && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-1 h-4 w-4" /> {t("partnerLeads.addLead")}</Button>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>{t("partnerLeads.addNewLead")}</DialogTitle></DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>{t("partnerLeads.name")}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem><FormLabel>{t("partnerLeads.phone")}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem><FormLabel>{t("partnerLeads.email")}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField control={form.control} name="priority" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("partnerLeads.priority")}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            {PRIORITIES.map(p => <SelectItem key={p} value={p}>{priorityLabel(p)}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="source" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("partnerLeads.source")}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl><SelectTrigger><SelectValue placeholder="—" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {SOURCES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField control={form.control} name="expected_investment_amount" render={({ field }) => (
                      <FormItem><FormLabel>{t("partnerLeads.expectedAmount")}</FormLabel><FormControl><Input type="number" min="0" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="next_follow_up_date" render={({ field }) => (
                      <FormItem><FormLabel>{t("partnerLeads.nextFollowUp")}</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="notes" render={({ field }) => (
                    <FormItem><FormLabel>{t("partnerLeads.notes")}</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} {t("partnerLeads.addLead")}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
        </div>
      </div>


      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard icon={Users} title={t("partnerLeads.statTotal")} value={String(stats.total)} />
        <StatsCard icon={Flame} title={t("partnerLeads.statHot")} value={String(stats.hot)} />
        <StatsCard icon={CalendarClock} title={t("partnerLeads.statFollowUps")} value={String(stats.followUps)} />
        <StatsCard icon={Trophy} title={t("partnerLeads.statConverted")} value={String(stats.converted)} />
      </div>

      {/* Today's follow-ups */}
      {todaysFollowUps.length > 0 && (
        <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-5">
          <div className="mb-3">
            <h2 className="font-display text-lg font-semibold text-foreground">{t("partnerLeads.todaysFollowUps")}</h2>
            <p className="text-sm text-muted-foreground">{t("partnerLeads.todaysFollowUpsDesc")}</p>
          </div>
          <div className="space-y-2">
            {todaysFollowUps.map(l => {
              const diff = daysDiff(l.next_follow_up_date!);
              const overdueLabel = diff > 0
                ? t("partnerLeads.overdueBy").replace("{days}", String(diff))
                : t("partnerLeads.dueToday");
              return (
                <div key={l.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-3">
                  <button className="flex-1 min-w-[180px] text-left" onClick={() => openLead(l)}>
                    <p className="font-medium text-foreground">{l.name}</p>
                    <p className="text-xs text-muted-foreground">{l.phone || "—"} · <span className={cn("font-medium", diff > 0 ? "text-red-600" : "text-amber-600")}>{overdueLabel}</span></p>
                  </button>
                  <div className="flex flex-wrap gap-2">
                    {l.phone && (
                      <>
                        <Button asChild size="sm" variant="outline"><a href={`tel:${l.phone}`}><Phone className="mr-1 h-3 w-3" />{t("partnerLeads.call")}</a></Button>
                        <Button asChild size="sm" variant="outline"><a href={waHrefForLead(l)} target="_blank" rel="noopener noreferrer"><MessageCircle className="mr-1 h-3 w-3" />{t("partnerLeads.whatsapp")}</a></Button>
                      </>
                    )}
                    <Button size="sm" onClick={() => markContacted(l)}><CheckCircle2 className="mr-1 h-3 w-3" />{t("partnerLeads.markContacted")}</Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder={t("partnerLeads.searchPlaceholder")} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <SelectTrigger className="w-[190px]"><SelectValue placeholder={t("partnerLeads.filterStatus")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("partnerLeads.allStatuses")}</SelectItem>
            {STATUSES.map(s => <SelectItem key={s} value={s}>{statusLabel(s)}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as any)}>
          <SelectTrigger className="w-[170px]"><SelectValue placeholder={t("partnerLeads.filterPriority")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("partnerLeads.allPriorities")}</SelectItem>
            {PRIORITIES.map(p => <SelectItem key={p} value={p}>{priorityLabel(p)}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Leads table */}
      <div className="mt-4 overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("partnerLeads.name")}</TableHead>
              <TableHead>{t("partnerLeads.phone")}</TableHead>
              <TableHead>{t("partnerLeads.priority")}</TableHead>
              <TableHead>{t("partnerLeads.status")}</TableHead>
              <TableHead>{t("partnerLeads.nextFollowUp")}</TableHead>
              <TableHead>{t("partnerLeads.source")}</TableHead>
              <TableHead>{t("partnerLeads.added")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">{partnerId ? t("partnerLeads.emptyWithPartner") : t("partnerLeads.emptyNoPartner")}</TableCell></TableRow>
            ) : filtered.map((l) => (
              <TableRow key={l.id} className="cursor-pointer" onClick={() => openLead(l)}>
                <TableCell className="font-medium">{l.name}</TableCell>
                <TableCell>{l.phone || "—"}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Select value={l.priority} onValueChange={(v) => handlePriorityChange(l, v as Priority)}>
                    <SelectTrigger className={cn("h-7 w-[100px] border-none px-2 text-xs font-medium", priorityBadge(l.priority))}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITIES.map(p => <SelectItem key={p} value={p}>{priorityLabel(p)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Select value={l.status} onValueChange={(v) => handleStatusChange(l, v as Status)}>
                    <SelectTrigger className="h-7 w-[160px] text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map(s => <SelectItem key={s} value={s}>{statusLabel(s)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className={cn("h-7 px-2 text-xs font-normal", !l.next_follow_up_date && "text-muted-foreground")}>
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        {l.next_follow_up_date ? format(new Date(l.next_follow_up_date + "T00:00:00"), "dd MMM") : t("partnerLeads.pickDate")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={l.next_follow_up_date ? new Date(l.next_follow_up_date + "T00:00:00") : undefined} onSelect={(d) => handleFollowUpChange(l, d)} initialFocus className={cn("p-3 pointer-events-auto")} />
                      {l.next_follow_up_date && (
                        <div className="border-t p-2"><Button variant="ghost" size="sm" className="w-full" onClick={() => handleFollowUpChange(l, undefined)}>{t("partnerLeads.clearDate")}</Button></div>
                      )}
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell className="text-muted-foreground">{l.source || "—"}</TableCell>
                <TableCell className="text-muted-foreground">{new Date(l.created_at).toLocaleDateString(localeCode)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Detail drawer */}
      <Sheet open={!!activeLead} onOpenChange={(o) => { if (!o) setActiveLead(null); }}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {activeLead && (
            <>
              <SheetHeader>
                <SheetTitle>{activeLead.name}</SheetTitle>
                <p className="text-sm text-muted-foreground">{t("partnerLeads.detailsTitle")}</p>
              </SheetHeader>

              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">{t("partnerLeads.phone")}</p>
                    <p className="font-medium text-foreground">{activeLead.phone || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("partnerLeads.email")}</p>
                    <p className="font-medium text-foreground break-all">{activeLead.email || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("partnerLeads.source")}</p>
                    <Select value={activeLead.source || ""} onValueChange={(v) => updateLead(activeLead, { source: v }, `Source set to ${v}`, "status_change")}>
                      <SelectTrigger className="mt-1 h-8 text-sm"><SelectValue placeholder="—" /></SelectTrigger>
                      <SelectContent>
                        {SOURCES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("partnerLeads.expectedAmount")}</p>
                    <p className="font-medium text-foreground">{activeLead.expected_investment_amount ? fmtINR(Number(activeLead.expected_investment_amount)) : "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("partnerLeads.priority")}</p>
                    <Select value={activeLead.priority} onValueChange={(v) => handlePriorityChange(activeLead, v as Priority)}>
                      <SelectTrigger className={cn("mt-1 h-8 text-xs font-medium", priorityBadge(activeLead.priority))}><SelectValue /></SelectTrigger>
                      <SelectContent>{PRIORITIES.map(p => <SelectItem key={p} value={p}>{priorityLabel(p)}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("partnerLeads.status")}</p>
                    <Select value={activeLead.status} onValueChange={(v) => handleStatusChange(activeLead, v as Status)}>
                      <SelectTrigger className="mt-1 h-8 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{statusLabel(s)}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">{t("partnerLeads.nextFollowUp")}</p>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className={cn("mt-1 w-full justify-start font-normal", !activeLead.next_follow_up_date && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-3 w-3" />
                          {activeLead.next_follow_up_date ? format(new Date(activeLead.next_follow_up_date + "T00:00:00"), "PPP") : t("partnerLeads.pickDate")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={activeLead.next_follow_up_date ? new Date(activeLead.next_follow_up_date + "T00:00:00") : undefined} onSelect={(d) => handleFollowUpChange(activeLead, d)} initialFocus className={cn("p-3 pointer-events-auto")} />
                        {activeLead.next_follow_up_date && (
                          <div className="border-t p-2"><Button variant="ghost" size="sm" className="w-full" onClick={() => handleFollowUpChange(activeLead, undefined)}>{t("partnerLeads.clearDate")}</Button></div>
                        )}
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Quick actions */}
                {activeLead.phone && (
                  <div className="flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="outline"><a href={`tel:${activeLead.phone}`}><Phone className="mr-1 h-3 w-3" />{t("partnerLeads.call")}</a></Button>
                    <Button asChild size="sm" variant="outline"><a href={waHrefForLead(activeLead)} target="_blank" rel="noopener noreferrer"><MessageCircle className="mr-1 h-3 w-3" />{t("partnerLeads.whatsapp")}</a></Button>
                    <Button size="sm" onClick={() => markContacted(activeLead)}><CheckCircle2 className="mr-1 h-3 w-3" />{t("partnerLeads.markContacted")}</Button>
                  </div>
                )}

                {activeLead.notes && (
                  <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
                    <p className="text-xs font-medium text-muted-foreground">{t("partnerLeads.notes")}</p>
                    <p className="mt-1 whitespace-pre-wrap text-foreground">{activeLead.notes}</p>
                  </div>
                )}

                {/* Add note */}
                <div>
                  <p className="text-sm font-medium text-foreground">{t("partnerLeads.addNote")}</p>
                  <Textarea className="mt-1" placeholder={t("partnerLeads.notePlaceholder")} value={noteText} onChange={(e) => setNoteText(e.target.value)} />
                  <Button size="sm" className="mt-2" onClick={addNote} disabled={!noteText.trim()}>{t("partnerLeads.saveNote")}</Button>
                </div>

                {/* Activity timeline */}
                <div>
                  <p className="text-sm font-medium text-foreground">{t("partnerLeads.activityTimeline")}</p>
                  {activities.length === 0 ? (
                    <p className="mt-2 text-sm text-muted-foreground">{t("partnerLeads.noActivities")}</p>
                  ) : (
                    <ol className="mt-3 space-y-3">
                      {activities.map(a => (
                        <li key={a.id} className="rounded-md border border-border bg-card p-3 text-sm">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-medium uppercase tracking-wide text-primary">{t(`partnerLeads.activity${a.activity_type.split("_").map(w => w[0].toUpperCase() + w.slice(1)).join("")}`)}</span>
                            <span className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString(localeCode)}</span>
                          </div>
                          <p className="mt-1 whitespace-pre-wrap text-foreground">{a.content}</p>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </PartnerLayout>
  );
};

export default Leads;
