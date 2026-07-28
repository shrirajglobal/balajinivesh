import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, Sparkles, ExternalLink, MessageCircle, Phone, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Markdown from "@/components/blog/Markdown";
import { chatBus } from "@/lib/chatBus";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useWhatsAppContactHref } from "@/lib/whatsapp";
import ChatLeadForm, { type ChatCTAAction } from "@/components/chatbot/ChatLeadForm";

type Msg = { role: "user" | "assistant"; content: string; citations?: Citation[] };
type Citation = { title: string; url: string | null; source_type: string };

const SESSION_KEY = "bn_chat_session";
const LEAD_KEY = "bn_chat_lead";
const HIDDEN_ROUTES = ["/admin", "/auth"];

function getOrCreateSession(): string {
  if (typeof window === "undefined") return "";
  let s = localStorage.getItem(SESSION_KEY);
  if (!s) {
    s = crypto.randomUUID().replace(/-/g, "");
    localStorage.setItem(SESSION_KEY, s);
  }
  return s;
}

function getStoredLead(): { name: string; phone: string } | null {
  try {
    const raw = localStorage.getItem(LEAD_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const SUGGESTED = [
  "What is SIP and how does it work?",
  "Explain the latest market update",
  "How is ELSS taxed?",
  "How do I become a partner?",
];

const ChatWidget = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: settings } = useSiteSettings();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [ctaForm, setCtaForm] = useState<ChatCTAAction | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(getOrCreateSession());

  const phone = (settings?.map.contact_phone || "").trim();
  const whatsappHref = useWhatsAppContactHref("Hi Balaji Nivesh, I'd like to speak with your team.");
  const callHref = phone ? `tel:${phone.replace(/\s+/g, "")}` : "/contact";

  const hidden = HIDDEN_ROUTES.some((p) => location.pathname.startsWith(p));

  useEffect(() => {
    const unsub = chatBus.subscribe(setOpen);
    return () => { unsub(); };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, loading, ctaForm]);

  const executeCTA = (action: ChatCTAAction) => {
    if (action === "whatsapp") {
      window.open(whatsappHref, "_blank", "noopener,noreferrer");
    } else if (action === "call") {
      window.location.href = callHref;
    } else if (action === "book") {
      chatBus.close();
      navigate("/contact");
    }
  };

  const handleCTAClick = (action: ChatCTAAction) => {
    const stored = getStoredLead();
    if (stored) {
      executeCTA(action);
      return;
    }
    setCtaForm(action);
  };

  const handleLeadCaptured = (name: string, phoneNumber: string) => {
    localStorage.setItem(LEAD_KEY, JSON.stringify({ name, phone: phoneNumber }));
    localStorage.setItem("bn_can_ask_review", "1");
    const action = ctaForm;
    setCtaForm(null);
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `Thanks **${name}** — your details are with our team. Opening the next step now.`,
      },
    ]);
    if (action) setTimeout(() => executeCTA(action), 400);
  };

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Msg = { role: "user", content: text.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    let assistantSoFar = "";
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chatbot`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: next,
          session_id: sessionId.current,
          conversation_id: conversationId,
        }),
      });

      const convHeader = resp.headers.get("X-Conversation-Id");
      if (convHeader && !conversationId) setConversationId(convHeader);

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || "Chat failed");
      }
      if (!resp.body) throw new Error("No response stream");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") continue;
          try {
            const obj = JSON.parse(json);
            const delta = obj.choices?.[0]?.delta?.content;
            if (delta) {
              assistantSoFar += delta;
              setMessages((prev) =>
                prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m)),
              );
            }
          } catch {/* incomplete chunk */}
        }
      }
    } catch (e) {
      setMessages((prev) =>
        prev.map((m, i) =>
          i === prev.length - 1
            ? { ...m, content: `Sorry — ${(e as Error).message}. Please try again.` }
            : m,
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  if (hidden) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.18 }}
          className="fixed bottom-24 right-5 z-50 flex h-[620px] max-h-[85vh] w-[calc(100vw-2.5rem)] sm:w-[420px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="font-display text-sm font-semibold text-foreground">Ask Balaji Nivesh</p>
              <p className="text-[11px] text-muted-foreground">Education only · not investment advice</p>
            </div>
            <button
              onClick={() => chatBus.close()}
              className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-3 gap-1.5 border-b border-border bg-background/50 px-3 py-2">
            <button
              onClick={() => handleCTAClick("whatsapp")}
              className="flex flex-col items-center gap-1 rounded-lg border border-border bg-card px-2 py-2 text-[11px] font-medium text-foreground transition-colors hover:border-brand-green hover:text-brand-green"
            >
              <MessageCircle className="h-4 w-4 text-brand-green" />
              WhatsApp
            </button>
            <button
              onClick={() => handleCTAClick("call")}
              className="flex flex-col items-center gap-1 rounded-lg border border-border bg-card px-2 py-2 text-[11px] font-medium text-foreground transition-colors hover:border-secondary hover:text-secondary"
            >
              <Phone className="h-4 w-4 text-secondary" />
              Call us
            </button>
            <button
              onClick={() => handleCTAClick("book")}
              className="flex flex-col items-center gap-1 rounded-lg border border-border bg-card px-2 py-2 text-[11px] font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <CalendarClock className="h-4 w-4 text-primary" />
              Book call
            </button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef as any}>
            {messages.length === 0 ? (
              <div className="space-y-4">
                <div className="rounded-xl bg-muted/40 p-3 text-sm text-foreground">
                  Hi! I can explain SIPs, market updates, taxes, partnership and more — based on Balaji Nivesh's content.
                  <br />
                  <span className="text-muted-foreground text-xs">Or tap WhatsApp / Call above to speak with our team.</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SUGGESTED.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="rounded-full border border-border bg-card px-3 py-2 text-left text-xs text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((m, idx) => (
                  <div key={idx} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-3.5 py-2.5",
                        m.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-sm"
                          : "text-foreground",
                      )}
                    >
                      {m.role === "assistant" && !m.content && loading ? (
                        <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                          <span className="flex gap-1">
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" />
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" />
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60" />
                          </span>
                          Thinking…
                        </span>
                      ) : m.role === "assistant" ? (
                        <Markdown
                          content={m.content || "…"}
                          className="text-sm leading-relaxed [&_p]:my-1.5 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_ul]:my-1.5 [&_ul]:pl-4 [&_ul]:list-disc [&_ol]:my-1.5 [&_ol]:pl-4 [&_ol]:list-decimal [&_li]:my-0.5 [&_strong]:font-semibold [&_strong]:text-foreground [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_h3]:mt-2 [&_h3]:mb-1 [&_h3]:font-semibold [&_h3]:text-foreground [&_h4]:mt-2 [&_h4]:mb-1 [&_h4]:font-semibold [&_h4]:text-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_em]:italic"
                        />
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                      )}
                      {m.role === "assistant" && m.citations && m.citations.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {m.citations
                            .filter((c) => c.url)
                            .slice(0, 3)
                            .map((c, i) => (
                              <Link
                                key={i}
                                to={c.url!}
                                onClick={() => chatBus.close()}
                                className="inline-flex items-center gap-0.5 rounded-full border border-border bg-card px-2 py-0.5 text-[10px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                              >
                                {c.title.slice(0, 30)}
                                {c.title.length > 30 ? "…" : ""}
                                <ExternalLink className="h-2.5 w-2.5" />
                              </Link>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {ctaForm && (
                  <ChatLeadForm
                    action={ctaForm}
                    conversationId={conversationId}
                    onCaptured={handleLeadCaptured}
                    onCancel={() => setCtaForm(null)}
                  />
                )}
              </div>
            )}
            {messages.length === 0 && ctaForm && (
              <div className="mt-4">
                <ChatLeadForm
                  action={ctaForm}
                  conversationId={conversationId}
                  onCaptured={handleLeadCaptured}
                  onCancel={() => setCtaForm(null)}
                />
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-border bg-background p-3"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about SIPs, market, taxes…"
              className="h-10"
              disabled={loading}
            />
            <Button type="submit" size="icon" className="h-10 w-10 shrink-0" disabled={loading || !input.trim()}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatWidget;
