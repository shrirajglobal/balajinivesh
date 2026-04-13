import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
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
  const { user } = useAuth();
  const { toast } = useToast();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [approveDialog, setApproveDialog] = useState<Application | null>(null);
  const [arnNumber, setArnNumber] = useState("");
  const [euin, setEuin] = useState("");
  const [approving, setApproving] = useState(false);

  useEffect(() => { fetchApps(); }, []);

  const fetchApps = async () => {
    const { data } = await supabase.from("partner_applications").select("*").order("created_at", { ascending: false });
    setApps(data || []);
    setLoading(false);
  };

  const handleApprove = async () => {
    if (!approveDialog || !user) return;
    if (!arnNumber.trim()) {
      toast({ title: "ARN Required", description: "Please enter the partner's ARN number", variant: "destructive" });
      return;
    }

    setApproving(true);
    const partnerData: any = {
      arn_number: arnNumber.trim().toUpperCase(),
      euin: euin.trim() || null,
      status: "active",
      user_id: approveDialog.user_id || user.id,
    };

    const { error: partnerError } = await supabase.from("partners").insert([partnerData]);
    if (partnerError) {
      toast({ title: "Error", description: partnerError.message, variant: "destructive" });
      setApproving(false);
      return;
    }

    await supabase.from("partner_applications").update({ status: "approved" as any }).eq("id", approveDialog.id);
    toast({ title: "Partner Approved!", description: `${approveDialog.full_name} approved with ARN ${arnNumber}` });
    setApproving(false);
    setApproveDialog(null);
    setArnNumber("");
    setEuin("");
    fetchApps();
  };

  const handleReject = async (id: string) => {
    await supabase.from("partner_applications").update({ status: "rejected" as any }).eq("id", id);
    toast({ title: "Application Rejected" });
    fetchApps();
  };

  if (loading) return <div className="flex min-h-[40vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Partner Applications</h1>
      <p className="mt-1 text-sm text-muted-foreground">Review and approve/reject partner applications</p>

      <div className="mt-6 rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Profession</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apps.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">No applications</TableCell></TableRow>
            ) : apps.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.full_name}</TableCell>
                <TableCell>{a.email}</TableCell>
                <TableCell>{a.phone}</TableCell>
                <TableCell>{a.city}</TableCell>
                <TableCell className="capitalize">{a.profession}</TableCell>
                <TableCell>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    a.status === "approved" ? "bg-green-100 text-green-700" :
                    a.status === "rejected" ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>{a.status}</span>
                </TableCell>
                <TableCell>
                  {a.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setApproveDialog(a)}>Approve</Button>
                      <Button size="sm" variant="ghost" onClick={() => handleReject(a.id)}>Reject</Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!approveDialog} onOpenChange={(open) => !open && setApproveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Partner Application</DialogTitle>
            <DialogDescription>Enter ARN number for {approveDialog?.full_name}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>ARN Number *</Label>
              <Input placeholder="e.g., ARN-123456" value={arnNumber} onChange={(e) => setArnNumber(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>EUIN (Optional)</Label>
              <Input placeholder="e.g., E123456" value={euin} onChange={(e) => setEuin(e.target.value)} />
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
