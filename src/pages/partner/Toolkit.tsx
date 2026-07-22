import { Download, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PartnerLayout from "@/components/partner/PartnerLayout";
import { useLanguage } from "@/contexts/LanguageContext";

const Toolkit = () => {
  const { t } = useLanguage();

  const materials = [
    { icon: FileText, title: t("partnerToolkit.brochuresTitle"), desc: t("partnerToolkit.brochuresDesc") },
    { icon: Download, title: t("partnerToolkit.formsTitle"), desc: t("partnerToolkit.formsDesc") },
  ];

  return (
    <PartnerLayout>
      <h1 className="font-display text-2xl font-bold text-foreground">{t("partnerToolkit.title")}</h1>
      <p className="mt-1 text-muted-foreground">{t("partnerToolkit.subtitle")}</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {materials.map((m) => (
          <Card key={m.title} className="border-border/60">
            <CardContent className="flex flex-col gap-4 p-6">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-brand-green-light text-brand-green">
                <m.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">{m.title}</h3>
              <p className="text-sm text-muted-foreground">{m.desc}</p>
              <Button variant="outline" size="sm" disabled>
                <Download className="mr-1 h-3 w-3" /> {t("partnerToolkit.comingSoon")}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PartnerLayout>
  );
};

export default Toolkit;
