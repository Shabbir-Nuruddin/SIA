import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home, Calendar, Zap, FileText, BookOpen, Link as LinkIcon,
  MessageCircle, Settings, LogOut, Flame, GraduationCap
} from "lucide-react";
import { ApexLogo } from "@/components/ApexLogo";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { SUBJECTS, SubjectCode } from "@/lib/subjects";

const items = [
  { to: "/dashboard", icon: Home, label: "Today's Plan" },
  { to: "/roadmap", icon: Calendar, label: "Roadmap" },
  { to: "/exams", icon: GraduationCap, label: "Exams" },
  { to: "/questions", icon: Zap, label: "Topical Questions" },
  { to: "/mock-papers", icon: FileText, label: "Mock Papers" },
  { to: "/notes", icon: BookOpen, label: "Notes" },
  { to: "/papers", icon: LinkIcon, label: "Past Papers" },
  { to: "/faq", icon: MessageCircle, label: "Exam FAQs" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

const subjectColor: Record<SubjectCode, string> = {
  mathematics: "hsl(var(--subject-maths))",
  biology: "hsl(var(--subject-biology))",
  chemistry: "hsl(var(--subject-chemistry))",
  physics: "hsl(var(--subject-physics))",
};

export const AppSidebar = () => {
  const { signOut, user } = useAuth();
  const { pathname } = useLocation();
  const [profile, setProfile] = useState<{ first_name: string | null; last_name: string | null; current_streak: number; exam_board: string | null } | null>(null);
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
  const board = (profile?.exam_board || "edexcel").toUpperCase();

  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-3 sticky self-start" style={{ top: 52, height: "calc(100vh - 52px)" }}>
      <div className="px-2 py-3 mb-4"><ApexLogo /></div>

      <nav className="flex-1 space-y-0.5">
        {items.map(it => {
          const active = pathname === it.to || (it.to !== "/dashboard" && pathname.startsWith(it.to));
          return (
            <NavLink key={it.to} to={it.to}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-[13px] transition-colors ${active
                ? "bg-primary/15 text-primary font-semibold"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"}`}>
              <it.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{it.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-3 pt-3 border-t border-sidebar-border space-y-2">
        <div className="px-2">
          <div className="text-sm font-semibold text-foreground truncate">{first} {last}</div>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
            <Flame className="h-3 w-3 text-primary" />
            <span className="font-mono tabular">{profile?.current_streak ?? 0} day streak</span>
          </div>
          <div className="mt-2 flex items-center gap-1 flex-wrap">
            <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground mr-1">{board}</span>
            {subjects.map(s => (
              <span key={s} title={SUBJECTS[s].name} className="h-1.5 w-1.5 rounded-full" style={{ background: subjectColor[s] }} />
            ))}
          </div>
        </div>
        <Button variant="ghost" onClick={signOut} className="w-full justify-start text-muted-foreground h-8 text-xs px-2">
          <LogOut className="h-3.5 w-3.5 mr-2" />Sign out
        </Button>
      </div>
    </aside>
  );
};
