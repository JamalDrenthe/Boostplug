import type { SubscriptionPlan } from '@/types';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Voor artiesten en merken die net beginnen met groeien.',
    monthlyPrice: { EUR: 29, GBP: 25 },
    features: [
      '2.500 streams of 5 reviews per maand',
      'Keuze uit alle platforms',
      'Levering binnen 72 uur',
      'Realtime ordertracking',
      'E-mail support',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    description: 'Doorlopende algoritme-boost voor serieuze groeiers.',
    monthlyPrice: { EUR: 79, GBP: 69 },
    popular: true,
    features: [
      '10.000 streams of 15 reviews per maand',
      'Alle platforms + priority levering',
      'Verdeelde levering over de maand',
      'Persoonlijke groeiplanning',
      'Priority support (24/7)',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Maximale algoritme-impact voor labels en bureaus.',
    monthlyPrice: { EUR: 149, GBP: 129 },
    features: [
      '25.000 streams of 40 reviews per maand',
      'Alle platforms + volumeboosts',
      'Dedicated accountmanager',
      'Maandelijkse performance-rapportage',
      'Maatwerk campagnes (Zheavenzy-artiesten)',
    ],
  },
];
