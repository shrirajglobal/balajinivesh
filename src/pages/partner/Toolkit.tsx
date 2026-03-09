import { Download, Image, FileText, Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PartnerLayout from "@/components/partner/PartnerLayout";

const materials = [
  { icon: Image, title: "Social Media Creatives", desc: "Ready-to-share posts for WhatsApp, Instagram, and Facebook.", count: "Coming soon" },
  { icon: FileText, title: "Product Brochures", desc: "One-pagers explaining SIP, ELSS, debt funds, and more.", count: "Coming soon" },
  { icon: Share2, title: "Referral Cards", desc: "Digital referral cards with your partner code.", count: "Coming soon" },
  { icon: Download, title: "KYC & Application Forms", desc: "Downloadable forms for client onboarding.", count: "Coming soon" },
];

const Toolkit = () => (
  <PartnerLayout>
    <h1 className="font-display text-2xl font-bold text-foreground">Marketing Toolkit</h1>
    <p className="mt-1 text-muted-foreground">Download creatives and materials to grow your network.</p>

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
              <Download className="mr-1 h-3 w-3" /> {m.count}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  </PartnerLayout>
);

export default Toolkit;
