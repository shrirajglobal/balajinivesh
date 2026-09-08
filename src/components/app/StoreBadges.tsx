import { cn } from "@/lib/utils";
import { useAppStoreLinks, trackAppDownload } from "@/lib/appLinks";

const AppleGlyph = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 shrink-0 fill-current">
    <path d="M16.365 1.43c0 1.14-.42 2.2-1.25 3.03-.9.9-1.98 1.42-3.14 1.33-.02-1.13.44-2.24 1.24-3.05.83-.85 2.06-1.4 3.15-1.31zM20.9 17.2c-.55 1.27-.82 1.83-1.53 2.95-.98 1.56-2.37 3.5-4.09 3.51-1.53.02-1.92-.99-4-.98-2.07.01-2.5 1-4.03.98-1.72-.02-3.03-1.77-4.02-3.32C.5 16.02.2 10.9 1.94 8.2c1.24-1.93 3.2-3.06 5.04-3.06 1.88 0 3.06 1.02 4.61 1.02 1.5 0 2.42-1.02 4.59-1.02 1.64 0 3.38.89 4.62 2.43-4.06 2.22-3.4 8.01.1 9.63z" />
  </svg>
);

const PlayGlyph = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 shrink-0">
    <path fill="#34A853" d="M3.6 21.4 14.3 12.9l2.6 2.6-11 6.3c-.9.5-1.9.3-2.3-.4z" />
    <path fill="#EA4335" d="M16.9 8.5 14.3 11.1 3.6 2.6c.4-.7 1.4-.9 2.3-.4l11 6.3z" />
    <path fill="#FBBC04" d="m16.9 8.5 3.5 2c1 .6 1 1.9 0 2.5l-3.5 2-2.9-2.5 2.9-2.5z" />
    <path fill="#4285F4" d="M3.6 2.6c-.2.3-.3.7-.3 1.1v16.6c0 .4.1.8.3 1.1l10.7-8.5L3.6 2.6z" />
  </svg>
);

interface Props {
  placement: string;
  className?: string;
  size?: "sm" | "md";
}

/** Two clear store buttons — always both, so nobody hunts for their store. */
const StoreBadges = ({ placement, className, size = "md" }: Props) => {
  const { play, ios } = useAppStoreLinks();

  const base = cn(
    "inline-flex items-center gap-3 rounded-xl border border-foreground/15 bg-foreground text-background transition-transform hover:scale-[1.02] active:scale-95",
    size === "md" ? "px-4 py-2.5" : "px-3 py-2",
  );

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <a
        href={play}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackAppDownload("android", placement)}
        className={base}
        aria-label="Get the Balaji Nivesh app on Google Play"
      >
        <PlayGlyph />
        <span className="text-left leading-tight">
          <span className="block text-[10px] uppercase tracking-wide opacity-80">Get it on</span>
          <span className="block text-sm font-semibold">Google Play</span>
        </span>
      </a>
      <a
        href={ios}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackAppDownload("ios", placement)}
        className={base}
        aria-label="Download the Balaji Nivesh app on the App Store"
      >
        <AppleGlyph />
        <span className="text-left leading-tight">
          <span className="block text-[10px] uppercase tracking-wide opacity-80">Download on the</span>
          <span className="block text-sm font-semibold">App Store</span>
        </span>
      </a>
    </div>
  );
};

export default StoreBadges;
