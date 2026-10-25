import { useState, useEffect, lazy, Suspense } from 'react';
import { StoreProvider, useStore } from '@/hooks/useStore';
import { Header } from '@/sections/Header';
import { Hero } from '@/sections/Hero';
import { LandingLogosSection } from '@/sections/LandingLogosSection';
import { ProductSelector } from '@/sections/ProductSelector';
import { SubscriptionsSection } from '@/sections/SubscriptionsSection';
import type { AccountType } from '@/types';

const CheckoutModal = lazy(() => import('@/sections/CheckoutModal').then(m => ({ default: m.CheckoutModal })));
const TrackingSection = lazy(() => import('@/sections/TrackingSection').then(m => ({ default: m.TrackingSection })));
const LoginPage = lazy(() => import('@/sections/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('@/sections/RegisterPage').then(m => ({ default: m.RegisterPage })));
const AccountCenter = lazy(() => import('@/sections/AccountCenter').then(m => ({ default: m.AccountCenter })));
const AboutPage = lazy(() => import('@/sections/AboutPage').then(m => ({ default: m.AboutPage })));
const MembersPage = lazy(() => import('@/sections/MembersPage').then(m => ({ default: m.MembersPage })));
const AdminDashboard = lazy(() => import('@/sections/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const IntegrationsPage = lazy(() => import('@/sections/IntegrationsPage').then(m => ({ default: m.IntegrationsPage })));
const VacanciesPage = lazy(() => import('@/sections/VacanciesPage').then(m => ({ default: m.VacanciesPage })));
import { Footer } from '@/sections/Footer';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

type Route =
  | { page: 'home' }
  | { page: 'tracking'; token: string }
  | { page: 'login' }
  | { page: 'register'; accountType?: AccountType }
  | { page: 'account' }
  | { page: 'admin' }
  | { page: 'about' }
  | { page: 'members' }
  | { page: 'integraties' }
  | { page: 'quantum-initium' }
  | { page: 'vvc' }
  | { page: 'vacancies' };

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
    case '#/admin':
      return { page: 'admin' };
    case '#/over-ons':
      return { page: 'about' };
    case '#/leden':
      return { page: 'members' };
    case '#/vacatures':
    case '#/careers':
    case '#/jobs':
      return { page: 'vacancies' };
    case '#/integraties':
    case '#/integraties#vvc':
    case '#/ecosysteem':
    case '#/quantum-initium':
    case '#/vvc':
    case '#/verdienende-vrienden-club':
      return { page: 'integraties' };
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
    case 'admin':
      return '#/admin';
    case 'about':
      return '#/over-ons';
    case 'members':
      return '#/leden';
    case 'vacancies':
      return '#/vacatures';
    case 'integraties':
      return '#/integraties';
    case 'quantum-initium':
    case 'vvc':
      return '#/integraties';
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
    const targetHash = routeToHash(next);
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleNavigateSection = (sectionId: string) => {
    if (route.page !== 'home') {
      navigate({ page: 'home' });
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      // In-page ankers op home niet resetten naar 0
      if (hash.startsWith('#products') || hash.startsWith('#abonnementen') || hash.startsWith('#how-it-works')) {
        const id = hash.replace(/^#/, '');
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        return;
      }

      const next = parseHash(hash);
      setRoute(next);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const goHome = () => navigate({ page: 'home' });
  const goAccount = () => navigate({ page: 'account' });
  const goAdmin = () => navigate({ page: 'admin' });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(220,35%,6%)] via-[hsl(220,30%,8%)] to-[hsl(220,25%,10%)]">
      <Header
        onCheckout={() => setShowCheckout(true)}
        onTracking={() => navigate({ page: 'tracking', token: '' })}
        onAccount={goAccount}
        onHome={goHome}
        onAbout={() => navigate({ page: 'about' })}
        onAdmin={goAdmin}
        onIntegrations={() => navigate({ page: 'integraties' })}
        onQuantumInitium={() => navigate({ page: 'integraties' })}
        onVVC={() => navigate({ page: 'integraties' })}
        onVacancies={() => navigate({ page: 'vacancies' })}
        onNavigateSection={handleNavigateSection}
      />

      <main>
        {route.page === 'home' && (
          <>
            <Hero onMembers={() => navigate({ page: 'members' })} />
            <LandingLogosSection />
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
              onShop={() => handleNavigateSection('products')}
              onAdmin={goAdmin}
              onIntegrations={() => navigate({ page: 'integraties' })}
              onQuantumInitium={() => navigate({ page: 'integraties' })}
              onVVC={() => navigate({ page: 'integraties' })}
            />
          )}
          {route.page === 'admin' && (
            <AdminDashboard
              onBack={goHome}
              onTrack={(token) => navigate({ page: 'tracking', token })}
            />
          )}
          {route.page === 'about' && (
            <AboutPage 
              onBack={goHome} 
              onShop={() => handleNavigateSection('products')} 
            />
          )}
          {route.page === 'members' && (
            <MembersPage
              onBack={goHome}
              onJoin={() => navigate({ page: 'register', accountType: 'member' })}
              onShop={() => handleNavigateSection('products')}
            />
          )}
          {(route.page === 'integraties' || route.page === 'quantum-initium' || route.page === 'vvc') && (
            <IntegrationsPage
              onBack={goHome}
              onShop={() => handleNavigateSection('products')}
              onJoin={() => navigate({ page: 'register', accountType: 'member' })}
            />
          )}
          {route.page === 'vacancies' && (
            <VacanciesPage
              onBack={goHome}
              onIntegrations={() => navigate({ page: 'integraties' })}
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
            background: 'hsl(220, 20%, 12%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white',
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
