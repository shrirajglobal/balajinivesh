import { BookOpen, Award, FileText, Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import PartnerLayout from "@/components/partner/PartnerLayout";
import { useLanguage } from "@/contexts/LanguageContext";

const Academy = () => {
  const { t } = useLanguage();

  const modules = [
    { icon: BookOpen, title: t("partnerAcademy.nismTitle"), desc: t("partnerAcademy.nismDesc"), tag: t("partnerAcademy.nismTag") },
    { icon: FileText, title: t("partnerAcademy.productTitle"), desc: t("partnerAcademy.productDesc"), tag: t("partnerAcademy.productTag") },
    { icon: Video, title: t("partnerAcademy.salesTitle"), desc: t("partnerAcademy.salesDesc"), tag: t("partnerAcademy.salesTag") },
    { icon: Award, title: t("partnerAcademy.complianceTitle"), desc: t("partnerAcademy.complianceDesc"), tag: t("partnerAcademy.complianceTag") },
  ];

  return (
    <PartnerLayout>
      <h1 className="font-display text-2xl font-bold text-foreground">{t("partnerAcademy.title")}</h1>
      <p className="mt-1 text-muted-foreground">{t("partnerAcademy.subtitle")}</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {modules.map((m) => (
          <Card key={m.title} className="border-border/60">
            <CardContent className="flex flex-col gap-4 p-6">
              <div className="flex items-center justify-between">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-brand-blue-light text-secondary">
                  <m.icon className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">{m.tag}</span>
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">{m.title}</h3>
              <p className="text-sm text-muted-foreground">{m.desc}</p>
              <p className="text-xs text-muted-foreground italic">{t("partnerAcademy.comingSoon")}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </PartnerLayout>
  );
};

export default Academy;
