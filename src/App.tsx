import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Landing from "./pages/Landing";
import AuthPage from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Questions from "./pages/Questions";
import MockPapers from "./pages/MockPapers";
import NewMockPaper from "./pages/NewMockPaper";
import MockExam from "./pages/MockExam";
import MockResults from "./pages/MockResults";
import Roadmap from "./pages/Roadmap";
import { StubPage } from "./components/StubPage";
import Notes from "./pages/Notes";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/mock-papers" element={<MockPapers />} />
            <Route path="/mock-papers/new" element={<NewMockPaper />} />
            <Route path="/mock-papers/exam/:id" element={<MockExam />} />
            <Route path="/mock-papers/:id/results" element={<MockResults />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/papers" element={<StubPage title="Past Papers" subtitle="Edexcel papers, mark schemes, and grade boundaries." />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
