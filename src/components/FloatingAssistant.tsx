import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Sparkles, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { MathMarkdown } from "@/components/MathMarkdown";

type Msg = { role: "user" | "assistant"; content: string };

interface AssistantContext {
  topic?: string;
  subject?: string;
  unit_name?: string;
  board?: "edexcel-ial" | "cie";
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-tutor`;

export const FloatingAssistant = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [context, setContext] = useState<AssistantContext | undefined>(undefined);
  const [board, setBoard] = useState<"edexcel-ial" | "cie">("edexcel-ial");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Load board from profile so the tutor adapts to Edexcel vs CIE
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("exam_board").eq("id", user.id).single();
      if (data?.exam_board === "cie") setBoard("cie"); else setBoard("edexcel-ial");
    })();
  }, []);

  // Listen for context updates from any page (e.g. Roadmap setting current node)
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as AssistantContext | undefined;
      setContext(detail);
    };
    window.addEventListener("apex-assistant-context", handler);
    return () => window.removeEventListener("apex-assistant-context", handler);
  }, []);

  // Auto-clear context on route change away from roadmap topic pages
  useEffect(() => {
    if (!pathname.startsWith("/roadmap")) setContext(undefined);
  }, [pathname]);

  useEffect(() => {
    if (open) scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  // Hide on auth/onboarding/landing/exam screens
  const hide =
    pathname === "/" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/diagnostic") ||
    pathname.startsWith("/mock-papers/exam");
  if (hide) return null;

  const send = async () => {
    const text = input.trim();
    if (!text || streaming) return;
    const userMsg: Msg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setStreaming(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: next, context: { ...(context || {}), board: context?.board || board } }),
      });
      if (!resp.ok || !resp.body) throw new Error("Tutor unavailable");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let acc = "";
      setMessages(m => [...m, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              acc += delta;
              setMessages(m => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: acc };
                return copy;
              });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (err) {
      setMessages(m => [...m, { role: "assistant", content: "Sorry — tutor unavailable just now. Try again in a moment." }]);
    } finally {
      setStreaming(false);
    }
  };

  return (
    <>
      {/* Trigger */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-40 h-12 w-12 rounded-full shadow-lg flex items-center justify-center text-white transition-all hover:scale-105"
          style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}
          aria-label="Open AI tutor"
        >
          <Sparkles className="h-5 w-5" />
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed bottom-5 right-5 z-40 w-[360px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-2rem)] surface flex flex-col shadow-2xl animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}>
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="text-sm font-bold leading-tight">Apex Tutor</div>
                <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider leading-tight">
                  {context?.topic ? `Re: ${context.topic}` : "Ask anything"}
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground p-1">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-sm text-muted-foreground py-8 px-4 leading-relaxed">
                Stuck on a concept? Want a step-by-step? Ask away.
                {context?.topic && (
                  <div className="mt-3 text-xs text-primary font-mono">Context: {context.topic}</div>
                )}
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground whitespace-pre-wrap"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  {m.role === "assistant" ? (
                    m.content ? <MathMarkdown>{m.content}</MathMarkdown>
                      : (streaming && i === messages.length - 1 ? <Loader2 className="h-3 w-3 animate-spin" /> : "")
                  ) : m.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Ask the tutor…"
                className="min-h-[40px] max-h-[120px] text-sm resize-none flex-1"
                rows={1}
              />
              <Button onClick={send} disabled={!input.trim() || streaming} size="sm" className="btn-primary self-end h-10 w-10 p-0">
                {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
