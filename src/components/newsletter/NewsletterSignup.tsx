import { useState } from "react";
import { Mail, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface NewsletterSignupProps {
  /** Tracks where the signup came from (footer, blog_inline, market_updates, homepage_hero, dedicated_page). */
  source: string;
  /** Visual style — inline (one-line) or stacked (card layout for hero/dedicated page). */
  variant?: "inline" | "stacked" | "card";
  /** Optional custom heading */
  heading?: string;
  /** Optional custom subline */
  description?: string;
  className?: string;
  /** Hide the heading + description (e.g. inside a footer column with its own h4). */
  bare?: boolean;
}

const NewsletterSignup = ({
  source,
  variant = "inline",
  heading,
  description,
  className,
  bare = false,
}: NewsletterSignupProps) => {
  const { language } = useLanguage();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("subscribe-newsletter", {
        body: {
          email: email.trim(),
          name: name.trim() || undefined,
          source,
          language,
          origin: typeof window !== "undefined" ? window.location.origin : undefined,
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setConfirmed(true);
      toast.success((data as any)?.message ?? "Almost done — check your inbox!");
      setEmail("");
      setName("");
    } catch (err) {
      toast.error((err as Error).message || "Could not subscribe right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmed) {
    return (
      <div className={cn("flex items-center gap-2 rounded-lg border border-brand-green/30 bg-brand-green/5 p-3 text-sm text-brand-green", className)}>
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        <span>Thanks! Please confirm your email from the inbox we just sent.</span>
      </div>
    );
  }

  // Inline (footer / blog post end) — one row of name + email + button
  if (variant === "inline") {
    return (
      <form onSubmit={submit} className={cn("space-y-2", className)}>
        {!bare && (
          <div>
            {heading && <h4 className="font-display text-sm font-semibold text-foreground">{heading}</h4>}
            {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
          </div>
        )}
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            type="email" required placeholder="Your email"
            value={email} onChange={(e) => setEmail(e.target.value)}
            className="h-10 flex-1" disabled={submitting}
          />
          <Button type="submit" disabled={submitting} className="h-10 shrink-0">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="mr-1.5 h-4 w-4" />}
            {submitting ? "Subscribing…" : "Subscribe"}
          </Button>
        </div>
      </form>
    );
  }

  // Card / stacked — bigger surface for hero, market page, dedicated subscribe page
  return (
    <form onSubmit={submit} className={cn(
      variant === "card"
        ? "rounded-2xl border border-primary/20 bg-gradient-to-br from-brand-orange-light via-background to-brand-blue-light p-6 sm:p-8 shadow-sm"
        : "space-y-3",
      className
    )}>
      {!bare && (
        <div className={variant === "card" ? "mb-5" : ""}>
          <span className="inline-flex items-center gap-1 rounded-full border border-brand-green/30 bg-brand-green/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand-green">
            <Sparkles className="h-3 w-3" /> Daily • Free • SEBI-aligned
          </span>
          <h3 className="mt-2 font-display text-xl font-bold text-foreground sm:text-2xl">
            {heading ?? "Samajhne Wali Khabar — daily, in your inbox"}
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {description ?? "Sensex, Nifty, gold, USD/INR — explained at a Class-10 reading level. One short email, every market day."}
          </p>
        </div>
      )}
      <div className="grid gap-2 sm:grid-cols-[1fr_1.4fr_auto]">
        <Input
          type="text" placeholder="First name (optional)"
          value={name} onChange={(e) => setName(e.target.value)}
          className="h-11" disabled={submitting}
        />
        <Input
          type="email" required placeholder="you@example.com"
          value={email} onChange={(e) => setEmail(e.target.value)}
          className="h-11" disabled={submitting}
        />
        <Button type="submit" disabled={submitting} size="lg" className="h-11">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Subscribe <Mail className="ml-1.5 h-4 w-4" /></>}
        </Button>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
        We use double opt-in. You'll get a confirmation email — no list will ever include you without your consent. Unsubscribe in one tap.
      </p>
    </form>
  );
};

export default NewsletterSignup;
