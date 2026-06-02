import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getPostAuthRoute } from "@/lib/postAuthRoute";
import { isStudentEmail, type UserRole } from "@/lib/auth/validators";
import { toast } from "sonner";
import { ArrowLeft, Eye, EyeOff, Loader2, GraduationCap, BookOpen, Users } from "lucide-react";
import { SEO } from "@/components/SEO";

const SCHOOL_NAME = import.meta.env.VITE_SCHOOL_NAME ?? "Scholars International Academy";
const SIA_LOGO = "https://sia.ae/wp-content/uploads/2022/03/cropped-sia-sub-logo-2-270x270.png";
const HERO_IMAGE = "https://sia.ae/wp-content/uploads/2022/03/BEN_6032.jpg";

const NAME_RE = /^[A-Za-z][A-Za-z'\- ]*$/;

type Mode = "login" | "signup";

const ROLE_CONFIG = {
  student: {
    icon: GraduationCap,
    label: "Student",
    color: "#1B2A4A",
    signupHint: "Use your SIA school email to register.",
    pendingMsg: null,
  },
  teacher: {
    icon: BookOpen,
    label: "Teacher",
    color: "#C9A84C",
    signupHint: "Teachers can register with any email. Your account will be reviewed by SIA administration.",
    pendingMsg:
      "Your teacher account request has been submitted. You'll be notified once approved by SIA administration.",
  },
  parent: {
    icon: Users,
    label: "Parent",
    color: "#2E7D32",
    signupHint: "Register with any email. You'll need your child's SIA school email to link their account.",
    pendingMsg:
      "Your parent account has been created. Once your child verifies the link, you'll have access to their progress.",
  },
} as const;

const AuthPage = () => {
  const [params] = useSearchParams();
  const initialMode: Mode = params.get("mode") === "signup" ? "signup" : "login";
  const initialRole = (params.get("role") as UserRole | null) ?? "student";

  const [mode, setMode] = useState<Mode>(initialMode);
  const [role, setRole] = useState<UserRole>(
    ["student", "teacher", "parent"].includes(initialRole) ? initialRole : "student"
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [childEmail, setChildEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading || !user) return;
    let cancelled = false;
    getPostAuthRoute(user.id).then((route) => {
      if (!cancelled) navigate(route, { replace: true });
    });
    return () => {
      cancelled = true;
    };
  }, [authLoading, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "signup") {
      const fn = firstName.trim();
      const ln = lastName.trim();
      if (!fn || !NAME_RE.test(fn)) { toast.error("First name: letters only."); return; }
      if (!ln || !NAME_RE.test(ln)) { toast.error("Last name: letters only."); return; }

      if (role === "student" && !isStudentEmail(email)) {
        toast.error("Only Scholars International Academy students can register as students.", {
          description: "Please use your SIA school email (e.g. name@sia.com).",
        });
        return;
      }

      if (role === "parent") {
        if (!childEmail.trim()) { toast.error("Please enter your child's SIA school email."); return; }
        if (!isStudentEmail(childEmail.trim())) {
          toast.error("Child email must be a valid SIA school email.", {
            description: "e.g. student.name@sia.com",
          });
          return;
        }
      }
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        const fn = firstName.trim();
        const ln = lastName.trim();

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth?verified=1`,
            data: { first_name: fn, last_name: ln, display_name: fn },
          },
        });
        if (error) throw error;

        const userId = data.user?.id;
        if (userId) {
          const approved = role === "student";
          await supabase.from("profiles").upsert(
            {
              id: userId,
              email,
              first_name: fn,
              last_name: ln,
              display_name: fn,
              role,
              approved,
              school_id: "SIA",
            },
            { onConflict: "id" }
          );

          if (role === "parent" && childEmail.trim()) {
            await supabase.from("parent_child_links").insert({
              parent_id: userId,
              child_email: childEmail.trim().toLowerCase(),
              verified: false,
            });
          }
        }

        if (!data.session) {
          toast.success(`Check your email, ${fn} — verify to activate your account.`);
          setMode("login");
          return;
        }

        const cfg = ROLE_CONFIG[role];
        if (cfg.pendingMsg) {
          toast.success(cfg.pendingMsg);
          navigate("/auth/pending-approval");
        } else {
          toast.success(`Welcome to SIA Smart Revision, ${fn}.`);
          navigate("/onboarding");
        }
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

  const cfg = ROLE_CONFIG[role];
  const RoleIcon = cfg.icon;

  return (
    <div
      className="min-h-dvh w-full grid lg:grid-cols-2"
      style={{ fontFamily: "'Source Sans 3', 'Inter', sans-serif" }}
    >
      <SEO
        title={`${mode === "signup" ? "Register" : "Sign In"} — SIA Smart Revision`}
        description="Access the official AI-powered revision platform for Scholars International Academy."
        path="/auth"
        noindex
      />

      {/* ── Left: form ─────────────────────────────────────────────── */}
      <div
        className="relative flex flex-col px-6 py-10 sm:px-10 md:px-14 lg:px-16"
        style={{ background: "#F7F7F5" }}
      >
        <Link
          to="/"
          className="inline-flex w-fit items-center text-sm transition-colors"
          style={{ color: "#6B7280" }}
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Link>

        {/* SIA Logo */}
        <div className="mt-8 flex items-center gap-3">
          <img
            src={SIA_LOGO}
            alt="SIA Logo"
            className="h-10 w-10 rounded-full object-contain bg-white shadow-sm"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <div>
            <div className="font-bold text-sm leading-tight" style={{ color: "#1B2A4A", fontFamily: "'Playfair Display', Georgia, serif" }}>
              {SCHOOL_NAME}
            </div>
            <div className="text-xs" style={{ color: "#6B7280" }}>Smart Revision Platform</div>
          </div>
        </div>

        <div className="mx-auto mt-10 w-full max-w-md flex-1">
          {/* Role tabs — only show on signup */}
          {mode === "signup" && (
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#6B7280" }}>
                I am a…
              </p>
              <div className="grid grid-cols-3 gap-2">
                {(["student", "teacher", "parent"] as UserRole[]).map((r) => {
                  const rc = ROLE_CONFIG[r];
                  const Icon = rc.icon;
                  const active = role === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-all text-sm font-semibold"
                      style={{
                        borderColor: active ? "#1B2A4A" : "#E5E7EB",
                        background: active ? "#1B2A4A" : "#fff",
                        color: active ? "#fff" : "#374151",
                      }}
                    >
                      <Icon className="h-5 w-5" />
                      {rc.label}
                    </button>
                  );
                })}
              </div>
              {cfg.signupHint && (
                <p className="mt-2 text-xs rounded-lg px-3 py-2" style={{ background: "#EEF2FF", color: "#1B2A4A" }}>
                  {cfg.signupHint}
                </p>
              )}
            </div>
          )}

          <div className="mb-6">
            <h1
              className="text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#1B2A4A" }}
            >
              {mode === "signup" ? "Create your account" : "Welcome back"}
            </h1>
            <p className="mt-1 text-sm" style={{ color: "#6B7280" }}>
              {mode === "signup"
                ? `Join ${SCHOOL_NAME}'s revision platform`
                : "Sign in to access your revision dashboard"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="first_name">First name</Label>
                  <Input
                    id="first_name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Ahmed"
                    required
                    maxLength={40}
                    className="h-11"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="last_name">Last name</Label>
                  <Input
                    id="last_name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Al-Rashidi"
                    required
                    maxLength={40}
                    className="h-11"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">
                {role === "student" && mode === "signup" ? "SIA School Email" : "Email"}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === "student" ? "name@sia.com" : "your@email.com"}
                required
                autoComplete="email"
                className="h-11"
              />
            </div>

            {mode === "signup" && role === "parent" && (
              <div className="space-y-1.5">
                <Label htmlFor="child_email">Child's SIA School Email</Label>
                <Input
                  id="child_email"
                  type="email"
                  value={childEmail}
                  onChange={(e) => setChildEmail(e.target.value)}
                  placeholder="child.name@sia.com"
                  required
                  className="h-11"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex h-11 w-10 items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-12 w-full text-base font-semibold"
              style={{ background: "#1B2A4A", color: "#fff" }}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : mode === "signup" ? (
                "Create account →"
              ) : (
                "Sign in →"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: "#6B7280" }}>
            {mode === "signup" ? "Already have an account?" : "Need an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signup" ? "login" : "signup")}
              className="font-semibold underline-offset-4 hover:underline"
              style={{ color: "#1B2A4A" }}
            >
              {mode === "signup" ? "Sign in" : "Register"}
            </button>
          </p>

          <p className="mt-8 text-center text-xs" style={{ color: "#9CA3AF" }}>
            Scholars International Academy — For SIA students, teachers &amp; parents only.
          </p>
        </div>
      </div>

      {/* ── Right: SIA visual ──────────────────────────────────────── */}
      <div className="relative hidden overflow-hidden lg:block">
        <img
          src={HERO_IMAGE}
          alt="Scholars International Academy students"
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
          width={1400}
          height={933}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(27,42,74,0.88) 0%, rgba(27,42,74,0.65) 100%)" }}
        />

        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <img
              src={SIA_LOGO}
              alt="SIA"
              className="h-12 w-12 rounded-full bg-white/10 object-contain p-1"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <div>
              <div className="font-bold text-white text-sm leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                {SCHOOL_NAME}
              </div>
              <div className="text-xs text-white/60">Sharjah, UAE</div>
            </div>
          </div>

          <div>
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-white/50">
              SIA Smart Revision
            </div>
            <h2
              className="text-4xl font-bold leading-tight text-white mb-4"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              AI-powered revision.<br />
              <span style={{ color: "#C9A84C" }}>Built exclusively</span><br />
              for SIA students.
            </h2>
            <p className="text-white/70 text-base max-w-sm">
              Personalised roadmaps, instant mock marking, and AI-generated notes — all aligned to your SIA syllabus.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { label: "AI Notes", icon: "📚" },
                { label: "Mock Papers", icon: "📝" },
                { label: "Progress Tracking", icon: "📊" },
              ].map((f) => (
                <div key={f.label} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.1)" }}>
                  <div className="text-2xl mb-1">{f.icon}</div>
                  <div className="text-xs font-semibold text-white/80">{f.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-white/40">
            A High Quality British Education · 50 Years of Progressive Leadership
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
