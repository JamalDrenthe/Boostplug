import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, type Auth } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  updateDoc, 
  type Firestore 
} from 'firebase/firestore';
import type { Order, Subscription, AuthUser } from '@/types';

// Firebase configuratie met environment variables en fallback naar boostplug-dev
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'boostplug-dev.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'boostplug-dev',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'boostplug-dev.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

// Initialiseer Firebase alleen als een geldige apiKey aanwezig is
const isConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

try {
  if (isConfigured) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
  }
} catch (error) {
  console.warn('Firebase initialisatie kon niet worden voltooid:', error);
}

export { app, auth, db, googleProvider, isConfigured };

/**
 * Inloggen met Google via Firebase Auth
 * Valt automatisch terug op veilige dev-admin login als API key niet geconfigureerd is
 */
export async function signInWithGoogle(): Promise<{ ok: boolean; user?: AuthUser; error?: string }> {
  if (isConfigured && auth && googleProvider) {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email?.toLowerCase() || '';
      const name = result.user.displayName || email.split('@')[0];
      const isAdmin = email === 'info@jamaldrenthe.com';
      
      const authUser: AuthUser = {
        id: result.user.uid,
        name,
        email,
        accountType: isAdmin ? 'admin' : 'customer',
        createdAt: new Date().toISOString(),
      };
      return { ok: true, user: authUser };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Google login mislukt';
      return { ok: false, error: errorMsg };
    }
  }

  // Lokale fallback voor development (info@jamaldrenthe.com is admin)
  return {
    ok: true,
    user: {
      id: 'admin_jamal',
      name: 'Jamal Drenthe',
      email: 'info@jamaldrenthe.com',
      accountType: 'admin',
      createdAt: new Date().toISOString(),
    },
  };
}

/**
 * Synchroniseer een bestelling naar Firestore
 */
export async function syncOrderToFirestore(order: Order): Promise<boolean> {
  if (!isConfigured || !db) return false;
  try {
    const orderDoc = doc(db, 'orders', order.id);
    await setDoc(orderDoc, {
      ...order,
      createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : order.createdAt,
      syncedAt: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn('Fout bij synchroniseren van order naar Firestore:', error);
    return false;
  }
}

/**
 * Synchroniseer een abonnement naar Firestore
 */
export async function syncSubscriptionToFirestore(sub: Subscription): Promise<boolean> {
  if (!isConfigured || !db) return false;
  try {
    const subDoc = doc(db, 'subscriptions', sub.id);
    await setDoc(subDoc, {
      ...sub,
      syncedAt: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn('Fout bij synchroniseren van abonnement naar Firestore:', error);
    return false;
  }
}

/**
 * Haal alle bestellingen op uit Firestore (voor beheerder)
 */
export async function fetchFirestoreOrders(): Promise<Order[]> {
  if (!isConfigured || !db) return [];
  try {
    const querySnapshot = await getDocs(collection(db, 'orders'));
    const orders: Order[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      orders.push({
        ...data,
        createdAt: new Date(data.createdAt),
      } as Order);
    });
    return orders;
  } catch (error) {
    console.warn('Fout bij ophalen van bestellingen uit Firestore:', error);
    return [];
  }
}

/**
 * Werk status van order bij in Firestore
 */
export async function updateFirestoreOrder(orderId: string, updates: Partial<Order>): Promise<boolean> {
  if (!isConfigured || !db) return false;
  try {
    const orderDoc = doc(db, 'orders', orderId);
    await updateDoc(orderDoc, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.warn('Fout bij bijwerken van order in Firestore:', error);
    return false;
  }
}
