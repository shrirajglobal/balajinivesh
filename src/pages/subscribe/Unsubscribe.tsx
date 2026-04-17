import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SEO from "@/components/seo/SEO";

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const [state, setState] = useState<"loading" | "success" | "error">("loading");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const token = params.get("token");
    if (!token) { setState("error"); return; }
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("unsubscribe", { body: { token } });
        if (error || (data as any)?.error) throw new Error((data as any)?.error || error?.message);
        setEmail((data as any).email ?? "");
        setState("success");
      } catch { setState("error"); }
    })();
  }, [params]);

  return (
    <div className="container py-16 lg:py-24">
      <SEO title="Unsubscribed | Balaji Nivesh" description="You have unsubscribed from Balaji Nivesh emails." />
      <Card className="mx-auto max-w-lg border-border/60">
        <CardContent className="p-8 text-center sm:p-10">
          {state === "loading" && <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />}
          {state === "success" && (
            <>
              <CheckCircle2 className="mx-auto h-12 w-12 text-brand-green" />
              <h1 className="mt-4 font-display text-2xl font-bold">You're unsubscribed</h1>
              {email && <p className="mt-2 text-sm text-muted-foreground">{email} will no longer receive newsletters from us.</p>}
              <p className="mt-3 text-sm text-muted-foreground">Changed your mind? You can resubscribe any time from the footer.</p>
              <div className="mt-6"><Button asChild variant="outline"><Link to="/">Back to home</Link></Button></div>
            </>
          )}
          {state === "error" && (
            <>
              <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
              <h1 className="mt-4 font-display text-2xl font-bold">Invalid unsubscribe link</h1>
              <p className="mt-2 text-sm text-muted-foreground">The link may have expired. Please contact us if you keep receiving emails.</p>
              <div className="mt-6"><Button asChild><Link to="/contact">Contact support</Link></Button></div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Unsubscribe;
