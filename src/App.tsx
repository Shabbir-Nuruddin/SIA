import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { MaintenanceGate } from "@/components/MaintenanceGate";
import Landing from "./pages/Landing";
import AuthPage from "./pages/Auth";
import Diagnostic from "./pages/Diagnostic";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Questions from "./pages/Questions";
import MockPapers from "./pages/MockPapers";
import NewMockPaper from "./pages/NewMockPaper";
import MockExam from "./pages/MockExam";
import MockResults from "./pages/MockResults";
import Roadmap from "./pages/Roadmap";
import RoadmapTopicNotes from "./pages/RoadmapTopicNotes";
import { StubPage } from "./components/StubPage";
import { RequirePro } from "./components/RequirePro";
import Notes from "./pages/Notes";
import Podcast from "./pages/Podcast";
import PastPapers from "./pages/PastPapers";
import FAQ from "./pages/FAQ";
import Settings from "./pages/Settings";
import Exams from "./pages/Exams";
import Pricing from "./pages/Pricing";
import Feedback from "./pages/Feedback";
import NotFound from "./pages/NotFound";
import { Terms, Privacy, Refund } from "./pages/Legal";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MaintenanceGate>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/diagnostic" element={<Diagnostic />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/mock-papers" element={<MockPapers />} />
            <Route path="/mock-papers/new" element={<NewMockPaper />} />
            <Route path="/mock-papers/exam/:id" element={<MockExam />} />
            <Route path="/mock-papers/:id/results" element={<MockResults />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/roadmap/topic/:nodeId/notes" element={<RoadmapTopicNotes />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/podcast" element={<Podcast />} />
            <Route path="/papers" element={<PastPapers />} />
            <Route path="/faq" element={<RequirePro featureName="Exam FAQs"><FAQ /></RequirePro>} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/refund" element={<Refund />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </MaintenanceGate>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
