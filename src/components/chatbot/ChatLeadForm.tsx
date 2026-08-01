import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type ChatCTAAction = "whatsapp" | "call" | "book";

interface Props {
  action: ChatCTAAction;
  conversationId: string | null;
  sessionId: string;
  onCaptured: (name: string, phone: string) => void;
  onCancel: () => void;
}

const ACTION_LABEL: Record<ChatCTAAction, string> = {
  whatsapp: "Continue on WhatsApp",
  call: "Get a call back",
  book: "Book a free call",
};

const ACTION_INTRO: Record<ChatCTAAction, string> = {
  whatsapp: "Share your details and we'll open WhatsApp so our team can help further.",
  call: "Leave your number and our team will call you back — usually within an hour.",
  book: "Tell us who you are and we'll take you to the booking form.",
};

const ChatLeadForm = ({ action, conversationId, onCaptured, onCancel }: Props) => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const digits = phone.replace(/\D/g, "");
    if (trimmedName.length < 2) {
      toast({ title: "Please share your name", variant: "destructive" });
      return;
    }
    if (digits.length < 10) {
      toast({ title: "Please share a valid 10-digit mobile number", variant: "destructive" });
      return;
    }

    setBusy(true);
    const source = `chatbot_${action}`;
    const { error } = await supabase.from("contact_submissions").insert({
      name: trimmedName,
      email: "chatbot@balajinivesh.internal",
      phone: digits,
      subject: `Chatbot ${action} request`,
      message: note.trim() || `User requested ${action} from the AI chat.`,
      source,
    });

    if (error) {
      setBusy(false);
      toast({ title: "Something went wrong", description: error.message, variant: "destructive" });
      return;
    }

    // Best-effort update on conversation row (RLS-safe: silently ignored if none)
    if (conversationId) {
      await supabase
        .from("chat_conversations")
        .update({
          lead_name: trimmedName,
          lead_phone: digits,
          lead_captured_at: new Date().toISOString(),
          lead_action: action,
        })
        .eq("id", conversationId);
    }

    setBusy(false);
    onCaptured(trimmedName, digits);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-primary/30 bg-primary/5 p-3 space-y-2.5">
      <div>
        <p className="text-sm font-semibold text-foreground">{ACTION_LABEL[action]}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{ACTION_INTRO[action]}</p>
      </div>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="h-9"
        autoFocus
        maxLength={80}
      />
      <Input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Mobile number"
        className="h-9"
        inputMode="tel"
        maxLength={15}
      />
      <Input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="What's on your mind? (optional)"
        className="h-9"
        maxLength={200}
      />
      <div className="flex gap-2 pt-1">
        <Button type="submit" size="sm" className="flex-1" disabled={busy}>
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : ACTION_LABEL[action]}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
      </div>
      <p className="text-[10px] text-muted-foreground">
        By sharing your details you agree to be contacted by Balaji Nivesh. Educational information only — not investment advice.
      </p>
    </form>
  );
};

export default ChatLeadForm;
