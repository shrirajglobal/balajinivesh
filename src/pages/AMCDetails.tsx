import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, MessageCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useArnIdentity } from "@/lib/arn";
import { useWhatsAppContactHref } from "@/lib/whatsapp";

// Illustrative fund-house names for discovery, not a statement of empanelment.
const fundHouses = [
  "Aditya Birla Sun Life Mutual Fund", "Axis Mutual Fund", "Bandhan Mutual Fund",
  "Canara Robeco Mutual Fund", "DSP Mutual Fund", "Franklin Templeton Mutual Fund",
  "HDFC Mutual Fund", "ICICI Prudential Mutual Fund", "Kotak Mahindra Mutual Fund",
  "Mirae Asset Mutual Fund", "Nippon India Mutual Fund", "SBI Mutual Fund",
  "Tata Mutual Fund", "UTI Mutual Fund",
];

const AMCDetails = () => {
  const [search, setSearch] = useState("");
  const identity = useArnIdentity();
  const whatsapp = useWhatsAppContactHref("Hello Balaji Nivesh, could you confirm which mutual fund AMCs are available through your distribution services?");
  const filtered = useMemo(() => fundHouses.filter((name) => name.toLowerCase().includes(search.trim().toLowerCase())), [search]);

  return (
    <div className="container max-w-5xl py-12 lg:py-16">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase text-primary">Mutual fund information</p>
        <h1 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">AMC Directory</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">Asset Management Companies (AMCs) manage mutual fund schemes. Browse some familiar fund houses below, then check official sources for complete and current details.</p>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{identity.entityName}<br />{identity.credentialLine}</p>
      </div>

      <div className="mt-10 border-l-2 border-primary bg-muted/40 px-5 py-4">
        <h2 className="font-display text-base font-semibold text-foreground">General directory — not our empanelment list</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">These examples are for reference only. A name appearing here does not mean Balaji Nivesh is empanelled with that AMC or distributes its schemes. This is not a complete or real-time list. Please confirm availability with our team before making any plans.</p>
      </div>

      <section className="mt-12" aria-labelledby="directory-heading">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="directory-heading" className="font-display text-2xl font-semibold text-foreground">Browse fund houses</h2>
            <p className="mt-1 text-sm text-muted-foreground">Illustrative names only · Listed alphabetically</p>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <label htmlFor="amc-search" className="sr-only">Search fund houses</label>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="amc-search" type="search" placeholder="Search fund houses" value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" />
          </div>
        </div>
        {filtered.length ? (
          <ul className="mt-6 grid border-t border-border sm:grid-cols-2">
            {filtered.map((name, index) => (
              <li key={name} className="flex min-h-14 items-center gap-4 border-b border-border py-3 pr-4 text-sm text-foreground">
                <span className="w-7 shrink-0 text-xs tabular-nums text-muted-foreground">{String(fundHouses.indexOf(name) + 1).padStart(2, "0")}</span>
                <span className="font-medium">{name}</span>
              </li>
            ))}
          </ul>
        ) : <p role="status" className="mt-6 border-y border-border py-8 text-sm text-muted-foreground">No names match “{search}”. Try a shorter search or use the official directory below.</p>}
      </section>

      <section className="mt-12 grid gap-8 border-t border-border pt-8 md:grid-cols-2">
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground">Check official information</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">For an up-to-date list of AMCs and links to individual fund houses, refer to AMFI. Verify any scheme’s documents on the AMC’s official site before investing.</p>
          <a href="https://www.amfiindia.com/" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">Visit AMFI India <ArrowUpRight className="h-4 w-4" /></a>
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground">Ask what we can service</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Want to know whether a particular AMC is available through Balaji Nivesh? Contact our team at +91 93300 79717. You can also read our <Link to="/commission-disclosure" className="text-primary hover:underline">commission disclosure</Link>.</p>
          <Button asChild className="mt-4"><a href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle /> Ask on WhatsApp</a></Button>
        </div>
      </section>
      <p className="mt-12 border-t border-border pt-6 text-xs text-muted-foreground">Mutual Fund investments are subject to market risks. Read all scheme related documents carefully.</p>
    </div>
  );
};

export default AMCDetails;