import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Gift, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { z } from "zod";

const giftSchema = z.object({
  full_name: z.string().trim().min(1, "Name is required").max(100),
  phone: z.string().trim().min(10, "Enter valid phone number").max(15),
  address: z.string().trim().min(5, "Enter full address").max(500),
  city: z.string().trim().min(1, "City is required").max(100),
  pincode: z.string().trim().min(6, "Enter valid pincode").max(10),
});

interface GiftClaimFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  segment: "homemakers" | "kids";
}

const GiftClaimForm = ({ open, onOpenChange, segment }: GiftClaimFormProps) => {
  const { user } = useAuth();
  const [form, setForm] = useState({ full_name: "", phone: "", address: "", city: "", pincode: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = giftSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    if (!user) {
      toast.error("Please sign in first");
      return;
    }

    setLoading(true);
    const validated = result.data;
    const { error } = await supabase.from("gift_claims").insert([{
      user_id: user.id,
      segment,
      full_name: validated.full_name,
      phone: validated.phone,
      address: validated.address,
      city: validated.city,
      pincode: validated.pincode,
    }]);

    if (error) {
      toast.error("Failed to submit. Please try again.");
    } else {
      // Notify back office via edge function
      try {
        await supabase.functions.invoke("notify-gift-claim", {
          body: { ...result.data, segment, user_email: user.email },
        });
      } catch {
        // Non-blocking — data is already saved
      }
      toast.success("🎁 Gift claim submitted! Our team will contact you soon.");
      onOpenChange(false);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-brand-green-light">
            <Gift className="h-6 w-6 text-brand-green" />
          </div>
          <DialogTitle className="text-center font-display text-xl">Claim Your Gift 🎁</DialogTitle>
          <DialogDescription className="text-center">
            Share your details so we can send you a special gift from Balaji Nivesh!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          {[
            { id: "full_name", label: "Full Name", placeholder: "Your full name", type: "text" },
            { id: "phone", label: "Phone Number", placeholder: "10-digit mobile number", type: "tel" },
            { id: "city", label: "City", placeholder: "Your city", type: "text" },
            { id: "pincode", label: "Pincode", placeholder: "6-digit pincode", type: "text" },
          ].map(({ id, label, placeholder, type }) => (
            <div key={id} className="space-y-1">
              <Label htmlFor={id}>{label}</Label>
              <Input id={id} type={type} placeholder={placeholder} value={(form as any)[id]} onChange={(e) => handleChange(id, e.target.value)} />
              {errors[id] && <p className="text-xs text-destructive">{errors[id]}</p>}
            </div>
          ))}
          <div className="space-y-1">
            <Label htmlFor="address">Full Address</Label>
            <Textarea id="address" placeholder="House no, street, landmark..." value={form.address} onChange={(e) => handleChange("address", e.target.value)} rows={2} />
            {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            <Send className="mr-2 h-4 w-4" /> {loading ? "Submitting..." : "Submit Gift Claim"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GiftClaimForm;
