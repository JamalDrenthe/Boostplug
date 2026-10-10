import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { 
  CartItem, 
  ProductCategory, 
  Currency, 
  Locale, 
  Order, 
  OrderStatus, 
  AuthUser, 
  AccountType, 
  Subscription, 
  SubscriptionStatus 
} from '@/types';
import {
  signInWithGoogle,
  syncOrderToFirestore,
  syncSubscriptionToFirestore,
  updateFirestoreOrder,
  fetchFirestoreOrders,
  isConfigured as isFirebaseConfigured,
} from '@/lib/firebase';

export interface StoredUser extends AuthUser {
  password?: string;
  miningStep?: number;
}

const USERS_KEY = 'boostplug_users';
const SESSION_KEY = 'boostplug_session';
const ORDERS_KEY = 'boostplug_orders';
const SUBSCRIPTIONS_KEY = 'boostplug_subscriptions';

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage unavailable
  }
}

function getStoredUsers(): StoredUser[] {
  return loadJSON<StoredUser[]>(USERS_KEY, []);
}

function saveStoredUsers(users: StoredUser[]) {
  saveJSON(USERS_KEY, users);
}

interface StoreState {
  // Product selection
  activeCategory: ProductCategory;
  setActiveCategory: (category: ProductCategory) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  
  // Currency & Locale
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  
  // Checkout
  checkoutEmail: string;
  setCheckoutEmail: (email: string) => void;
  
  // Orders
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (tokenOrId: string, status: OrderStatus, progress?: number) => void;
  deleteOrder: (id: string) => void;
  getOrderByToken: (token: string) => Order | undefined;

  // Subscriptions
  subscriptions: Subscription[];
  addSubscription: (subscription: Subscription) => void;
  cancelSubscription: (id: string) => void;
  updateSubscriptionStatus: (id: string, status: SubscriptionStatus) => void;

  // Account & Auth
  user: AuthUser | null;
  register: (name: string, email: string, password: string, accountType: AccountType) => { ok: boolean; error?: string };
  login: (email: string, password: string) => { ok: boolean; error?: string };
  loginWithGoogle: () => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;

  // Admin & System
  isFirebaseConfigured: boolean;
  getAllUsers: () => StoredUser[];
  seedDemoData: () => void;
  syncWithFirebase: () => Promise<{ success: boolean; message: string }>;
}

