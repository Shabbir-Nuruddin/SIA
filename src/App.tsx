import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { ConfirmHost } from "@/components/ui/confirm";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { RequireAdmin } from "@/components/RequireAdmin";
import { SidebarModeProvider } from "@/lib/sidebarMode";
import Landing from "./pages/Landing";
import AuthPage from "./pages/Auth";

import Onboarding from "./pages/Onboarding";
import StudentSetup from "./pages/StudentSetup";
import StudentTasks from "./pages/StudentTasks";
import ParentDashboard from "./pages/ParentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
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

import PastPapers from "./pages/PastPapers";
import FAQ from "./pages/FAQ";
import Settings from "./pages/Settings";
import Exams from "./pages/Exams";
import Pricing from "./pages/Pricing";
import Feedback from "./pages/Feedback";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminLaunch from "./pages/AdminLaunch";
import { Terms, Privacy, Refund } from "./pages/Legal";
import { ClarityCompassHome } from "./pages/ClarityCompass/ClarityCompassHome";
import { ClarityOnboarding } from "./pages/ClarityCompass/ClarityOnboarding";
import { ClarityQuiz } from "./pages/ClarityCompass/ClarityQuiz";
import { ClarityResults } from "./pages/ClarityCompass/ClarityResults";
import { ClarityRoadmap } from "./pages/ClarityCompass/ClarityRoadmap";
import { ClarityProfile } from "./pages/ClarityCompass/ClarityProfile";
import Progress from "./pages/Progress";
import { AnalyticsTracker } from "./components/AnalyticsTracker";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SidebarModeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ConfirmHost />
          <BrowserRouter>
          <AnalyticsTracker />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<AuthPage />} />

            <Route path="/student-setup" element={<StudentSetup />} />
            <Route path="/parent" element={<ParentDashboard />} />
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/mock-papers" element={<MockPapers />} />
            <Route path="/mock-papers/new" element={<NewMockPaper />} />
            <Route path="/mock-papers/exam/:id" element={<MockExam />} />
            <Route path="/mock-papers/:id/results" element={<MockResults />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/roadmap/topic/:nodeId/notes" element={<RoadmapTopicNotes />} />
            <Route path="/tasks" element={<StudentTasks />} />
            <Route path="/notes" element={<Notes />} />
            
            <Route path="/papers" element={<PastPapers />} />
            <Route path="/faq" element={<RequireAdmin><FAQ /></RequireAdmin>} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/launch" element={<AdminLaunch />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/refund" element={<Refund />} />
            <Route path="/clarity-compass" element={<RequireAdmin><ClarityCompassHome /></RequireAdmin>} />
            <Route path="/clarity-compass/onboarding" element={<RequireAdmin><ClarityOnboarding /></RequireAdmin>} />
            <Route path="/clarity-compass/quiz" element={<RequireAdmin><ClarityQuiz /></RequireAdmin>} />
            <Route path="/clarity-compass/results" element={<RequireAdmin><ClarityResults /></RequireAdmin>} />
            <Route path="/clarity-compass/roadmap" element={<RequireAdmin><ClarityRoadmap /></RequireAdmin>} />
            <Route path="/clarity-compass/profile" element={<RequireAdmin><ClarityProfile /></RequireAdmin>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SidebarModeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
