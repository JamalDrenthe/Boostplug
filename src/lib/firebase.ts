import type { Order, Subscription, AuthUser, MemberMiningProfile } from '@/types';

// Firebase configuratie met environment variables en fallback naar boostplug-dev
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'boostplug-dev.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'boostplug-dev',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'boostplug-dev.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

// Initialiseer Firebase alleen als een geldige apiKey aanwezig is
export const isConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

interface FirebaseBundle {
  auth: import('firebase/auth').Auth;
  db: import('firebase/firestore').Firestore;
  googleProvider: import('firebase/auth').GoogleAuthProvider;
  firestore: typeof import('firebase/firestore');
  signInWithPopup: typeof import('firebase/auth').signInWithPopup;
}

let firebaseBundlePromise: Promise<FirebaseBundle | null> | null = null;

async function getFirebaseBundle(): Promise<FirebaseBundle | null> {
  if (!isConfigured) return null;

  if (!firebaseBundlePromise) {
    firebaseBundlePromise = (async () => {
      try {
        const [
          { initializeApp, getApps },
          { getAuth, GoogleAuthProvider, signInWithPopup },
          firestore
        ] = await Promise.all([
          import('firebase/app'),
          import('firebase/auth'),
          import('firebase/firestore')
        ]);

        const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
        const auth = getAuth(app);
        const db = firestore.getFirestore(app);
        const googleProvider = new GoogleAuthProvider();

        return {
          auth,
          db,
          googleProvider,
          firestore,
          signInWithPopup
        };
      } catch (error) {
        console.warn('Firebase asynchrone initialisatie kon niet worden voltooid:', error);
        return null;
      }
    })();
  }

  return firebaseBundlePromise;
}

/**
 * Inloggen met Google via Firebase Auth
 * Valt automatisch terug op veilige dev-admin login als API key niet geconfigureerd is
 */
export async function signInWithGoogle(): Promise<{ ok: boolean; user?: AuthUser; error?: string }> {
  if (isConfigured) {
    try {
      const fb = await getFirebaseBundle();
      if (fb) {
        const result = await fb.signInWithPopup(fb.auth, fb.googleProvider);
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
      }
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
  if (!isConfigured) return false;
  try {
    const fb = await getFirebaseBundle();
    if (!fb) return false;
    const orderDoc = fb.firestore.doc(fb.db, 'orders', order.id);
    await fb.firestore.setDoc(orderDoc, {
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
  if (!isConfigured) return false;
  try {
    const fb = await getFirebaseBundle();
    if (!fb) return false;
    const subDoc = fb.firestore.doc(fb.db, 'subscriptions', sub.id);
    await fb.firestore.setDoc(subDoc, {
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
  if (!isConfigured) return [];
  try {
    const fb = await getFirebaseBundle();
    if (!fb) return [];
    const querySnapshot = await fb.firestore.getDocs(fb.firestore.collection(fb.db, 'orders'));
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
  if (!isConfigured) return false;
  try {
    const fb = await getFirebaseBundle();
    if (!fb) return false;
    const orderDoc = fb.firestore.doc(fb.db, 'orders', orderId);
    await fb.firestore.updateDoc(orderDoc, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.warn('Fout bij bijwerken van order in Firestore:', error);
    return false;
  }
}

/**
 * Synchroniseer mining profiel van lid naar Firestore
 */
export async function syncMiningProfileToFirestore(profile: MemberMiningProfile): Promise<boolean> {
  if (!isConfigured) return false;
  try {
    const fb = await getFirebaseBundle();
    if (!fb) return false;
    const nodeDoc = fb.firestore.doc(fb.db, 'mining_nodes', profile.userId);
    await fb.firestore.setDoc(nodeDoc, {
      ...profile,
      syncedAt: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn('Fout bij synchroniseren van mining profiel naar Firestore:', error);
    return false;
  }
}
