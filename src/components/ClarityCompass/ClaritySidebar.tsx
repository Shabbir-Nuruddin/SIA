import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Compass,
  User,
  Brain,
  Star,
  Map,
  ArrowLeft,
  Menu,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const items: { to: string; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
  { to: "/clarity-compass", icon: Compass, label: "Home" },
  { to: "/clarity-compass/profile", icon: User, label: "My Profile" },
  { to: "/clarity-compass/quiz", icon: Brain, label: "Take Quiz" },
  { to: "/clarity-compass/results", icon: Star, label: "My Results" },
  { to: "/clarity-compass/roadmap", icon: Map, label: "My Roadmap" },
];

interface SidebarBodyProps {
  onNavigate?: () => void;
}

const SidebarBody = ({ onNavigate }: SidebarBodyProps): React.ReactElement => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const [userName, setUserName] = useState<string>("Clarity Explorer");

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("first_name, last_name, display_name")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.first_name || data?.display_name) {
          const name = `${data.first_name || data.display_name || ""} ${data.last_name || ""}`.trim();
          setUserName(name || "Clarity Explorer");
        } else if (user.email) {
          // Fallback: capitalise the part before @ so at least it looks like a name
          const prefix = user.email.split("@")[0];
          setUserName(prefix.charAt(0).toUpperCase() + prefix.slice(1));
        }
      });
  }, [user]);

  return (
    <div className="flex h-full flex-col p-3">
      <div className="px-2 py-3 mb-4">
        <h2 className="text-lg font-bold text-foreground">Clarity Compass</h2>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto">
        {items.map((it) => {
          const isExactMatch = pathname === it.to;
          const isActive =
            isExactMatch ||
            (it.to !== "/clarity-compass" && pathname.startsWith(it.to));
          const IconComponent = it.icon;
          return (
            <NavLink
              key={it.to}
              to={it.to}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-[13px] transition-colors ${
                isActive
                  ? "bg-primary/15 text-primary font-semibold"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
              }`}
            >
              <IconComponent className="h-4 w-4 shrink-0" />
              <span className="flex-1">{it.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-3 pt-3 border-t border-sidebar-border space-y-2">
        <div className="px-2">
          <div className="text-sm font-semibold text-foreground truncate">
            {userName}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1">
            Clarity Explorer
          </div>
        </div>
        <NavLink
          to="/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-sidebar-accent px-3 py-2 rounded-md text-xs transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to SIA Smart Revision</span>
        </NavLink>
      </div>
    </div>
  );
};

export function ClaritySidebar(): React.ReactElement {
  const [open, setOpen] = useState<boolean>(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile / tablet hamburger trigger */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            aria-label="Open menu"
            className="lg:hidden fixed top-2 left-2 z-50 h-10 w-10 rounded-md bg-card/95 border border-border backdrop-blur flex items-center justify-center shadow-md hover:bg-secondary transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="p-0 w-[280px] bg-sidebar border-r border-sidebar-border"
        >
          <SidebarBody onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Desktop static sidebar */}
      <aside
        className="hidden lg:flex w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar sticky self-start"
        style={{ top: 52, height: "calc(100vh - 52px)" }}
      >
        <SidebarBody />
      </aside>
    </>
  );
}
