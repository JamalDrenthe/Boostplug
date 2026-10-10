export type ProductCategory = 'streams' | 'reviews';
export type OrderStatus = 'pending' | 'processing' | 'delivered' | 'partial' | 'failed' | 'refunded';
export type QualityTier = 'standard' | 'premium';
export type Currency = 'EUR' | 'GBP';
export type Locale = 'nl' | 'en';

export interface StreamPlatform {
  id: string;
  name: string;
  icon: string;
  color: string;
  types: StreamType[];
}

export interface StreamType {
  id: string;
  name: string;
  description: string;
  minQuantity: number;
  maxQuantity: number;
  basePrice: number;
}

export interface ReviewPlatform {
  id: string;
  name: string;
  category: ReviewCategory;
  icon: string;
  color: string;
  requiresUrl: boolean;
  requiresText: boolean;
  requiresRating: boolean;
  minRating?: number;
  maxRating?: number;
  price: Record<Currency, number>;
  estimatedDelivery: string;
  maxQuantity: number;
  active: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  urlPattern?: RegExp;
  urlExample?: string;
}

export type ReviewCategory = 
  | 'local_search' 
  | 'ecommerce' 
  | 'music' 
  | 'apps' 
  | 'services';

export interface CartItem {
  id: string;
  category: ProductCategory;
  platform: string;
  platformName: string;
  type?: string;
  typeName?: string;
  quantity: number;
  quality?: QualityTier;
  price: number;
  currency: Currency;
  targetUrl?: string;
  reviewText?: string;
  rating?: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  email: string;
  locale: Locale;
  currency: Currency;
  items: CartItem[];
  totalPrice: number;
  status: OrderStatus;
  deliveryProgress: number;
  trackingToken: string;
  createdAt: Date;
  paidAt?: Date;
  deliveredAt?: Date;
}

export type AccountType = 'customer' | 'member' | 'admin';

export interface GroverOrderData {
  orderNumber: string;
  deviceType: 'mac_mini_m2' | 'mac_mini_m4' | 'mac_studio' | 'custom_gpu';
  serialOrMac: string;
  discountCode: string;
  rentalTermMonths: number;
  status: 'ordered' | 'received' | 'verified';
  submittedAt?: string;
}

export interface SoftwareConfigData {
  nodeToken: string;
  osPlatform: 'macos' | 'linux' | 'windows';
  ipPoolRegion: 'eu-west-1' | 'eu-central-1' | 'us-east-1';
  threadsLimitPercent: number;
  autoStartOnBoot: boolean;
  status: 'pending_installation' | 'connected' | 'mining_active';
  lastPing?: string;
  hashRateOrStreamsPerHour?: number;
  assignedIp?: string;
}

export interface MemberMiningProfile {
  userId: string;
  currentStep: number;
  completedSteps: number[];
  vvcMemberCode?: string;
  xabiWorldUsername?: string;
  groverData?: GroverOrderData;
  softwareConfig?: SoftwareConfigData;
  zheavenzyArtistId?: string;
  logsRentApiKey?: string;
  estimatedMonthlyEarnings?: number;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  accountType: AccountType;
  createdAt: string;
  miningProfile?: MemberMiningProfile;
}

export type SubscriptionStatus = 'active' | 'cancelled';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: Record<Currency, number>;
  features: string[];
  popular?: boolean;
}

export interface Subscription {
  id: string;
  planId: string;
  planName: string;
  email: string;
  monthlyPrice: number;
  currency: Currency;
  status: SubscriptionStatus;
  startedAt: string;
  nextBillingAt: string;
}

export interface CheckoutFormData {
  email: string;
  acceptTerms: boolean;
}

export const REVIEW_CATEGORIES: Record<ReviewCategory, { name: string; icon: string }> = {
  local_search: { name: 'Lokale Bedrijven', icon: 'Building2' },
  ecommerce: { name: 'E-commerce', icon: 'ShoppingCart' },
  music: { name: 'Muziek', icon: 'Music' },
  apps: { name: 'Apps', icon: 'Smartphone' },
  services: { name: 'Diensten', icon: 'Car' },
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  EUR: '€',
  GBP: '£',
};
