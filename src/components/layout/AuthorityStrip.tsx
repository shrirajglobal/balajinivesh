import { ShieldCheck, BadgeCheck, Users, Award } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

/**
 * Slim authority bar shown under hero on key marketing pages.
 * Pre-empts the "is this trustworthy?" friction Indian first-time investors carry.
 */
const AuthorityStrip = () => {
  const { data: settings } = useSiteSettings();
  const arn = settings?.map.arn_number;

  const items = [
    { icon: BadgeCheck, label: arn ? `AMFI Reg. ${arn}` : "AMFI Registered" },
    { icon: ShieldCheck, label: "SEBI-compliant Distributor" },
    { icon: Award, label: "10+ years experience" },
    { icon: Users, label: "1,000+ families served" },
  ];

  return (
    <div className="border-y border-border bg-muted/40">
      <div className="container">
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-3 sm:gap-x-10">
          {items.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground sm:text-xs">
              <Icon className="h-3.5 w-3.5 text-brand-green" />
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AuthorityStrip;
