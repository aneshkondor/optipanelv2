import { useState, useEffect } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from './components/ui/sonner';
import { DashboardLoader } from './components/DashboardLoader';
import { MetricsProvider } from './contexts/MetricsContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Marketing pages
import { LandingPage } from './components/marketing/LandingPage';
import { ProductPage } from './components/marketing/ProductPage';
import { SolutionsPage } from './components/marketing/SolutionsPage';
import { PricingPage } from './components/marketing/PricingPage';
import { SecurityPage } from './components/marketing/SecurityPage';

// App pages
import { OnboardingFlow } from './components/app/OnboardingFlow';
import { AppShell } from './components/app/AppShell';
import { ExecutiveDashboard } from './components/app/ExecutiveDashboard';
import { ExplorePage } from './components/app/ExplorePage';
import { FunnelsPage } from './components/app/FunnelsPage';
import { CohortsPage } from './components/app/CohortsPage';
import { RetentionPage } from './components/app/RetentionPage';
import { RevenuePage } from './components/app/RevenuePage';
import { ExperimentsPage } from './components/app/ExperimentsPage';
import { FlowsPage } from './components/app/FlowsPage';
import { AlertsPage } from './components/app/AlertsPage';
import { ReportsPage } from './components/app/ReportsPage';
import { DataCatalogPage } from './components/app/DataCatalogPage';
import { SettingsPage } from './components/app/SettingsPage';
import { EngagementMonitor } from './components/app/EngagementMonitor';
import { LiveMetricsPage } from './components/app/LiveMetricsPage';
import { AIChatPanel } from './components/app/AIChatPanel';


type Route = 
  | 'landing'
  | 'product'
  | 'solutions'
  | 'pricing'
  | 'security'
  | 'onboarding'
  | 'dashboard'
  | 'explore'
  | 'funnels'
  | 'cohorts'
  | 'retention'
  | 'revenue'
  | 'experiments'
  | 'flows'
  | 'alerts'
  | 'reports'
  | 'catalog'
  | 'engagement'
  | 'livemetrics'
  | 'settings'
  | 'aichat';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<Route>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);

  // Simple hash-based routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'landing';
      setCurrentRoute(hash as Route);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route: Route) => {
    window.location.hash = route;
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate('onboarding');
  };

  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
    setIsLoadingDashboard(true);
    
    // Show loading screen for 3 seconds
    setTimeout(() => {
      setIsLoadingDashboard(false);
      navigate('dashboard');
    }, 3000);
  };

  // Marketing routes
  const marketingRoutes: Route[] = ['landing', 'product', 'solutions', 'pricing', 'security'];
  const isMarketingRoute = marketingRoutes.includes(currentRoute);

  // Render marketing pages
  if (isMarketingRoute) {
    return (
      <ThemeProvider defaultTheme="dark">
        <div className="min-h-screen">
          {currentRoute === 'landing' && <LandingPage onNavigate={navigate} onLogin={handleLogin} />}
          {currentRoute === 'product' && <ProductPage onNavigate={navigate} onLogin={handleLogin} />}
          {currentRoute === 'solutions' && <SolutionsPage onNavigate={navigate} onLogin={handleLogin} />}
          {currentRoute === 'pricing' && <PricingPage onNavigate={navigate} onLogin={handleLogin} />}
          {currentRoute === 'security' && <SecurityPage onNavigate={navigate} onLogin={handleLogin} />}
        </div>
        <Toaster />
      </ThemeProvider>
    );
  }

  // Loading screen
  if (isLoadingDashboard) {
    return (
      <ThemeProvider defaultTheme="dark">
        <DashboardLoader />
        <Toaster />
      </ThemeProvider>
    );
  }

  // Onboarding flow
  if (isAuthenticated && !hasCompletedOnboarding && currentRoute === 'onboarding') {
    return (
      <ThemeProvider defaultTheme="dark">
        <OnboardingFlow onComplete={handleOnboardingComplete} />
        <Toaster />
      </ThemeProvider>
    );
  }

  // App routes - wrapped in AppShell
  return (
    <ThemeProvider defaultTheme="dark">
      <DndProvider backend={HTML5Backend}>
        <MetricsProvider>
          <AppShell currentRoute={currentRoute} onNavigate={navigate}>
            {currentRoute === 'dashboard' && <ExecutiveDashboard />}
            {currentRoute === 'explore' && <ExplorePage onNavigate={navigate} />}
            {currentRoute === 'funnels' && <FunnelsPage />}
            {currentRoute === 'cohorts' && <CohortsPage />}
            {currentRoute === 'retention' && <RetentionPage />}
            {currentRoute === 'revenue' && <RevenuePage />}
            {currentRoute === 'experiments' && <ExperimentsPage />}
            {currentRoute === 'flows' && <FlowsPage />}
            {currentRoute === 'engagement' && <EngagementMonitor />}
            {currentRoute === 'livemetrics' && <LiveMetricsPage />}
            {currentRoute === 'alerts' && <AlertsPage />}
            {currentRoute === 'reports' && <ReportsPage />}
            {currentRoute === 'catalog' && <DataCatalogPage />}
            {currentRoute === 'aichat' && <AIChatPanel />}
            {currentRoute === 'settings' && <SettingsPage />}
          </AppShell>
          <Toaster />
        </MetricsProvider>
      </DndProvider>
    </ThemeProvider>
  );
}
