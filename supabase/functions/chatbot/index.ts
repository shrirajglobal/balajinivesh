// supabase/functions/chatbot/index.ts
// "Ask Balaji Nivesh" — RAG over content_embeddings. Streaming SSE.
// SEBI/AMFI guardrails: never advise specific schemes, never quote returns,
// never recommend allocation. Distributor (not Advisor) language always.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const EMBED_MODEL = "google/text-embedding-004";
const CHAT_MODEL = "google/gemini-3-flash-preview";

const SYSTEM_PROMPT = `You are "Ask Balaji Nivesh", a friendly financial education assistant for an Indian AMFI-registered Mutual Fund Distributor.

CRITICAL COMPLIANCE RULES — NEVER VIOLATE:
1. You are an EDUCATOR and DISTRIBUTOR, NOT an Advisor. Never use the word "advice" or "recommend".
2. Never name specific mutual fund schemes, AMCs, stocks, or bonds.
3. Never quote past returns, guaranteed returns, or projections of future returns.
4. Never give asset-allocation percentages tailored to a person.
5. Never give tax filing instructions — only general tax structure education.
6. End every substantive answer with: "_For personalised guidance, please contact a Balaji Nivesh team member via the contact form._"

ANSWER STYLE:
- Class-10 reading level. Short sentences. Use simple Hindi/Bengali words sparingly when they aid clarity (SIP, NAV, ELSS stay in English).
- Cite the source documents you used by their title in [Source: Title] format.
- If the question is outside scope (medical, legal, personal finance specifics, scheme picks, predictions), politely decline and redirect to the contact form.
- If you don't have enough context from the sources, say so honestly — don't invent.

You will receive a CONTEXT block with snippets retrieved from Balaji Nivesh's blog, market updates, and academy. Use these as your primary source.`;

async function embedQuery(text: string): Promise<number[]> {
  const resp = await fetch("https://ai.gateway.lovable.dev/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: EMBED_MODEL, input: text }),
  });
  if (!resp.ok) throw new Error(`Embedding failed: ${resp.status}`);
  const json = await resp.json();
  return json.data?.[0]?.embedding ?? [];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, session_id, conversation_id } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!session_id || typeof session_id !== "string" || session_id.length < 8) {
      return new Response(JSON.stringify({ error: "session_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Identify user (optional)
    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization") ?? "";
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const u = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
          global: { headers: { Authorization: authHeader } },
        });
        const { data } = await u.auth.getUser();
        userId = data?.user?.id ?? null;
      } catch { /* ignore */ }
    }

    // Get / create conversation
    let convId = conversation_id as string | undefined;
    if (!convId) {
      const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
      const title = lastUserMsg?.content?.slice(0, 60) ?? "New chat";
      const { data: conv } = await admin
        .from("chat_conversations")
        .insert({ user_id: userId, session_id, title })
        .select("id")
        .single();
      convId = conv?.id;
    }

    // Persist the latest user message
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMsg && convId) {
      await admin.from("chat_messages").insert({
        conversation_id: convId,
        role: "user",
        content: lastUserMsg.content,
      });
    }

    // ----- RAG retrieval -------------------------------------------------
    const queryText = lastUserMsg?.content ?? "";
    let citations: any[] = [];
    let contextBlock = "";
    try {
      const queryEmbedding = await embedQuery(queryText);
      const { data: matches } = await admin.rpc("match_content_embeddings", {
        query_embedding: queryEmbedding,
        match_count: 5,
        match_threshold: 0.45,
      });
      if (matches && matches.length > 0) {
        contextBlock = matches
          .map(
            (m: any, i: number) =>
              `[${i + 1}] Title: ${m.title}\nURL: ${m.url ?? "n/a"}\nSnippet: ${m.content}`,
          )
          .join("\n\n---\n\n");
        citations = matches.map((m: any) => ({
          title: m.title,
          url: m.url,
          source_type: m.source_type,
          similarity: m.similarity,
        }));
      }
    } catch (e) {
      console.error("RAG retrieval failed:", e);
    }

    const systemWithContext = contextBlock
      ? `${SYSTEM_PROMPT}\n\nCONTEXT (use these to answer; cite by title):\n\n${contextBlock}`
      : `${SYSTEM_PROMPT}\n\nCONTEXT: (no relevant sources found — say so if needed)`;

    // ----- Stream from Lovable AI ----------------------------------------
    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: CHAT_MODEL,
        messages: [
          { role: "system", content: systemWithContext },
          ...messages.map((m: any) => ({ role: m.role, content: m.content })),
        ],
        stream: true,
      }),
    });

    if (!aiResp.ok) {
      if (aiResp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in workspace settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "Chatbot temporarily unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Tee the stream so we can persist the assistant message at the end.
    const [s1, s2] = aiResp.body!.tee();

    // Background: read s2, accumulate, persist to DB.
    (async () => {
      try {
        const reader = s2.getReader();
        const decoder = new TextDecoder();
        let assistantText = "";
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
            if (json === "[DONE]") break;
            try {
              const obj = JSON.parse(json);
              const delta = obj.choices?.[0]?.delta?.content;
              if (delta) assistantText += delta;
            } catch {/* incomplete */}
          }
        }
        if (convId && assistantText.trim()) {
          await admin.from("chat_messages").insert({
            conversation_id: convId,
            role: "assistant",
            content: assistantText,
            citations,
          });
        }
      } catch (e) {
        console.error("Persist error:", e);
      }
    })();

    return new Response(s1, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "X-Conversation-Id": convId ?? "",
      },
    });
  } catch (e) {
    console.error("chatbot error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
