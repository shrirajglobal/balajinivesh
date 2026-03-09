import { useEffect, useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
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
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [uploads, setUploads] = useState<RTAUpload[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const check = async () => {
      const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      setIsAdmin(!!data);
      if (data) fetchUploads();
    };
    check();
  }, [user]);

  const fetchUploads = async () => {
    const { data } = await supabase.from("rta_uploads").select("*").order("created_at", { ascending: false });
    setUploads(data || []);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const allowed = [".csv", ".xlsx", ".xls"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowed.includes(ext)) {
      toast({ title: "Invalid file", description: "Please upload a CSV or Excel file.", variant: "destructive" });
      return;
    }

    setUploading(true);
    const filePath = `rta-statements/${Date.now()}_${file.name}`;

    // Upload to storage
    const { error: storageError } = await supabase.storage.from("rta-statements").upload(filePath, file);
    if (storageError) {
      toast({ title: "Upload failed", description: storageError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    // Create record
    const { error: dbError } = await supabase.from("rta_uploads").insert({
      file_name: file.name,
      file_path: filePath,
      admin_id: user.id,
      status: "uploaded",
    });

    setUploading(false);
    if (dbError) {
      toast({ title: "Error", description: dbError.message, variant: "destructive" });
      return;
    }

    toast({ title: "File uploaded!", description: "RTA statement uploaded. Processing will begin shortly." });
    fetchUploads();
    if (fileRef.current) fileRef.current.value = "";
  };

  if (authLoading || isAdmin === null) return <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">Loading...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">Access denied. Admin only.</div>;

  return (
    <div className="container py-8 lg:py-12">
      <h1 className="font-display text-2xl font-bold text-foreground">RTA Statement Upload</h1>
      <p className="mt-1 text-muted-foreground">Upload CAMS / KFintech statements to update partner data.</p>

      <div className="mt-8 rounded-xl border-2 border-dashed border-border bg-card p-8 text-center">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-4 font-medium text-foreground">Upload RTA Statement</p>
        <p className="mt-1 text-sm text-muted-foreground">CSV or Excel files from CAMS / KFintech</p>
        <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleUpload} className="hidden" />
        <Button className="mt-4" onClick={() => fileRef.current?.click()} disabled={uploading}>
          {uploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</> : <><Upload className="mr-2 h-4 w-4" /> Choose File</>}
        </Button>
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
              <TableRow><TableCell colSpan={4} className="py-8 text-center text-muted-foreground">No uploads yet.</TableCell></TableRow>
            ) : uploads.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.file_name}</TableCell>
                <TableCell>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    u.status === "completed" ? "bg-brand-green-light text-brand-green" : "bg-brand-orange-light text-primary"
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
