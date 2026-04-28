import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Calendar, Brain, FileText, Trophy, Settings, LogOut } from "lucide-react";
import { ApexLogo } from "@/components/ApexLogo";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const items = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/roadmap", icon: Calendar, label: "Roadmap" },
  { to: "/questions", icon: Brain, label: "AI Questions" },
  { to: "/notes", icon: FileText, label: "Notes" },
  { to: "/papers", icon: Trophy, label: "Past Papers" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export const AppSidebar = () => {
  const { signOut } = useAuth();
  const { pathname } = useLocation();
  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-4">
      <div className="px-2 py-3 mb-6"><ApexLogo /></div>
      <nav className="flex-1 space-y-1">
        {items.map(it => {
          const active = pathname === it.to;
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
      <Button variant="ghost" onClick={signOut} className="justify-start text-muted-foreground">
        <LogOut className="h-4 w-4 mr-2" />Sign out
      </Button>
    </aside>
  );
};
