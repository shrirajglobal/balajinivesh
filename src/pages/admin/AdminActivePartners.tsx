import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Pencil } from "lucide-react";

interface Partner {
  id: string;
  user_id: string;
  arn_number: string | null;
  euin: string | null;
  status: string;
  joined_date: string;
}

const AdminActivePartners = () => {
  const { toast } = useToast();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editPartner, setEditPartner] = useState<Partner | null>(null);
  const [arn, setArn] = useState("");
  const [euin, setEuin] = useState("");
  const [userId, setUserId] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchPartners(); }, []);

  const fetchPartners = async () => {
    const { data } = await supabase.from("partners").select("*").order("joined_date", { ascending: false });
    setPartners(data || []);
    setLoading(false);
  };

  const openEdit = (p: Partner) => {
    setEditPartner(p);
    setArn(p.arn_number || "");
    setEuin(p.euin || "");
    setUserId(p.user_id || "");
  };

  const handleSave = async () => {
    if (!editPartner) return;
    const trimmedUserId = userId.trim();
    if (!trimmedUserId) {
      toast({ title: "Linked User ID required", description: "A partner must be linked to a user account.", variant: "destructive" });
      return;
    }
    const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRe.test(trimmedUserId)) {
      toast({ title: "Invalid User ID", description: "Enter a valid UUID for the linked user.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("partners").update({
      arn_number: arn.trim() || null,
      euin: euin.trim() || null,
      user_id: trimmedUserId,
    }).eq("id", editPartner.id);
    setSaving(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Partner updated" });
    setEditPartner(null);
    fetchPartners();
  };

  const toggleStatus = async (p: Partner) => {
    const newStatus = p.status === "active" ? "inactive" : "active";
    const { error } = await supabase.from("partners").update({ status: newStatus as any }).eq("id", p.id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: `Partner ${newStatus}` });
    fetchPartners();
  };

  if (loading) return <div className="flex min-h-[40vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Active Partners</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage all registered partners</p>

      <div className="mt-6 rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ARN</TableHead>
              <TableHead>EUIN</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partners.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No partners found</TableCell></TableRow>
            ) : partners.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.arn_number || "—"}</TableCell>
                <TableCell>{p.euin || "—"}</TableCell>
                <TableCell>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {p.status}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">{new Date(p.joined_date).toLocaleDateString("en-IN")}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(p)}><Pencil className="h-3 w-3 mr-1" /> Edit</Button>
                    <Button size="sm" variant="ghost" onClick={() => toggleStatus(p)}>
                      {p.status === "active" ? "Deactivate" : "Activate"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editPartner} onOpenChange={(o) => !o && setEditPartner(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Partner</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>ARN Number</Label>
              <Input value={arn} onChange={(e) => setArn(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>EUIN</Label>
              <Input value={euin} onChange={(e) => setEuin(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPartner(null)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminActivePartners;
