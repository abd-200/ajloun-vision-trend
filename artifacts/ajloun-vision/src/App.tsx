import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/Layout";
import { AuthProvider } from "@/context/AuthContext";
import Home from "@/pages/Home";
import Initiatives from "@/pages/Initiatives";
import InitiativeDetail from "@/pages/InitiativeDetail";
import Members from "@/pages/Members";
import MemberProfile from "@/pages/MemberProfile";
import About from "@/pages/About";
import Join from "@/pages/Join";
import AuthPage from "@/pages/AuthPage";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfUse from "@/pages/TermsOfUse";
import JoinTerms from "@/pages/JoinTerms";
import Feed from "@/pages/Feed";
import OpportunitiesPage from "@/pages/OpportunitiesPage";
import PointsPage from "@/pages/PointsPage";
import RewardsPage from "@/pages/RewardsPage";
import NotificationsPage from "@/pages/NotificationsPage";
import AccessibilityPage from "@/pages/AccessibilityPage";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/feed" component={Feed} />
      <Route path="/opportunities" component={OpportunitiesPage} />
      <Route path="/points" component={PointsPage} />
      <Route path="/rewards" component={RewardsPage} />
      <Route path="/notifications" component={NotificationsPage} />
      <Route path="/accessibility" component={AccessibilityPage} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/initiatives" component={Initiatives} />
      <Route path="/initiatives/:id" component={InitiativeDetail} />
      <Route path="/members" component={Members} />
      <Route path="/members/:id" component={MemberProfile} />
      <Route path="/about" component={About} />
      <Route path="/join" component={Join} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/terms" component={TermsOfUse} />
      <Route path="/join-terms" component={JoinTerms} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AuthProvider>
            <Layout>
              <Router />
            </Layout>
          </AuthProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
