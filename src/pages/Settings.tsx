import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { SUBJECTS, SubjectCode, formatDuration } from "@/lib/subjects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ChevronDown, Loader2, Save, User, Calendar, Timer, Lock, Palette, Trash2, Pencil, Check } from "lucide-react";
import { THEMES, applyTheme, ThemeName } from "@/lib/theme";
import { useSubscription } from "@/hooks/useSubscription";
import { cancelProSubscription } from "@/lib/dodo";

const NAME_RE = /^[A-Za-z][A-Za-z'\- ]*$/;
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface ProfileRow {
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  pomodoro_work_minutes: number;
  pomodoro_break_minutes: number;
  daily_reminder_enabled: boolean;
  daily_reminder_time: string;
  rest_days: number[];
  theme: string;
  is_pro: boolean;
  subscription_status: string | null;
  trial_start_date: string | null;
}

interface UnitRow {
  id: string;
  subject: SubjectCode;
  unit_number: number;
  unit_name: string;
  exam_date: string;
}

const SettingsPage = () => {
  const { user, signOut } = useAuth();
  const { isPro, inTrial, refresh: refreshSubscription } = useSubscription();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [units, setUnits] = useState<UnitRow[]>([]);
  const [savingProfile, setSavingProfile] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [changingPw, setChangingPw] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [cancellingPlan, setCancellingPlan] = useState(false);

  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState("");

  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    if (!user) return;
    setEmail(user.email || "");
    Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("user_subjects").select("id,subject,unit_number,unit_name,exam_date").eq("user_id", user.id).order("subject").order("unit_number"),
    ]).then(([p, u]) => {
      if (p.data) {
        const row = p.data as any as ProfileRow;
        setProfile(row);
        setFirstName(row.first_name || "");
        setLastName(row.last_name || "");
      }
      if (u.data) setUnits(u.data as UnitRow[]);
      setLoading(false);
    });
  }, [user]);

  // Apply theme on change
  useEffect(() => {
    if (!profile) return;
    applyTheme(profile.theme);
  }, [profile?.theme]); // eslint-disable-line

  const saveProfile = async () => {
    if (!user || !profile) return;
    const fn = firstName.trim();
    const ln = lastName.trim();
    if (!NAME_RE.test(fn)) return toast.error("First name: letters only.");
    if (!NAME_RE.test(ln)) return toast.error("Last name: letters only.");
    setSavingProfile(true);
    const { error } = await supabase.from("profiles").update({
      first_name: fn, last_name: ln, display_name: fn,
    }).eq("id", user.id);
    setSavingProfile(false);
    if (error) return toast.error(error.message);
    setProfile({ ...profile, first_name: fn, last_name: ln, display_name: fn });
    toast.success("Profile updated");
  };

  const updatePref = async <K extends keyof ProfileRow>(key: K, value: ProfileRow[K]) => {
    if (!user || !profile) return;
    setProfile({ ...profile, [key]: value });
    const { error } = await supabase.from("profiles").update({ [key]: value } as any).eq("id", user.id);
    if (error) toast.error("Couldn't save preference");
  };

  const toggleRestDay = (day: number) => {
    if (!profile) return;
    const next = profile.rest_days.includes(day)
      ? profile.rest_days.filter(d => d !== day)
      : [...profile.rest_days, day].sort();
    updatePref("rest_days", next);
  };

  const startEditDate = (u: UnitRow) => {
    setEditingUnitId(u.id);
    setEditDate(u.exam_date);
  };

  const saveDate = async (id: string) => {
    if (!user) return;
    const { error } = await supabase.from("user_subjects").update({ exam_date: editDate }).eq("id", id);
    if (error) return toast.error(error.message);
    setUnits(us => us.map(u => u.id === id ? { ...u, exam_date: editDate } : u));
    setEditingUnitId(null);
    toast.success("Exam date updated");
  };

  const changePassword = async () => {
    if (!user) return;
    if (pwNew.length < 8) return toast.error("New password must be 8+ characters.");
    if (pwNew !== pwConfirm) return toast.error("New passwords don't match.");
    if (!pwCurrent) return toast.error("Enter your current password.");
    setChangingPw(true);
    // Verify current password by re-authenticating
    const { error: verifyErr } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: pwCurrent,
    });
    if (verifyErr) {
      setChangingPw(false);
      return toast.error("Current password is incorrect.");
    }
    const { error } = await supabase.auth.updateUser({ password: pwNew });
    setChangingPw(false);
    if (error) return toast.error(error.message);
    setPwCurrent(""); setPwNew(""); setPwConfirm("");
    toast.success("Password changed");
  };

  const deleteAccount = async () => {
    if (!user) return;
    if (deleteConfirm !== "DELETE") return toast.error('Type "DELETE" to confirm.');
    setDeleting(true);
    // Wipe owned rows (RLS-protected)
    await Promise.all([
      supabase.from("note_annotations").delete().eq("user_id", user.id),
      supabase.from("topic_notes").delete().eq("user_id", user.id),
      supabase.from("mock_paper_questions").delete().eq("user_id", user.id),
      supabase.from("mock_papers").delete().eq("user_id", user.id),
      supabase.from("user_subjects").delete().eq("user_id", user.id),
      supabase.from("ai_questions").delete().eq("user_id", user.id),
    ]);
    await supabase.from("profiles").update({
      first_name: null, last_name: null, display_name: null, onboarded: false,
    }).eq("id", user.id);
    await signOut();
    toast.success("Account data wiped. Sign-in disabled — contact support to fully remove your login.");
    setDeleting(false);
  };

  const cancelPlan = async () => {
    setCancellingPlan(true);
    try {
      const message = await cancelProSubscription();
      await refreshSubscription();
      setProfile(profile ? { ...profile, subscription_status: "cancelled", is_pro: false } : profile);
      toast.success(message);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "We could not cancel your subscription right now. Please try again in a minute.");
    } finally {
      setCancellingPlan(false);
    }
  };

  if (loading || !profile) {
    return <AppLayout><div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div></AppLayout>;
  }

  const bySubject = units.reduce((acc, u) => {
    (acc[u.subject] ||= []).push(u);
    return acc;
  }, {} as Record<SubjectCode, UnitRow[]>);

  return (
    <AppLayout>
      <SEO title="Settings — MakeMeRevise" description="Manage your MakeMeRevise account, subscription, exam board, and notification preferences." path="/settings" />
      <div className="p-6 md:p-10 max-w-3xl mx-auto animate-fade-in">
        <div className="mb-8">
          <div className="text-xs text-primary font-mono uppercase tracking-widest mb-2">Settings</div>
          <h1 className="text-3xl md:text-4xl font-extrabold">Tune your setup.</h1>
          <p className="text-muted-foreground mt-1">Profile, exams, study preferences, and account.</p>
        </div>

        {/* Section 1 — Profile */}
        <SettingsSection icon={User} title="Profile">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fn">First name</Label>
              <Input id="fn" value={firstName} onChange={e => setFirstName(e.target.value)} className="mt-1.5" maxLength={40} />
            </div>
            <div>
              <Label htmlFor="ln">Last name</Label>
              <Input id="ln" value={lastName} onChange={e => setLastName(e.target.value)} className="mt-1.5" maxLength={40} />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={saveProfile} disabled={savingProfile} className="bg-primary hover:bg-primary/90">
              {savingProfile ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save profile
            </Button>
          </div>
        </SettingsSection>

        <SettingsSection icon={Lock} title="Subscription">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="font-semibold">{isPro ? (inTrial ? "Pro trial" : "Pro plan") : "Starter plan"}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {isPro
                  ? inTrial
                    ? "Cancel before the 3-day trial ends and you will not be charged."
                    : "Cancel anytime. Your plan will stop renewing."
                  : "You do not have an active paid subscription."}
              </p>
            </div>
            {isPro ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="text-urgent border-urgent/40 hover:bg-urgent/10 hover:text-urgent">
                    Cancel {inTrial ? "trial" : "subscription"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel {inTrial ? "trial" : "subscription"}?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You will not be charged again. If you are in the 3-day trial, cancelling now stops the trial before any money is deducted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Pro</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={cancelPlan}
                      disabled={cancellingPlan}
                      className="bg-urgent hover:bg-urgent/90 text-urgent-foreground"
                    >
                      {cancellingPlan ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                      Cancel plan
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <Link to="/pricing"><Button variant="outline">View plans</Button></Link>
            )}
          </div>
        </SettingsSection>

        {/* Section 2 — Exam Setup */}
        <SettingsSection icon={Calendar} title="Exam setup">
          {Object.entries(bySubject).length === 0 && (
            <p className="text-sm text-muted-foreground">No subjects yet. <Link to="/onboarding" className="text-primary underline">Add subjects →</Link></p>
          )}
          <div className="space-y-5">
            {Object.entries(bySubject).map(([code, rows]) => {
              const m = SUBJECTS[code as SubjectCode];
              return (
                <div key={code}>
                  <div className="flex items-center gap-2 mb-2 text-sm font-semibold">
                    <span className="text-lg">{m.emoji}</span>{m.name}
                  </div>
                  <div className="rounded-lg border border-border divide-y divide-border">
                    {rows.map(u => (
                      <div key={u.id} className="flex items-center gap-3 px-3 py-2.5 text-sm">
                        <div className="font-mono text-xs text-primary w-8">U{u.unit_number}</div>
                        <div className="flex-1 truncate">{u.unit_name}</div>
                        {editingUnitId === u.id ? (
                          <>
                            <Input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} className="h-8 w-40 text-xs" />
                            <Button size="sm" variant="ghost" onClick={() => saveDate(u.id)}>Save</Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingUnitId(null)}>Cancel</Button>
                          </>
                        ) : (
                          <>
                            <div className="font-mono text-xs text-muted-foreground">{format(parseISO(u.exam_date), "d MMM yyyy")}</div>
                            <Button size="sm" variant="ghost" onClick={() => startEditDate(u)} className="h-7 w-7 p-0"><Pencil className="h-3 w-3" /></Button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4">
            <Link to="/onboarding" className="text-sm text-primary hover:underline">Change my subjects →</Link>
          </div>
        </SettingsSection>

        {/* Section 3 — Study Preferences */}
        <SettingsSection icon={Timer} title="Study preferences">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Pomodoro work interval</Label>
                <span className="font-mono text-sm">{profile.pomodoro_work_minutes} min</span>
              </div>
              <Slider min={15} max={60} step={5}
                value={[profile.pomodoro_work_minutes]}
                onValueChange={v => updatePref("pomodoro_work_minutes", v[0])} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Pomodoro break interval</Label>
                <span className="font-mono text-sm">{profile.pomodoro_break_minutes} min</span>
              </div>
              <Slider min={3} max={20} step={1}
                value={[profile.pomodoro_break_minutes]}
                onValueChange={v => updatePref("pomodoro_break_minutes", v[0])} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Daily study reminder</Label>
                <p className="text-xs text-muted-foreground mt-0.5">A nudge to keep your streak alive.</p>
              </div>
              <Switch checked={profile.daily_reminder_enabled}
                onCheckedChange={v => updatePref("daily_reminder_enabled", v)} />
            </div>
            {profile.daily_reminder_enabled && (
              <div>
                <Label>Reminder time</Label>
                <Input type="time" value={profile.daily_reminder_time.slice(0, 5)}
                  onChange={e => updatePref("daily_reminder_time", e.target.value + ":00")}
                  className="mt-1.5 w-40" />
              </div>
            )}

            <div>
              <Label>Rest days</Label>
              <p className="text-xs text-muted-foreground mt-0.5 mb-2">No study blocks scheduled on these days.</p>
              <div className="flex gap-1.5">
                {DAYS.map((d, i) => {
                  const on = profile.rest_days.includes(i);
                  return (
                    <button key={d} onClick={() => toggleRestDay(i)}
                      className={`h-9 w-12 rounded-md text-xs font-mono border transition-all ${on ? "bg-accent/20 border-accent text-accent" : "border-border text-muted-foreground hover:border-foreground/40"}`}>
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Section 5 — Appearance */}
        <SettingsSection icon={Palette} title="Appearance">
          <div>
            <Label>Theme</Label>
            <p className="text-xs text-muted-foreground mt-0.5 mb-3">Pick the look that helps you focus.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {THEMES.map(t => {
                const active = (profile.theme || "sia") === t.name;
                return (
                  <button
                    key={t.name}
                    onClick={() => updatePref("theme", t.name)}
                    className={`relative rounded-lg border-2 p-2.5 text-left transition-all ${active ? "border-primary" : "border-border hover:border-foreground/30"}`}
                  >
                    <div className="flex gap-1 mb-2">
                      {t.swatches.map((c, i) => (
                        <div key={i} className="h-6 flex-1 rounded-sm" style={{ background: c }} />
                      ))}
                    </div>
                    <div className="text-xs font-semibold flex items-center justify-between">
                      <span>{t.label}</span>
                      {active && <Check className="h-3.5 w-3.5 text-primary" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </SettingsSection>

        {/* Section 4 — Account Details */}
        <Collapsible className="glass-card rounded-2xl mb-6">
          <CollapsibleTrigger className="w-full flex items-center justify-between p-6 group">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-secondary/60 flex items-center justify-center">
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-left">
                <h2 className="text-lg font-bold">Account details</h2>
                <p className="text-xs text-muted-foreground">Email, password, account deletion.</p>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="p-6 pt-0 space-y-6">
              <div>
                <Label>Email address</Label>
                <Input value={email} disabled readOnly className="mt-1.5 opacity-60 cursor-not-allowed" />
                <p className="text-xs text-muted-foreground mt-1.5">To change your email contact support.</p>
              </div>

              <div className="border-t border-border pt-5">
                <h3 className="font-semibold mb-3">Change password</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="pwc">Current password</Label>
                    <Input id="pwc" type="password" value={pwCurrent} onChange={e => setPwCurrent(e.target.value)} className="mt-1.5" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="pwn">New password</Label>
                      <Input id="pwn" type="password" value={pwNew} onChange={e => setPwNew(e.target.value)} className="mt-1.5" />
                    </div>
                    <div>
                      <Label htmlFor="pwc2">Confirm new</Label>
                      <Input id="pwc2" type="password" value={pwConfirm} onChange={e => setPwConfirm(e.target.value)} className="mt-1.5" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={changePassword} disabled={changingPw} variant="outline">
                      {changingPw ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                      Update password
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-5">
                <h3 className="font-semibold mb-2 text-urgent">Delete account</h3>
                <p className="text-xs text-muted-foreground mb-3">Removes all your data permanently.</p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="text-urgent border-urgent/40 hover:bg-urgent/10 hover:text-urgent">
                      <Trash2 className="h-3.5 w-3.5 mr-1.5" />Delete my account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete account?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This wipes every subject, mock paper, note, and annotation tied to your account. Type <span className="font-mono font-bold text-urgent">DELETE</span> below to confirm.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <Input value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} placeholder="DELETE" />
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setDeleteConfirm("")}>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={deleteAccount}
                        disabled={deleteConfirm !== "DELETE" || deleting}
                        className="bg-urgent hover:bg-urgent/90 text-urgent-foreground">
                        {deleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                        Delete forever
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </AppLayout>
  );
};

const SettingsSection = ({
  icon: Icon, title, children,
}: { icon: any; title: string; children: React.ReactNode }) => (
  <section className="glass-card rounded-2xl p-6 mb-6">
    <div className="flex items-center gap-3 mb-5">
      <div className="h-9 w-9 rounded-lg bg-primary/15 flex items-center justify-center">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <h2 className="text-lg font-bold">{title}</h2>
    </div>
    {children}
  </section>
);

export default SettingsPage;
