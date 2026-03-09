import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import PartnerLayout from "@/components/partner/PartnerLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(10).max(15).optional().or(z.literal("")),
  email: z.string().trim().email().optional().or(z.literal("")),
  notes: z.string().max(500).optional().or(z.literal("")),
});

interface Lead {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  status: string;
  notes: string | null;
  created_at: string;
}

const Leads = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", email: "", notes: "" },
  });

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data: partner } = await supabase.from("partners").select("id").eq("user_id", user.id).maybeSingle();
      if (!partner) return;
      setPartnerId(partner.id);
      const { data: rows } = await supabase.from("partner_leads").select("*").eq("partner_id", partner.id).order("created_at", { ascending: false });
      setLeads(rows || []);
    };
    fetch();
  }, [user]);

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (!partnerId) return;
    setLoading(true);
    const { error } = await supabase.from("partner_leads").insert({
      partner_id: partnerId,
      name: data.name,
      phone: data.phone || null,
      email: data.email || null,
      notes: data.notes || null,
    });
    setLoading(false);
    if (error) { toast({ title: t("partnerLeads.errorTitle"), description: t("partnerLeads.errorDesc"), variant: "destructive" }); return; }

    toast({ title: t("partnerLeads.successTitle") });
    setOpen(false);
    form.reset();
    const { data: rows } = await supabase.from("partner_leads").select("*").eq("partner_id", partnerId).order("created_at", { ascending: false });
    setLeads(rows || []);
  };

  return (
    <PartnerLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">{t("partnerLeads.title")}</h1>
          <p className="mt-1 text-muted-foreground">{t("partnerLeads.subtitle")}</p>
        </div>
        {partnerId && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-1 h-4 w-4" /> {t("partnerLeads.addLead")}</Button>
            </DialogTrigger>
            <DialogContent>
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

      <div className="mt-8 rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("partnerLeads.name")}</TableHead>
              <TableHead>{t("partnerLeads.phone")}</TableHead>
              <TableHead>{t("partnerLeads.email")}</TableHead>
              <TableHead>{t("partnerLeads.status")}</TableHead>
              <TableHead>{t("partnerLeads.added")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">{partnerId ? t("partnerLeads.emptyWithPartner") : t("partnerLeads.emptyNoPartner")}</TableCell></TableRow>
            ) : leads.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="font-medium">{l.name}</TableCell>
                <TableCell>{l.phone || "—"}</TableCell>
                <TableCell>{l.email || "—"}</TableCell>
                <TableCell>
                  <span className="rounded-full bg-brand-blue-light px-2 py-0.5 text-xs font-medium text-secondary">{l.status}</span>
                </TableCell>
                <TableCell className="text-muted-foreground">{new Date(l.created_at).toLocaleDateString("en-IN")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PartnerLayout>
  );
};

export default Leads;
