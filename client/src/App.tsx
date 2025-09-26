import React from "react";
import { useLocation } from 'wouter';
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AppProvider } from "@/contexts/AppContext";
import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";
import BillingPage from "@/pages/billing";
import SettingsPage from "@/pages/settings";
import AppearanceSettingsPage from "@/pages/appearance";
import WalletPage from "@/pages/credit";
import SendReceivePage from "@/pages/send-receive";
import CheckoutPage from "@/pages/checkout";
import ProfileSettingsPage from "@/pages/profile";
import LanguageSettingsPage from "@/pages/language";
import NotificationSettingsPage from "@/pages/notifications";
import PrivacySecuritySettingsPage from "@/pages/privacy-security";
import AboutSupportSettingsPage from "@/pages/about-support";
import UsageAnalyticsSettingsPage from "@/pages/usage-analytics";
import ReceiptPage from "@/pages/receipt";
import PaymentConfirmedPage from "@/pages/payment-confirmed";
import SplashScreen from "@/pages/splash";
import OnboardingPage from "@/pages/onboarding";
import PlanComparisonPage from "@/pages/plan-comparison";
import ImageVideoGenPage from "@/pages/image-video-gen";
import ContactsPage from "@/pages/contacts";
import NotFound from "@/pages/not-found";
import ChatPage from "@/pages/Chat";
import CrackTheCodePage from "@/pages/crack-the-code";
import CodeExecutionPage from "@/pages/code-execution";
import ProjectSetupScreen from "@/pages/project-setup";
import ScaffoldGenerator from "@/pages/generation-ui";

type Page =
  | 'home'
  | 'login'
  | 'signup'
  | 'billing'
  | 'settings'
  | 'appearance'
  | 'wallet'
  | 'send-receive'
  | 'checkout'
  | 'profile'
  | 'language'
  | 'notifications'
  | 'privacy-security'
  | 'about-support'
  | 'usage-analytics'
  | 'receipt'
  | 'payment-confirmed'
  | 'splash'
  | 'onboarding'
  | 'plan-comparison'
  | 'image-video-gen'
  | 'contacts'
  | 'crack-the-code'
  | 'code-execution'
  | 'project-setup'
  | 'generation-ui'
  | 'credit';

function Router() {
  // derive current page from the URL so wouter navigation works
  const [location] = useLocation();
  const currentPage: Page = location === '/' ? 'home' : (location.replace(/^\//, '') as Page);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <ChatPage />;
      case 'login':
        return <LoginPage />;
      case 'signup':
        return <SignupPage />;
      case 'billing':
        return <BillingPage />;
      case 'settings':
        return <SettingsPage />;
      case 'appearance':
        return <AppearanceSettingsPage />;
      case 'wallet':
        return <WalletPage />;
      case 'send-receive':
        return <SendReceivePage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'profile':
        return <ProfileSettingsPage />;
      case 'language':
        return <LanguageSettingsPage />;
      case 'notifications':
        return <NotificationSettingsPage />;
      case 'privacy-security':
        return <PrivacySecuritySettingsPage />;
      case 'about-support':
        return <AboutSupportSettingsPage />;
      case 'usage-analytics':
        return <UsageAnalyticsSettingsPage />;
      case 'receipt':
        return <ReceiptPage />;
      case 'payment-confirmed':
        return <PaymentConfirmedPage />;
      case 'splash':
        return <SplashScreen />;
      case 'onboarding':
        return <OnboardingPage />;
      case 'plan-comparison':
        return <PlanComparisonPage />;
      case 'image-video-gen':
        return <ImageVideoGenPage />;
      case 'contacts':
        return <ContactsPage />;
      case 'crack-the-code':
        return <CrackTheCodePage />;
      case 'code-execution':
        return <CodeExecutionPage />;
      case 'project-setup':
        return <ProjectSetupScreen />;
      case 'generation-ui':
        return <ScaffoldGenerator />;
      case 'credit':
        return <WalletPage />;
      default:
        // in case of unknown slug, fall back to NotFound
        return <NotFound />;
    }
  };

  return (
    <Switch>
  <Route path="/" component={() => <SplashScreen />} />
  <Route path="/home" component={() => <ChatPage />} />
  <Route path="/login" component={() => <LoginPage />} />
  <Route path="/signup" component={() => <SignupPage />} />
  <Route path=":page" component={() => renderPage()} />
  <Route component={NotFound} />
    </Switch>
  );
}

import { AuthProvider } from "@/contexts/AuthContext";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </AuthProvider>
        </AppProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
