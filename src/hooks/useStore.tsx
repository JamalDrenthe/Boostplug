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
  SubscriptionStatus,
  MemberMiningProfile,
  StoredUser,
} from '@/types';
import {
  DEMO_ACCOUNTS_CONFIG,
  DEMO_ACCOUNTS_LIST,
  isDemoEmail,
  getDemoConfigByEmail,
} from '@/data/demoAccounts';
const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY && (import.meta.env.VITE_FIREBASE_PROJECT_ID || 'boostplug-dev')
);

export type { StoredUser } from '@/types';

const USERS_KEY = 'boostplug_users';
const SESSION_KEY = 'boostplug_session';
const ORDERS_KEY = 'boostplug_orders';
const SUBSCRIPTIONS_KEY = 'boostplug_subscriptions';

const ADMIN_EMAILS = ['info@boostplug.one', 'info@jamaldrenthe.com', 'demo-admin@boostplug.one'];
function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

function quickHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'bp_' + Math.abs(hash).toString(36);
}

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
  const users = loadJSON<StoredUser[]>(USERS_KEY, []);
  let changed = false;
  DEMO_ACCOUNTS_LIST.forEach((demo) => {
    if (!users.some((u) => u.email.toLowerCase() === demo.email.toLowerCase())) {
      users.push(demo.user);
      changed = true;
    }
  });
  if (changed) {
    saveJSON(USERS_KEY, users);
  }
  return users;
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
  fetchFirestoreOrderByToken: (token: string) => Promise<Order | null>;
  syncLiveOrders: (remoteOrders: Order[]) => void;

  // Subscriptions
  subscriptions: Subscription[];
  addSubscription: (subscription: Subscription) => void;
  cancelSubscription: (id: string) => void;
  updateSubscriptionStatus: (id: string, status: SubscriptionStatus) => void;

  // Account & Auth
  user: AuthUser | null;
  isDemoUser: boolean;
  register: (name: string, email: string, password: string, accountType: AccountType) => Promise<{ ok: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  loginAsDemo: (type: 'customer' | 'member' | 'admin') => Promise<{ ok: boolean; error?: string; user?: AuthUser }>;
  loginWithGoogle: (options?: { forceDevFallback?: boolean }) => Promise<{ ok: boolean; error?: string; isRedirecting?: boolean }>;
  logout: () => void;
  updateUserProfile: (updates: Partial<AuthUser>) => void;
  reorderCart: (items: CartItem[]) => void;

  // Member Mining
  saveMiningProfile: (profileUpdates: Partial<MemberMiningProfile>) => void;
  getMemberMiningProfile: (userId?: string) => MemberMiningProfile;

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
    if (raw.length === 0) {
      const initial = [
        ...DEMO_ACCOUNTS_CONFIG.customer.orders,
        ...DEMO_ACCOUNTS_CONFIG.member.orders,
      ];
      saveJSON(ORDERS_KEY, initial);
      return initial;
    }
    return raw.map(o => ({ ...o, createdAt: new Date(o.createdAt) }));
  });
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => {
    const raw = loadJSON<Subscription[]>(SUBSCRIPTIONS_KEY, []);
    if (raw.length === 0) {
      const initial = DEMO_ACCOUNTS_CONFIG.customer.subscriptions;
      saveJSON(SUBSCRIPTIONS_KEY, initial);
      return initial;
    }
    return raw;
  });
  const [user, setUser] = useState<AuthUser | null>(() => {
    const loaded = loadJSON<AuthUser | null>(SESSION_KEY, null);
    if (loaded && loaded.email && isAdminEmail(loaded.email)) {
      return { ...loaded, accountType: 'admin' };
    }
    return loaded;
  });

  // Optionele achtergrondsfeer-sync met Firestore als Firebase actief is
  useEffect(() => {
    if (isFirebaseConfigured && user?.accountType === 'admin') {
      import('@/lib/firebase').then(({ fetchFirestoreOrders }) => {
        fetchFirestoreOrders().then((remoteOrders) => {
          if (remoteOrders && remoteOrders.length > 0) {
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
      });
    }

    // Controleer of er een Google redirect login resultaat wacht
    if (isFirebaseConfigured && !user) {
      import('@/lib/firebase').then(({ checkGoogleRedirectResult }) => {
        checkGoogleRedirectResult().then((res) => {
          if (res?.ok && res.user) {
            const emailNorm = res.user.email.toLowerCase();
            const isAdmin = isAdminEmail(emailNorm);
            const session: AuthUser = {
              ...res.user,
              accountType: isAdmin ? 'admin' : res.user.accountType,
            };
            setUser(session);
            saveJSON(SESSION_KEY, session);
          }
        });
      });
    }
  }, [user]);

  const register = useCallback(async (name: string, email: string, password: string, accountType: AccountType) => {
    const normalized = email.trim().toLowerCase();
    const resolvedRole: AccountType = isAdminEmail(normalized) ? 'admin' : accountType;

    // 1. Registreren via Firebase Auth (met lokale fallback in firebase.ts)
    const { signUpWithEmail } = await import('@/lib/firebase');
    const fbRes = await signUpWithEmail(normalized, password, name, resolvedRole);
    if (!fbRes.ok || !fbRes.user) {
      return { ok: false, error: fbRes.error || 'Registreren mislukt' };
    }

    const session: AuthUser = {
      ...fbRes.user,
      accountType: resolvedRole,
    };
    setUser(session);
    saveJSON(SESSION_KEY, session);

    // Sla gebruiker lokaal op zonder plain-text wachtwoord
    const users = getStoredUsers();
    const existingIndex = users.findIndex(u => u.email.toLowerCase() === normalized);
    const storedUser: StoredUser = {
      ...session,
      passwordHash: quickHash(password),
      miningStep: resolvedRole === 'member' ? 1 : undefined,
    };
    if (existingIndex >= 0) {
      users[existingIndex] = storedUser;
      saveStoredUsers(users);
    } else {
      saveStoredUsers([...users, storedUser]);
    }

    return { ok: true };
  }, []);

  const loginAsDemo = useCallback(async (type: 'customer' | 'member' | 'admin') => {
    const config = DEMO_ACCOUNTS_CONFIG[type];
    if (!config) return { ok: false, error: 'Onbekend demo account' };

    setOrders(prev => {
      const map = new Map<string, Order>();
      prev.forEach(o => map.set(o.id, o));
      config.orders.forEach(o => map.set(o.id, o));
      const merged = Array.from(map.values());
      saveJSON(ORDERS_KEY, merged);
      return merged;
    });

    if (config.subscriptions.length > 0) {
      setSubscriptions(prev => {
        const map = new Map<string, Subscription>();
        prev.forEach(s => map.set(s.id, s));
        config.subscriptions.forEach(s => map.set(s.id, s));
        const merged = Array.from(map.values());
        saveJSON(SUBSCRIPTIONS_KEY, merged);
        return merged;
      });
    }

    const users = getStoredUsers();
    const idx = users.findIndex(u => u.email.toLowerCase() === config.user.email.toLowerCase());
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...config.user };
      saveStoredUsers(users);
    } else {
      saveStoredUsers([...users, config.user]);
    }

    const sessionUser: AuthUser = {
      id: config.user.id,
      name: config.user.name,
      email: config.user.email,
      accountType: config.role,
      createdAt: config.user.createdAt,
      phone: config.user.phone,
      companyOrArtistName: config.user.companyOrArtistName,
      kvkOrVat: config.user.kvkOrVat,
      billingAddress: config.user.billingAddress,
      ibanPayout: config.user.ibanPayout,
      ibanHolder: config.user.ibanHolder,
      preferredCurrency: config.user.preferredCurrency,
      emailNotifications: config.user.emailNotifications,
      miningProfile: config.user.miningProfile,
    };

    setUser(sessionUser);
    saveJSON(SESSION_KEY, sessionUser);
    return { ok: true, user: sessionUser };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const normalized = email.trim().toLowerCase();
    const isAdmin = isAdminEmail(normalized);

    // 0. Snelle controle op Demo Accounts
    const demoConfig = getDemoConfigByEmail(normalized);
    if (demoConfig) {
      const cleanPass = password.trim().toLowerCase();
      if (cleanPass === 'demo1234' || cleanPass === 'demo' || cleanPass === 'boostplug' || !isFirebaseConfigured) {
        return await loginAsDemo(demoConfig.role);
      }
    }

    // 1. Inloggen via Firebase Auth
    const { signInWithEmail } = await import('@/lib/firebase');
    const fbRes = await signInWithEmail(normalized, password);
    if (fbRes.ok && fbRes.user) {
      const session: AuthUser = {
        ...fbRes.user,
        accountType: isAdmin ? 'admin' : fbRes.user.accountType,
      };
      setUser(session);
      saveJSON(SESSION_KEY, session);
      return { ok: true };
    }

    // 2. Fallback controle als Firebase offline of niet geconfigureerd is
    const localUser = getStoredUsers().find(u => u.email === normalized);
    if (localUser && (localUser.passwordHash === quickHash(password) || !isFirebaseConfigured)) {
      const accountType: AccountType = isAdmin ? 'admin' : (localUser.accountType ?? 'customer');
      const session: AuthUser = {
        id: localUser.id,
        name: localUser.name,
        email: localUser.email,
        accountType,
        createdAt: localUser.createdAt,
        phone: localUser.phone,
        companyOrArtistName: localUser.companyOrArtistName,
        kvkOrVat: localUser.kvkOrVat,
        billingAddress: localUser.billingAddress,
        ibanPayout: localUser.ibanPayout,
        ibanHolder: localUser.ibanHolder,
        preferredCurrency: localUser.preferredCurrency,
        emailNotifications: localUser.emailNotifications,
        miningProfile: localUser.miningProfile,
      };
      setUser(session);
      saveJSON(SESSION_KEY, session);
      return { ok: true };
    }

    return { ok: false, error: fbRes.error || 'Onjuiste combinatie van e-mailadres en wachtwoord.' };
  }, [loginAsDemo]);

  const loginWithGoogleHandler = useCallback(async (options?: { forceDevFallback?: boolean }) => {
    const { signInWithGoogle } = await import('@/lib/firebase');
    const res = await signInWithGoogle(options);
    if (res.isRedirecting) {
      return { ok: false, isRedirecting: true, error: res.error };
    }
    if (!res.ok || !res.user) {
      return { ok: false, error: res.error || 'Google login mislukt' };
    }
    const emailNorm = res.user.email.toLowerCase();
    const isAdmin = isAdminEmail(emailNorm);
    const session: AuthUser = {
      ...res.user,
      accountType: isAdmin ? 'admin' : res.user.accountType,
    };
    setUser(session);
    saveJSON(SESSION_KEY, session);

    // Voeg toe aan lokale users als nog niet aanwezig of werk admin-status bij
    const users = getStoredUsers();
    const existingIndex = users.findIndex(u => u.email.toLowerCase() === emailNorm);
    if (existingIndex >= 0) {
      if (isAdmin && users[existingIndex].accountType !== 'admin') {
        users[existingIndex].accountType = 'admin';
        saveStoredUsers(users);
      }
    } else {
      saveStoredUsers([...users, { ...session, miningStep: 1 }]);
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

  const updateUserProfile = useCallback((updates: Partial<AuthUser>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated: AuthUser = { ...prev, ...updates };
      if (isAdminEmail(updated.email)) {
        updated.accountType = 'admin';
      }
      saveJSON(SESSION_KEY, updated);

      const users = getStoredUsers();
      const idx = users.findIndex(u => u.email.toLowerCase() === prev.email.toLowerCase());
      if (idx >= 0) {
        users[idx] = { ...users[idx], ...updated };
        saveStoredUsers(users);
      }
      return updated;
    });
  }, []);

  const reorderCart = useCallback((items: CartItem[]) => {
    setCart(items);
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
    import('@/lib/firebase').then(({ syncOrderToFirestore }) => syncOrderToFirestore(order));
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
          import('@/lib/firebase').then(({ updateFirestoreOrder }) => {
            updateFirestoreOrder(order.id, { 
              status, 
              deliveryProgress: updated.deliveryProgress, 
              deliveredAt: updated.deliveredAt 
            });
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
    import('@/lib/firebase').then(({ syncSubscriptionToFirestore }) => syncSubscriptionToFirestore(subscription));
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
    const norm = token.trim().toLowerCase();
    if (!norm) return undefined;
    return orders.find(order => 
      order.trackingToken.toLowerCase() === norm ||
      order.orderNumber.toLowerCase() === norm ||
      order.id.toLowerCase() === norm
    );
  }, [orders]);

  const fetchFirestoreOrderByToken = useCallback(async (token: string): Promise<Order | null> => {
    const cleanToken = token.trim();
    if (!cleanToken) return null;

    // Haal op uit Firestore
    const { fetchOrderByTokenFromFirestore } = await import('@/lib/firebase');
    const remoteOrder = await fetchOrderByTokenFromFirestore(cleanToken);
    if (remoteOrder) {
      setOrders(prev => {
        if (prev.some(o => o.id === remoteOrder.id)) return prev;
        const next = [remoteOrder, ...prev];
        saveJSON(ORDERS_KEY, next);
        return next;
      });
    }
    return remoteOrder;
  }, []);

  const syncLiveOrders = useCallback((remoteOrders: Order[]) => {
    if (!remoteOrders || remoteOrders.length === 0) return;
    setOrders(prev => {
      const map = new Map<string, Order>();
      prev.forEach(o => map.set(o.id, o));
      remoteOrders.forEach(o => map.set(o.id, o));
      const merged = Array.from(map.values()).sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      saveJSON(ORDERS_KEY, merged);
      return merged;
    });
  }, []);

  const getMemberMiningProfile = useCallback((userId?: string): MemberMiningProfile => {
    const targetId = userId || user?.id || 'demo_member';
    if (user?.id === targetId && user.miningProfile) {
      return user.miningProfile;
    }
    const stored = getStoredUsers().find(u => u.id === targetId);
    if (stored?.miningProfile) {
      return stored.miningProfile;
    }
    const tokenSeed = Math.random().toString(36).substring(2, 6).toUpperCase();
    return {
      userId: targetId,
      currentStep: 1,
      completedSteps: [],
      vvcMemberCode: '',
      xabiWorldUsername: '',
      groverData: {
        orderNumber: '',
        deviceType: 'mac_mini_m2',
        serialOrMac: '',
        discountCode: 'QUANTUMBOOST20',
        rentalTermMonths: 12,
        status: 'ordered',
      },
      softwareConfig: {
        nodeToken: `BP-NODE-${targetId.slice(0, 6).toUpperCase()}-${tokenSeed}`,
        osPlatform: 'macos',
        ipPoolRegion: 'eu-west-1',
        threadsLimitPercent: 75,
        autoStartOnBoot: true,
        status: 'pending_installation',
        assignedIp: '84.112.44.192 (KPN Residentieel)',
        hashRateOrStreamsPerHour: 120,
      },
      estimatedMonthlyEarnings: 185,
      updatedAt: new Date().toISOString(),
    };
  }, [user]);

  const saveMiningProfile = useCallback((updates: Partial<MemberMiningProfile>) => {
    if (!user) return;
    const current = getMemberMiningProfile(user.id);
    const updated: MemberMiningProfile = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const updatedUser: AuthUser = {
      ...user,
      miningProfile: updated,
    };

    setUser(updatedUser);
    saveJSON(SESSION_KEY, updatedUser);

    const users = getStoredUsers();
    const updatedUsers = users.map(u => u.id === user.id ? { ...u, miningProfile: updated } : u);
    saveStoredUsers(updatedUsers);

    import('@/lib/firebase').then(({ syncMiningProfileToFirestore }) => syncMiningProfileToFirestore(updated));
  }, [user, getMemberMiningProfile]);

  const getAllUsers = useCallback(() => {
    const list = getStoredUsers();
    // Zorg dat admin info@boostplug.one er altijd tussen staat en gegarandeerd admin is
    const adminIndex = list.findIndex(u => isAdminEmail(u.email));
    if (adminIndex === -1) {
      list.unshift({
        id: 'admin_boostplug',
        name: 'BoostPlug Beheerder',
        email: 'info@boostplug.one',
        accountType: 'admin',
        createdAt: '2026-10-10T12:00:00.000Z',
      });
    } else {
      list[adminIndex].accountType = 'admin';
    }
    return list;
  }, []);

  const seedDemoData = useCallback(() => {
    const demoOrders: Order[] = [
      ...DEMO_ACCOUNTS_CONFIG.customer.orders,
      ...DEMO_ACCOUNTS_CONFIG.member.orders,
    ];
    const demoSubs: Subscription[] = [
      ...DEMO_ACCOUNTS_CONFIG.customer.subscriptions,
    ];
    const demoUsers: StoredUser[] = DEMO_ACCOUNTS_LIST.map(d => d.user);

    setOrders(demoOrders);
    saveJSON(ORDERS_KEY, demoOrders);
    setSubscriptions(demoSubs);
    saveJSON(SUBSCRIPTIONS_KEY, demoSubs);
    saveStoredUsers(demoUsers);
  }, []);

  const syncWithFirebase = useCallback(async () => {
    if (!isFirebaseConfigured) {
      return { 
        success: false, 
        message: 'Firebase is lokaal actief in veilige fallback mode. Voeg VITE_FIREBASE_API_KEY toe in .env voor live Firestore sync.' 
      };
    }
    try {
      const { syncOrderToFirestore, syncSubscriptionToFirestore } = await import('@/lib/firebase');
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
      fetchFirestoreOrderByToken,
      syncLiveOrders,
      subscriptions,
      addSubscription,
      cancelSubscription,
      updateSubscriptionStatus,
      user,
      isDemoUser: isDemoEmail(user?.email),
      register,
      login,
      loginAsDemo,
      loginWithGoogle: loginWithGoogleHandler,
      logout,
      updateUserProfile,
      reorderCart,
      saveMiningProfile,
      getMemberMiningProfile,
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
