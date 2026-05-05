import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MessageSquare, Send, Plus, Users, Crown, Search } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

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

  // Admin users panel
  const [adminStats, setAdminStats] = useState<{ total: number; pro: number } | null>(null);
  const [adminUsers, setAdminUsers] = useState<Array<{ id: string; email: string; display_name: string | null; is_pro: boolean; study_minutes?: number }>>([]);
  const [userSearch, setUserSearch] = useState("");
  const [ticketTarget, setTicketTarget] = useState<{ id: string; email: string } | null>(null);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [sendingTicket, setSendingTicket] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: prof } = await supabase.from("profiles")
        .select("is_admin").eq("id", user.id).maybeSingle();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const admin = Boolean((prof as any)?.is_admin);
      setIsAdmin(admin);
      await loadTickets();
      if (admin) await loadAdminUsers();
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadAdminUsers = async () => {
    const { data, error } = await supabase.functions.invoke("admin-list-users");
    if (error) { console.error(error); return; }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const d = data as any;
    setAdminStats({ total: d.total ?? 0, pro: d.pro ?? 0 });
    setAdminUsers(d.users ?? []);
  };

  const sendAdminTicket = async () => {
    if (!ticketTarget || !ticketSubject.trim() || !ticketMessage.trim()) {
      toast.error("Subject and message required.");
      return;
    }
    setSendingTicket(true);
    const { error } = await supabase.functions.invoke("admin-create-ticket", {
      body: {
        target_user_id: ticketTarget.id,
        subject: ticketSubject.trim(),
        message: ticketMessage.trim(),
      },
    });
    setSendingTicket(false);
    if (error) { toast.error(error.message); return; }
    toast.success(`Ticket sent to ${ticketTarget.email}`);
    setTicketTarget(null); setTicketSubject(""); setTicketMessage("");
    await loadTickets();
  };

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

        {isAdmin && (
          <div className="surface p-4 mb-6">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2 font-semibold text-sm">
                <Users className="h-4 w-4 text-primary" /> Users overview
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="px-2 py-1 rounded bg-muted/60">
                  Total: <strong className="text-foreground">{adminStats?.total ?? "—"}</strong>
                </span>
                <span className="px-2 py-1 rounded bg-primary/10 text-primary flex items-center gap-1">
                  <Crown className="h-3 w-3" /> Pro: <strong>{adminStats?.pro ?? "—"}</strong>
                </span>
              </div>
            </div>
            <div className="relative mb-3">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search by email or name..."
                className="pl-9"
              />
            </div>
            <div className="max-h-72 overflow-y-auto divide-y divide-border rounded-md border border-border">
              {adminUsers
                .filter((u) => {
                  const q = userSearch.toLowerCase().trim();
                  if (!q) return true;
                  return u.email.toLowerCase().includes(q) || (u.display_name ?? "").toLowerCase().includes(q);
                })
                .slice(0, 200)
                .map((u) => (
                  <div key={u.id} className="flex items-center justify-between gap-2 px-3 py-2 text-sm">
                    <div className="min-w-0">
                      <div className="truncate font-medium flex items-center gap-2">
                        {u.email || "(no email)"}
                        {u.is_pro && <Crown className="h-3 w-3 text-primary shrink-0" />}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {u.display_name ? `${u.display_name} · ` : ""}
                        {(() => {
                          const m = u.study_minutes ?? 0;
                          const h = Math.floor(m / 60);
                          const r = m % 60;
                          return h > 0 ? `${h}h ${r}m studied` : `${r}m studied`;
                        })()}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => { setTicketTarget({ id: u.id, email: u.email }); setTicketSubject(""); setTicketMessage(""); }}
                    >
                      <MessageSquare className="h-3 w-3 mr-1" /> Open ticket
                    </Button>
                  </div>
                ))}
              {adminUsers.length === 0 && (
                <div className="text-xs text-muted-foreground p-4 text-center">No users loaded.</div>
              )}
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

      <Dialog open={!!ticketTarget} onOpenChange={(o) => !o && setTicketTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Open ticket with {ticketTarget?.email}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Subject" value={ticketSubject} onChange={(e) => setTicketSubject(e.target.value)} />
            <Textarea placeholder="Message to user..." rows={5} value={ticketMessage} onChange={(e) => setTicketMessage(e.target.value)} />
            <p className="text-xs text-muted-foreground">
              This creates a support thread in the user's Feedback inbox. They can reply and you'll see it here.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTicketTarget(null)}>Cancel</Button>
            <Button onClick={sendAdminTicket} disabled={sendingTicket}>
              {sendingTicket ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4 mr-1" /> Send</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Feedback;
