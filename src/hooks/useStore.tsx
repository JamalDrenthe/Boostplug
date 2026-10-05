import React, { createContext, useContext, useState, useCallback } from 'react';
import type { CartItem, ProductCategory, Currency, Locale, Order, OrderStatus, AuthUser, AccountType, Subscription } from '@/types';

interface StoredUser extends AuthUser {
  password: string;
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
    // localStorage unavailable (private mode) — sessie blijft in memory
  }
}

function getUsers(): StoredUser[] {
  return loadJSON<StoredUser[]>(USERS_KEY, []);
}

function saveUsers(users: StoredUser[]) {
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
  updateOrderStatus: (token: string, status: OrderStatus, progress?: number) => void;
  getOrderByToken: (token: string) => Order | undefined;

  // Subscriptions
  subscriptions: Subscription[];
  addSubscription: (subscription: Subscription) => void;
  cancelSubscription: (id: string) => void;

  // Account
  user: AuthUser | null;
  register: (name: string, email: string, password: string, accountType: AccountType) => { ok: boolean; error?: string };
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
}

const StoreContext = createContext<StoreState | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('streams');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currency, setCurrency] = useState<Currency>('EUR');
  const [locale, setLocale] = useState<Locale>('nl');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [orders, setOrders] = useState<Order[]>(() => loadJSON<Order[]>(ORDERS_KEY, []));
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => loadJSON<Subscription[]>(SUBSCRIPTIONS_KEY, []));
  const [user, setUser] = useState<AuthUser | null>(() => loadJSON<AuthUser | null>(SESSION_KEY, null));

  const register = useCallback((name: string, email: string, password: string, accountType: AccountType) => {
    const normalized = email.trim().toLowerCase();
    const users = getUsers();
    if (users.some(u => u.email === normalized)) {
      return { ok: false, error: 'Er bestaat al een account met dit e-mailadres.' };
    }
    const newUser: StoredUser = {
      id: Math.random().toString(36).substring(2, 10),
      name: name.trim(),
      email: normalized,
      password,
      accountType,
      createdAt: new Date().toISOString(),
    };
    saveUsers([...users, newUser]);
    const session: AuthUser = { id: newUser.id, name: newUser.name, email: newUser.email, accountType: newUser.accountType, createdAt: newUser.createdAt };
    setUser(session);
    saveJSON(SESSION_KEY, session);
    return { ok: true };
  }, []);

  const login = useCallback((email: string, password: string) => {
    const normalized = email.trim().toLowerCase();
    const found = getUsers().find(u => u.email === normalized && u.password === password);
    if (!found) {
      return { ok: false, error: 'Onjuiste combinatie van e-mailadres en wachtwoord.' };
    }
    const session: AuthUser = { id: found.id, name: found.name, email: found.email, accountType: found.accountType ?? 'customer', createdAt: found.createdAt };
    setUser(session);
    saveJSON(SESSION_KEY, session);
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
  }, []);

  const updateOrderStatus = useCallback((token: string, status: OrderStatus, progress?: number) => {
    setOrders(prev => {
      const next = prev.map(order =>
        order.trackingToken === token
          ? { ...order, status, deliveryProgress: progress ?? order.deliveryProgress }
          : order
      );
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

  const getOrderByToken = useCallback((token: string) => {
    return orders.find(order => order.trackingToken === token);
  }, [orders]);

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
      getOrderByToken,
      subscriptions,
      addSubscription,
      cancelSubscription,
      user,
      register,
      login,
      logout,
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
