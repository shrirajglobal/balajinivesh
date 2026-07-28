import { ShieldCheck, BadgeCheck, Users, Award, Star } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

/**
 * Slim authority bar shown under hero on key marketing pages.
 * Pre-empts the "is this trustworthy?" friction Indian first-time investors carry.
 */
const AuthorityStrip = () => {
  const { data: settings } = useSiteSettings();
  const arn = settings?.map.arn_number;
  const reviewUrl = settings?.map.google_review_url;
  const rating = settings?.map.google_rating;
  const reviewCount = settings?.map.google_review_count;

  const items = [
    { icon: BadgeCheck, label: arn ? `AMFI Reg. ${arn}` : "AMFI Registered" },
    { icon: ShieldCheck, label: "SEBI-compliant Distributor" },
    { icon: Award, label: "5+ years experience" },
    { icon: Users, label: "2,500+ families served" },
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
          {reviewUrl && (
            <li className="flex items-center">
              <a
                href={reviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-full border border-yellow-300/60 bg-yellow-50 px-2.5 py-1 text-[11px] font-medium text-yellow-900 transition-colors hover:border-yellow-400 hover:bg-yellow-100 sm:text-xs"
              >
                <span className="flex">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  ))}
                </span>
                {rating ? (
                  <span>
                    <span className="font-semibold">{rating}</span> on Google
                    {reviewCount ? <span className="text-yellow-800/70"> · {reviewCount} reviews</span> : null}
                  </span>
                ) : (
                  <span className="font-semibold">Rate us on Google</span>
                )}
              </a>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AuthorityStrip;

