import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import PartnerLayout from "@/components/partner/PartnerLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";

interface Client {
  id: string;
  client_name: string;
  folio_number: string | null;
  pan_number: string | null;
}

const Clients = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [data, setData] = useState<Client[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data: partner } = await supabase.from("partners").select("id").eq("user_id", user.id).maybeSingle();
      if (!partner) return;
      const { data: rows } = await supabase.from("partner_clients").select("*").eq("partner_id", partner.id).order("client_name");
      setData(rows || []);
    };
    fetch();
  }, [user]);

  return (
    <PartnerLayout>
      <h1 className="font-display text-2xl font-bold text-foreground">{t("partnerClients.title")}</h1>
      <p className="mt-1 text-muted-foreground">{t("partnerClients.subtitle")}</p>

      <div className="mt-8 rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("partnerClients.clientName")}</TableHead>
              <TableHead>{t("partnerClients.folioNumber")}</TableHead>
              <TableHead>{t("partnerClients.pan")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow><TableCell colSpan={3} className="py-8 text-center text-muted-foreground">{t("partnerClients.empty")}</TableCell></TableRow>
            ) : data.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.client_name}</TableCell>
                <TableCell>{c.folio_number || "—"}</TableCell>
                <TableCell>{c.pan_number ? `${c.pan_number.slice(0, 3)}****${c.pan_number.slice(-2)}` : "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PartnerLayout>
  );
};

export default Clients;
