import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";

interface Application {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  profession: string;
  status: string;
  created_at: string;
  user_id: string | null;
}

const AdminPartners = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [apps, setApps] = useState<Application[]>([]);
  const [approveDialog, setApproveDialog] = useState<Application | null>(null);
  const [arnNumber, setArnNumber] = useState("");
  const [euin, setEuin] = useState("");
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const check = async () => {
      const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      setIsAdmin(!!data);
      if (data) fetchApps();
    };
    check();
  }, [user]);

  const fetchApps = async () => {
    const { data } = await supabase.from("partner_applications").select("*").order("created_at", { ascending: false });
    setApps(data || []);
  };

  const handleApprove = async () => {
    if (!approveDialog) return;
    if (!arnNumber.trim()) {
      toast({ title: "ARN Required", description: "Please enter the partner's ARN number", variant: "destructive" });
      return;
    }

    setApproving(true);

    // Create partner record
    const partnerData: any = {
      arn_number: arnNumber.trim().toUpperCase(),
      euin: euin.trim() || null,
      status: "active",
    };

    // If application has user_id, link the partner to that user
    if (approveDialog.user_id) {
      partnerData.user_id = approveDialog.user_id;
    } else {
      // Create a placeholder - admin will need to link later when user signs up
      // For now, use admin's user_id as placeholder (not ideal but prevents null constraint violation)
      partnerData.user_id = user!.id;
    }

    const { error: partnerError } = await supabase.from("partners").insert([partnerData]);
    if (partnerError) {
      toast({ title: "Error", description: partnerError.message, variant: "destructive" });
      setApproving(false);
      return;
    }

    // Update application status
    const { error: appError } = await supabase.from("partner_applications").update({ status: "approved" as any }).eq("id", approveDialog.id);
    if (appError) {
      toast({ title: "Error", description: appError.message, variant: "destructive" });
      setApproving(false);
      return;
    }

    toast({ title: "Partner Approved!", description: `${approveDialog.full_name} has been approved with ARN ${arnNumber}` });
    setApproving(false);
    setApproveDialog(null);
    setArnNumber("");
    setEuin("");
    fetchApps();
  };

  const handleReject = async (id: string) => {
    const { error } = await supabase.from("partner_applications").update({ status: "rejected" as any }).eq("id", id);
    if (error) { toast({ title: t("partnerLeads.errorTitle"), description: error.message, variant: "destructive" }); return; }
    toast({ title: "Application Rejected" });
    fetchApps();
  };

  if (authLoading || isAdmin === null) return <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">{t("admin.loading")}</div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">{t("admin.accessDenied")}</div>;

  return (
    <div className="container py-8 lg:py-12">
      <h1 className="font-display text-2xl font-bold text-foreground">{t("admin.partnersTitle")}</h1>
      <p className="mt-1 text-muted-foreground">{t("admin.partnersSubtitle")}</p>

      <div className="mt-8 rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("admin.nameCol")}</TableHead>
              <TableHead>{t("admin.emailCol")}</TableHead>
              <TableHead>{t("admin.phoneCol")}</TableHead>
              <TableHead>{t("admin.cityCol")}</TableHead>
              <TableHead>{t("admin.professionCol")}</TableHead>
              <TableHead>{t("admin.statusCol")}</TableHead>
              <TableHead>{t("admin.actionsCol")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apps.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">{t("admin.noApps")}</TableCell></TableRow>
            ) : apps.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.full_name}</TableCell>
                <TableCell>{a.email}</TableCell>
                <TableCell>{a.phone}</TableCell>
                <TableCell>{a.city}</TableCell>
                <TableCell className="capitalize">{a.profession}</TableCell>
                <TableCell>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    a.status === "approved" ? "bg-brand-green-light text-brand-green" :
                    a.status === "rejected" ? "bg-destructive/10 text-destructive" :
                    "bg-brand-orange-light text-primary"
                  }`}>{a.status}</span>
                </TableCell>
                <TableCell>
                  {a.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setApproveDialog(a)}>{t("admin.approve")}</Button>
                      <Button size="sm" variant="ghost" onClick={() => handleReject(a.id)}>{t("admin.reject")}</Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Approve Dialog with ARN Input */}
      <Dialog open={!!approveDialog} onOpenChange={(open) => !open && setApproveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Partner Application</DialogTitle>
            <DialogDescription>
              Enter the ARN number to create the partner record for {approveDialog?.full_name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="arn">ARN Number *</Label>
              <Input
                id="arn"
                placeholder="e.g., ARN-123456"
                value={arnNumber}
                onChange={(e) => setArnNumber(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">This will be used to match RTA statement data</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="euin">EUIN (Optional)</Label>
              <Input
                id="euin"
                placeholder="e.g., E123456"
                value={euin}
                onChange={(e) => setEuin(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialog(null)}>Cancel</Button>
            <Button onClick={handleApprove} disabled={approving}>
              {approving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Approving...</> : "Approve & Create Partner"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPartners;
