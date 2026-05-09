import { ClaritySidebar } from "./ClaritySidebar";

interface ClarityLayoutProps {
  children: React.ReactNode;
}

export function ClarityLayout({ children }: ClarityLayoutProps): React.ReactElement {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <ClaritySidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
