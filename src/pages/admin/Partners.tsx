import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [apps, setApps] = useState<Application[]>([]);

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

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("partner_applications").update({ status: status as any }).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: `Application ${status}` });
    fetchApps();
  };

  if (authLoading || isAdmin === null) return <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">Loading...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">Access denied. Admin only.</div>;

  return (
    <div className="container py-8 lg:py-12">
      <h1 className="font-display text-2xl font-bold text-foreground">Partner Management</h1>
      <p className="mt-1 text-muted-foreground">Review and manage partner applications.</p>

      <div className="mt-8 rounded-xl border border-border">
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
              <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">No applications yet.</TableCell></TableRow>
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
                      <Button size="sm" variant="outline" onClick={() => updateStatus(a.id, "approved")}>Approve</Button>
                      <Button size="sm" variant="ghost" onClick={() => updateStatus(a.id, "rejected")}>Reject</Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminPartners;
