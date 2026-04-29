import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Calendar, Brain, FileText, Trophy, Settings, LogOut, FileClock, User } from "lucide-react";
import { ApexLogo } from "@/components/ApexLogo";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const items = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/roadmap", icon: Calendar, label: "Roadmap" },
  { to: "/questions", icon: Brain, label: "AI Questions" },
  { to: "/mock-papers", icon: FileClock, label: "Mock Papers" },
  { to: "/notes", icon: FileText, label: "Notes" },
  { to: "/papers", icon: Trophy, label: "Past Papers" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export const AppSidebar = () => {
  const { signOut, user } = useAuth();
  const { pathname } = useLocation();
  const [profile, setProfile] = useState<{ first_name: string | null; last_name: string | null; display_name: string | null } | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("first_name,last_name,display_name").eq("id", user.id).single()
      .then(({ data }) => { if (data) setProfile(data as any); });
  }, [user]);

  const first = profile?.first_name || profile?.display_name || "Student";
  const last = profile?.last_name || "";
  const initials = `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase() || (first?.[0] ?? "S");

  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-4 sticky top-9 self-start" style={{ height: "calc(100vh - 36px)" }}>
      <div className="px-2 py-3 mb-6"><ApexLogo /></div>
      <nav className="flex-1 space-y-1">
        {items.map(it => {
          const active = pathname === it.to || (it.to !== "/dashboard" && pathname.startsWith(it.to));
          return (
            <NavLink key={it.to} to={it.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${active
                ? "bg-primary/15 text-primary font-semibold"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"}`}>
              <it.icon className="h-4 w-4" />
              <span>{it.label}</span>
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-3 pt-3 border-t border-sidebar-border">
        <NavLink to="/settings" className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-sidebar-accent transition-colors">
          <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold truncate">{first} {last}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">Account</div>
          </div>
          <User className="h-3.5 w-3.5 text-muted-foreground" />
        </NavLink>
        <Button variant="ghost" onClick={signOut} className="w-full justify-start text-muted-foreground mt-1">
          <LogOut className="h-4 w-4 mr-2" />Sign out
        </Button>
      </div>
    </aside>
  );
};
