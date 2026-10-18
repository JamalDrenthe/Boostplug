import type { Order, Subscription, StoredUser, AccountType } from '@/types';

export interface DemoAccountConfig {
  id: string;
  name: string;
  email: string;
  password: string;
  role: AccountType;
  badge: string;
  badgeClass: string;
  iconType: 'customer' | 'member' | 'admin';
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  user: StoredUser;
  orders: Order[];
  subscriptions: Subscription[];
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

const DEMO_PASSWORD = 'demo1234';
const DEMO_PASSWORD_HASH = quickHash(DEMO_PASSWORD);

// Demo 1: Klant (Artiest / Label)
const CUSTOMER_DEMO_USER: StoredUser = {
  id: 'usr_demo_customer',
  name: 'Nova Sound Studio',
  email: 'demo-klant@boostplug.one',
  accountType: 'customer',
  createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 45).toISOString(),
  phone: '+31 6 1234 5678',
  companyOrArtistName: 'Nova Sound Records B.V.',
  kvkOrVat: 'KvK 89123049 / NL89123049B01',
  billingAddress: {
    street: 'Keizersgracht 421',
    postalCode: '1016 EK',
    city: 'Amsterdam',
    country: 'Nederland',
  },
  preferredCurrency: 'EUR',
  emailNotifications: true,
  passwordHash: DEMO_PASSWORD_HASH,
};

const CUSTOMER_DEMO_ORDERS: Order[] = [
  {
    id: 'bp_ord_demo_01',
    orderNumber: 'BP-202610-00421',
    email: 'demo-klant@boostplug.one',
    locale: 'nl',
    currency: 'EUR',
    items: [
      {
        id: 'c_spot_1',
        category: 'streams',
        platform: 'spotify',
        platformName: 'Spotify',
        typeName: 'Premium Streams',
        quantity: 50000,
        quality: 'premium',
        price: 189,
        currency: 'EUR',
        targetUrl: 'https://open.spotify.com/artist/novasound-official',
      },
    ],
    totalPrice: 189,
    status: 'processing',
    deliveryProgress: 68,
    trackingToken: 'BP-SPOT-7721',
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 2),
    paidAt: new Date(Date.now() - 3600 * 1000 * 24 * 2),
  },
  {
    id: 'bp_ord_demo_02',
    orderNumber: 'BP-202610-00388',
    email: 'demo-klant@boostplug.one',
    locale: 'nl',
    currency: 'EUR',
    items: [
      {
        id: 'c_gmap_2',
        category: 'reviews',
        platform: 'google_maps',
        platformName: 'Google Maps',
        quantity: 15,
        price: 75,
        currency: 'EUR',
        targetUrl: 'https://maps.google.com/?cid=novasoundstudio',
        rating: 5,
      },
    ],
    totalPrice: 75,
    status: 'delivered',
    deliveryProgress: 100,
    trackingToken: 'BP-GMAP-9902',
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 10),
    paidAt: new Date(Date.now() - 3600 * 1000 * 24 * 10),
    deliveredAt: new Date(Date.now() - 3600 * 1000 * 24 * 3),
  },
  {
    id: 'bp_ord_demo_03',
    orderNumber: 'BP-202610-00499',
    email: 'demo-klant@boostplug.one',
    locale: 'nl',
    currency: 'EUR',
    items: [
      {
        id: 'c_appl_3',
        category: 'streams',
        platform: 'apple_music',
        platformName: 'Apple Music',
        typeName: 'Plays & Saves',
        quantity: 10000,
        price: 49,
        currency: 'EUR',
        targetUrl: 'https://music.apple.com/artist/novasound',
      },
    ],
    totalPrice: 49,
    status: 'pending',
    deliveryProgress: 15,
    trackingToken: 'BP-APPL-3310',
    createdAt: new Date(Date.now() - 3600 * 1000 * 5),
    paidAt: new Date(Date.now() - 3600 * 1000 * 5),
  },
];

const CUSTOMER_DEMO_SUBS: Subscription[] = [
  {
    id: 'SUB-GROWTH-DEMO',
    planId: 'growth',
    planName: 'Growth Boost Plan',
    email: 'demo-klant@boostplug.one',
    monthlyPrice: 79,
    currency: 'EUR',
    status: 'active',
    startedAt: new Date(Date.now() - 3600 * 1000 * 24 * 14).toISOString(),
    nextBillingAt: new Date(Date.now() + 3600 * 1000 * 24 * 16).toISOString(),
  },
];

