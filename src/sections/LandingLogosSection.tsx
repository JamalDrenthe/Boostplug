import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { TiltCard } from '@/components/ui/TiltCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  SpotifyLogo,
  AppleLogo,
  YouTubeLogo,
  SoundCloudLogo,
  DeezerLogo,
  TidalLogo,
  AmazonLogo,
  GoogleLogo,
  TrustpilotLogo,
  TripAdvisorLogo,
  YelpLogo,
  BolLogo,
  AppStoreLogo,
  PlayStoreLogo,
  KpnLogo,
  ZiggoLogo,
  CloudflareLogo,
  StripeLogo,
  QuantumInitiumLogo,
  DjobbaLogo,
} from '@/components/common/CompanyLogos';

type CategoryFilter = 'all' | 'streaming' | 'reviews' | 'infrastructure';

interface PartnerCompany {
  id: string;
  name: string;
  category: 'streaming' | 'reviews' | 'infrastructure';
  logo: React.ComponentType<{ size?: number; className?: string; colored?: boolean }>;
  brandColor: string;
  role: string;
  tag: string;
  status: string;
  targetAction?: string;
}

const PARTNER_COMPANIES: PartnerCompany[] = [
  // 1. Streaming
  {
    id: 'spotify',
    name: 'Spotify',
    category: 'streaming',
    logo: SpotifyLogo,
    brandColor: '#1DB954',
    role: 'Top-40 & Release Radar Drip-Feed',
    tag: 'Algoritmisch Veilig',
    status: '99,4% Retentie',
    targetAction: 'products',
  },
  {
    id: 'apple_music',
    name: 'Apple Music',
    category: 'streaming',
    logo: AppleLogo,
    brandColor: '#FA243C',
    role: 'Lossless Audio & Spatial Streams',
    tag: 'High-Res Playlists',
    status: 'Directe Node Sync',
    targetAction: 'products',
  },
  {
    id: 'youtube_music',
    name: 'YouTube Music',
    category: 'streaming',
    logo: YouTubeLogo,
    brandColor: '#FF0000',
    role: 'Video Views & Channel Abonnees',
    tag: 'Monetization Ready',
    status: '100% Organisch',
    targetAction: 'products',
  },
  {
    id: 'soundcloud',
    name: 'SoundCloud',
    category: 'streaming',
    logo: SoundCloudLogo,
    brandColor: '#FF5500',
    role: 'Underground Repost & Fanbase Boost',
    tag: 'Pro Unlimited',
    status: 'Actief Drip-Feed',
    targetAction: 'products',
  },
  {
    id: 'deezer',
    name: 'Deezer',
    category: 'streaming',
    logo: DeezerLogo,
    brandColor: '#A238FF',
    role: 'Europese & Franse Playlist Push',
    tag: 'Global Flow',
    status: 'Directe Levering',
    targetAction: 'products',
  },
  {
    id: 'tidal',
    name: 'Tidal',
    category: 'streaming',
    logo: TidalLogo,
    brandColor: '#00FFFF',
    role: 'HiFi Plus Master Sound Plays',
    tag: 'Audiophile Tier',
    status: 'Exclusief',
    targetAction: 'products',
  },
  {
    id: 'amazon_music',
    name: 'Amazon Music',
    category: 'streaming',
    logo: AmazonLogo,
    brandColor: '#FF9900',
    role: 'Echo & Alexa Voice Stream Boost',
    tag: 'Prime Ecosystem',
    status: 'Geverifieerd',
    targetAction: 'products',
  },

  // 2. Reviews & Social Proof
  {
    id: 'google_reviews',
    name: 'Google Reviews',
    category: 'reviews',
    logo: GoogleLogo,
    brandColor: '#4285F4',
    role: 'Google Maps & Bedrijfsprofiel Reviews',
    tag: 'Lokale SEO Autoriteit',
    status: 'KPN/Ziggo Residentieel',
    targetAction: 'products',
  },
  {
    id: 'trustpilot',
    name: 'Trustpilot',
    category: 'reviews',
    logo: TrustpilotLogo,
    brandColor: '#00B67A',
    role: '5-Sterren Geverifieerde Ervaringen',
    tag: 'Conversie Booster',
    status: 'Handmatig Gespreid',
    targetAction: 'products',
  },
  {
    id: 'tripadvisor',
    name: 'TripAdvisor',
    category: 'reviews',
    logo: TripAdvisorLogo,
    brandColor: '#00AF87',
    role: 'Horeca, Hotel & Bestemming Ranking',
    tag: 'Traveler Choice',
    status: 'Geografisch Getarget',
    targetAction: 'products',
  },
  {
    id: 'yelp',
    name: 'Yelp',
    category: 'reviews',
    logo: YelpLogo,
    brandColor: '#D32323',
    role: 'Elite Community & Local Feedback',
    tag: 'Anti-Filter Beschermd',
    status: 'Strikt Residentieel',
    targetAction: 'products',
  },
  {
    id: 'bol_com',
    name: 'Bol.com',
    category: 'reviews',
    logo: BolLogo,
    brandColor: '#0000A4',
    role: 'Partner & Product Recensies',
    tag: 'E-commerce Koopknop',
    status: 'Koopblok Optimalisatie',
    targetAction: 'products',
  },
  {
    id: 'app_store',
    name: 'Apple App Store',
    category: 'reviews',
    logo: AppStoreLogo,
    brandColor: '#0D96F6',
    role: 'iOS App Ratings & Reviews',
    tag: 'App Store Charts',
    status: 'Geldige Apple ID’s',
    targetAction: 'products',
  },
  {
    id: 'google_play',
    name: 'Google Play Store',
    category: 'reviews',
    logo: PlayStoreLogo,
    brandColor: '#34A853',
    role: 'Android App Installaties & Recensies',
    tag: 'Play Console Safe',
    status: 'Echte Toestellen',
    targetAction: 'products',
  },

  // 3. Infrastructure & Telecom
  {
    id: 'kpn',
    name: 'KPN Residentieel',
    category: 'infrastructure',
    logo: KpnLogo,
    brandColor: '#009900',
    role: 'Nederlands Glasvezel IP-Pool',
    tag: 'AS286 Netwerk',
    status: '100% Residentieel',
    targetAction: 'integraties',
  },
  {
    id: 'ziggo',
    name: 'VodafoneZiggo',
    category: 'infrastructure',
    logo: ZiggoLogo,
    brandColor: '#F37021',
    role: 'Coax & Fiber Residentiële Nodes',
    tag: 'AS9143 Netwerk',
    status: 'Hardware Thuisnodes',
    targetAction: 'integraties',
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare',
    category: 'infrastructure',
    logo: CloudflareLogo,
    brandColor: '#F38020',
    role: 'DDoS Mitigatie & Edge Routing',
    tag: 'Enterprise Shield',
    status: '99,99% Uptime',
    targetAction: 'integraties',
  },
  {
    id: 'stripe',
    name: 'Stripe Payments',
    category: 'infrastructure',
    logo: StripeLogo,
    brandColor: '#635BFF',
    role: 'PCI DSS Level 1 Afrekenrails',
    tag: 'iDEAL & Creditcard',
    status: 'Instant Settlement',
    targetAction: 'integraties',
  },
  {
    id: 'quantum_initium',
    name: 'Quantum Initium',
    category: 'infrastructure',
    logo: QuantumInitiumLogo,
    brandColor: '#E5C583',
    role: 'Moederholding Ecosysteem & Nodes',
    tag: 'Sovereign Network',
    status: 'Subholding 01-05',
    targetAction: 'integraties',
  },
  {
    id: 'djobba',
    name: 'Djobba.works',
    category: 'infrastructure',
    logo: DjobbaLogo,
    brandColor: '#38BDF8',
    role: 'Talent & Gateway API Factoring',
    tag: 'Xabi World Rails 72h',
    status: 'Live API Sync',
    targetAction: 'vacancies',
  },
];