const StoreContext = createContext<StoreState | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('streams');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currency, setCurrency] = useState<Currency>('EUR');
  const [locale, setLocale] = useState<Locale>('nl');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [orders, setOrders] = useState<Order[]>(() => {
    const raw = loadJSON<Order[]>(ORDERS_KEY, []);
    return raw.map(o => ({ ...o, createdAt: new Date(o.createdAt) }));
  });
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => loadJSON<Subscription[]>(SUBSCRIPTIONS_KEY, []));
  const [user, setUser] = useState<AuthUser | null>(() => loadJSON<AuthUser | null>(SESSION_KEY, null));

  // Optionele achtergrondsfeer-sync met Firestore als Firebase actief is
  useEffect(() => {
    if (isFirebaseConfigured && user?.accountType === 'admin') {
      fetchFirestoreOrders().then((remoteOrders) => {
        if (remoteOrders.length > 0) {
          setOrders(prev => {
            const map = new Map<string, Order>();
            prev.forEach(o => map.set(o.id, o));
            remoteOrders.forEach(o => map.set(o.id, o));
            const merged = Array.from(map.values());
            saveJSON(ORDERS_KEY, merged);
            return merged;
          });
        }
      });
    }
  }, [user]);

  const register = useCallback((name: string, email: string, password: string, accountType: AccountType) => {
    const normalized = email.trim().toLowerCase();
    const users = getStoredUsers();
    if (users.some(u => u.email === normalized)) {
      return { ok: false, error: 'Er bestaat al een account met dit e-mailadres.' };
    }
    const resolvedRole: AccountType = normalized === 'info@jamaldrenthe.com' ? 'admin' : accountType;
    const newUser: StoredUser = {
      id: Math.random().toString(36).substring(2, 10),
      name: name.trim(),
      email: normalized,
      password,
      accountType: resolvedRole,
      createdAt: new Date().toISOString(),
      miningStep: resolvedRole === 'member' ? 1 : undefined,
    };
    saveStoredUsers([...users, newUser]);
    const session: AuthUser = { 
      id: newUser.id, 
      name: newUser.name, 
      email: newUser.email, 
      accountType: newUser.accountType, 
      createdAt: newUser.createdAt 
    };
    setUser(session);
    saveJSON(SESSION_KEY, session);
    return { ok: true };
  }, []);

  const login = useCallback((email: string, password: string) => {
    const normalized = email.trim().toLowerCase();
    const found = getStoredUsers().find(u => u.email === normalized && u.password === password);
    if (!found) {
      return { ok: false, error: 'Onjuiste combinatie van e-mailadres en wachtwoord.' };
    }
    const accountType: AccountType = (found.email === 'info@jamaldrenthe.com') ? 'admin' : (found.accountType ?? 'customer');
    const session: AuthUser = { id: found.id, name: found.name, email: found.email, accountType, createdAt: found.createdAt };
    setUser(session);
    saveJSON(SESSION_KEY, session);
    return { ok: true };
  }, []);

  const loginWithGoogleHandler = useCallback(async () => {
    const res = await signInWithGoogle();
    if (!res.ok || !res.user) {
      return { ok: false, error: res.error || 'Google login mislukt' };
    }
    setUser(res.user);
    saveJSON(SESSION_KEY, res.user);

    // Voeg toe aan lokale users als nog niet aanwezig
    const users = getStoredUsers();
    if (!users.some(u => u.email === res.user?.email)) {
      saveStoredUsers([...users, { ...res.user, miningStep: 1 }]);
    }
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      // sessie blijft in memory
    }
  }, []);

  const addToCart = useCallback((item: CartItem) => {
    setCart(prev => [...prev, item]);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const addOrder = useCallback((order: Order) => {
    setOrders(prev => {
      const next = [order, ...prev];
      saveJSON(ORDERS_KEY, next);
      return next;
    });
    // Async push naar Firestore
    syncOrderToFirestore(order);
  }, []);

  const updateOrderStatus = useCallback((tokenOrId: string, status: OrderStatus, progress?: number) => {
    setOrders(prev => {
      const next = prev.map(order => {
        if (order.trackingToken === tokenOrId || order.id === tokenOrId) {
          const updated = { 
            ...order, 
            status, 
            deliveryProgress: progress !== undefined ? progress : order.deliveryProgress,
            deliveredAt: status === 'delivered' ? new Date() : order.deliveredAt
          };
          // Async update in Firestore
          updateFirestoreOrder(order.id, { 
            status, 
            deliveryProgress: updated.deliveryProgress, 
            deliveredAt: updated.deliveredAt 
          });
          return updated;
        }
        return order;
      });
      saveJSON(ORDERS_KEY, next);
      return next;
    });
  }, []);

  const deleteOrder = useCallback((id: string) => {
    setOrders(prev => {
      const next = prev.filter(o => o.id !== id);
      saveJSON(ORDERS_KEY, next);
      return next;
    });
  }, []);

  const addSubscription = useCallback((subscription: Subscription) => {
    setSubscriptions(prev => {
      const next = [subscription, ...prev];
      saveJSON(SUBSCRIPTIONS_KEY, next);
      return next;
    });
    syncSubscriptionToFirestore(subscription);
  }, []);

  const cancelSubscription = useCallback((id: string) => {
    setSubscriptions(prev => {
      const next = prev.map(sub =>
        sub.id === id ? { ...sub, status: 'cancelled' as const } : sub
      );
      saveJSON(SUBSCRIPTIONS_KEY, next);
      return next;
    });
  }, []);

  const updateSubscriptionStatus = useCallback((id: string, status: SubscriptionStatus) => {
    setSubscriptions(prev => {
      const next = prev.map(sub =>
        sub.id === id ? { ...sub, status } : sub
      );
      saveJSON(SUBSCRIPTIONS_KEY, next);
      return next;
    });
  }, []);

  const getOrderByToken = useCallback((token: string) => {
    return orders.find(order => order.trackingToken === token);
  }, [orders]);

  const getAllUsers = useCallback(() => {
    const list = getStoredUsers();
    // Zorg dat admin Jamal er altijd tussen staat
    if (!list.some(u => u.email === 'info@jamaldrenthe.com')) {
      list.unshift({
        id: 'admin_jamal',
        name: 'Jamal Drenthe',
        email: 'info@jamaldrenthe.com',
        accountType: 'admin',
        createdAt: '2026-10-10T12:00:00.000Z',
      });
    }
    return list;
  }, []);

  const seedDemoData = useCallback(() => {
    const demoOrders: Order[] = [
      {
        id: 'bp_ord_101',
        orderNumber: 'BP-202610-00421',
        email: 'info@jamaldrenthe.com',
        locale: 'nl',
        currency: 'EUR',
        items: [
          {
            id: 'c1',
            category: 'streams',
            platform: 'spotify',
            platformName: 'Spotify',
            typeName: 'Premium Streams',
            quantity: 50000,
            quality: 'premium',
            price: 189,
            currency: 'EUR',
            targetUrl: 'https://open.spotify.com/artist/zheavenzy-official',
          },
        ],
        totalPrice: 189,
        status: 'processing',
        deliveryProgress: 65,
        trackingToken: 'BP-SPOT-7721',
        createdAt: new Date(Date.now() - 3600 * 1000 * 24),
      },
      {
        id: 'bp_ord_102',
        orderNumber: 'BP-202610-00422',
        email: 'member@quantuminitium.com',
        locale: 'nl',
        currency: 'EUR',
        items: [
          {
            id: 'c2',
            category: 'reviews',
            platform: 'google_maps',
            platformName: 'Google Maps',
            quantity: 15,
            price: 75,
            currency: 'EUR',
            targetUrl: 'https://maps.google.com/?cid=12345678',
            rating: 5,
          },
        ],
        totalPrice: 75,
        status: 'delivered',
        deliveryProgress: 100,
        trackingToken: 'BP-GMAP-9902',
        createdAt: new Date(Date.now() - 3600 * 1000 * 72),
        deliveredAt: new Date(Date.now() - 3600 * 1000 * 12),
      },
      {
        id: 'bp_ord_103',
        orderNumber: 'BP-202610-00423',
        email: 'klant@spontiva.nl',
        locale: 'nl',
        currency: 'EUR',
        items: [
          {
            id: 'c3',
            category: 'streams',
            platform: 'apple_music',
            platformName: 'Apple Music',
            typeName: 'Plays & Saves',
            quantity: 10000,
            price: 49,
            currency: 'EUR',
            targetUrl: 'https://music.apple.com/album/example',
          },
        ],
        totalPrice: 49,
        status: 'pending',
        deliveryProgress: 10,
        trackingToken: 'BP-APPL-3310',
        createdAt: new Date(),
      },
    ];

    const demoSubs: Subscription[] = [
      {
        id: 'SUB-STARTER-1',
        planId: 'growth',
        planName: 'Growth',
        email: 'info@jamaldrenthe.com',
        monthlyPrice: 79,
        currency: 'EUR',
        status: 'active',
        startedAt: new Date(Date.now() - 3600 * 1000 * 24 * 15).toISOString(),
        nextBillingAt: new Date(Date.now() + 3600 * 1000 * 24 * 15).toISOString(),
      },
    ];

    setOrders(demoOrders);
    saveJSON(ORDERS_KEY, demoOrders);
    setSubscriptions(demoSubs);
    saveJSON(SUBSCRIPTIONS_KEY, demoSubs);
  }, []);

  const syncWithFirebase = useCallback(async () => {
    if (!isFirebaseConfigured) {
      return { 
        success: false, 
        message: 'Firebase is lokaal actief in veilige fallback mode. Voeg VITE_FIREBASE_API_KEY toe in .env voor live Firestore sync.' 
      };
    }
    try {
      for (const order of orders) {
        await syncOrderToFirestore(order);
      }
      for (const sub of subscriptions) {
        await syncSubscriptionToFirestore(sub);
      }
      return { success: true, message: 'Succesvol gesynchroniseerd met Firestore (boostplug-dev)!' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Synchronisatie mislukt';
      return { success: false, message: msg };
    }
  }, [orders, subscriptions]);

  return (
    <StoreContext.Provider value={{
      activeCategory,
      setActiveCategory,
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      currency,
      setCurrency,
      locale,
      setLocale,
      checkoutEmail,
      setCheckoutEmail,
      orders,
      addOrder,
      updateOrderStatus,
      deleteOrder,
      getOrderByToken,
      subscriptions,
      addSubscription,
      cancelSubscription,
      updateSubscriptionStatus,
      user,
      register,
      login,
      loginWithGoogle: loginWithGoogleHandler,
      logout,
      isFirebaseConfigured,
      getAllUsers,
      seedDemoData,
      syncWithFirebase,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
