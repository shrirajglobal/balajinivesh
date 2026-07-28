import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, MessageSquare, User, Phone, Search, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Markdown from "@/components/blog/Markdown";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  title: string | null;
  session_id: string;
  source: string;
  created_at: string;
  updated_at: string;
  lead_name: string | null;
  lead_phone: string | null;
  lead_captured_at: string | null;
  lead_action: string | null;
}

interface Message {
  id: string;
  role: string;
  content: string;
  citations: any;
  created_at: string;
}

const AdminChats = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [msgLoading, setMsgLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [leadFilter, setLeadFilter] = useState<"all" | "with_lead" | "no_lead">("all");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("chat_conversations")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(500);
      setConversations((data || []) as Conversation[]);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!selectedId) { setMessages([]); return; }
    (async () => {
      setMsgLoading(true);
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("conversation_id", selectedId)
        .order("created_at", { ascending: true });
      setMessages((data || []) as Message[]);
      setMsgLoading(false);
    })();
  }, [selectedId]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return conversations.filter((c) => {
      if (leadFilter === "with_lead" && !c.lead_phone) return false;
      if (leadFilter === "no_lead" && c.lead_phone) return false;
      if (!q) return true;
      return (
        (c.title || "").toLowerCase().includes(q) ||
        (c.lead_name || "").toLowerCase().includes(q) ||
        (c.lead_phone || "").toLowerCase().includes(q)
      );
    });
  }, [conversations, search, leadFilter]);

  const active = conversations.find((c) => c.id === selectedId) || null;
  const withLeadCount = conversations.filter((c) => c.lead_phone).length;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Chatbot Conversations</h1>
        <p className="text-sm text-muted-foreground">
          {conversations.length} total · {withLeadCount} with captured contact info
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[380px,1fr]">
        {/* List */}
        <Card className="p-3">
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search title, name, phone…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
            <Select value={leadFilter} onValueChange={(v: any) => setLeadFilter(v)}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All conversations</SelectItem>
                <SelectItem value="with_lead">With contact info</SelectItem>
                <SelectItem value="no_lead">No contact info</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-3 max-h-[70vh] space-y-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
            ) : filtered.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No conversations found.</p>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={cn(
                    "w-full rounded-lg border p-2.5 text-left transition-colors",
                    selectedId === c.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/40"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {c.title || "Untitled conversation"}
                      </p>
                      {c.lead_phone && (
                        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-foreground">
                          <User className="h-3 w-3" />
                          <span className="font-medium">{c.lead_name || "—"}</span>
                          <Phone className="ml-1 h-3 w-3" />
                          <span>{c.lead_phone}</span>
                          {c.lead_action && (
                            <Badge variant="outline" className="ml-1 h-4 text-[9px] px-1">
                              {c.lead_action}
                            </Badge>
                          )}
                        </div>
                      )}
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        {formatDistanceToNow(new Date(c.updated_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </Card>

        {/* Transcript */}
        <Card className="p-4">
          {!active ? (
            <div className="flex h-[70vh] items-center justify-center text-muted-foreground">
              <p className="text-sm">Select a conversation to view the transcript.</p>
            </div>
          ) : (
            <div className="flex h-full flex-col">
              <div className="border-b border-border pb-3">
                <h2 className="font-display text-lg font-semibold text-foreground">
                  {active.title || "Untitled conversation"}
                </h2>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span>Session: {active.session_id.slice(0, 8)}…</span>
                  <span>Source: {active.source}</span>
                  {active.lead_captured_at && (
                    <Badge variant="secondary" className="gap-1">
                      Lead captured · {active.lead_action}
                    </Badge>
                  )}
                </div>
                {active.lead_phone && (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {active.lead_name} · {active.lead_phone}
                    </span>
                    <Button asChild size="sm" variant="outline">
                      <a href={`tel:${active.lead_phone}`}><Phone className="mr-1 h-3 w-3" />Call</a>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <a
                        href={`https://wa.me/${active.lead_phone.replace(/\D/g, "").length === 10 ? "91" + active.lead_phone.replace(/\D/g, "") : active.lead_phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        WhatsApp <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                )}
              </div>

              <div className="mt-4 max-h-[65vh] flex-1 space-y-4 overflow-y-auto pr-2">
                {msgLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
                ) : messages.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No messages yet.</p>
                ) : (
                  messages.map((m) => (
                    <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-3.5 py-2.5",
                          m.role === "user"
                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                            : "bg-muted/40 text-foreground"
                        )}
                      >
                        {m.role === "assistant" ? (
                          <Markdown
                            content={m.content}
                            className="text-sm leading-relaxed [&_p]:my-1.5 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_ul]:my-1.5 [&_ul]:pl-4 [&_ul]:list-disc [&_ol]:my-1.5 [&_ol]:pl-4 [&_ol]:list-decimal [&_strong]:font-semibold [&_a]:text-primary [&_a]:underline"
                          />
                        ) : (
                          <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                        )}
                        <p className="mt-1.5 text-[10px] opacity-60">
                          {formatDistanceToNow(new Date(m.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminChats;
