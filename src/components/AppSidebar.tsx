import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home, Calendar, Zap, FileText, BookOpen, Link as LinkIcon,
  MessageCircle, Settings, LogOut, Flame, GraduationCap, Menu,
  MessageSquare, Compass, Shield, Star, TrendingUp, Users, BarChart2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { PrestigeBadge } from "@/components/game/PrestigeBadge";
import { supabase } from "@/integrations/supabase/client";
import { SUBJECTS, SubjectCode } from "@/lib/subjects";
import { ADMIN_EMAIL, useTestMode } from "@/lib/admin";

const SIA_LOGO = "https://sia.ae/wp-content/uploads/2022/03/cropped-sia-sub-logo-2-270x270.png";
const SCHOOL_SHORT = import.meta.env.VITE_SCHOOL_SHORT ?? "SIA";
const SCHOOL_NAME = import.meta.env.VITE_SCHOOL_NAME ?? "Scholars International Academy";

const STUDENT_ITEMS: { to: string; icon: any; label: string; color: string; adminOnly?: boolean }[] = [
  { to: "/dashboard",   icon: Home,          label: "Today's Plan",      color: "215 60% 35%" },
  { to: "/roadmap",     icon: Calendar,      label: "Roadmap",           color: "205 85% 40%", adminOnly: true },
  { to: "/exams",       icon: GraduationCap, label: "Exams",             color: "340 70% 45%" },
  { to: "/progress",    icon: TrendingUp,    label: "Progress",          color: "160 60% 35%" },
  { to: "/questions",   icon: Zap,           label: "Topical Questions", color: "28 80% 45%"  },
  { to: "/mock-papers", icon: FileText,      label: "Mock Papers",       color: "178 55% 38%", adminOnly: true },
  { to: "/notes",       icon: BookOpen,      label: "Notes",             color: "265 65% 45%" },
  { to: "/papers",      icon: LinkIcon,      label: "Past Papers",       color: "205 85% 40%" },
  { to: "/faq",         icon: MessageCircle, label: "Exam FAQs",         color: "178 55% 38%", adminOnly: true },
  { to: "/feedback",    icon: MessageSquare, label: "Feedback",          color: "28 80% 45%"  },
  { to: "/settings",    icon: Settings,      label: "Settings",          color: "215 14% 45%" },
  { to: "/admin",       icon: Shield,        label: "Admin Panel",       color: "0 65% 45%", adminOnly: true },
];

const subjectMeta: Record<SubjectCode, { emoji: string; color: string }> = {
  mathematics: { emoji: "📐", color: "hsl(var(--subject-maths))" },
  biology:     { emoji: "🧬", color: "hsl(var(--subject-biology))" },
  chemistry:   { emoji: "🧪", color: "hsl(var(--subject-chemistry))" },
  physics:     { emoji: "⚡", color: "hsl(var(--subject-physics))" },
};

interface ProfileLite {
  first_name: string | null;
  last_name: string | null;
  current_streak: number;
  exam_board: string | null;
  role?: string;
}

