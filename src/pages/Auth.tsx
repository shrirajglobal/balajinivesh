import { useEffect } from "react";
import { EXTERNAL_LOGIN_URL } from "@/lib/externalAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, ExternalLink } from "lucide-react";

const Auth = () => {
  useEffect(() => {
    // Temporary redirect: send users to Wealth Elite login in a new tab.
    window.open(EXTERNAL_LOGIN_URL, "_blank", "noopener,noreferrer");
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-background to-accent px-4">
      <Card className="w-full max-w-md border-border/60 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange-light text-primary">
            <ExternalLink className="h-6 w-6" />
          </div>
          <CardTitle className="font-display text-2xl">Login redirected</CardTitle>
          <CardDescription>
            We have opened the temporary login page in a new tab. If it did not open, use the button below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pb-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <a
            href={EXTERNAL_LOGIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <ExternalLink className="h-4 w-4" />
            Open login page
          </a>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
