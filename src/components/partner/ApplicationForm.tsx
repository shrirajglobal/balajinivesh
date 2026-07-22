import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, LogIn } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const schema = z.object({
  full_name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(10, "Enter a valid phone number").max(15),
  city: z.string().trim().min(2, "City is required").max(100),
  profession: z.string().min(1, "Select your profession"),
});

type FormData = z.infer<typeof schema>;

const ApplicationForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { full_name: "", email: "", phone: "", city: "", profession: "" },
  });

  const onSubmit = async (data: FormData) => {
    if (!user?.id) return;
    setLoading(true);
    const insertData: any = { ...data, user_id: user.id };
    const { error } = await supabase.from("partner_applications").insert([insertData]);
    setLoading(false);

    if (error) {
      toast({ title: t("partnerApp.errorTitle"), description: t("partnerApp.errorDesc"), variant: "destructive" });
      return;
    }

    setSubmitted(true);
    toast({ title: t("partnerApp.toastTitle"), description: t("partnerApp.toastDesc") });
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-brand-green" />
        <h3 className="font-display text-xl font-bold text-foreground">{t("partnerApp.successTitle")}</h3>
        <p className="text-muted-foreground">{t("partnerApp.successDesc")}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center">
        <LogIn className="h-10 w-10 text-primary" />
        <h3 className="font-display text-xl font-bold text-foreground">Sign in to apply</h3>
        <p className="text-sm text-muted-foreground">
          Please create an account or sign in first, so we can link your application to your login.
        </p>
        <Button asChild size="lg">
          <Link to="/auth?redirect=/partner%23apply">Sign in / Create account</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <h3 className="font-display text-xl font-bold text-foreground">{t("partnerApp.title")}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{t("partnerApp.subtitle")}</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <FormField control={form.control} name="full_name" render={({ field }) => (
            <FormItem><FormLabel>{t("partnerApp.fullName")}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem><FormLabel>{t("partnerApp.email")}</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem><FormLabel>{t("partnerApp.phone")}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField control={form.control} name="city" render={({ field }) => (
              <FormItem><FormLabel>{t("partnerApp.city")}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="profession" render={({ field }) => (
              <FormItem>
                <FormLabel>{t("partnerApp.profession")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder={t("partnerApp.selectProfession")} /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="homemaker">{t("partnerApp.homemaker")}</SelectItem>
                    <SelectItem value="student">{t("partnerApp.student")}</SelectItem>
                    <SelectItem value="ca">{t("partnerApp.ca")}</SelectItem>
                    <SelectItem value="professional">{t("partnerApp.professional")}</SelectItem>
                    <SelectItem value="retired">{t("partnerApp.retired")}</SelectItem>
                    <SelectItem value="other">{t("partnerApp.other")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("partnerApp.submitting")}</> : t("partnerApp.submit")}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ApplicationForm;