// Demo 2: Lid (Mining Node Operator)
const MEMBER_DEMO_USER: StoredUser = {
  id: 'usr_demo_member',
  name: 'Lars van Dijk (VVC Node)',
  email: 'demo-lid@boostplug.one',
  accountType: 'member',
  createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 60).toISOString(),
  phone: '+31 6 8765 4321',
  companyOrArtistName: 'Quantum Node Cluster AMS',
  kvkOrVat: 'NL002948192B01',
  billingAddress: {
    street: 'Singel 188',
    postalCode: '1015 AJ',
    city: 'Amsterdam',
    country: 'Nederland',
  },
  ibanPayout: 'NL91 ABNA 0417 1234 56',
  ibanHolder: 'L. van Dijk',
  preferredCurrency: 'EUR',
  emailNotifications: true,
  passwordHash: DEMO_PASSWORD_HASH,
  miningStep: 7,
  miningProfile: {
    userId: 'usr_demo_member',
    currentStep: 7,
    completedSteps: [1, 2, 3, 4, 5, 6, 7],
    vvcMemberCode: 'VVC-2026-8819',
    xabiWorldUsername: 'lars_vvc_node',
    groverData: {
      orderNumber: 'GRV-771920-NL',
      deviceType: 'mac_mini_m2',
      serialOrMac: 'C02G8490MD6M (e0:d5:5e:12:44:a1)',
      discountCode: 'QUANTUMBOOST20',
      rentalTermMonths: 12,
      status: 'verified',
      submittedAt: new Date(Date.now() - 3600 * 1000 * 24 * 30).toISOString(),
    },
    softwareConfig: {
      nodeToken: 'BP-NODE-LARS01-M2',
      osPlatform: 'macos',
      ipPoolRegion: 'eu-west-1',
      threadsLimitPercent: 75,
      autoStartOnBoot: true,
      status: 'mining_active',
      lastPing: 'Zojuist (11ms latency)',
      hashRateOrStreamsPerHour: 145,
      assignedIp: '84.112.98.14 (KPN Residentieel)',
    },
    zheavenzyArtistId: 'ZH-ROSTER-01',
    logsRentApiKey: 'LR-KEY-99201',
    estimatedMonthlyEarnings: 285,
    updatedAt: new Date().toISOString(),
  },
};

const MEMBER_DEMO_ORDERS: Order[] = [
  {
    id: 'bp_ord_demo_node_test',
    orderNumber: 'BP-202610-00210',
    email: 'demo-lid@boostplug.one',
    locale: 'nl',
    currency: 'EUR',
    items: [
      {
        id: 'c_node_verif',
        category: 'streams',
        platform: 'spotify',
        platformName: 'Spotify',
        typeName: 'Node Latency Test',
        quantity: 1000,
        quality: 'premium',
        price: 0,
        currency: 'EUR',
        targetUrl: 'https://open.spotify.com/artist/zheavenzy-official',
      },
    ],
    totalPrice: 0,
    status: 'delivered',
    deliveryProgress: 100,
    trackingToken: 'BP-NODE-TEST-01',
    createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 14),
    paidAt: new Date(Date.now() - 3600 * 1000 * 24 * 14),
    deliveredAt: new Date(Date.now() - 3600 * 1000 * 24 * 13),
  },
];

// Demo 3: Admin (Hoofdbeheerder)
const ADMIN_DEMO_USER: StoredUser = {
  id: 'admin_boostplug',
  name: 'BoostPlug Beheerder',
  email: 'info@boostplug.one',
  accountType: 'admin',
  createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 90).toISOString(),
  phone: '+31 20 890 1234',
  companyOrArtistName: 'Quantum Initium B.V.',
  kvkOrVat: 'KvK 91029384 / NL91029384B01',
  billingAddress: {
    street: 'Herengracht 500',
    postalCode: '1017 CB',
    city: 'Amsterdam',
    country: 'Nederland',
  },
  preferredCurrency: 'EUR',
  emailNotifications: true,
  passwordHash: DEMO_PASSWORD_HASH,
};

