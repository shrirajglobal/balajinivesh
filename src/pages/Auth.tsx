import { FormEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { EXTERNAL_LOGIN_URL } from "@/lib/externalAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowRight, BarChart3, BookOpenCheck, BriefcaseBusiness, CheckCircle2, Eye, EyeOff, GraduationCap, Loader2, LockKeyhole, Mail, ShieldCheck, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { consumeReturnTo, rememberReturnTo, safeReturnTo } from "@/lib/authNavigation";
import { useArnIdentity } from "@/lib/arn";

type Mode = "choice" | "distributor" | "signup" | "forgot" | "check-email";

const Auth = () => {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, signIn, signUp } = useAuth();
  const arnIdentity = useArnIdentity();
  const requestedMode = params.get("mode");
  const initialMode: Mode = requestedMode === "distributor" || requestedMode === "signup" || requestedMode === "forgot" ? requestedMode : "choice";
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const pageTopRef = useRef<HTMLElement | null>(null);
  const returnTo = safeReturnTo(params.get("returnTo"));

  useEffect(() => {
    if (user && mode !== "choice" && mode !== "check-email") navigate(consumeReturnTo(returnTo), { replace: true });
  }, [mode, navigate, returnTo, user]);

  useLayoutEffect(() => {
    const scrollToTop = () => {
      pageTopRef.current?.scrollIntoView({ block: "start" });
    };
    scrollToTop();
    const timer = window.setTimeout(scrollToTop, 200);
    return () => window.clearTimeout(timer);
  }, [mode]);

  const changeMode = (nextMode: Mode) => {
    setMode(nextMode);
    setError("");
    const next = new URLSearchParams(params);
    if (nextMode === "choice") next.delete("mode"); else next.set("mode", nextMode);
    setParams(next, { replace: true });
  };

  const handleSignIn = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    rememberReturnTo(returnTo);
    const result = await signIn(email.trim(), password);
    setLoading(false);
    if (result.error) {
      setError(result.error.message === "Invalid login credentials" ? "Email or password is incorrect. Please try again." : result.error.message);
      return;
    }
    navigate(consumeReturnTo(returnTo), { replace: true });
  };

  const handleSignUp = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    rememberReturnTo("/partner#apply");
    const result = await signUp(email.trim(), password, fullName.trim());
    setLoading(false);
    if (result.error) {
      setError(result.error.message);
      return;
    }
    if (result.session) navigate("/partner#apply", { replace: true });
    else changeMode("check-email");
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    rememberReturnTo(mode === "signup" ? "/partner#apply" : returnTo);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/auth?mode=distributor`, extraParams: { prompt: "select_account" } });
    setLoading(false);
    if (result.error) setError(result.error.message);
    else if (!result.redirected) navigate(consumeReturnTo(), { replace: true });
  };

  const handleForgot = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` });
    setLoading(false);
    if (resetError) setError(resetError.message);
    else changeMode("check-email");
  };

  const errorMessage = error && <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">{error}</p>;

  if (mode === "choice") {
    return (
      <main ref={pageTopRef} className="min-h-[80vh] bg-muted/30 px-4 py-10 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-sm font-semibold text-primary">Choose where you want to go</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">Login to Balaji Nivesh</h1>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">Portfolio access and the Distributor Learning &amp; CRM portal use separate secure accounts.</p>
          </div>
          <div className="mt-9 grid gap-5 md:grid-cols-2">
            <Card className="border-border/70 shadow-sm transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary"><BarChart3 className="h-6 w-6" /></div>
                <CardTitle className="pt-3 font-display text-2xl">Portfolio Login</CardTitle>
                <CardDescription>View your investments and portfolio securely.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />Portfolio and statement access</li>
                  <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />Existing Wealth Elite credentials</li>
                </ul>
                <Button asChild className="w-full" size="lg">
                  <a href={EXTERNAL_LOGIN_URL} target="_blank" rel="noopener noreferrer">Open Portfolio Login <ArrowRight className="ml-2 h-4 w-4" /></a>
                </Button>
              </CardContent>
            </Card>
            <Card className="border-secondary/40 shadow-sm transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10 text-secondary"><GraduationCap className="h-6 w-6" /></div>
                <CardTitle className="pt-3 font-display text-2xl">Distributor Login</CardTitle>
                <CardDescription>Continue learning and manage leads in your CRM.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2"><BookOpenCheck className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />NISM learning and progress</li>
                  <li className="flex gap-2"><BriefcaseBusiness className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />Leads, clients and follow-ups</li>
                </ul>
                <Button className="w-full" variant="secondary" size="lg" onClick={() => changeMode("distributor")}>Continue to Distributor Login <ArrowRight className="ml-2 h-4 w-4" /></Button>
                <p className="text-center text-sm text-muted-foreground">Interested in becoming a distributor? <button type="button" onClick={() => changeMode("signup")} className="font-semibold text-primary hover:underline">Apply here</button></p>
              </CardContent>
            </Card>
          </div>
          <p className="mt-7 text-center text-xs text-muted-foreground"><ShieldCheck className="mr-1 inline h-4 w-4" />{arnIdentity.credentialLine}</p>
        </div>
      </main>
    );
  }

  return (
    <main ref={pageTopRef} className="min-h-[80vh] bg-muted/30 px-4 py-10 sm:py-16">
      <Card className="w-full max-w-md border-border/60 shadow-lg">
        <CardHeader className="text-center">
          <Button type="button" variant="ghost" size="sm" className="absolute" onClick={() => changeMode("choice")}><ArrowLeft className="mr-1 h-4 w-4" />Back</Button>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10 text-secondary">{mode === "forgot" ? <Mail className="h-6 w-6" /> : mode === "check-email" ? <CheckCircle2 className="h-6 w-6" /> : <LockKeyhole className="h-6 w-6" />}</div>
          <CardTitle className="font-display text-2xl">{mode === "signup" ? "Create distributor account" : mode === "forgot" ? "Reset your password" : mode === "check-email" ? "Check your email" : "Distributor Login"}</CardTitle>
          <CardDescription>{mode === "signup" ? "Create your account, then submit your distributor application." : mode === "forgot" ? "We’ll email you a secure password reset link." : mode === "check-email" ? "Use the link we sent to continue securely." : "Access Learning, Leads CRM, clients and business tools."}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 pb-8">
          {mode === "check-email" ? (
            <div className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">Check your inbox and follow the link. You can then return here to sign in or continue your application.</p>
              <Button className="w-full" onClick={() => changeMode("distributor")}>Return to Distributor Login</Button>
            </div>
          ) : (
            <form onSubmit={mode === "signup" ? handleSignUp : mode === "forgot" ? handleForgot : handleSignIn} className="space-y-4">
              {mode === "signup" && <div className="space-y-2"><Label htmlFor="full-name">Full name</Label><Input id="full-name" value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" required minLength={2} /></div>}
              <div className="space-y-2"><Label htmlFor="email">Email address</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required /></div>
              {mode !== "forgot" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between"><Label htmlFor="password">Password</Label>{mode === "distributor" && <button type="button" onClick={() => changeMode("forgot")} className="text-xs font-medium text-primary hover:underline">Forgot password?</button>}</div>
                  <div className="relative"><Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={8} required className="pr-10" /><Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-10 w-10" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button></div>
                  {mode === "signup" && <p className="text-xs text-muted-foreground">Use at least 8 characters.</p>}
                </div>
              )}
              {errorMessage}
              <Button type="submit" className="w-full" size="lg" disabled={loading}>{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{mode === "signup" ? "Create account & continue" : mode === "forgot" ? "Send reset link" : "Sign in to Learning & CRM"}</Button>
            </form>
          )}
          {(mode === "distributor" || mode === "signup") && <><div className="flex items-center gap-3"><Separator className="flex-1" /><span className="text-xs text-muted-foreground">or</span><Separator className="flex-1" /></div><Button type="button" variant="outline" className="w-full" onClick={handleGoogle} disabled={loading}><Users className="mr-2 h-4 w-4" />Continue with Google</Button></>}
          {mode === "distributor" && <p className="text-center text-sm text-muted-foreground">New distributor? <button type="button" onClick={() => changeMode("signup")} className="font-semibold text-primary hover:underline">Create an account and apply</button></p>}
          {mode === "signup" && <p className="text-center text-sm text-muted-foreground">Already applied? <button type="button" onClick={() => changeMode("distributor")} className="font-semibold text-primary hover:underline">Sign in</button></p>}
          <p className="text-center text-xs text-muted-foreground"><ShieldCheck className="mr-1 inline h-3.5 w-3.5" />{arnIdentity.credentialLine}</p>
        </CardContent>
      </Card>
    </main>
  );
};

export default Auth;
