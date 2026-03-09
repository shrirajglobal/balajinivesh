import { useState } from "react";
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
import { Loader2, CheckCircle2 } from "lucide-react";

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
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { full_name: "", email: "", phone: "", city: "", profession: "" },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const insertData: any = { ...data };
    if (user?.id) insertData.user_id = user.id;
    const { error } = await supabase.from("partner_applications").insert([insertData]);
    setLoading(false);

    if (error) {
      toast({ title: "Error", description: "Failed to submit. Please try again.", variant: "destructive" });
      return;
    }

    setSubmitted(true);
    toast({ title: "Application Submitted!", description: "We'll review and get back to you within 48 hours." });
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-brand-green" />
        <h3 className="font-display text-xl font-bold text-foreground">Application Received!</h3>
        <p className="text-muted-foreground">Our team will review your application and contact you within 48 hours.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <h3 className="font-display text-xl font-bold text-foreground">Become a Partner</h3>
      <p className="mt-1 text-sm text-muted-foreground">Fill in your details and we'll get in touch.</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <FormField control={form.control} name="full_name" render={({ field }) => (
            <FormItem><FormLabel>Full Name *</FormLabel><FormControl><Input placeholder="Your full name" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem><FormLabel>Email *</FormLabel><FormControl><Input type="email" placeholder="you@email.com" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem><FormLabel>Phone *</FormLabel><FormControl><Input placeholder="+91 XXXXX XXXXX" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField control={form.control} name="city" render={({ field }) => (
              <FormItem><FormLabel>City *</FormLabel><FormControl><Input placeholder="Your city" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="profession" render={({ field }) => (
              <FormItem>
                <FormLabel>Profession *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select profession" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="homemaker">Homemaker</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="ca">CA / Tax Professional</SelectItem>
                    <SelectItem value="professional">Working Professional</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Submit Application"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ApplicationForm;
