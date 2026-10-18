import type { LucideIcon } from 'lucide-react';
import {
  Users,
  KeyRound,
  Music2,
  Compass,
  TrendingUp,
  Cpu,
  Home,
  Briefcase,
  CreditCard,
  BellRing,
} from 'lucide-react';

export type IntegrationCategory =
  | 'all'
  | 'hardware'
  | 'distribution'
  | 'infra'
  | 'finance'
  | 'lifestyle'
  | 'legal'
  | 'developer'
  | 'physical';

export interface IntegrationField {
  id: string;
  label: string;
  placeholder: string;
  type?: 'text' | 'password' | 'select' | 'url';
  options?: { label: string; value: string }[];
  helperText?: string;
  required?: boolean;
}

export interface EcosystemIntegration {
  id: string;
  name: string;
  subtitle: string;
  category: IntegrationCategory;
  categoryLabel: string;
  tag: string;
  tagColor: string;
  icon: LucideIcon;
  description: string;
  synergy: string;
  defaultActive?: boolean;
  externalUrl?: string;
  metrics?: { label: string; value: string };
  fields: IntegrationField[];
  instructions: string[];
}

export const ECOSYSTEM_INTEGRATIONS: EcosystemIntegration[] = [
  {
    id: 'vvc_node',
    name: 'Verdienende Vrienden Club (VVC)',
    subtitle: 'Hardware Node & Passief Inkomen',
    category: 'hardware',
    categoryLabel: 'Hardware & Nodes',
    tag: 'Flagship Community',
    tagColor: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    icon: Users,
    description:
      'Het officiële verdienmodel van Quantum Initium. Koppel een Mac mini M2/M4 of laptop als residentiële node en ontvang maandelijks €150 tot €400 aan vaste SEPA vergoedingen.',
    synergy:
      'Leden leveren de veilige achtergrondcapaciteit die BoostPlug-campagnes en artiestenreleases organisch aandrijft.',
    defaultActive: false,
    metrics: { label: 'Vaste Vergoeding', value: '€150 - €400/mnd' },
    instructions: [
      'Lease een Mac mini M2 of M4 via Grover met kortingscode QUANTUMBOOST20 (of gebruik eigen hardware).',
      'Voer hieronder je Grover bestelnummer of serienummer in.',
      'Activeer de BoostPlug achtergrondsoftware en koppel je IBAN voor automatische uitbetaling op de 1e van de maand.',
    ],
    fields: [
      {
        id: 'vvcMemberCode',
        label: 'VVC Lidnummer',
        placeholder: 'bv. VVC-2026-8812',
        helperText: 'Ontvangen bij aanmelding of te vinden in je account.',
        required: true,
      },
      {
        id: 'hardwareType',
        label: 'Type Hardware Node',
        placeholder: 'Selecteer apparaat',
        type: 'select',
        options: [
          { label: 'Apple Mac Mini M2 (Aanbevolen)', value: 'mac_mini_m2' },
          { label: 'Apple Mac Mini M4 (Hoge Throughput)', value: 'mac_mini_m4' },
          { label: 'Eigen Laptop / Mini-PC', value: 'custom_pc' },
        ],
        required: true,
      },
      {
        id: 'hardwareIdentifier',
        label: 'Serienummer of MAC-adres',
        placeholder: 'bv. C02G90XXMD6M',
        helperText: 'Onderop de machine of via instellingen.',
        required: true,
      },
      {
        id: 'groverCode',
        label: 'Grover Kortingscode',
        placeholder: 'QUANTUMBOOST20',
        helperText: 'Geeft 20% korting op je hardwarelease via Grover.',
      },
    ],
  },
  {
    id: 'logs_rent',
    name: 'Logs.rent',
    subtitle: 'Residentiële IP Pools & Account Sessies',
    category: 'infra',
    categoryLabel: 'Residentieel & Data',
    tag: 'Infra Fundament',
    tagColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    icon: KeyRound,
    description:
      'Directe koppeling met logs.rent voor betrouwbare residentiële IP-pools (KPN & Ziggo) en geauthenticeerde account-sessies voor streamingdiensten en zoekmachines.',
    synergy:
      'Garandeert dat alle interacties van BoostPlug en VVC natuurlijk en veilig worden verwerkt zonder risico op detectie.',
    externalUrl: 'https://logs.rent',
    metrics: { label: 'Pool Betrouwbaarheid', value: '99,4% Uptime' },
    instructions: [
      'Maak een account aan op logs.rent of activeer de ingebouwde Quantum Initium pooltoegang.',
      'Voer je unieke API-sleutel in.',
      'Kies je voorkeursregio voor IP-rotatie.',
    ],
    fields: [
      {
        id: 'apiKey',
        label: 'Logs.rent API Sleutel',
        placeholder: 'LR-LIVE-88491024',
        type: 'password',
        required: true,
      },
      {
        id: 'region',
        label: 'Voorkeursregio',
        placeholder: 'Selecteer regio',
        type: 'select',
        options: [
          { label: 'Nederland (KPN & Ziggo Residentieel)', value: 'nl-residential' },
          { label: 'Europa Centraal', value: 'eu-central' },
          { label: 'Verenigde Staten (US-East)', value: 'us-east' },
        ],
      },
    ],
  },
  {
    id: 'zheavenzy',
    name: 'Zheavenzy',
    subtitle: 'Muziekdistributie & Artiestenmanagement',
    category: 'distribution',
    categoryLabel: 'Muziek & Distributie',
    tag: 'Music Label',
    tagColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    icon: Music2,
    description:
      'Internationaal platenlabel en artiestenplatform op zheavenzy.one. Koppel releases en artiestenprofielen voor directe distributie binnen het streamingnetwerk.',
    synergy:
      'BoostPlug levert de algoritmekracht voor releases; VVC-leden delen mee in het succes van de muziekcampagnes.',
    externalUrl: 'https://zheavenzy.one',
    metrics: { label: 'Platform Bereik', value: 'Wereldwijd' },
    instructions: [
      'Koppel je Spotify Artist URL of Zheavenzy artiestencode.',
      'Selecteer releases die automatisch in aanmerking komen voor netwerkpromotie.',
    ],
    fields: [
      {
        id: 'artistId',
        label: 'Spotify Artist URI of URL',
        placeholder: 'https://open.spotify.com/artist/...',
        type: 'url',
        required: true,
      },
      {
        id: 'labelPass',
        label: 'Zheavenzy Label Code (optioneel)',
        placeholder: 'ZH-REC-2026',
      },
    ],
  },
  {
    id: 'spontiva',
    name: 'Spontiva',
    subtitle: 'Lifestyle & Exclusive Member Perks',
    category: 'lifestyle',
    categoryLabel: 'Lifestyle & Community',
    tag: 'Members Gateway',
    tagColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    icon: Compass,
    description:
      'Het exclusieve lifestyle- en ledenplatform dat toegang biedt tot partneraanbiedingen, VIP-gastenlijsten, speciale hardwaredeals en netwerkevenementen.',
    synergy:
      'Fungeert als de officiële toegangspoort voor VVC-leden met exclusieve voordelen en Quantum Initium kortingen.',
    metrics: { label: 'Korting & Perks', value: 'Tot 35% voordeel' },
    instructions: [
      'Voer je Spontiva accountnummer of e-mailadres in.',
      'Ontvang direct toegang tot holdingaanbiedingen en techkortingen.',
    ],
    fields: [
      {
        id: 'spontivaId',
        label: 'Spontiva Member ID of E-mail',
        placeholder: 'spontiva-lid@voorbeeld.nl',
        required: true,
      },
    ],
  },
  {
    id: 'investbotiq',
    name: 'Investbotiq',
    subtitle: 'Fintech & Kwantitatieve Analyse',
    category: 'finance',
    categoryLabel: 'Financiën & Liquiditeit',
    tag: 'Fintech & Treasury',
    tagColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    icon: TrendingUp,
    description:
      'Geavanceerde financiële technologie en geautomatiseerde kwantitatieve analyses voor schaalbaar holdingbeheer, micro-uitbetalingen en cashflowcontrole.',
    synergy:
      'Biedt stabiele technologische infrastructuur voor holdingtransacties, directe SEPA-micro-uitbetalingen en liquiditeitsbeheer.',
    metrics: { label: 'Automatisering', value: '24/7 Treasury' },
    instructions: [
      'Koppel je voorkeursuitbetalingsprofiel voor geautomatiseerde periodieke SEPA-overschrijvingen.',
    ],
    fields: [
      {
        id: 'clientRef',
        label: 'Investbotiq Referentie / Client ID',
        placeholder: 'IBQ-TRS-8902',
        required: true,
      },
      {
        id: 'payoutFrequency',
        label: 'Uitbetalingsfrequentie',
        placeholder: 'Kies frequentie',
        type: 'select',
        options: [
          { label: 'Maandelijks (1e van de maand)', value: 'monthly' },
          { label: 'Wekelijks (Maandagochtend)', value: 'weekly' },
        ],
      },
    ],
  },
  {
    id: 'xabi_world',
    name: 'Xabi World',
    subtitle: 'Gedecentraliseerde Identiteit & Media',
    category: 'infra',
    categoryLabel: 'Web3 & Identiteit',
    tag: 'Decentralized ID',
    tagColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    icon: Cpu,
    description:
      'Internationale mediaproducties, gedecentraliseerde identiteit (DID) en culturele projecten versterkt door het holdingnetwerk.',
    synergy:
      'Verzorgt de gedecentraliseerde identiteitsverificatie voor hardware node operators en holdinggebruikers.',
    metrics: { label: 'Verificatie', value: 'Zero-Knowledge' },
    instructions: [
      'Koppel je Web3 wallet of Xabi World account voor cryptografische hardware node verificatie.',
    ],
    fields: [
      {
        id: 'walletOrDid',
        label: 'Web3 Wallet Adres of Xabi World Handle',
        placeholder: '0x... of @xabi_operator',
        required: true,
      },
    ],
  },
  {
    id: 'woningvry',
    name: 'WoningVry',
    subtitle: 'Vastgoed, Co-Living & Datacenter Hubs',
    category: 'physical',
    categoryLabel: 'Fysieke Expansie',
    tag: 'Real Estate & Hubs',
    tagColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    icon: Home,
    description:
      'Vooruitstrevend vastgoedplatform en flexibele woon/werkoplossingen. Ondersteunt datacenter-rackspace en huisvesting voor partners.',
    synergy:
      'Biedt fysieke expansie, datacenterlocaties en huisvesting voor holdingmedewerkers, artiesten en technologische specialisten.',
    metrics: { label: 'Locaties', value: 'NL & Internationaal' },
    instructions: [
      'Selecteer de gewenste hub-locatie voor node hosting of werkplekreservaties.',
    ],
    fields: [
      {
        id: 'hubLocation',
        label: 'Voorkeurslocatie Hub',
        placeholder: 'Kies hub',
        type: 'select',
        options: [
          { label: 'Amsterdam Centrum / Zuidas Hub', value: 'ams_hub' },
          { label: 'Rotterdam Tech Campus', value: 'rtm_hub' },
          { label: 'Eindhoven High Tech Region', value: 'ehv_hub' },
        ],
      },
    ],
  },
  {
    id: 'immigratie_punt',
    name: 'Immigratie Punt',
    subtitle: 'Juridisch Advies, Visa & EU Relocatie',
    category: 'legal',
    categoryLabel: 'Juridisch & Relocatie',
    tag: 'Legal & Mobility',
    tagColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    icon: Briefcase,
    description:
      'Gespecialiseerd advies en begeleiding bij internationale mobiliteit, visa, zakelijke vestiging en expat services in Nederland.',
    synergy:
      'Begeleidt internationale partners, artiesten en technologische specialisten bij vestiging in de EU.',
    metrics: { label: 'Juridische Status', value: 'Erkend Advies' },
    instructions: [
      'Voer je bedrijfsgegevens of aanvraagcode in voor zakelijke vestiging en juridische ondersteuning in Nederland.',
    ],
    fields: [
      {
        id: 'kvkOrVat',
        label: 'KvK-nummer of BTW-identificatie',
        placeholder: 'bv. KvK 91029384',
        required: true,
      },
      {
        id: 'contactPerson',
        label: 'Naam Contactpersoon / Advocaat',
        placeholder: 'Dhr. / Mevr. Achternaam',
      },
    ],
  },
  {
    id: 'stripe_sepa',
    name: 'Stripe & SEPA Payout Gateway',
    subtitle: 'Directe Bankuitbetalingen & Facturatie',
    category: 'finance',
    categoryLabel: 'Financiën & Liquiditeit',
    tag: 'Direct Payouts',
    tagColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    icon: CreditCard,
    description:
      'Veilige betaal- en uitbetalingsgateway voor automatische wekelijkse of maandelijkse SEPA-overboekingen naar jouw zakelijke of privérekening.',
    synergy:
      'Verwerkt commissies, node-vergoedingen van VVC en klantbestellingen zonder vertraging.',
    metrics: { label: 'Uitbetalingstijd', value: 'Binnen 24 uur' },
    instructions: [
      'Voer jouw IBAN rekeningnummer en tenaamstelling in voor geverifieerde SEPA-overschrijvingen.',
    ],
    fields: [
      {
        id: 'iban',
        label: 'IBAN Rekeningnummer',
        placeholder: 'NL91 INGB 0001 2345 67',
        required: true,
      },
      {
        id: 'accountHolder',
        label: 'Naam Rekeninghouder',
        placeholder: 'J. Drenthe of Bedrijfsnaam B.V.',
        required: true,
      },
    ],
  },
  {
    id: 'webhooks_alerts',
    name: 'Discord & Telegram Webhooks',
    subtitle: 'Realtime Notificaties & Node Telemetrie',
    category: 'developer',
    categoryLabel: 'Developer & Webhooks',
    tag: 'Realtime Alerts',
    tagColor: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    icon: BellRing,
    description:
      'Koppel een Discord of Telegram webhook om direct live pushberichten te ontvangen bij voltooide order-leveringen, node handshakes of statuswijzigingen.',
    synergy:
      'Houdt jou 24/7 op de hoogte van alle transacties en netwerkprestaties in jouw eigen kanalen.',
    metrics: { label: 'Latency', value: '< 100ms Push' },
    instructions: [
      'Kopieer de Webhook URL uit jouw Discord serverinstellingen of Telegram bot kanaal en plak deze hier.',
    ],
    fields: [
      {
        id: 'webhookUrl',
        label: 'Discord / Slack Webhook URL',
        placeholder: 'https://discord.com/api/webhooks/...',
        type: 'url',
        required: true,
      },
    ],
  },
];

