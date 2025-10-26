import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeProvider } from './contexts/ThemeContext';
import { CartProvider } from './contexts/CartContext';
import { UserProvider } from './contexts/UserContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AccountPage } from './pages/AccountPage';
import { OrdersPage } from './pages/OrdersPage';
import { AuthPage } from './pages/AuthPage';
import { Toaster } from './components/ui/sonner';
import { analyticsTracker } from './services/analyticsTracker';

type Page =
  | 'home'
  | 'category'
  | 'product'
  | 'search'
  | 'checkout'
  | 'confirmation'
  | 'tracking'
  | 'account'
  | 'orders'
  | 'auth';

interface NavigationState {
  page: Page;
  data?: any;
}

function App() {
  const [navigation, setNavigation] = useState<NavigationState>({
    page: 'home',
  });

  const handleNavigate = (page: string, data?: any) => {
    setNavigation({ page: page as Page, data });
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Track page view
    analyticsTracker.trackPageView(page.charAt(0).toUpperCase() + page.slice(1));
  };

  const handleSearch = (query: string, category?: string) => {
    setNavigation({
      page: 'search',
      data: { query, category },
    });

    // Track search
    analyticsTracker.trackSearch(query);
  };

  const handleClearSearch = () => {
    setNavigation({ page: 'home' });
  };

  const renderPage = () => {
    switch (navigation.page) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'category':
        return (
          <CategoryPage
            categoryId={navigation.data?.categoryId}
            onNavigate={handleNavigate}
          />
        );
      case 'product':
        return (
          <ProductDetailPage
            productId={navigation.data?.productId}
            onNavigate={handleNavigate}
          />
        );
      case 'search':
        return (
          <SearchResultsPage
            query={navigation.data?.query}
            category={navigation.data?.category}
            onNavigate={handleNavigate}
            onClearSearch={handleClearSearch}
          />
        );
      case 'checkout':
        return <CheckoutPage onNavigate={handleNavigate} />;
      case 'confirmation':
        return <OrderConfirmationPage onNavigate={handleNavigate} />;
      case 'tracking':
        return (
          <OrderTrackingPage
            orderId={navigation.data?.orderId}
            onNavigate={handleNavigate}
          />
        );
      case 'account':
        return <AccountPage onNavigate={handleNavigate} />;
      case 'orders':
        return <OrdersPage onNavigate={handleNavigate} />;
      case 'auth':
        return <AuthPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <ThemeProvider>
      <UserProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Header onNavigate={handleNavigate} onSearch={handleSearch} />
            <main className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={navigation.page}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  {renderPage()}
                </motion.div>
              </AnimatePresence>
            </main>
            <Footer />
            <CartDrawer onCheckout={() => handleNavigate('checkout')} />
            <Toaster position="top-center" />
          </div>
        </CartProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
