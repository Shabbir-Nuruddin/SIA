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

const SIA_LOGO = "https://sia.ae/wp-content/uploads/2022/03/cropped-sia-sub-logo-2-270x270.png";
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

const AuthPage = () => {
  const [params] = useSearchParams();
  const initialMode = params.get("mode") === "signup" ? "signup" : "login";
  const initialRole = (params.get("role") as Role) || "student";
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [role, setRole] = useState<Role>(["student", "teacher", "parent"].includes(initialRole) ? initialRole : "student");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading || !user) return;
    let cancelled = false;
    getPostAuthRoute(user.id).then((route) => { if (!cancelled) navigate(route, { replace: true }); });
    return () => { cancelled = true; };
  }, [authLoading, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

        // Best-effort: store role on the profile if the column exists. Never blocks signup.
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

  return (
    <div className="min-h-dvh w-full grid lg:grid-cols-2" style={{ fontFamily: "'Source Sans 3','Inter',sans-serif" }}>
      <SEO
        title={mode === "signup" ? "Register — SIA Smart Revision" : "Sign in — SIA Smart Revision"}
        description="Access the official AI revision platform for Scholars International Academy."
        path="/auth"
        noindex
      />

      {/* Left: form */}
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

        <div className="mx-auto mt-10 w-full max-w-md flex-1">
          {/* Role selector */}
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#888" }}>
              {mode === "signup" ? "I am a…" : "Sign in as"}
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

          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ fontFamily: "'Playfair Display',Georgia,serif", color: RED_DARK }}>
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
                  <Input id="first_name" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Ahmed" required maxLength={40} className="h-11" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="last_name">Last name</Label>
                  <Input id="last_name" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Al-Rashidi" required maxLength={40} className="h-11" />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required autoComplete="email" className="h-11" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" required minLength={8} autoComplete={mode === "signup" ? "new-password" : "current-password"} className="h-11 pr-10" />
                <button type="button" onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex h-11 w-10 items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="h-12 w-full text-base font-semibold text-white" style={{ background: RED }}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "signup" ? "Create account →" : "Sign in →"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: "#888" }}>
            {mode === "signup" ? "Already have an account?" : "Need an account?"}{" "}
            <button type="button" onClick={() => setMode(mode === "signup" ? "login" : "signup")}
              className="font-semibold underline-offset-4 hover:underline" style={{ color: RED }}>
              {mode === "signup" ? "Sign in" : "Register"}
            </button>
          </p>

          <p className="mt-8 text-center text-xs" style={{ color: "#aaa" }}>
            Scholars International Academy — For SIA students, teachers &amp; parents.
          </p>
        </div>
      </div>

      {/* Right: visual */}
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
