import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, AlertCircle, Loader2, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SEO from "@/components/seo/SEO";

const ConfirmSubscription = () => {
  const [params] = useSearchParams();
  const [state, setState] = useState<"loading" | "success" | "already" | "error">("loading");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const token = params.get("token");
    if (!token) { setState("error"); setErrorMsg("Missing confirmation token."); return; }

    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("confirm-subscription", { body: { token } });
        if (error) throw error;
        if ((data as any)?.error) throw new Error((data as any).error);
        setEmail((data as any).email ?? "");
        setState((data as any).alreadyConfirmed ? "already" : "success");
      } catch (e) {
        setState("error");
        setErrorMsg((e as Error).message || "Could not confirm your email.");
      }
    })();
  }, [params]);

  return (
    <div className="container py-16 lg:py-24">
      <SEO title="Confirm your subscription | Balaji Nivesh" description="Confirm your email to start receiving Samajhne Wali Khabar." />
      <Card className="mx-auto max-w-lg border-border/60">
        <CardContent className="p-8 text-center sm:p-10">
          {state === "loading" && (
            <>
              <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
              <h1 className="mt-4 font-display text-2xl font-bold">Confirming…</h1>
              <p className="mt-2 text-sm text-muted-foreground">Hang on while we activate your subscription.</p>
            </>
          )}
          {(state === "success" || state === "already") && (
            <>
              <CheckCircle2 className="mx-auto h-12 w-12 text-brand-green" />
              <h1 className="mt-4 font-display text-2xl font-bold text-foreground">
                {state === "already" ? "You're already subscribed" : "You're in!"}
              </h1>
              {email && <p className="mt-2 text-sm text-muted-foreground">{email}</p>}
              <p className="mt-3 text-sm text-muted-foreground">
                Expect <strong>Samajhne Wali Khabar</strong> on the next market day. Keep an eye on your inbox.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button asChild><Link to="/market-updates"><Mail className="mr-1.5 h-4 w-4" /> See today's update</Link></Button>
                <Button asChild variant="outline"><Link to="/">Back to home</Link></Button>
              </div>
            </>
          )}
          {state === "error" && (
            <>
              <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
              <h1 className="mt-4 font-display text-2xl font-bold text-foreground">Something went wrong</h1>
              <p className="mt-2 text-sm text-muted-foreground">{errorMsg}</p>
              <p className="mt-3 text-sm text-muted-foreground">The link may have expired. Try subscribing again.</p>
              <div className="mt-6"><Button asChild><Link to="/subscribe">Subscribe again</Link></Button></div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmSubscription;
