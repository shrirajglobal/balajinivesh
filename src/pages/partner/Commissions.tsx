import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import PartnerLayout from "@/components/partner/PartnerLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";

interface Commission {
  id: string;
  amc_name: string;
  month_year: string;
  commission_amount: number;
  status: string;
}

const Commissions = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [data, setData] = useState<Commission[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data: partner } = await supabase.from("partners").select("id").eq("user_id", user.id).maybeSingle();
      if (!partner) return;
      const { data: rows } = await supabase.from("partner_commissions").select("*").eq("partner_id", partner.id).order("month_year", { ascending: false });
      setData(rows || []);
    };
    fetch();
  }, [user]);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <PartnerLayout>
      <h1 className="font-display text-2xl font-bold text-foreground">{t("partnerComm.title")}</h1>
      <p className="mt-1 text-muted-foreground">{t("partnerComm.subtitle")}</p>

      <div className="mt-8 rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("partnerComm.month")}</TableHead>
              <TableHead>{t("partnerComm.amc")}</TableHead>
              <TableHead className="text-right">{t("partnerComm.amount")}</TableHead>
              <TableHead>{t("partnerComm.status")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="py-8 text-center text-muted-foreground">{t("partnerComm.empty")}</TableCell></TableRow>
            ) : data.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{new Date(c.month_year).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</TableCell>
                <TableCell>{c.amc_name}</TableCell>
                <TableCell className="text-right font-medium">{fmt(c.commission_amount)}</TableCell>
                <TableCell>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.status === "paid" ? "bg-brand-green-light text-brand-green" : "bg-brand-orange-light text-primary"}`}>
                    {c.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PartnerLayout>
  );
};

export default Commissions;
