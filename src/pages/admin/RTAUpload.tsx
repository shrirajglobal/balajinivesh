import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, Loader2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RTAUpload {
  id: string;
  file_name: string;
  status: string;
  records_processed: number | null;
  created_at: string;
}

const RTAUploadPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploads, setUploads] = useState<RTAUpload[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [monthYear, setMonthYear] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  useEffect(() => { fetchUploads(); }, []);

  const fetchUploads = async () => {
    const { data } = await supabase.from("rta_uploads").select("*").order("created_at", { ascending: false });
    setUploads(data || []);
    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const allowed = [".csv", ".xlsx", ".xls"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowed.includes(ext)) {
      toast({ title: "Invalid file", description: "Please upload CSV or Excel files only", variant: "destructive" });
      return;
    }

    setUploading(true);
    const filePath = `rta-statements/${Date.now()}_${file.name}`;

    const { error: storageError } = await supabase.storage.from("rta-statements").upload(filePath, file);
    if (storageError) {
      toast({ title: "Upload failed", description: storageError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: uploadRecord, error: dbError } = await supabase.from("rta_uploads").insert({
      file_name: file.name,
      file_path: filePath,
      admin_id: user.id,
      status: "processing",
    }).select("id").single();

    if (dbError || !uploadRecord) {
      toast({ title: "Upload failed", description: dbError?.message || "Failed to create record", variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: parseResult, error: parseError } = await supabase.functions.invoke("parse-rta-statement", {
      body: { upload_id: uploadRecord.id, file_path: filePath, month_year: `${monthYear}-01` },
    });

    setUploading(false);

    if (parseError) {
      toast({ title: "Parsing failed", description: parseError.message, variant: "destructive" });
    } else if (parseResult?.error) {
      toast({ title: "Parsing issue", description: parseResult.error, variant: "destructive" });
    } else {
      toast({ title: "Statement parsed", description: `Processed ${parseResult?.records_processed || 0} of ${parseResult?.total_rows || 0} rows.` });
    }

    fetchUploads();
    if (fileRef.current) fileRef.current.value = "";
  };

  if (loading) return <div className="flex min-h-[40vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">RTA Statement Upload</h1>
      <p className="mt-1 text-sm text-muted-foreground">Upload and process RTA statements</p>

      <div className="mt-8 rounded-xl border-2 border-dashed border-border bg-card p-8">
        <div className="mx-auto max-w-md text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 font-medium text-foreground">Upload RTA Statement</p>
          <p className="mt-1 text-sm text-muted-foreground">CSV or Excel file from your RTA</p>

          <div className="mt-6">
            <Label htmlFor="month-year" className="text-sm">Statement Month</Label>
            <Input id="month-year" type="month" value={monthYear} onChange={(e) => setMonthYear(e.target.value)} className="mx-auto mt-1 max-w-[200px]" />
          </div>

          <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleUpload} className="hidden" />
          <Button className="mt-4" onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : <><Upload className="mr-2 h-4 w-4" /> Choose File</>}
          </Button>
        </div>
      </div>

      <h2 className="mt-12 font-display text-lg font-semibold text-foreground">Upload History</h2>
      <div className="mt-4 rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Records</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {uploads.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="py-8 text-center text-muted-foreground">No uploads yet</TableCell></TableRow>
            ) : uploads.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.file_name}</TableCell>
                <TableCell>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    u.status === "completed" ? "bg-green-100 text-green-700" :
                    u.status === "failed" ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>{u.status}</span>
                </TableCell>
                <TableCell>{u.records_processed ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">{new Date(u.created_at).toLocaleDateString("en-IN")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RTAUploadPage;
