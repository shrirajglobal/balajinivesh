import { ReactNode, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import PartnerSidebar from "./PartnerSidebar";

const PartnerLayout = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const [hasPartner, setHasPartner] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) {
      setHasPartner(null);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("partners")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!cancelled) setHasPartner(!!data);
    })();
    return () => { cancelled = true; };
  }, [user]);

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">Loading...</div>;
  if (!user) return <Navigate to="/auth" replace />;

  if (hasPartner === null) {
    return <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">Loading...</div>;
  }

  if (!hasPartner) {
    return (
      <div className="container py-16 lg:py-24">
        <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange-light text-primary">
            <UserPlus className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-foreground">
            You don't have a partner account yet
          </h1>
          <p className="mt-2 text-muted-foreground">
            Apply to become a partner. Once your application is approved, your dashboard, clients, leads and commissions will appear here.
          </p>
          <Button asChild className="mt-6" size="lg">
            <Link to="/partner#apply">Apply to become a partner</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 lg:py-12">
      <div className="flex flex-col gap-8 lg:flex-row">
        <PartnerSidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
};

export default PartnerLayout;
