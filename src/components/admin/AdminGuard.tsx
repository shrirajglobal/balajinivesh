import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, ExternalLink } from "lucide-react";
import { EXTERNAL_LOGIN_URL } from "@/lib/externalAuth";

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data, error } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
        if (error) {
          console.error("Admin role check failed:", error);
          setIsAdmin(false);
          return;
        }
        setIsAdmin(!!data);
      } catch (err) {
        console.error("Admin role check failed:", err);
        setIsAdmin(false);
      }
    })();
  }, [user]);

  // Temporary redirect: send unauthenticated users to Wealth Elite login.
  useEffect(() => {
    if (!authLoading && !user) {
      window.open(EXTERNAL_LOGIN_URL, "_blank", "noopener,noreferrer");
    }
  }, [authLoading, user]);

  if (authLoading || (user && isAdmin === null)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <ExternalLink className="h-10 w-10 text-primary" />
        <h1 className="font-display text-2xl font-bold text-foreground">Opening login...</h1>
        <p className="max-w-md text-muted-foreground">
          The login page has opened in a new tab. Once you are signed in there, return here to access the admin panel.
        </p>
        <a
          href={EXTERNAL_LOGIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <ExternalLink className="h-4 w-4" />
          Open login page
        </a>
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default AdminGuard;
