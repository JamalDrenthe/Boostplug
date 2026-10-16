import type { Order, Subscription, AuthUser, MemberMiningProfile } from '@/types';

// Firebase configuratie met environment variables en fallback naar boostplug-dev
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyB4MJsHlKXZpNO_sALLgPVxRX0qm-wq6lM',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'boostplug-dev.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'boostplug-dev',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'boostplug-dev.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '343475014741',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:343475014741:web:859d97498891c1f10c58dc',
};

// Initialiseer Firebase alleen als een geldige apiKey aanwezig is
export const isConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

interface FirebaseBundle {
  auth: import('firebase/auth').Auth;
  db: import('firebase/firestore').Firestore;
  googleProvider: import('firebase/auth').GoogleAuthProvider;
  firestore: typeof import('firebase/firestore');
  signInWithPopup: typeof import('firebase/auth').signInWithPopup;
  signInWithRedirect: typeof import('firebase/auth').signInWithRedirect;
  getRedirectResult: typeof import('firebase/auth').getRedirectResult;
  signInWithEmailAndPassword: typeof import('firebase/auth').signInWithEmailAndPassword;
  createUserWithEmailAndPassword: typeof import('firebase/auth').createUserWithEmailAndPassword;
  updateProfile: typeof import('firebase/auth').updateProfile;
}

let firebaseBundlePromise: Promise<FirebaseBundle | null> | null = null;

// Geautoriseerde beheerder e-mailadressen
export const ADMIN_EMAILS = ['info@boostplug.one', 'info@jamaldrenthe.com'];

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

export const DEFAULT_ADMIN_USER: AuthUser = {
  id: 'admin_boostplug',
  name: 'BoostPlug Beheerder',
  email: 'info@boostplug.one',
  accountType: 'admin',
  createdAt: new Date().toISOString(),
};

