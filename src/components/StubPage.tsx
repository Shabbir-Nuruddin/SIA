import { ReactNode } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Construction } from "lucide-react";

export const StubPage = ({ title, subtitle, children }: { title: string; subtitle: string; children?: ReactNode }) => (
  <AppLayout>
    <div className="p-6 md:p-10 max-w-5xl mx-auto animate-fade-in">
      <h1 className="text-3xl md:text-4xl font-extrabold">{title}</h1>
      <p className="text-muted-foreground mt-1">{subtitle}</p>
      <div className="glass-card rounded-2xl p-12 mt-8 text-center">
        <Construction className="h-12 w-12 text-accent mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Coming in the next iteration.</h3>
        <p className="text-muted-foreground max-w-md mx-auto">This screen is wired up. The full feature ships once we lock in the dashboard, auth, and AI engine.</p>
        {children}
      </div>
    </div>
  </AppLayout>
);
