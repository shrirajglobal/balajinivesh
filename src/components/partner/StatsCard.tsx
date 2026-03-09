import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
}

const StatsCard = ({ title, value, subtitle, icon: Icon, trend }: StatsCardProps) => (
  <Card className="border-border/60">
    <CardContent className="flex items-start gap-4 p-6">
      <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-orange-light text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="mt-1 font-display text-2xl font-bold text-foreground">{value}</p>
        {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
        {trend && <p className="mt-0.5 text-xs font-medium text-brand-green">{trend}</p>}
      </div>
    </CardContent>
  </Card>
);

export default StatsCard;