async function getFirebaseBundle(): Promise<FirebaseBundle | null> {
  if (!isConfigured) return null;

  if (!firebaseBundlePromise) {
    firebaseBundlePromise = (async () => {
      try {
        const [
          { initializeApp, getApps },
          { 
            getAuth, 
            GoogleAuthProvider, 
            signInWithPopup, 
            signInWithRedirect,
            getRedirectResult,
            signInWithEmailAndPassword, 
            createUserWithEmailAndPassword, 
            updateProfile 
          },
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
        googleProvider.addScope('email');
        googleProvider.addScope('profile');
        googleProvider.setCustomParameters({
          prompt: 'select_account',
        });

        return {
          auth,
          db,
          googleProvider,
          firestore,
          signInWithPopup,
          signInWithRedirect,
          getRedirectResult,
          signInWithEmailAndPassword,
          createUserWithEmailAndPassword,
          updateProfile
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
 * Controleer of er een Google redirect login resultaat wacht (bijvoorbeeld na pop-up blokkade)
 */
export async function checkGoogleRedirectResult(): Promise<{ ok: boolean; user?: AuthUser; error?: string } | null> {
  if (!isConfigured) return null;
  try {
    const fb = await getFirebaseBundle();
    if (!fb) return null;
    const result = await fb.getRedirectResult(fb.auth);
    if (result && result.user) {
      const email = result.user.email?.toLowerCase() || '';
      const name = result.user.displayName || email.split('@')[0];
      const isAdmin = isAdminEmail(email);
      const authUser: AuthUser = {
        id: result.user.uid,
        name,
        email,
        accountType: isAdmin ? 'admin' : 'customer',
        createdAt: result.user.metadata?.creationTime || new Date().toISOString(),
      };
      return { ok: true, user: authUser };
    }
    return null;
  } catch (err: unknown) {
    console.warn('Fout bij controleren van Google redirect resultaat:', err);
    return null;
  }
}

/**
 * Inloggen met Google via Firebase Auth
 * Valt automatisch terug op veilige dev-admin login als API key niet geconfigureerd is
 */
export async function signInWithGoogle(options?: { forceDevFallback?: boolean }): Promise<{ 
  ok: boolean; 
  user?: AuthUser; 
  error?: string; 
  code?: string;
  isRedirecting?: boolean;
}> {
  if (options?.forceDevFallback) {
    return {
      ok: true,
      user: {
        ...DEFAULT_ADMIN_USER,
        createdAt: new Date().toISOString(),
      },
    };
  }

  if (isConfigured) {
    try {
      const fb = await getFirebaseBundle();
      if (!fb) {
        return { ok: false, error: 'Firebase kon niet worden geïnitialiseerd.' };
      }

      let result;
      try {
        result = await fb.signInWithPopup(fb.auth, fb.googleProvider);
      } catch (popupErr: any) {
        if (popupErr?.code === 'auth/popup-blocked') {
          console.info('Google popup geblokkeerd door browser, schakelt over naar redirect...');
          await fb.signInWithRedirect(fb.auth, fb.googleProvider);
          return { ok: false, isRedirecting: true, error: 'Doorsturen naar Google login...' };
        }
        throw popupErr;
      }

      const email = result.user.email?.toLowerCase() || '';
      const name = result.user.displayName || email.split('@')[0];
      const isAdmin = isAdminEmail(email);
      
      const authUser: AuthUser = {
        id: result.user.uid,
        name,
        email,
        accountType: isAdmin ? 'admin' : 'customer',
        createdAt: result.user.metadata?.creationTime || new Date().toISOString(),
      };
      return { ok: true, user: authUser };
    } catch (err: unknown) {
      console.error('Firebase Google login fout:', err);
      const code = (err as { code?: string })?.code;
      let errorMsg = 'Google login mislukt';

      if (code === 'auth/unauthorized-domain') {
        const hostname = typeof window !== 'undefined' ? window.location.hostname : 'huidige domein';
        errorMsg = `Domein '${hostname}' is nog niet gemachtigd in Firebase Console. Voeg '${hostname}' toe in Firebase Console -> Authentication -> Settings -> Authorized Domains.`;
      } else if (code === 'auth/popup-blocked') {
        errorMsg = 'Pop-up geblokkeerd door je browser. Sta pop-ups toe of gebruik inloggen via e-mail.';
      } else if (code === 'auth/popup-closed-by-user') {
        errorMsg = 'Inloggen geannuleerd (het Google loginvenster werd gesloten).';
      } else if (code === 'auth/operation-not-allowed') {
        errorMsg = 'Google Sign-In is niet ingeschakeld in Firebase Console (Authentication -> Sign-in method -> Google).';
      } else if (code === 'auth/cancelled-popup-request') {
        errorMsg = 'Er is al een Google login venster actief.';
      } else if (code === 'auth/network-request-failed') {
        errorMsg = 'Netwerkfout bij verbinden met Google Auth. Controleer je internetverbinding of adblocker.';
      } else if (err instanceof Error) {
        errorMsg = err.message;
      }

      return { ok: false, error: errorMsg, code };
    }
  }

  // Lokale fallback voor development
  return {
    ok: true,
    user: {
      ...DEFAULT_ADMIN_USER,
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

/**
 * Inloggen met e-mail en wachtwoord via Firebase Auth
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ ok: boolean; user?: AuthUser; error?: string }> {
  const normEmail = email.trim().toLowerCase();
  if (isConfigured) {
    try {
      const fb = await getFirebaseBundle();
      if (fb) {
        const result = await fb.signInWithEmailAndPassword(fb.auth, normEmail, password);
        const userEmail = result.user.email?.toLowerCase() || normEmail;
        const name = result.user.displayName || userEmail.split('@')[0];
        const isAdmin = isAdminEmail(userEmail);
        const authUser: AuthUser = {
          id: result.user.uid,
          name,
          email: userEmail,
          accountType: isAdmin ? 'admin' : 'customer',
          createdAt: result.user.metadata?.creationTime || new Date().toISOString(),
        };
        return { ok: true, user: authUser };
      }
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      let errorMsg = 'Inloggen mislukt. Controleer je gegevens.';
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        errorMsg = 'Onjuiste combinatie van e-mailadres en wachtwoord.';
      } else if (code === 'auth/too-many-requests') {
        errorMsg = 'Te veel pogingen. Probeer het over enkele minuten opnieuw.';
      } else if (err instanceof Error) {
        errorMsg = err.message;
      }
      return { ok: false, error: errorMsg };
    }
  }

  // Lokale dev-fallback
  const isAdmin = isAdminEmail(normEmail);
  return {
    ok: true,
    user: {
      id: isAdmin ? 'admin_boostplug' : 'dev_usr_' + Math.random().toString(36).substring(2, 8),
      name: isAdmin ? 'BoostPlug Beheerder' : normEmail.split('@')[0],
      email: normEmail,
      accountType: isAdmin ? 'admin' : 'customer',
      createdAt: new Date().toISOString(),
    },
  };
}

/**
 * Registreren met e-mail, wachtwoord en naam via Firebase Auth
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  name: string,
  accountType: import('@/types').AccountType = 'customer'
): Promise<{ ok: boolean; user?: AuthUser; error?: string }> {
  const normEmail = email.trim().toLowerCase();
  const trimmedName = name.trim();
  const resolvedRole: import('@/types').AccountType = isAdminEmail(normEmail) ? 'admin' : accountType;

  if (isConfigured) {
    try {
      const fb = await getFirebaseBundle();
      if (fb) {
        const cred = await fb.createUserWithEmailAndPassword(fb.auth, normEmail, password);
        if (trimmedName && fb.auth.currentUser) {
          try {
            await fb.updateProfile(fb.auth.currentUser, { displayName: trimmedName });
          } catch {
            // Niet kritiek
          }
        }
        const authUser: AuthUser = {
          id: cred.user.uid,
          name: trimmedName || cred.user.email?.split('@')[0] || normEmail.split('@')[0],
          email: normEmail,
          accountType: resolvedRole,
          createdAt: cred.user.metadata?.creationTime || new Date().toISOString(),
        };
        return { ok: true, user: authUser };
      }
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      let errorMsg = 'Registreren mislukt.';
      if (code === 'auth/email-already-in-use') {
        errorMsg = 'Er bestaat al een account met dit e-mailadres.';
      } else if (code === 'auth/weak-password') {
        errorMsg = 'Wachtwoord is te zwak (minimaal 6 tekens).';
      } else if (code === 'auth/invalid-email') {
        errorMsg = 'Ongeldig e-mailadres.';
      } else if (err instanceof Error) {
        errorMsg = err.message;
      }
      return { ok: false, error: errorMsg };
    }
  }

  // Lokale dev-fallback
  return {
    ok: true,
    user: {
      id: resolvedRole === 'admin' ? 'admin_jamal' : 'dev_usr_' + Math.random().toString(36).substring(2, 8),
      name: trimmedName || normEmail.split('@')[0],
      email: normEmail,
      accountType: resolvedRole,
      createdAt: new Date().toISOString(),
    },
  };
}

/**
 * Cross-device fallback: haal een bestelling eenmalig op via Firestore met trackingToken
 */
export async function fetchOrderByTokenFromFirestore(token: string): Promise<Order | null> {
  const cleanToken = token.trim();
  if (!cleanToken || !isConfigured) return null;

  try {
    const fb = await getFirebaseBundle();
    if (!fb) return null;

    const ordersRef = fb.firestore.collection(fb.db, 'orders');

    // 1. Zoek op trackingToken
    const q1 = fb.firestore.query(
      ordersRef,
      fb.firestore.where('trackingToken', '==', cleanToken),
      fb.firestore.limit(1)
    );
    const snap1 = await fb.firestore.getDocs(q1);
    if (!snap1.empty) {
      const data = snap1.docs[0].data();
      return {
        ...data,
        createdAt: new Date(data.createdAt),
        deliveredAt: data.deliveredAt ? new Date(data.deliveredAt) : undefined,
      } as Order;
    }

    // 2. Zoek op orderNumber
    const q2 = fb.firestore.query(
      ordersRef,
      fb.firestore.where('orderNumber', '==', cleanToken),
      fb.firestore.limit(1)
    );
    const snap2 = await fb.firestore.getDocs(q2);
    if (!snap2.empty) {
      const data = snap2.docs[0].data();
      return {
        ...data,
        createdAt: new Date(data.createdAt),
        deliveredAt: data.deliveredAt ? new Date(data.deliveredAt) : undefined,
      } as Order;
    }

    // 3. Directe document ID controle
    const docRef = fb.firestore.doc(fb.db, 'orders', cleanToken);
    const docSnap = await fb.firestore.getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        createdAt: new Date(data.createdAt),
        deliveredAt: data.deliveredAt ? new Date(data.deliveredAt) : undefined,
      } as Order;
    }

    return null;
  } catch (err) {
    console.warn('Fout bij ophalen van order via Firestore token lookup:', err);
    return null;
  }
}

/**
 * Realtime Firestore listener voor bestellingen in het admin dashboard (onSnapshot)
 */
export function subscribeToFirestoreOrders(
  onOrders: (orders: Order[]) => void,
  onError?: (error: unknown) => void
): () => void {
  if (!isConfigured) {
    return () => {};
  }

  let unsubscribe: (() => void) | null = null;
  let isCancelled = false;

  getFirebaseBundle().then((fb) => {
    if (isCancelled || !fb) return;
    try {
      const ordersCol = fb.firestore.collection(fb.db, 'orders');
      unsubscribe = fb.firestore.onSnapshot(
        ordersCol,
        (snapshot) => {
          const orders: Order[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            orders.push({
              ...data,
              createdAt: new Date(data.createdAt),
              deliveredAt: data.deliveredAt ? new Date(data.deliveredAt) : undefined,
            } as Order);
          });
          onOrders(orders);
        },
        (err) => {
          console.warn('Firestore onSnapshot listener fout:', err);
          if (onError) onError(err);
        }
      );
    } catch (err) {
      console.warn('Kon Firestore onSnapshot niet starten:', err);
      if (onError) onError(err);
    }
  });

  return () => {
    isCancelled = true;
    if (unsubscribe) {
      unsubscribe();
    }
  };
}
