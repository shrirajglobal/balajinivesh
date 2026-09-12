import { ReactNode, useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Clock3, UserPlus, XCircle } from "lucide-react";
import PartnerSidebar from "./PartnerSidebar";
import { distributorLoginPath } from "@/lib/authNavigation";

const PartnerLayout = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [access, setAccess] = useState<"loading" | "active" | "apply" | "pending" | "rejected">("loading");

  useEffect(() => {
    if (!user) {
      setAccess("loading");
      return;
    }
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("partners")
        .select("id,status")
        .eq("user_id", user.id)
        .maybeSingle();
      if (cancelled) return;
      if (data?.status === "active") {
        setAccess("active");
        return;
      }
      const { data: application } = await supabase.from("partner_applications").select("status").eq("user_id", user.id).maybeSingle();
      if (cancelled) return;
      setAccess(application?.status === "pending" ? "pending" : application?.status === "rejected" ? "rejected" : "apply");
    })();
    return () => { cancelled = true; };
  }, [user]);

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">Loading...</div>;

  if (!user) return <Navigate to={distributorLoginPath(`${location.pathname}${location.search}`)} replace />;

  if (access === "loading") {
    return <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">Loading...</div>;
  }

  if (access !== "active") {
    const pending = access === "pending";
    const rejected = access === "rejected";
    return (
      <div className="container py-16 lg:py-24">
        <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange-light text-primary">
             {pending ? <Clock3 className="h-6 w-6" /> : rejected ? <XCircle className="h-6 w-6" /> : <UserPlus className="h-6 w-6" />}
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-foreground">
             {pending ? "Your distributor application is under review" : rejected ? "Your application needs attention" : "Apply for Distributor Learning & CRM access"}
          </h1>
          <p className="mt-2 text-muted-foreground">
             {pending ? "We’ll activate your Learning & CRM access after our team completes the review." : rejected ? "Please contact the Balaji Nivesh team before submitting another application." : "Submit your distributor application. Once approved, Learning, CRM, clients and business tools will appear here."}
          </p>
           {!pending && <Button asChild className="mt-6" size="lg"><Link to="/partner#apply">{rejected ? "Contact team / review application" : "Start distributor application"}</Link></Button>}
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
