import { useState, useEffect, lazy, Suspense } from 'react';
import { StoreProvider, useStore } from '@/hooks/useStore';
import { Header } from '@/sections/Header';
import { Hero } from '@/sections/Hero';
import { ProductSelector } from '@/sections/ProductSelector';
import type { AccountType } from '@/types';
import { SubscriptionsSection } from '@/sections/SubscriptionsSection';

const CheckoutModal = lazy(() => import('@/sections/CheckoutModal').then(m => ({ default: m.CheckoutModal })));
const TrackingSection = lazy(() => import('@/sections/TrackingSection').then(m => ({ default: m.TrackingSection })));
const LoginPage = lazy(() => import('@/sections/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('@/sections/RegisterPage').then(m => ({ default: m.RegisterPage })));
const AccountCenter = lazy(() => import('@/sections/AccountCenter').then(m => ({ default: m.AccountCenter })));
const AboutPage = lazy(() => import('@/sections/AboutPage').then(m => ({ default: m.AboutPage })));
const MembersPage = lazy(() => import('@/sections/MembersPage').then(m => ({ default: m.MembersPage })));
import { Footer } from '@/sections/Footer';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

type Route =
  | { page: 'home' }
  | { page: 'tracking'; token: string }
  | { page: 'login' }
  | { page: 'register'; accountType?: AccountType }
  | { page: 'account' }
  | { page: 'about' }
  | { page: 'members' };

function parseHash(hash: string): Route {
  if (hash.startsWith('#/track/')) {
    return { page: 'tracking', token: hash.replace('#/track/', '') };
  }
  switch (hash) {
    case '#/track':
      return { page: 'tracking', token: '' };
    case '#/login':
      return { page: 'login' };
    case '#/register':
      return { page: 'register' };
    case '#/register/lid':
      return { page: 'register', accountType: 'member' };
    case '#/account':
      return { page: 'account' };
    case '#/over-ons':
      return { page: 'about' };
    case '#/leden':
      return { page: 'members' };
    default:
      return { page: 'home' };
  }
}

function routeToHash(route: Route): string {
  switch (route.page) {
    case 'tracking':
      return route.token ? `#/track/${route.token}` : '#/track';
    case 'login':
      return '#/login';
    case 'register':
      return route.accountType === 'member' ? '#/register/lid' : '#/register';
    case 'account':
      return '#/account';
    case 'about':
      return '#/over-ons';
    case 'members':
      return '#/leden';
    default:
      return '';
  }
}

function AppContent() {
  const [showCheckout, setShowCheckout] = useState(false);
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  const { user } = useStore();

  const navigate = (next: Route) => {
    setRoute(next);
    window.location.hash = routeToHash(next);
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const next = parseHash(window.location.hash);
      setRoute(next);
      window.scrollTo({ top: 0 });
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const goHome = () => navigate({ page: 'home' });
  const goAccount = () => navigate({ page: 'account' });
  const goProducts = () => {
    navigate({ page: 'home' });
    requestAnimationFrame(() => {
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(220,35%,6%)] via-[hsl(220,30%,8%)] to-[hsl(220,25%,10%)]">
      <Header
        onCheckout={() => setShowCheckout(true)}
        onTracking={() => navigate({ page: 'tracking', token: '' })}
        onAccount={goAccount}
        onHome={goHome}
        onAbout={() => navigate({ page: 'about' })}
      />

      <main>
        {route.page === 'home' && (
          <>
            <Hero onMembers={() => navigate({ page: 'members' })} />
            <ProductSelector onCheckout={() => setShowCheckout(true)} />
            <SubscriptionsSection
              onRequireLogin={() => navigate({ page: 'login' })}
              onGoAccount={goAccount}
            />
          </>
        )}
        <Suspense fallback={<div className="min-h-screen" />}>
        {route.page === 'tracking' && (
          <TrackingSection initialToken={route.token} onBack={goHome} />
        )}
        {route.page === 'login' && (
          <LoginPage
            onBack={goHome}
            onSuccess={goAccount}
            onGoRegister={() => navigate({ page: 'register' })}
          />
        )}
        {route.page === 'register' && (
          <RegisterPage
            defaultType={route.accountType}
            onBack={goHome}
            onSuccess={goAccount}
            onGoLogin={() => navigate({ page: 'login' })}
          />
        )}
        {route.page === 'account' && !user && (
          <LoginPage
            onBack={goHome}
            onSuccess={goAccount}
            onGoRegister={() => navigate({ page: 'register' })}
          />
        )}
        {route.page === 'account' && user && (
          <AccountCenter
            onBack={goHome}
            onTrack={(token) => navigate({ page: 'tracking', token })}
            onShop={goProducts}
          />
        )}
        {route.page === 'about' && (
          <AboutPage onBack={goHome} onShop={goProducts} />
        )}
        {route.page === 'members' && (
          <MembersPage
            onBack={goHome}
            onJoin={() => navigate({ page: 'register', accountType: 'member' })}
            onShop={goProducts}
          />
        )}
        </Suspense>
      </main>

      <Footer />

      {showCheckout && (
        <Suspense fallback={null}>
          <CheckoutModal
            open={showCheckout}
            onClose={() => setShowCheckout(false)}
          />
        </Suspense>
      )}

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'hsl(220 20% 12%)',
            border: '1px solid hsl(220 15% 20%)',
            color: 'hsl(0 0% 98%)',
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

export default App;