const SidebarBody = ({ onNavigate, onClose }: { onNavigate?: () => void; onClose?: () => void }) => {
  const { signOut, user, profile } = useAuth();
  const { pathname } = useLocation();
  const [testMode] = useTestMode();
  const isAdmin = (user?.email || "").toLowerCase() === ADMIN_EMAIL && !testMode;
  const [profileLite, setProfileLite] = useState<ProfileLite | null>(null);
  const [subjects, setSubjects] = useState<SubjectCode[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("first_name,last_name,current_streak,exam_board,role").eq("id", user.id).single()
      .then(({ data }) => { if (data) setProfileLite(data as any); });
    supabase.from("user_subjects").select("subject").eq("user_id", user.id)
      .then(({ data }) => {
        if (data) setSubjects(Array.from(new Set((data as any[]).map(d => d.subject))) as SubjectCode[]);
      });
  }, [user]);

  const role = profile?.role ?? profileLite?.role ?? "student";
  const isTeacher = role === "teacher";
  const isParent = role === "parent";

  const first = profileLite?.first_name || profile?.first_name || "User";
  const last = profileLite?.last_name || profile?.last_name || "";
  const initials = `${(first[0] || "S")}${(last[0] || "")}`.toUpperCase();
  const board = (profileLite?.exam_board || "").toUpperCase();

  const roleBadge = isTeacher ? "Teacher" : isParent ? "Parent" : "Student";
  const roleBadgeColor = isTeacher ? "#C9A84C" : isParent ? "#2E7D32" : "#1B2A4A";

  return (
    <div className="flex h-full flex-col p-3" style={{ background: "hsl(var(--sidebar-background))" }}>
      {/* SIA Logo + name */}
      <div className="px-2 pt-3 pb-5 shrink-0 flex items-start justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={SIA_LOGO}
            alt="SIA"
            className="h-9 w-9 rounded-full shrink-0 bg-white/10 object-contain"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <div className="min-w-0">
            <div
              className="font-bold text-sm leading-tight truncate"
              style={{ color: "hsl(var(--sidebar-foreground))", fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {SCHOOL_SHORT} Smart Revision
            </div>
            <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground mt-0.5 truncate">
              {SCHOOL_NAME}
            </div>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-sidebar-accent/60 transition-colors mt-1 shrink-0"
            aria-label="Collapse sidebar"
          >
            <Menu className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Role-specific quick links */}
      {(isTeacher || isParent) && (
        <div className="px-1 pb-3">
          <NavLink
            to={isTeacher ? "/dashboard/teacher" : "/dashboard/parent"}
            onClick={onNavigate}
            className={({ isActive }) =>
              `pill-nav ${isActive ? "pill-nav-active font-semibold" : "text-sidebar-foreground hover:bg-sidebar-accent/60"}`
            }
          >
            <span
              className="h-7 w-7 rounded-full flex items-center justify-center shrink-0"
              style={{ background: `${roleBadgeColor}22`, color: roleBadgeColor }}
            >
              {isTeacher ? <BarChart2 className="h-3.5 w-3.5" /> : <Users className="h-3.5 w-3.5" />}
            </span>
            <span className="flex-1 text-[13px]">{isTeacher ? "Teacher Dashboard" : "Parent Dashboard"}</span>
          </NavLink>
        </div>
      )}

      <nav className="flex-1 min-h-0 space-y-1 overflow-y-auto pr-1">
        {STUDENT_ITEMS.map(it => {
          if (it.adminOnly && !isAdmin) return null;
          const active = pathname === it.to || (it.to !== "/dashboard" && pathname.startsWith(it.to));
          return (
            <NavLink
              key={it.to}
              to={it.to}
              onClick={onNavigate}
              className={`pill-nav ${active ? "pill-nav-active font-semibold" : "text-sidebar-foreground hover:bg-sidebar-accent/60"}`}
            >
              <span
                className="h-7 w-7 rounded-full flex items-center justify-center shrink-0"
                style={
                  active
                    ? { background: "rgba(255,255,255,0.22)" }
                    : { background: `hsl(${it.color} / 0.18)`, color: `hsl(${it.color})` }
                }
              >
                <it.icon className="h-3.5 w-3.5" />
              </span>
              <span className="flex-1 text-[13px]">{it.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Clarity Compass — admin-only */}
      {isAdmin && (
        <div className="px-1 pb-3 pt-2">
          <NavLink
            to="/clarity-compass"
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all ${
                isActive
                  ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 shadow-lg shadow-amber-400/30"
                  : "border border-amber-400/40 bg-amber-50/40 hover:bg-amber-100/60 text-amber-900 dark:text-amber-200 dark:bg-amber-500/10"
              }`
            }
          >
            <Star className="h-4 w-4 shrink-0 fill-current" />
            <div className="flex-1">
              <div className="font-semibold text-[12px] flex items-center gap-1">Clarity Compass <Compass className="h-3 w-3" /></div>
              <div className="text-[10px] opacity-80 leading-tight">Discover your career path</div>
            </div>
          </NavLink>
        </div>
      )}

      {/* Profile footer */}
      <div className="mt-1 pt-3 border-t border-sidebar-border/60 space-y-2 shrink-0">
        <div className="px-1 flex items-center gap-3">
          <div
            className="relative h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0"
            style={{ background: `linear-gradient(135deg, ${roleBadgeColor}cc, ${roleBadgeColor})` }}
          >
            {initials}
            <PrestigeBadge className="absolute -bottom-1 -right-1" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-display text-base leading-none truncate text-foreground">{first} {last}</div>
            <div className="flex items-center gap-2 mt-1">
              {!isTeacher && !isParent && (
                <span className="chip chip-amber !py-0 !text-[10px]">
                  <Flame className="h-2.5 w-2.5" />{profileLite?.current_streak ?? 0}
                </span>
              )}
              <span
                className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                style={{ background: `${roleBadgeColor}22`, color: roleBadgeColor }}
              >
                {roleBadge}
              </span>
              {board && <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">{board}</span>}
            </div>
          </div>
        </div>

        {subjects.length > 0 && !isTeacher && !isParent && (
          <div className="px-1 flex items-center gap-1.5 flex-wrap">
            {subjects.map(s => (
              <span
                key={s}
                title={SUBJECTS[s].name}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                style={{ background: `${subjectMeta[s].color.replace('hsl(', 'hsl(').replace(')', ' / 0.15)')}`, color: subjectMeta[s].color }}
              >
                <span>{subjectMeta[s].emoji}</span>
                <span>{SUBJECTS[s].name}</span>
              </span>
            ))}
          </div>
        )}

        <Button variant="ghost" onClick={signOut} className="w-full justify-start text-muted-foreground h-8 text-xs px-2 rounded-full">
          <LogOut className="h-3.5 w-3.5 mr-2" />Sign out
        </Button>
      </div>
    </div>
  );
};

export const AppSidebar = ({ visible = true, onClose, onOpen }: { visible?: boolean; onClose?: () => void; onOpen?: () => void }) => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            aria-label="Open menu"
            className="lg:hidden fixed top-2 left-2 z-50 h-10 w-10 rounded-full bg-card/95 border border-border backdrop-blur flex items-center justify-center shadow-md hover:bg-secondary transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[280px] bg-sidebar border-r border-sidebar-border">
          <SidebarBody onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      {visible ? (
        <aside
          className="hidden lg:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar sticky self-start overflow-hidden pt-11"
          style={{ top: 0, height: "100dvh" }}
        >
          <div className="flex-1 min-h-0 overflow-hidden">
            <SidebarBody onClose={onClose} />
          </div>
        </aside>
      ) : (
        <button
          onClick={onOpen}
          className="hidden lg:flex fixed top-[52px] left-4 z-40 h-10 w-10 rounded-full bg-card border border-border text-sidebar-foreground shadow-lg hover:bg-secondary transition-colors items-center justify-center"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}
    </>
  );
};
