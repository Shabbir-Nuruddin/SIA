import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MessageSquare, Send, Plus } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "closed";
  created_at: string;
  user_id: string;
}
interface Reply {
  id: string;
  ticket_id: string;
  message: string;
  is_admin_reply: boolean;
  created_at: string;
  author_id: string;
}

const Feedback = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [active, setActive] = useState<Ticket | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [creating, setCreating] = useState(false);
  const [composing, setComposing] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: prof } = await supabase.from("profiles")
        .select("is_admin").eq("id", user.id).maybeSingle();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setIsAdmin(Boolean((prof as any)?.is_admin));
      await loadTickets();
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadTickets = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase.from("feedback_tickets") as any)
      .select("*").order("created_at", { ascending: false });
    setTickets((data ?? []) as Ticket[]);
  };

  const loadReplies = async (t: Ticket) => {
    setActive(t);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase.from("feedback_replies") as any)
      .select("*").eq("ticket_id", t.id).order("created_at", { ascending: true });
    setReplies((data ?? []) as Reply[]);
  };

  const submit = async () => {
    if (!user) return;
    if (!subject.trim() || !message.trim()) {
      toast.error("Subject and message required.");
      return;
    }
    setCreating(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("feedback_tickets") as any).insert({
      user_id: user.id, subject: subject.trim(), message: message.trim(),
    });
    setCreating(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Sent. Thank you!");
    setSubject(""); setMessage(""); setComposing(false);
    await loadTickets();
  };

  const sendReply = async () => {
    if (!user || !active || !reply.trim()) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("feedback_replies") as any).insert({
      ticket_id: active.id, author_id: user.id, message: reply.trim(),
      is_admin_reply: isAdmin,
    });
    if (error) { toast.error(error.message); return; }
    setReply("");
    await loadReplies(active);
  };

  const updateStatus = async (t: Ticket, status: Ticket["status"]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("feedback_tickets") as any).update({ status }).eq("id", t.id);
    await loadTickets();
    if (active?.id === t.id) setActive({ ...active, status });
  };

  if (loading) return (
    <AppLayout>
      <div className="flex items-center justify-center h-[60vh]"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
    </AppLayout>
  );

  return (
    <AppLayout>
      <div className="px-6 md:px-10 py-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-2">
              <MessageSquare className="h-7 w-7 text-primary" />
              {isAdmin ? "Feedback Inbox" : "Send Feedback"}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {isAdmin
                ? "All user feedback. Replies stay anonymous to users."
                : "Found a bug, missing feature, or have an idea? Let us know — we read every message."}
            </p>
          </div>
          {!isAdmin && !composing && (
            <Button onClick={() => setComposing(true)} className="bg-primary"><Plus className="h-4 w-4 mr-1" /> New</Button>
          )}
        </div>

        {composing && !isAdmin && (
          <div className="surface p-5 mb-6 space-y-3">
            <Input placeholder="Subject (e.g. Music player bug)" value={subject} onChange={e => setSubject(e.target.value)} />
            <Textarea placeholder="Tell us more..." value={message} onChange={e => setMessage(e.target.value)} rows={5} />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setComposing(false)}>Cancel</Button>
              <Button onClick={submit} disabled={creating}>
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4 mr-1" /> Send</>}
              </Button>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-[320px_1fr] gap-4">
          <div className="space-y-2">
            {tickets.length === 0 && (
              <div className="text-sm text-muted-foreground p-4">No tickets yet.</div>
            )}
            {tickets.map(t => (
              <button key={t.id} onClick={() => loadReplies(t)}
                className={`w-full text-left p-3 rounded-lg border transition ${
                  active?.id === t.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}>
                <div className="text-sm font-semibold truncate">{t.subject}</div>
                <div className="text-xs text-muted-foreground truncate mt-0.5">{t.message}</div>
                <div className="flex items-center justify-between mt-2 text-[10px]">
                  <span className={`px-1.5 py-0.5 rounded font-mono uppercase tracking-wide ${
                    t.status === "open" ? "bg-amber-500/15 text-amber-500" :
                    t.status === "in_progress" ? "bg-blue-500/15 text-blue-400" :
                    "bg-success/15 text-success"
                  }`}>{t.status.replace("_", " ")}</span>
                  <span className="text-muted-foreground">{format(new Date(t.created_at), "MMM d")}</span>
                </div>
              </button>
            ))}
          </div>

          <div>
            {!active && (
              <div className="surface p-8 text-center text-muted-foreground text-sm">
                Select a ticket to view conversation.
              </div>
            )}
            {active && (
              <div className="surface p-5 space-y-4">
                <div>
                  <div className="text-lg font-bold">{active.subject}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{format(new Date(active.created_at), "MMM d, yyyy · HH:mm")}</div>
                </div>
                <div className="p-3 rounded-md bg-muted/50 text-sm whitespace-pre-wrap">{active.message}</div>

                {isAdmin && (
                  <div className="flex gap-2 text-xs">
                    <Button size="sm" variant={active.status === "open" ? "default" : "outline"} onClick={() => updateStatus(active, "open")}>Open</Button>
                    <Button size="sm" variant={active.status === "in_progress" ? "default" : "outline"} onClick={() => updateStatus(active, "in_progress")}>In progress</Button>
                    <Button size="sm" variant={active.status === "closed" ? "default" : "outline"} onClick={() => updateStatus(active, "closed")}>Closed</Button>
                  </div>
                )}

                <div className="space-y-2">
                  {replies.map(r => (
                    <div key={r.id} className={`p-3 rounded-md text-sm whitespace-pre-wrap ${
                      r.is_admin_reply ? "bg-primary/10 border border-primary/30" : "bg-muted/50"
                    }`}>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                        {r.is_admin_reply ? "Support team" : "You"} · {format(new Date(r.created_at), "MMM d HH:mm")}
                      </div>
                      {r.message}
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-2 border-t border-border">
                  <Textarea placeholder={isAdmin ? "Reply to user..." : "Add a follow-up..."} value={reply} onChange={e => setReply(e.target.value)} rows={3} />
                  <div className="flex justify-end">
                    <Button onClick={sendReply} disabled={!reply.trim()}>
                      <Send className="h-4 w-4 mr-1" /> Send
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Feedback;
