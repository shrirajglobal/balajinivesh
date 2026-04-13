import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: string;
  notes: string | null;
  partner_id: string;
  created_at: string;
}

const AdminLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("partner_leads").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setLeads(data || []);
      setLoading(false);
    });
  }, []);

  const filtered = leads.filter((l) => !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.email?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="flex min-h-[40vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Partner Leads</h1>
      <p className="mt-1 text-sm text-muted-foreground">All leads across partners</p>

      <div className="mt-6 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No leads</TableCell></TableRow>
            ) : filtered.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="font-medium">{l.name}</TableCell>
                <TableCell>{l.email || "—"}</TableCell>
                <TableCell>{l.phone || "—"}</TableCell>
                <TableCell>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    l.status === "converted" ? "bg-green-100 text-green-700" :
                    l.status === "contacted" ? "bg-blue-100 text-blue-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>{l.status}</span>
                </TableCell>
                <TableCell className="max-w-[200px] truncate text-muted-foreground">{l.notes || "—"}</TableCell>
                <TableCell className="text-muted-foreground">{new Date(l.created_at).toLocaleDateString("en-IN")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminLeads;
