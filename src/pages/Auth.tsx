import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getPostAuthRoute } from "@/lib/postAuthRoute";
import { toast } from "sonner";
import { ArrowLeft, Eye, EyeOff, Loader2, GraduationCap, BookOpen, Users } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { scheduleOnboardingEmails } from "@/lib/onboardingEmails";
import { SEO } from "@/components/SEO";

const SIA_LOGO = "/sia-logo.png";
const HERO_IMAGE = "https://sia.ae/wp-content/uploads/2022/03/BEN_6032.jpg";
const RED = "#C8102E";
const RED_DARK = "#7A0A1C";

const NAME_RE = /^[A-Za-z][A-Za-z'\- ]*$/;
type Role = "student" | "teacher" | "parent";

const ROLES: { key: Role; label: string; icon: any }[] = [
  { key: "student", label: "Student", icon: GraduationCap },
  { key: "teacher", label: "Teacher", icon: BookOpen },
  { key: "parent",  label: "Parent",  icon: Users },
];

// Pre-created demo accounts — run the SQL below in Supabase SQL Editor to create them.
const DEMO_CREDENTIALS: Record<Role, { email: string; password: string }> = {
  student: { email: "demo.student@sia-revision.com", password: "Demo@Student1" },
  teacher: { email: "demo.teacher@sia-revision.com", password: "Demo@Teacher1" },
  parent:  { email: "demo.parent@sia-revision.com",  password: "Demo@Parent1"  },
};

const DEMO_META: Record<Role, { label: string; desc: string; icon: any; color: string }> = {
  student: { label: "Demo Student",  desc: "Roadmap, notes & mock papers", icon: GraduationCap, color: RED },
  teacher: { label: "Demo Teacher",  desc: "Class analytics & task tools",  icon: BookOpen,     color: "#1d4ed8" },
  parent:  { label: "Demo Parent",   desc: "Child progress & activity",     icon: Users,        color: "#15803d" },
};

const AuthPage = () => {
  const [params] = useSearchParams();
  const initialMode = params.get("mode") === "signup" ? "signup" : "login";
  const initialRole = (params.get("role") as Role) || "student";
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [role, setRole] = useState<Role>(["student", "teacher", "parent"].includes(initialRole) ? initialRole : "student");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [demoLoading, setDemoLoading] = useState<Role | null>(null);
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();

  // One-time toast after email verification redirect.
  useEffect(() => {
    if (params.get("verified") === "1") {
      toast.success("Email verified — you're all set. Welcome to SIA Smart Revision.");
    }
  }, [params]);

  // Any signed-in user who lands on /auth goes straight to their portal — no
  // "already signed in" screen. (Fresh sign-ins also handle pending-role setup.)
  useEffect(() => {
    if (authLoading || !user) return;
    const pending   = localStorage.getItem("sia_pending_role");
    const demoJump  = localStorage.getItem("sia_demo_jump");
    let cancelled = false;
    (async () => {
      try {
        if (pending && ["student", "teacher", "parent"].includes(pending)) {
          if ((user.user_metadata as any)?.role !== pending) {
            await supabase.auth.updateUser({ data: { role: pending } });
          }
          await supabase.from("profiles").upsert({ id: user.id, role: pending } as any, { onConflict: "id" });
          localStorage.removeItem("sia_pending_role");
        }
        localStorage.removeItem("sia_demo_jump");
      } catch { /* non-blocking */ }
      const route = await getPostAuthRoute(user.id);
      if (!cancelled) navigate(route, { replace: true });
    })();
    return () => { cancelled = true; };
  }, [authLoading, user, navigate, params]);

  const goToPortal    = async () => { if (user) navigate(await getPostAuthRoute(user.id), { replace: true }); };
  const switchAccount = async () => { await signOut(); };

  // Demo sign-in: uses pre-created demo accounts.
  const handleDemo = async (demoRole: Role) => {
    setDemoLoading(demoRole);
    try {
      const { email: demoEmail, password: demoPass } = DEMO_CREDENTIALS[demoRole];
      localStorage.removeItem("sia_pending_role");
      localStorage.setItem("sia_demo_jump", "1");
      const { data, error } = await supabase.auth.signInWithPassword({ email: demoEmail, password: demoPass });
      if (error) {
        localStorage.removeItem("sia_demo_jump");
        toast.error("Demo account not set up yet — ask the admin to run the demo SQL.");
        return;
      }
      const route = data.user ? await getPostAuthRoute(data.user.id) : "/dashboard";
      navigate(route, { replace: true });
    } catch {
      localStorage.removeItem("sia_demo_jump");
      toast.error("Could not load demo. Try again.");
    } finally {
      setDemoLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.removeItem("sia_pending_role");
    if (mode === "signup") {
      const fn = firstName.trim();
      const ln = lastName.trim();
      if (!fn || !NAME_RE.test(fn)) { toast.error("First name: letters only."); return; }
      if (!ln || !NAME_RE.test(ln)) { toast.error("Last name: letters only."); return; }
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const fn = firstName.trim();
        const ln = lastName.trim();
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth?verified=1`,
            data: { first_name: fn, last_name: ln, display_name: fn, role },
          },
        });
        if (error) throw error;
        trackEvent("sign_up", { method: "email", role });
        if (data.user) {
          supabase.from("profiles").upsert({ id: data.user.id, role } as any, { onConflict: "id" }).then(() => {}, () => {});
        }
        if (!data.session) {
          toast.success(`Check your email, ${fn} — verify to activate your account.`);
          setMode("login");
          return;
        }
        if (data.user) {
          void scheduleOnboardingEmails({ userId: data.user.id, email: data.user.email ?? email, firstName: fn });
        }
        toast.success(`Welcome to SIA Smart Revision, ${fn}.`);
        navigate("/onboarding");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (/email.*not.*confirm|confirm.*email/i.test(error.message)) {
            throw new Error("Please verify your email first. Check your inbox.");
          }
          throw error;
        }
        const route = data.user ? await getPostAuthRoute(data.user.id) : "/dashboard";
        navigate(route);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Signed in → show a brief spinner while the effect above redirects to the portal.
  if (user && !authLoading) {
    return (
      <div className="min-h-dvh w-full flex items-center justify-center" style={{ background: "#fdf8f8" }}>
        <SEO title="Sign in — SIA Smart Revision" description="Access SIA Smart Revision." path="/auth" noindex />
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: RED }} />
      </div>
    );
  }

  return (
    <div className="min-h-dvh w-full grid lg:grid-cols-2" style={{ fontFamily: "'Source Sans 3','Inter',sans-serif" }}>
      <SEO
        title={mode === "signup" ? "Register — SIA Smart Revision" : "Sign in — SIA Smart Revision"}
        description="Access the official AI revision platform for Scholars International Academy."
        path="/auth"
        noindex
      />

      {/* ── Left: form ── */}
      <div className="relative flex flex-col px-6 py-10 sm:px-10 md:px-14 lg:px-16" style={{ background: "#fff" }}>
        <Link to="/" className="inline-flex w-fit items-center text-sm transition-colors" style={{ color: "#888" }}>
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Link>

        <div className="mt-8 flex items-center gap-3">
          <img src={SIA_LOGO} alt="SIA" className="h-10 w-10 rounded-full object-contain bg-white shadow-sm"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <div>
            <div className="font-bold text-sm leading-tight" style={{ fontFamily: "'Playfair Display',Georgia,serif", color: RED_DARK }}>
              Scholars International Academy
            </div>
            <div className="text-xs" style={{ color: "#888" }}>Smart Revision Platform</div>
          </div>
        </div>

        <div className="mx-auto mt-8 w-full max-w-md flex-1">

          {/* ── Demo buttons ── */}
          <div className="mb-7">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#bbb" }}>
              🎯 Try a demo
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              {(Object.keys(DEMO_META) as Role[]).map((r) => {
                const m = DEMO_META[r];
                const Icon = m.icon;
                const busy = demoLoading === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleDemo(r)}
                    disabled={!!demoLoading}
                    className="relative flex flex-col items-center gap-2 rounded-xl border-2 py-4 px-2 text-center transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ borderColor: m.color, background: `${m.color}08` }}
                  >
                    <div className="h-10 w-10 rounded-full flex items-center justify-center"
                      style={{ background: `${m.color}18` }}>
                      {busy
                        ? <Loader2 className="h-5 w-5 animate-spin" style={{ color: m.color }} />
                        : <Icon className="h-5 w-5" style={{ color: m.color }} />}
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-tight" style={{ color: m.color }}>{m.label}</div>
                      <div className="text-[10px] mt-0.5 leading-tight" style={{ color: "#999" }}>{m.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px flex-1" style={{ background: "#eee" }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#bbb" }}>or sign in</span>
            <span className="h-px flex-1" style={{ background: "#eee" }} />
          </div>

          {/* ── Role selector ── */}
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#888" }}>
              {mode === "signup" ? "I am a…" : "Signing in as"}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((r) => {
                const Icon = r.icon;
                const active = role === r.key;
                return (
                  <button key={r.key} type="button" onClick={() => setRole(r.key)}
                    className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-all text-sm font-semibold"
                    style={{ borderColor: active ? RED : "#e5e7eb", background: active ? RED : "#fff", color: active ? "#fff" : "#374151" }}>
                    <Icon className="h-5 w-5" />
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-5">
            <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'Playfair Display',Georgia,serif", color: RED_DARK }}>
              {mode === "signup" ? "Create your account" : "Welcome back"}
            </h1>
            <p className="mt-1 text-sm" style={{ color: "#888" }}>
              {mode === "signup" ? "Join the SIA revision platform" : "Sign in to your revision dashboard"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="first_name">First name</Label>
                  <Input id="first_name" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Ahmed" required maxLength={40} className="h-11" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="last_name">Last name</Label>
                  <Input id="last_name" value={lastName} onChange={(e) => setLastName(e.target.value)}
                    placeholder="Al-Rashidi" required maxLength={40} className="h-11" />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com" required autoComplete="email" className="h-11" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" required minLength={8}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  className="h-11 pr-10" />
                <button type="button" onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex h-11 w-10 items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading || !!demoLoading}
              className="h-12 w-full text-base font-semibold text-white" style={{ background: RED }}>
              {loading
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : mode === "signup" ? "Create account →" : "Sign in →"}
            </Button>
          </form>

          {mode === "signup" && (
            <p className="mt-4 text-center text-xs" style={{ color: "#aaa" }}>
              {role === "student" && "After signing up you'll confirm your Student ID, year group and section."}
              {role === "parent"  && "After signing up you'll link your child using their Student ID."}
              {role === "teacher" && "Teacher accounts can view all students' grades and progress."}
            </p>
          )}

          <p className="mt-6 text-center text-sm" style={{ color: "#888" }}>
            {mode === "signup" ? "Already have an account?" : "Need an account?"}{" "}
            <button type="button" onClick={() => setMode(mode === "signup" ? "login" : "signup")}
              className="font-semibold underline-offset-4 hover:underline" style={{ color: RED }}>
              {mode === "signup" ? "Sign in" : "Register"}
            </button>
          </p>

          <p className="mt-8 text-center text-xs" style={{ color: "#bbb" }}>
            Scholars International Academy · For SIA students, teachers &amp; parents only.
          </p>
        </div>
      </div>

      {/* ── Right: visual ── */}
      <div className="relative hidden overflow-hidden lg:block">
        <img src={HERO_IMAGE} alt="SIA students" className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${RED_DARK}f2 0%, ${RED}b3 100%)` }} />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <img src={SIA_LOGO} alt="SIA" className="h-12 w-12 rounded-full bg-white/10 object-contain p-1"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <div>
              <div className="font-bold text-white text-sm leading-tight" style={{ fontFamily: "'Playfair Display',Georgia,serif" }}>Scholars International Academy</div>
              <div className="text-xs text-white/60">Sharjah, UAE</div>
            </div>
          </div>
          <div>
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-white/50">SIA Smart Revision</div>
            <h2 className="text-4xl font-bold leading-tight text-white mb-4" style={{ fontFamily: "'Playfair Display',Georgia,serif" }}>
              AI-powered revision,<br /><span style={{ color: "#FFD7DD" }}>built for SIA.</span>
            </h2>
            <p className="text-white/75 text-base max-w-sm">Personalised roadmaps, instant mock marking, and AI-generated notes — aligned to your SIA syllabus.</p>
          </div>
          <div className="text-xs text-white/40">A High Quality British Education · 50 Years of Progressive Leadership</div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