export function LandingLogosSection() {
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const [hoveredCompany, setHoveredCompany] = useState<string | null>(null);

  const filteredCompanies = PARTNER_COMPANIES.filter(
    (c) => filter === 'all' || c.category === filter
  );

  return (
    <section className="relative py-20 px-4 overflow-hidden border-y border-white/[0.06] bg-black/40 backdrop-blur-md">
      {/* Subtle Ambient Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] pointer-events-none rounded-full opacity-15 blur-3xl"
        style={{
          background: 'radial-gradient(ellipse, rgba(229, 197, 131, 0.4) 0%, rgba(56, 189, 248, 0.15) 50%, transparent 80%)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E5C583]/10 border border-[#E5C583]/20 mb-3"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5C583] animate-pulse" />
            <p className="text-[10px] sm:text-[11px] font-semibold text-[#E5C583] tracking-[0.2em] uppercase font-mono">
              ONDERSTEUNDE PLATFORMS &amp; RESIDENTIËLE TELECOM NETWERKEN
            </p>
            <Sparkles className="w-3 h-3 text-[#E5C583]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight"
          >
            Verbonden met 's werelds{' '}
            <span className="font-serif italic font-normal text-gold-gradient">
              Grootste Platforms
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xs sm:text-sm md:text-base text-white/60 leading-relaxed font-light"
          >
            Geautomatiseerde distributie en organische stimulans via officiële API-protocollen en 100% echte residentiële KPN- &amp; Ziggo-nodes.
          </motion.p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-10 overflow-x-auto pb-2 scrollbar-none">
          <div className="inline-flex items-center p-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl">
            {[
              { id: 'all', label: 'Alle Partners & Platforms', count: '20' },
              { id: 'streaming', label: 'Streaming & Muziek', count: '7' },
              { id: 'reviews', label: 'Reviews & Social Proof', count: '7' },
              { id: 'infrastructure', label: 'Telecom & Rails', count: '6' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as CategoryFilter)}
                className={`relative px-4 sm:px-5 py-2 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  filter === tab.id
                    ? 'text-black font-semibold shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {filter === tab.id && (
                  <motion.div
                    layoutId="activeTabBadge"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F5E6CA] via-[#E5C583] to-[#DFB86C]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
                <span
                  className={`relative z-10 text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    filter === tab.id ? 'bg-black/20 text-black' : 'bg-white/10 text-white/50'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Marquee Banner of Authentic Logos */}
        <div className="relative mb-14 py-4 overflow-hidden rounded-2xl bg-white/[0.015] border border-white/[0.05] group">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none" />

          <div className="flex gap-10 items-center animate-marquee group-hover:[animation-play-state:paused] w-max">
            {[...PARTNER_COMPANIES, ...PARTNER_COMPANIES].map((company, index) => {
              const LogoComp = company.logo;
              return (
                <div
                  key={`${company.id}-${index}`}
                  className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-[#E5C583]/40 hover:bg-white/[0.06] transition-all cursor-pointer group/item shrink-0"
                >
                  <LogoComp
                    size={22}
                    colored={false}
                    className="text-white/60 group-hover/item:text-[#E5C583] group-hover/item:scale-110 transition-all duration-300"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-white/80 group-hover/item:text-white transition-colors">
                      {company.name}
                    </span>
                    <span className="text-[10px] text-white/40 font-mono tracking-tight">
                      {company.tag}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Logo & Capability Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <AnimatePresence>
            {filteredCompanies.map((company) => {
              const LogoComponent = company.logo;
              const isHovered = hoveredCompany === company.id;

              return (
                <motion.div
                  key={company.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  onMouseEnter={() => setHoveredCompany(company.id)}
                  onMouseLeave={() => setHoveredCompany(null)}
                >
                  <TiltCard
                    glowColor="gold"
                    className="h-full rounded-2xl bg-neutral-900/40 border border-white/[0.07] hover:border-[#E5C583]/30 transition-all"
                  >
                    <div className="p-5 flex flex-col justify-between h-full group">
                      {/* Top Header: Logo, Name & Badge */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-md"
                              style={{
                                backgroundColor: isHovered ? `${company.brandColor}18` : 'rgba(255, 255, 255, 0.05)',
                                border: `1px solid ${isHovered ? `${company.brandColor}40` : 'rgba(255, 255, 255, 0.1)'}`,
                              }}
                            >
                              <LogoComponent
                                size={24}
                                colored={isHovered}
                                className={
                                  isHovered
                                    ? 'transition-transform duration-300 scale-110'
                                    : 'text-white/80 transition-colors'
                                }
                              />
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-white group-hover:text-[#E5C583] transition-colors flex items-center gap-1.5">
                                {company.name}
                              </h3>
                              <span className="text-[10.5px] text-white/40 font-mono">
                                {company.tag}
                              </span>
                            </div>
                          </div>

                          <Badge
                            variant="outline"
                            className="text-[10px] font-mono border-white/10 bg-white/[0.03] text-white/70"
                          >
                            {company.category === 'streaming'
                              ? 'Audio'
                              : company.category === 'reviews'
                              ? 'Social Proof'
                              : 'Netwerk'}
                          </Badge>
                        </div>

                        {/* Description / Role */}
                        <p className="text-xs text-white/60 leading-relaxed font-light mb-4">
                          {company.role}
                        </p>
                      </div>

                      {/* Bottom Footer: Verification Seal & Action */}
                      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{company.status}</span>
                        </div>

                        {company.targetAction === 'products' ? (
                          <button
                            onClick={() => {
                              document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="text-[11px] text-[#E5C583] hover:text-white flex items-center gap-1 font-medium transition-colors cursor-pointer"
                          >
                            <span>Boost Nu</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        ) : (
                          <a
                            href={company.targetAction === 'vacancies' ? '#/vacatures' : '#/integraties'}
                            className="text-[11px] text-[#E5C583] hover:text-white flex items-center gap-1 font-medium transition-colors cursor-pointer"
                          >
                            <span>Bekijk Tech</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </a>
                        )}
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Global Assurance Footer */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E5C583]/10 border border-[#E5C583]/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#E5C583]" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-white">
                100% Algoritmische Veiligheid &amp; Strikt Discrete Drip-Feed
              </p>
              <p className="text-[11px] sm:text-xs text-white/50">
                Geen proxy-farms of virtuele datacenters. Elke interactie verloopt via residentiële verbindingen met reële surfprofielen.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => {
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-gradient-to-r from-[#F5E6CA] via-[#E5C583] to-[#DFB86C] text-black font-semibold text-xs px-5 py-2 rounded-full cursor-pointer hover:shadow-[0_4px_20px_rgba(229,197,131,0.35)] transition-all"
            >
              Start Campagne
            </Button>
            <a
              href="#/integraties"
              className="text-xs text-white/70 hover:text-white px-4 py-2 rounded-full border border-white/10 hover:border-white/20 transition-all cursor-pointer"
            >
              Architectuur Documentatie
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
