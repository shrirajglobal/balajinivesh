import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import Markdown from "@/components/blog/Markdown";
import { chatBus } from "@/lib/chatBus";

type Msg = { role: "user" | "assistant"; content: string; citations?: Citation[] };
type Citation = { title: string; url: string | null; source_type: string };

const SESSION_KEY = "bn_chat_session";
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

const SUGGESTED = [
  "What is SIP and how does it work?",
  "Explain the latest market update simply",
  "How is ELSS taxed?",
  "How do I become a partner?",
];

const ChatWidget = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(getOrCreateSession());

  const hidden = HIDDEN_ROUTES.some((p) => location.pathname.startsWith(p));

  useEffect(() => chatBus.subscribe(setOpen), []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, loading]);

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
    <>
      {/* Launcher removed — ChatWidget is now opened from the merged StickyCTA fan-out. */}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-24 right-5 z-50 flex h-[560px] max-h-[80vh] w-[calc(100vw-2.5rem)] sm:w-96 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="font-display text-sm font-semibold text-foreground">Ask Balaji Nivesh</p>
                <p className="text-[11px] text-muted-foreground">Education only · not investment advice</p>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef as any}>
              {messages.length === 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Hi! I can explain SIPs, market updates, taxes, partnership, and more — based on Balaji Nivesh's content.
                  </p>
                  <div className="space-y-1.5">
                    {SUGGESTED.map((q) => (
                      <button
                        key={q}
                        onClick={() => send(q)}
                        className="w-full rounded-lg border border-border bg-muted/40 px-3 py-2 text-left text-xs text-foreground transition-colors hover:bg-muted"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "rounded-lg px-3 py-2 text-sm",
                        m.role === "user"
                          ? "ml-6 bg-primary/10 text-foreground"
                          : "mr-6 bg-muted/60 text-foreground",
                      )}
                    >
                      {m.role === "assistant" && !m.content && loading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      ) : m.role === "assistant" ? (
                        <div className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                          <Markdown content={m.content || "…"} />
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{m.content}</p>
                      )}
                      {m.citations && m.citations.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {m.citations
                            .filter((c) => c.url)
                            .slice(0, 3)
                            .map((c, i) => (
                              <Link
                                key={i}
                                to={c.url!}
                                onClick={() => setOpen(false)}
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
                  ))}
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
    </>
  );
};

export default ChatWidget;
