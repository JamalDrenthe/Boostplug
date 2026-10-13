/**
 * BoostPlug - Stripe Payment Integration Helper
 * Ondersteunt iDEAL, Bancontact, Creditcard en Apple Pay via Stripe
 */

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';

export const isStripeConfigured = Boolean(publishableKey && publishableKey.startsWith('pk_'));

export type StripeMode = 'live' | 'test' | 'unconfigured';

export function getStripeMode(): StripeMode {
  if (!isStripeConfigured) return 'unconfigured';
  if (publishableKey.startsWith('pk_test_')) return 'test';
  if (publishableKey.startsWith('pk_live_')) return 'live';
  return 'test';
}

export interface StripePaymentSessionOptions {
  amount: number; // in cents of euros
  currency: string;
  orderNumber: string;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
}

/**
 * Dynamische loader voor Stripe.js zodat initial page load 0 overhead heeft
 */
export async function loadStripeInstance() {
  if (!isStripeConfigured) return null;

  try {
    // Laad Stripe script op de achtergrond als deze nog niet aanwezig is
    if (!window.Stripe) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Stripe.js script kon niet worden geladen'));
        document.head.appendChild(script);
      });
    }

    if (window.Stripe) {
      return window.Stripe(publishableKey);
    }
    return null;
  } catch (error) {
    console.warn('Fout bij laden van Stripe SDK:', error);
    return null;
  }
}

// Global declaration voor window.Stripe
declare global {
  interface Window {
    Stripe?: (key: string) => any;
  }
}