const INTEGRATIONS_STORAGE_KEY = 'boostplug_active_integrations';

export interface UserIntegrationState {
  integrationId: string;
  isActive: boolean;
  activatedAt: string;
  configData: Record<string, string>;
}

export function loadUserIntegrations(): Record<string, UserIntegrationState> {
  try {
    const raw = localStorage.getItem(INTEGRATIONS_STORAGE_KEY);
    if (!raw) {
      // Standaard VVC en Logs.rent als voorbereid
      const initial: Record<string, UserIntegrationState> = {
        vvc_node: {
          integrationId: 'vvc_node',
          isActive: true,
          activatedAt: new Date(Date.now() - 3600 * 1000 * 24 * 7).toISOString(),
          configData: {
            vvcMemberCode: 'VVC-2026-LIVE',
            hardwareType: 'mac_mini_m2',
            hardwareIdentifier: 'C02G90XXMD6M',
            groverCode: 'QUANTUMBOOST20',
          },
        },
        logs_rent: {
          integrationId: 'logs_rent',
          isActive: true,
          activatedAt: new Date(Date.now() - 3600 * 1000 * 24 * 5).toISOString(),
          configData: {
            apiKey: 'LR-LIVE-NL-8491',
            region: 'nl-residential',
          },
        },
      };
      localStorage.setItem(INTEGRATIONS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveUserIntegration(
  integrationId: string,
  isActive: boolean,
  configData: Record<string, string>
) {
  try {
    const current = loadUserIntegrations();
    current[integrationId] = {
      integrationId,
      isActive,
      activatedAt: current[integrationId]?.activatedAt || new Date().toISOString(),
      configData,
    };
    localStorage.setItem(INTEGRATIONS_STORAGE_KEY, JSON.stringify(current));
    return current;
  } catch {
    return {};
  }
}

export function removeUserIntegration(integrationId: string) {
  try {
    const current = loadUserIntegrations();
    if (current[integrationId]) {
      current[integrationId].isActive = false;
      localStorage.setItem(INTEGRATIONS_STORAGE_KEY, JSON.stringify(current));
    }
    return current;
  } catch {
    return {};
  }
}
