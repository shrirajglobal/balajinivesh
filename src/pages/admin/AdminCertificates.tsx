import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

interface Certificate {
  id: string;
  certificate_number: string;
  segment: string;
  user_id: string;
  issued_at: string;
}

const AdminCertificates = () => {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("certificates").select("*").order("issued_at", { ascending: false }).then(({ data }) => {
      setCerts(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex min-h-[40vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Certificates</h1>
      <p className="mt-1 text-sm text-muted-foreground">All issued education certificates</p>

      <div className="mt-6 rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Certificate #</TableHead>
              <TableHead>Segment</TableHead>
              <TableHead>Issued</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {certs.length === 0 ? (
              <TableRow><TableCell colSpan={3} className="py-8 text-center text-muted-foreground">No certificates issued</TableCell></TableRow>
            ) : certs.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium font-mono">{c.certificate_number}</TableCell>
                <TableCell className="capitalize">{c.segment}</TableCell>
                <TableCell className="text-muted-foreground">{new Date(c.issued_at).toLocaleDateString("en-IN")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminCertificates;
