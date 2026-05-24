import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home, Calendar, Zap, FileText, BookOpen, Link as LinkIcon,
  MessageCircle, Settings, LogOut, Flame, GraduationCap, Sparkles, Menu,
  MessageSquare, Lock, Headphones, Compass, Shield, Star,
  PanelLeftClose, PanelLeftOpen, PanelLeft, X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { SUBJECTS, SubjectCode } from "@/lib/subjects";
import { isAdminEmail, useTestMode } from "@/lib/admin";
import { useSidebarMode } from "@/lib/sidebarMode";

const items: { to: string; icon: any; label: string; color: string; proOnly?: boolean; adminOnly?: boolean }[] = [
  { to: "/dashboard",   icon: Home,         label: "Today's Plan",     color: "160 65% 50%" },
  { to: "/roadmap",     icon: Calendar,     label: "Roadmap",          color: "43 80% 60%", adminOnly: true },
  { to: "/exams",       icon: GraduationCap,label: "Exams",            color: "12 70% 60%" },
  { to: "/questions",   icon: Zap,          label: "Topical Questions",color: "43 80% 60%"  },
  { to: "/mock-papers", icon: FileText,     label: "Mock Papers",      color: "160 60% 50%", adminOnly: true },
  { to: "/notes",       icon: BookOpen,     label: "Notes",            color: "200 70% 60%" },
  { to: "/podcast",     icon: Headphones,   label: "Podcast",          color: "280 55% 65%", adminOnly: true },
  { to: "/papers",      icon: LinkIcon,     label: "Past Papers",      color: "200 70% 60%" },
  { to: "/faq",         icon: MessageCircle,label: "Exam FAQs",        color: "160 60% 50%", adminOnly: true },
  { to: "/feedback",    icon: MessageSquare,label: "Feedback",         color: "43 80% 60%"  },
  { to: "/pricing",     icon: Sparkles,     label: "Plans",            color: "43 80% 60%" },
  { to: "/settings",    icon: Settings,     label: "Settings",         color: "160 8% 60%" },
  { to: "/admin",       icon: Shield,       label: "Admin Panel",      color: "12 70% 60%", adminOnly: true },
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

const SidebarBody = ({ onNavigate, rail = false }: { onNavigate?: () => void; rail?: boolean }) => {
  const { signOut, user } = useAuth();
  const { pathname } = useLocation();
  const [testMode] = useTestMode();
  const isAdmin = isAdminEmail(user?.email) && !testMode;
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
    <div className="flex h-full flex-col p-2.5">
      {/* Logo */}
      <div className={`px-2 pt-3 pb-5 ${rail ? "text-center" : ""}`}>
        {rail ? (
          <div className="h-9 w-9 mx-auto rounded-xl flex items-center justify-center font-display text-base font-bold warm-gradient text-background shadow-md">M</div>
        ) : (
          <>
            <div className="font-display text-2xl leading-none warm-gradient-text font-bold tracking-tight">
              MakeMeRevise
            </div>
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground mt-1.5">
              Study smarter ✦
            </div>
          </>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        {items.map(it => {
          if (it.adminOnly && !isAdmin) return null;
          const active = pathname === it.to || (it.to !== "/dashboard" && pathname.startsWith(it.to));
          const locked = it.proOnly && !isPro;
          const tutorialKey =
            it.to === "/roadmap" ? "nav-roadmap" :
            it.to === "/notes" ? "nav-notes" :
            it.to === "/mock-papers" ? "nav-mocks" :
            it.to === "/questions" ? "nav-questions" :
            it.to === "/feedback" ? "nav-feedback" : undefined;

          const inner = (
            <NavLink
              key={it.to}
              to={it.to}
              onClick={onNavigate}
              {...(tutorialKey ? { "data-tutorial": tutorialKey } : {})}
              className={`pill-nav ${active ? "pill-nav-active font-semibold" : "text-sidebar-foreground hover:bg-sidebar-accent/80"} ${locked ? "opacity-70" : ""} ${rail ? "justify-center !px-0 !py-2.5" : ""}`}
              title={rail ? it.label : undefined}
            >
              <span
                className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                style={
                  active
                    ? { background: "hsl(43 70% 58% / 0.18)", color: "hsl(43 80% 70%)" }
                    : { background: `hsl(${it.color} / 0.12)`, color: `hsl(${it.color})` }
                }
              >
                <it.icon className="h-4 w-4" />
              </span>
              {!rail && (
                <>
                  <span className="flex-1 text-[13px]">{it.label}</span>
                  {locked && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-accent/15 gold-text">
                      <Lock className="h-2.5 w-2.5" /> Pro
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );

          if (rail) {
            return (
              <Tooltip key={it.to} delayDuration={100}>
                <TooltipTrigger asChild>{inner}</TooltipTrigger>
                <TooltipContent side="right" className="text-xs">{it.label}</TooltipContent>
              </Tooltip>
            );
          }
          return inner;
        })}
      </nav>

      {isAdmin && !rail && (
        <div className="px-1 pb-3 pt-2">
          <NavLink
            to="/clarity-compass"
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                isActive
                  ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 shadow-lg shadow-amber-400/30"
                  : "border border-amber-400/30 bg-amber-500/5 hover:bg-amber-500/10 gold-text"
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

      <div className="mt-1 pt-3 border-t border-sidebar-border/60 space-y-2">
        {!rail ? (
          <>
            <div className="px-1 flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center text-primary-foreground font-bold text-sm shadow-md shrink-0"
                style={{ backgroundImage: "linear-gradient(135deg, hsl(160 65% 35%), hsl(43 70% 55%))" }}
              >
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-display text-base leading-none truncate text-foreground">{first} {last}</div>
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
                  style={{ background: `${subjectMeta[s].color.replace(')', ' / 0.15)')}`, color: subjectMeta[s].color }}
                >
                  <span>{subjectMeta[s].emoji}</span>
                  <span>{SUBJECTS[s].name}</span>
                </span>
              ))}
            </div>
            <Button variant="ghost" onClick={signOut} className="w-full justify-start text-muted-foreground h-8 text-xs px-2 rounded-lg">
              <LogOut className="h-3.5 w-3.5 mr-2" />Sign out
            </Button>
          </>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={signOut} className="mx-auto h-9 w-9">
                <LogOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Sign out</TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export const SidebarToggle = ({ className = "" }: { className?: string }) => {
  const { mode, setMode } = useSidebarMode();
  return (
    <div className={`hidden lg:flex items-center gap-1 ${className}`}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            aria-label={mode === "expanded" ? "Collapse to icons" : mode === "rail" ? "Hide sidebar" : "Show sidebar"}
            onClick={() => setMode(mode === "expanded" ? "rail" : mode === "rail" ? "hidden" : "expanded")}
            className="h-9 w-9 rounded-xl bg-card/80 hover:bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors backdrop-blur"
          >
            {mode === "expanded" ? <PanelLeftClose className="h-4 w-4" /> : mode === "rail" ? <X className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          {mode === "expanded" ? "Collapse → icon rail" : mode === "rail" ? "Hide sidebar" : "Show sidebar"}
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export const AppSidebar = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { mode, setMode } = useSidebarMode();

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      {/* Mobile sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            aria-label="Open menu"
            className="lg:hidden fixed top-2 left-2 z-50 h-10 w-10 rounded-xl bg-card/95 border border-border backdrop-blur flex items-center justify-center shadow-md hover:bg-secondary transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[280px] bg-sidebar border-r border-sidebar-border">
          <SidebarBody onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Floating reopen trigger when hidden on desktop */}
      {mode === "hidden" && (
        <button
          aria-label="Show sidebar"
          onClick={() => setMode("expanded")}
          className="hidden lg:flex fixed top-3 left-3 z-40 h-10 w-10 rounded-xl bg-card/90 border border-border backdrop-blur items-center justify-center shadow-lg hover:bg-card transition-all text-foreground"
        >
          <PanelLeft className="h-4 w-4" />
        </button>
      )}

      {/* Desktop sidebar */}
      {mode !== "hidden" && (
        <aside
          className={`hidden lg:flex shrink-0 flex-col border-r border-sidebar-border bg-sidebar/95 backdrop-blur sticky self-start transition-[width] duration-300 ${mode === "rail" ? "w-[68px]" : "w-64"}`}
          style={{ top: 0, height: "100vh" }}
        >
          <SidebarBody rail={mode === "rail"} />
        </aside>
      )}
    </>
  );
};
