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

import { setBaseUrl } from "@workspace/api-client-react";

// Configure backend API base URL if provided in environment variables
const apiUrl = import.meta.env.VITE_API_URL;
if (apiUrl) {
  setBaseUrl(apiUrl);
}

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

import React, { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F6F0] p-6 text-center" dir="rtl">
          <div className="max-w-md w-full bg-white border rounded-2xl p-8 shadow-lg text-right">
            <h2 className="text-2xl font-bold text-red-600 mb-4">حدث خطأ في النظام</h2>
            <p className="text-muted-foreground mb-6 text-sm">
              فشل تحميل بعض مكونات الموقع. قد يكون ذلك بسبب تعذر الاتصال بملقم البيانات (API Backend) عند التشغيل على استضافة ساكنة مثل Netlify.
            </p>
            <div className="bg-zinc-50 p-4 rounded-lg text-left text-xs font-mono overflow-auto max-h-40 border border-red-200 text-red-500 mb-6">
              {this.state.error?.toString()}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-[#2D6A4F] hover:bg-[#1b4332] text-white py-2.5 rounded-md transition-colors font-medium"
            >
              إعادة تحميل الصفحة
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={(import.meta.env.BASE_URL || "").replace(/\/$/, "")}>
            <AuthProvider>
              <Layout>
                <Router />
              </Layout>
            </AuthProvider>
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
