import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApexLogo } from "@/components/ApexLogo";
import { getPostAuthRoute } from "@/lib/postAuthRoute";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

const NAME_RE = /^[A-Za-z][A-Za-z'\- ]*$/;

const AuthPage = () => {
  const [params] = useSearchParams();
  const initialMode = params.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup") {
      const fn = firstName.trim();
      const ln = lastName.trim();
      if (!fn || !NAME_RE.test(fn)) {
        toast.error("First name: letters only.");
        return;
      }
      if (!ln || !NAME_RE.test(ln)) {
        toast.error("Last name: letters only.");
        return;
      }
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const fn = firstName.trim();
        const ln = lastName.trim();
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { first_name: fn, last_name: ln, display_name: fn },
          },
        });
        if (error) throw error;
        toast.success(`Welcome to Apex, ${fn}. Let's set up your revision plan.`);
        navigate("/diagnostic");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
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
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      toast.error("Google sign-in failed");
      setLoading(false);
      return;
    }
    if (result.redirected) return;
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 grid-bg" style={{ background: "var(--gradient-hero)" }}>
      <Link to="/" className="absolute top-6 left-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </Link>
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8"><ApexLogo size={40} /></div>
        <div className="glass-card rounded-2xl p-8 animate-in-up">
          <h1 className="text-3xl font-extrabold mb-2">{mode === "signup" ? "Start your revision" : "Welcome back"}</h1>
          <p className="text-muted-foreground mb-8">
            {mode === "signup" ? "Your exam isn't waiting. Let's go." : "Time to keep the streak alive."}
          </p>

          <Button onClick={handleGoogle} disabled={loading} variant="outline" className="w-full h-12 mb-4">
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24"><path fill="#EA4335" d="M5.3 9.6a6.7 6.7 0 0 1 12.7 0l3.3-3.3A11.5 11.5 0 0 0 12 .5C7.4.5 3.4 3.1 1.4 6.9z"/><path fill="#34A853" d="M12 23.5c3.1 0 5.7-1 7.6-2.8l-3.6-2.8c-1 .7-2.3 1.1-4 1.1a6.7 6.7 0 0 1-6.3-4.6L1.4 17.1A11.5 11.5 0 0 0 12 23.5z"/><path fill="#4A90E2" d="M23.5 12c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.6l3.6 2.8c2.1-2 3.3-4.9 3.3-8.6z"/><path fill="#FBBC05" d="M5.7 14.4A6.7 6.7 0 0 1 5.3 12c0-.8.1-1.6.4-2.4L1.4 6.9A11.5 11.5 0 0 0 .5 12c0 1.8.4 3.6 1 5.1z"/></svg>
            Continue with Google
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-card px-3 text-muted-foreground uppercase tracking-wider">or</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="first_name">First name</Label>
                  <Input id="first_name" value={firstName} onChange={e => setFirstName(e.target.value)}
                    placeholder="Alex" required pattern="^[A-Za-z][A-Za-z'\- ]*$"
                    title="Letters only" maxLength={40}
                    className="mt-1.5 h-11" />
                </div>
                <div>
                  <Label htmlFor="last_name">Last name</Label>
                  <Input id="last_name" value={lastName} onChange={e => setLastName(e.target.value)}
                    placeholder="Patel" required pattern="^[A-Za-z][A-Za-z'\- ]*$"
                    title="Letters only" maxLength={40}
                    className="mt-1.5 h-11" />
                </div>
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@school.edu" required className="mt-1.5 h-11" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={8} className="mt-1.5 h-11" />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-12 bg-primary hover:bg-primary/90 text-base font-semibold">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (mode === "signup" ? "Create account →" : "Sign in →")}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {mode === "signup" ? "Already with us?" : "New here?"}{" "}
            <button onClick={() => setMode(mode === "signup" ? "login" : "signup")} className="text-primary hover:underline font-medium">
              {mode === "signup" ? "Log in" : "Create account"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
