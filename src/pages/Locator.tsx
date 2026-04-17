import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Search, Loader2, Phone, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import HeroBanner from "@/components/layout/HeroBanner";
import SEO from "@/components/seo/SEO";
import SebiDisclaimer from "@/components/compliance/SebiDisclaimer";
import { Link } from "react-router-dom";

interface PartnerMatch {
  partner_id: string;
  full_name: string | null;
  city: string | null;
  pincode: string;
  arn_number: string | null;
  match_type: string;
}

const Locator = () => {
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [results, setResults] = useState<PartnerMatch[] | null>(null);
  const [loading, setLoading] = useState(false);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode.trim() && !city.trim()) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("find_partners_by_location", {
        _pincode: pincode.trim() || null,
        _city: city.trim() || null,
        _limit: 10,
      });
      if (error) throw error;
      setResults((data as PartnerMatch[]) ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SEO
        title="Find a Mutual Fund Distributor near you — Balaji Nivesh"
        description="Locate an active AMFI-registered Balaji Nivesh distributor by PIN code or city. Personalised guidance, verified ARN."
        canonical="/locator"
      />

      <HeroBanner>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-orange-light text-primary">
            <MapPin className="h-7 w-7" />
          </div>
          <h1 className="font-display text-4xl font-extrabold text-foreground sm:text-5xl">
            Find a distributor near you
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Enter your PIN code (or city) — we'll show active Balaji Nivesh partners in your area.
          </p>
        </motion.div>
      </HeroBanner>

      <section className="py-10 lg:py-12">
        <div className="container max-w-3xl">
          <Card className="border-primary/20">
            <CardContent className="p-6">
              <form onSubmit={search} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">PIN code (6 digits)</label>
                  <Input
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="700001"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                    className="mt-1 h-11"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Or city</label>
                  <Input
                    placeholder="Kolkata"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-1 h-11"
                  />
                </div>
                <Button type="submit" size="lg" className="h-11 self-end" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="mr-1.5 h-4 w-4" />}
                  Find
                </Button>
              </form>
            </CardContent>
          </Card>

          {results && (
            <div className="mt-6 space-y-3">
              {results.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center">
                    <p className="text-muted-foreground">
                      No active partner found for that location yet.
                    </p>
                    <Button asChild className="mt-4">
                      <Link to="/contact">Contact head office</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                results.map((r) => (
                  <Card key={`${r.partner_id}-${r.pincode}`} className="border-border/60">
                    <CardContent className="flex items-start gap-3 p-4 sm:p-5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-orange-light text-primary">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-display text-base font-semibold text-foreground">
                            {r.full_name ?? "Balaji Nivesh Partner"}
                          </h3>
                          <Badge variant="outline" className={r.match_type === "pincode" ? "border-brand-green/40 text-brand-green" : "border-secondary/40 text-secondary"}>
                            {r.match_type === "pincode" ? "Exact PIN" : "Same city"}
                          </Badge>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {r.city ?? "—"} · PIN {r.pincode}
                          {r.arn_number ? ` · ARN ${r.arn_number}` : ""}
                        </p>
                        <div className="mt-3">
                          <Button asChild size="sm" variant="outline">
                            <Link to={`/contact?partner=${r.partner_id}`}>
                              <Phone className="mr-1.5 h-3.5 w-3.5" />
                              Request a call
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          <div className="mt-8">
            <SebiDisclaimer variant="compact" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Locator;