export const DEMO_ACCOUNTS_CONFIG: Record<'customer' | 'member' | 'admin', DemoAccountConfig> = {
  customer: {
    id: 'usr_demo_customer',
    name: 'Nova Sound Studio',
    email: 'demo-klant@boostplug.one',
    password: DEMO_PASSWORD,
    role: 'customer',
    badge: 'Klantaccount',
    badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    iconType: 'customer',
    title: 'Klantaccount (Artiest / Brand)',
    subtitle: 'Spotify Drip-feed, Apple Music & Reviews',
    description: 'Bekijk actieve bestellingen met realtime drip-feed voortgang, printklare BTW-facturen en het lopende abonnement.',
    highlights: [
      'Spotify 50k streams drip-feed (68% voltooid)',
      'Google Maps 5-sterren reviews met PDF-factuur',
      'Actief Growth abonnement (€79/mnd)',
    ],
    user: CUSTOMER_DEMO_USER,
    orders: CUSTOMER_DEMO_ORDERS,
    subscriptions: CUSTOMER_DEMO_SUBS,
  },
  member: {
    id: 'usr_demo_member',
    name: 'Lars van Dijk',
    email: 'demo-lid@boostplug.one',
    password: DEMO_PASSWORD,
    role: 'member',
    badge: 'Lidaccount (Mining)',
    badgeClass: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    iconType: 'member',
    title: 'Lidaccount (Node Partner)',
    subtitle: 'Mac mini M2 via Grover & Residentieel IP',
    description: 'Bekijk de actieve Grover hardware lease, telemetry (145 streams/uur), residentiële KPN pool en SEPA uitbetalingen.',
    highlights: [
      'Grover hardware contract geverifieerd (code QUANTUMBOOST20)',
      '145 streams/uur actief via KPN residentieel IP',
      'Geschatte maandopbrengst: €285,- op IBAN',
    ],
    user: MEMBER_DEMO_USER,
    orders: MEMBER_DEMO_ORDERS,
    subscriptions: [],
  },
  admin: {
    id: 'admin_boostplug',
    name: 'BoostPlug Beheerder',
    email: 'info@boostplug.one',
    password: DEMO_PASSWORD,
    role: 'admin',
    badge: 'Hoofdbeheerder',
    badgeClass: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    iconType: 'admin',
    title: 'Admin Controlecentrum',
    subtitle: 'Live Orderbeheer & Firestore Sync',
    description: 'Krijg direct toegang tot alle bestellingen, realtime Firestore updates, 1-klik CSV export en controle over leveringen.',
    highlights: [
      'Volledige controle over alle orders en statussen',
      'Realtime Firestore synchronisatie met één klik',
      'CSV export voor boekhouding & live drip-feed',
    ],
    user: ADMIN_DEMO_USER,
    orders: [...CUSTOMER_DEMO_ORDERS, ...MEMBER_DEMO_ORDERS],
    subscriptions: CUSTOMER_DEMO_SUBS,
  },
};

export const DEMO_ACCOUNTS_LIST: DemoAccountConfig[] = [
  DEMO_ACCOUNTS_CONFIG.customer,
  DEMO_ACCOUNTS_CONFIG.member,
  DEMO_ACCOUNTS_CONFIG.admin,
];

export const DEMO_EMAILS = [
  'demo-klant@boostplug.one',
  'klant@boostplug.one',
  'artiest@boostplug.one',
  'demo-lid@boostplug.one',
  'lid@boostplug.one',
  'member@boostplug.one',
  'info@boostplug.one',
  'demo-admin@boostplug.one',
];

export function isDemoEmail(email?: string | null): boolean {
  if (!email) return false;
  return DEMO_EMAILS.includes(email.trim().toLowerCase());
}

export function getDemoConfigByEmail(email: string): DemoAccountConfig | undefined {
  const norm = email.trim().toLowerCase();
  if (norm === 'demo-klant@boostplug.one' || norm === 'klant@boostplug.one' || norm === 'artiest@boostplug.one') {
    return DEMO_ACCOUNTS_CONFIG.customer;
  }
  if (norm === 'demo-lid@boostplug.one' || norm === 'lid@boostplug.one' || norm === 'member@boostplug.one') {
    return DEMO_ACCOUNTS_CONFIG.member;
  }
  if (norm === 'info@boostplug.one' || norm === 'demo-admin@boostplug.one') {
    return DEMO_ACCOUNTS_CONFIG.admin;
  }
  return undefined;
}
