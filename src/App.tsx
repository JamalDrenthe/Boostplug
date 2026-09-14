import { useState, useEffect } from 'react';
import { StoreProvider } from '@/hooks/useStore';
import { Header } from '@/sections/Header';
import { Hero } from '@/sections/Hero';
import { ProductSelector } from '@/sections/ProductSelector';
import { CheckoutModal } from '@/sections/CheckoutModal';
import { TrackingSection } from '@/sections/TrackingSection';
import { Footer } from '@/sections/Footer';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

function AppContent() {
  const [showCheckout, setShowCheckout] = useState(false);
  const [showTracking, setShowTracking] = useState(false);
  const [trackingToken, setTrackingToken] = useState('');

  // Handle hash routing for tracking
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/track/')) {
        const token = hash.replace('#/track/', '');
        setTrackingToken(token);
        setShowTracking(true);
      } else if (hash === '#/track') {
        setShowTracking(true);
        setTrackingToken('');
      } else {
        setShowTracking(false);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(220,35%,6%)] via-[hsl(220,30%,8%)] to-[hsl(220,25%,10%)]">
      <Header 
        onCheckout={() => setShowCheckout(true)} 
        onTracking={() => {
          setTrackingToken('');
          setShowTracking(true);
          window.location.hash = '#/track';
        }}
      />
      
      <main>
        {!showTracking ? (
          <>
            <Hero />
            <ProductSelector onCheckout={() => setShowCheckout(true)} />
          </>
        ) : (
          <TrackingSection 
            initialToken={trackingToken} 
            onBack={() => {
              setShowTracking(false);
              window.location.hash = '';
            }}
          />
        )}
      </main>

      <Footer />

      <CheckoutModal 
        open={showCheckout} 
        onClose={() => setShowCheckout(false)} 
      />
      
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
