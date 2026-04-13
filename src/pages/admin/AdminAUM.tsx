import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";

interface AUMRecord {
  id: string;
  partner_id: string;
  amc_name: string;
  scheme_name: string;
  aum_amount: number;
  month_year: string;
}

const AdminAUM = () => {
  const [data, setData] = useState<AUMRecord[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("partner_aum_data").select("*").order("month_year", { ascending: false }).then(({ data }) => {
      setData(data || []);
      setLoading(false);
    });
  }, []);

  const filtered = data.filter((r) => !search || r.amc_name.toLowerCase().includes(search.toLowerCase()) || r.scheme_name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="flex min-h-[40vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">AUM Data</h1>
      <p className="mt-1 text-sm text-muted-foreground">Assets Under Management across all partners</p>

      <div className="mt-6 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search AMC or scheme..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>AMC</TableHead>
              <TableHead>Scheme</TableHead>
              <TableHead>AUM</TableHead>
              <TableHead>Month</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="py-8 text-center text-muted-foreground">No AUM data</TableCell></TableRow>
            ) : filtered.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.amc_name}</TableCell>
                <TableCell>{r.scheme_name}</TableCell>
                <TableCell>₹{Number(r.aum_amount).toLocaleString("en-IN")}</TableCell>
                <TableCell className="text-muted-foreground">{new Date(r.month_year).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminAUM;
