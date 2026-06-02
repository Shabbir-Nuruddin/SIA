import { ReactNode } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Loader2, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useMyRole, SiaRole } from "@/lib/useMyRole";

const SIA_LOGO = "https://sia.ae/wp-content/uploads/2022/03/cropped-sia-sub-logo-2-270x270.png";
const RED = "#C8102E";
const RED_DARK = "#7A0A1C";

/**
 * Page wrapper for the parent & teacher portals. Provides a branded top bar,
 * sign-out, and a role guard. Students who land here are bounced to /dashboard.
 */
export function RoleShell({
  role,
  title,
  subtitle,
  children,
}: {
  role: SiaRole;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { profile, loading } = useMyRole();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#fdf8f8" }}>
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: RED }} />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  // Wrong role → send them to where they belong.
  if (profile && profile.role !== role) {
    const dest = profile.role === "teacher" ? "/teacher" : profile.role === "parent" ? "/parent" : "/dashboard";
    return <Navigate to={dest} replace />;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen" style={{ background: "#fdf8f8", fontFamily: "'Source Sans 3','Inter',sans-serif" }}>
      <header className="sticky top-0 z-40 backdrop-blur-md border-b" style={{ background: "rgba(255,255,255,0.95)", borderColor: "#e8d4d7" }}>
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={SIA_LOGO} alt="SIA" className="h-10 w-10 rounded-full object-contain bg-white shadow-sm"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <div>
              <div className="font-bold text-sm leading-tight" style={{ fontFamily: "'Playfair Display',Georgia,serif", color: RED_DARK }}>
                SIA Smart Revision
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "#999" }}>
                {role === "teacher" ? "Teacher Portal" : "Parent Portal"}
              </div>
            </div>
          </div>
          <button onClick={handleSignOut}
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full transition-colors hover:bg-red-50"
            style={{ color: RED_DARK }}>
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: "'Playfair Display',Georgia,serif", color: RED_DARK }}>
            {title}
          </h1>
          {subtitle && <p className="mt-1 text-sm" style={{ color: "#777" }}>{subtitle}</p>}
        </div>
        {children}
      </main>
    </div>
  );
}

export { RED, RED_DARK };
