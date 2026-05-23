import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home, Calendar, Zap, FileText, BookOpen, Link as LinkIcon,
  MessageCircle, Settings, LogOut, Flame, GraduationCap, Sparkles, Menu,
  MessageSquare, Lock, Headphones, Compass, Shield, Star,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { SUBJECTS, SubjectCode } from "@/lib/subjects";
import { isAdminEmail, useTestMode } from "@/lib/admin";

const items: { to: string; icon: any; label: string; color: string; proOnly?: boolean; adminOnly?: boolean }[] = [
  { to: "/dashboard",   icon: Home,         label: "Today's Plan",     color: "265 75% 62%" },
  { to: "/roadmap",     icon: Calendar,     label: "Roadmap",          color: "205 85% 58%", adminOnly: true },
  { to: "/exams",       icon: GraduationCap,label: "Exams",            color: "340 80% 62%" },
  { to: "/questions",   icon: Zap,          label: "Topical Questions",color: "28 95% 58%"  },
  { to: "/mock-papers", icon: FileText,     label: "Mock Papers",      color: "178 65% 48%", adminOnly: true },
  { to: "/notes",       icon: BookOpen,     label: "Notes",            color: "265 75% 62%" },
  { to: "/podcast",     icon: Headphones,   label: "Podcast",          color: "325 80% 62%", adminOnly: true },
  { to: "/papers",      icon: LinkIcon,     label: "Past Papers",      color: "205 85% 58%" },
  { to: "/faq",         icon: MessageCircle,label: "Exam FAQs",        color: "178 65% 48%", adminOnly: true },
  { to: "/feedback",    icon: MessageSquare,label: "Feedback",         color: "28 95% 58%"  },
  { to: "/pricing",     icon: Sparkles,     label: "Plans",            color: "340 80% 62%" },
  { to: "/settings",    icon: Settings,     label: "Settings",         color: "215 14% 50%" },
  { to: "/admin",       icon: Shield,       label: "Admin Panel",      color: "0 75% 55%", adminOnly: true },
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
}

const SidebarBody = ({ onNavigate }: { onNavigate?: () => void }) => {
  const { signOut, user } = useAuth();
  const { pathname } = useLocation();
  const [testMode] = useTestMode();
  const isAdmin = (user?.email || "").toLowerCase() === ADMIN_EMAIL && !testMode;
  const { isPro } = useSubscription();
  const [profile, setProfile] = useState<ProfileLite | null>(null);
  const [subjects, setSubjects] = useState<SubjectCode[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("first_name,last_name,current_streak,exam_board").eq("id", user.id).single()
      .then(({ data }) => { if (data) setProfile(data as any); });
    supabase.from("user_subjects").select("subject").eq("user_id", user.id)
      .then(({ data }) => {
        if (data) setSubjects(Array.from(new Set((data as any[]).map(d => d.subject))) as SubjectCode[]);
      });
  }, [user]);

  const first = profile?.first_name || "Student";
  const last = profile?.last_name || "";
  const initials = `${(first[0] || "S")}${(last[0] || "")}`.toUpperCase();
  const board = (profile?.exam_board || "edexcel").toUpperCase();

  return (
    <div className="flex h-full flex-col p-3 warm-gradient-soft">
      {/* Logo */}
      <div className="px-2 pt-3 pb-5">
        <div className="font-display text-3xl leading-none warm-gradient-text font-bold tracking-tight">
          MakeMeRevise
        </div>
        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mt-1">
          Study smarter ✨
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        {items.map(it => {
          if (it.adminOnly && !isAdmin) return null;
          const active = pathname === it.to || (it.to !== "/dashboard" && pathname.startsWith(it.to));
          const tutorialKey =
            it.to === "/roadmap" ? "nav-roadmap" :
            it.to === "/notes" ? "nav-notes" :
            it.to === "/mock-papers" ? "nav-mocks" :
            it.to === "/questions" ? "nav-questions" :
            it.to === "/feedback" ? "nav-feedback" : undefined;
          const locked = it.proOnly && !isPro;
          return (
            <NavLink
              key={it.to}
              to={it.to}
              onClick={onNavigate}
              {...(tutorialKey ? { "data-tutorial": tutorialKey } : {})}
              className={`pill-nav ${active ? "pill-nav-active font-semibold" : "text-sidebar-foreground hover:bg-sidebar-accent/60"} ${locked ? "opacity-70" : ""}`}
              title={locked ? "Pro feature — start your 3-day free trial to unlock." : undefined}
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
              {locked && (
                <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-primary/15 text-primary">
                  <Lock className="h-2.5 w-2.5" /> Pro
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Clarity Compass — admin-only preview */}
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

      {/* Profile */}
      <div className="mt-1 pt-3 border-t border-sidebar-border/60 space-y-2">
        <div className="px-1 flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0"
            style={{ backgroundImage: "linear-gradient(135deg, hsl(265 75% 62%), hsl(325 80% 65%))" }}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-display text-lg leading-none truncate text-foreground">{first} {last}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="chip chip-amber !py-0 !text-[10px]">
                <Flame className="h-2.5 w-2.5" />{profile?.current_streak ?? 0}
              </span>
              <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">{board}</span>
            </div>
          </div>
        </div>
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
        <Button variant="ghost" onClick={signOut} className="w-full justify-start text-muted-foreground h-8 text-xs px-2 rounded-full">
          <LogOut className="h-3.5 w-3.5 mr-2" />Sign out
        </Button>
      </div>
    </div>
  );
};

export const AppSidebar = () => {
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

      <aside
        className="hidden lg:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar sticky self-start"
        style={{ top: 0, height: "100vh" }}
      >
        <SidebarBody />
      </aside>
    </>
  );
};
