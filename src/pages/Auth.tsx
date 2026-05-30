import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApexLogo } from "@/components/ApexLogo";
import { getPostAuthRoute } from "@/lib/postAuthRoute";
import { toast } from "sonner";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { scheduleOnboardingEmails } from "@/lib/onboardingEmails";

const NAME_RE = /^[A-Za-z][A-Za-z'\- ]*$/;

const QUOTES = {
  login: {
    text: "Your comeback starts where your last session ended — sharpen the edge.",
    author: "MakeMeRevise",
  },
  signup: {
    text: "Build the revision engine your future self will thank you for.",
    author: "MakeMeRevise",
  },
};

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1400&q=80";

const AuthPage = () => {
  const [params] = useSearchParams();
  const initialMode = params.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
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
    getPostAuthRoute(user.id).then((route) => {
      if (!cancelled) navigate(route, { replace: true });
    });
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
            data: { first_name: fn, last_name: ln, display_name: fn },
          },
        });
        if (error) throw error;
        trackEvent("sign_up", { method: "email" });
        if (!data.session) {
          toast.success(`Check your email, ${fn} — verify to activate your account.`);
          setMode("login");
          return;
        }
        if (data.user) {
          void scheduleOnboardingEmails({
            userId: data.user.id,
            email: data.user.email ?? email,
            firstName: fn,
          });
        }
        toast.success(`Welcome to MMR, ${fn}. Let's set up your revision plan.`);
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
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    trackEvent("sign_in_attempt", { method: "google" });
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/auth?oauth=1` });
    if (result.error) {
      toast.error("Google sign-in failed");
      setLoading(false);
      return;
    }
    if (result.redirected) return;
    navigate("/dashboard");
  };

  const quote = mode === "signup" ? QUOTES.signup : QUOTES.login;

  return (
    <div className="min-h-dvh w-full bg-background text-foreground grid lg:grid-cols-2">
      {/* ── Left: form ─────────────────────────────────────────────── */}
      <div className="relative flex flex-col px-6 py-10 sm:px-10 md:px-14 lg:px-16">
        <Link
          to="/"
          className="inline-flex w-fit items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Link>

        <div className="mt-8 flex items-center gap-3">
          <ApexLogo size={36} />
          <span className="font-display text-lg font-semibold tracking-tight">MakeMeRevise</span>
        </div>

        <div className="mx-auto mt-12 w-full max-w-md flex-1">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {mode === "signup" ? "Start your grade comeback" : "Step back into focus"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {mode === "signup"
                ? "A sharper revision plan, ready in under a minute."
                : "Your plan is waiting — keep the momentum alive."}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={handleGoogle}
            className="h-11 w-full"
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24"><path fill="#EA4335" d="M5.3 9.6a6.7 6.7 0 0 1 12.7 0l3.3-3.3A11.5 11.5 0 0 0 12 .5C7.4.5 3.4 3.1 1.4 6.9z"/><path fill="#34A853" d="M12 23.5c3.1 0 5.7-1 7.6-2.8l-3.6-2.8c-1 .7-2.3 1.1-4 1.1a6.7 6.7 0 0 1-6.3-4.6L1.4 17.1A11.5 11.5 0 0 0 12 23.5z"/><path fill="#4A90E2" d="M23.5 12c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.6l3.6 2.8c2.1-2 3.3-4.9 3.3-8.6z"/><path fill="#FBBC05" d="M5.7 14.4A6.7 6.7 0 0 1 5.3 12c0-.8.1-1.6.4-2.4L1.4 6.9A11.5 11.5 0 0 0 .5 12c0 1.8.4 3.6 1 5.1z"/></svg>
            Continue with Google
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                Or continue with email
              </span>
            </div>
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
                    placeholder="Alex"
                    required
                    pattern="^[A-Za-z][A-Za-z'\- ]*$"
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
                    placeholder="Patel"
                    required
                    pattern="^[A-Za-z][A-Za-z'\- ]*$"
                    maxLength={40}
                    className="h-11"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@school.edu"
                required
                autoComplete="email"
                className="h-11"
              />
            </div>

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
                  className="absolute inset-y-0 right-0 flex h-11 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="flip"
              disabled={loading}
              className="h-12 w-full text-base"
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

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signup" ? "login" : "signup")}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {mode === "signup" ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>

      {/* ── Right: visual + quote ──────────────────────────────────── */}
      <div className="relative hidden overflow-hidden lg:block">
        <img
          src={HERO_IMAGE}
          alt="Student revising at a wooden desk surrounded by books"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, hsl(var(--primary) / 0.85) 0%, hsl(var(--background) / 0.92) 100%)",
          }}
        />
        <div className="absolute inset-0 grid-bg opacity-30" />

        <div className="relative flex h-full flex-col justify-between p-12 text-foreground">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-primary-foreground/80">
            <span className="h-px w-8 bg-primary-foreground/40" />
            A-Level revision, refined
          </div>

          <figure className="max-w-md">
            <blockquote className="font-display text-3xl font-semibold leading-tight tracking-tight text-primary-foreground sm:text-4xl">
              <span className="text-accent">"</span>
              {quote.text}
              <span className="text-accent">"</span>
            </blockquote>
            <figcaption className="mt-4 text-sm uppercase tracking-widest text-primary-foreground/70">
              — {quote.author}
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
