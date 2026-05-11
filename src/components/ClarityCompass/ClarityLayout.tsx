import { ClaritySidebar } from "./ClaritySidebar";

interface ClarityLayoutProps {
  children: React.ReactNode;
}

/**
 * ClarityLayout — wraps every ClarityCompass page.
 * Renders the sidebar + a flex main content area.
 * This file was missing from the build, causing the "Preview failed" error.
 */
export function ClarityLayout({ children }: ClarityLayoutProps): React.ReactElement {
  return (
    <div className="flex min-h-screen bg-background">
      <ClaritySidebar />
      <main className="flex-1 flex flex-col min-w-0">
        {children}
      </main>
    </div>
  );
}
