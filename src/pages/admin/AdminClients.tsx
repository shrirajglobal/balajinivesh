import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";

interface Client {
  id: string;
  client_name: string;
  pan_number: string | null;
  folio_number: string | null;
  partner_id: string;
  created_at: string;
}

const AdminClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("partner_clients").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setClients(data || []);
      setLoading(false);
    });
  }, []);

  const filtered = clients.filter((c) => !search || c.client_name.toLowerCase().includes(search.toLowerCase()) || c.pan_number?.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="flex min-h-[40vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">All Clients</h1>
      <p className="mt-1 text-sm text-muted-foreground">Clients across all partners</p>

      <div className="mt-6 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name or PAN..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>PAN</TableHead>
              <TableHead>Folio</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="py-8 text-center text-muted-foreground">No clients found</TableCell></TableRow>
            ) : filtered.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.client_name}</TableCell>
                <TableCell>{c.pan_number || "—"}</TableCell>
                <TableCell>{c.folio_number || "—"}</TableCell>
                <TableCell className="text-muted-foreground">{new Date(c.created_at).toLocaleDateString("en-IN")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminClients;
