import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Building2,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Music2,
  KeyRound,
  Users,
  Home,
  Briefcase,
  Compass,
  Sparkles,
} from 'lucide-react';

interface QuantumInitiumPageProps {
  onBack: () => void;
  onShop?: () => void;
  onGoVVC?: () => void;
}

interface PortfolioEntity {
  name: string;
  category: string;
  tag: string;
  tagColor: string;
  description: string;
  synergy: string;
  url?: string;
  internalRoute?: string;
  icon: typeof Building2;
}

const portfolioEntities: PortfolioEntity[] = [
  {
    name: 'BoostPlug',
    category: 'Algoritme & Distributie',
    tag: 'Core Platform',
    tagColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    description: 'De toonaangevende motor voor geautomatiseerde en organische streaming- en reviewgroei op Spotify, Apple Music, Google Maps en Trustpilot.',
    synergy: 'Benut de residentiële nodes en accounts uit het holdingnetwerk voor veilige drip-feed levering.',
    internalRoute: '#products',
    icon: Sparkles,
  },
  {
    name: 'Verdienende Vrienden Club (VVC)',
    category: 'Ledenclub & Verdienmodel',
    tag: 'Community',
    tagColor: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    description: 'De exclusieve community van Quantum Initium waar leden via hardware nodes (Mac mini M2/M4) maandelijks passief inkomen genereren.',
    synergy: 'Leden leveren de IP- en simulatiecapaciteit die BoostPlug en holdingprojecten aandrijft.',
    internalRoute: '#/vvc',
    icon: Users,
  },
  {
    name: 'Zheavenzy',
    category: 'Muziek & Artiestenmanagement',
    tag: 'Music Label',
    tagColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    description: 'Internationaal muziek- en artiestenplatform op zheavenzy.one. Vertegenwoordigt opkomende en gevestigde artiesten met wereldwijde releases.',
    synergy: 'BoostPlug levert de algoritmekracht voor releases; VVC-leden delen mee in het succes van de muziekcampagnes.',
    url: 'https://zheavenzy.one',
    icon: Music2,
  },
  {
    name: 'Logs.rent',
    category: 'Infrastructuur & IP Pools',
    tag: 'Accounts & Infra',
    tagColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    description: 'Leverancier van hoogwaardige, organische accounts en residentiële IP-infrastructuur op logs.rent voor betrouwbare data- en streaminginteractie.',
    synergy: 'Vormt het veilige datafundament waardoor streamingdiensten en zoekmachines interacties als natuurlijk beoordelen.',
    url: 'https://logs.rent',
    icon: KeyRound,
  },
  {
    name: 'Spontiva',
    category: 'Lifestyle & Members Club',
    tag: 'Members Gateway',
    tagColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    description: 'Het exclusieve lifestyle- en ledenplatform dat toegang biedt tot partneraanbiedingen, premium evenementen en speciale tarieven.',
    synergy: 'Fungeert als de officiële toegangspoort voor VVC-leden met exclusieve voordelen en holdingkortingen.',
    icon: Compass,
  },
  {
    name: 'Investbotiq',
    category: 'Fintech & Kwantitatieve Analyse',
    tag: 'Fintech',
    tagColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    description: 'Geavanceerde financiële technologie en geautomatiseerde kwantitatieve analyses voor schaalbaar holdingbeheer en kapitaalgroei.',
    synergy: 'Biedt stabiele technologische infrastructuur voor holdingtransacties, micro-uitbetalingen en cashflowbeheer.',
    icon: TrendingUp,
  },
  {
    name: 'WoningVry',
    category: 'Vastgoed & Huisvesting',
    tag: 'Real Estate',
    tagColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    description: 'Vooruitstrevend vastgoedplatform en flexibele woonoplossingen binnen het Quantum Initium portfolio voor particulieren en ondernemers.',
    synergy: 'Ondersteunt fysieke expansie, datacenterlocaties en huisvesting voor holdingmedewerkers en partners.',
    icon: Home,
  },
  {
    name: 'Immigratie Punt',
    category: 'Juridisch & Relocatie',
    tag: 'Legal & Mobility',
    tagColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    description: 'Gespecialiseerd advies en begeleiding bij internationale mobiliteit, visa, zakelijke vestiging en expat services in Nederland.',
    synergy: 'Begeleidt internationale partners, artiesten en technologische specialisten bij vestiging in de EU.',
    icon: Briefcase,
  },
  {
    name: 'Xabi World',
    category: 'Creatieve Media & Identiteit',
    tag: 'Decentralized ID',
    tagColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    description: 'Internationale mediaproducties, gedecentraliseerde identiteit en culturele projecten versterkt door het holdingnetwerk.',
    synergy: 'Verzorgt de gedecentraliseerde identiteitsverificatie voor hardware node operators en holdinggebruikers.',
    icon: Cpu,
  },
];

export function QuantumInitiumPage({ onBack, onShop, onGoVVC }: QuantumInitiumPageProps) {
  return (
    <section className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigatie Terug */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors cursor-pointer text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar home
          </button>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (onGoVVC) onGoVVC();
                else window.location.hash = '#/vvc';
              }}
              className="border-sky-500/40 text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 text-xs rounded-full"
            >
              <Users className="w-3.5 h-3.5 mr-1.5" />
              Verdienende Vrienden Club &rarr;
            </Button>
            <a
              href="https://quantuminitium.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/60 hover:text-white px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-1.5"
            >
              quantuminitium.com
              <ExternalLink className="w-3 h-3 text-[hsl(142,76%,45%)]" />
            </a>
          </div>
        </div>

        {/* Hero Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(142,76%,45%)]/10 border border-[hsl(142,76%,45%)]/30 text-[hsl(142,76%,45%)] text-xs font-semibold uppercase tracking-wider mb-4">
            <Building2 className="w-3.5 h-3.5" />
            Holding & Ecosysteem
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4">
            Quantum <span className="text-[hsl(142,76%,45%)]">Initium</span>
          </h1>
          <p className="text-white/60 text-sm sm:text-lg max-w-3xl mx-auto leading-relaxed">
            Quantum Initium is het dynamische holding-ecosysteem achter toonaangevende technologieën,
            digitale algoritme-beïnvloeding, gedecentraliseerde streaming-infrastructuur en collectieve verdienmodellen.
          </p>
        </div>

        {/* KPI Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="p-4 sm:p-5 bg-white/5 border-white/10 rounded-2xl text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-white mb-1">9</p>
            <p className="text-white/50 text-xs font-medium uppercase tracking-wider">Ecosysteem Entiteiten</p>
          </Card>
          <Card className="p-4 sm:p-5 bg-white/5 border-white/10 rounded-2xl text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-[hsl(142,76%,45%)] mb-1">100%</p>
            <p className="text-white/50 text-xs font-medium uppercase tracking-wider">Algoritmische Synergie</p>
          </Card>
          <Card className="p-4 sm:p-5 bg-white/5 border-white/10 rounded-2xl text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-[hsl(199,89%,48%)] mb-1">&lt; 15 min</p>
            <p className="text-white/50 text-xs font-medium uppercase tracking-wider">Netwerk Activering</p>
          </Card>
          <Card className="p-4 sm:p-5 bg-white/5 border-white/10 rounded-2xl text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-purple-400 mb-1">24/7</p>
            <p className="text-white/50 text-xs font-medium uppercase tracking-wider">Monitoring & Node SLA</p>
          </Card>
        </div>

        {/* 4 Pijlers van Quantum Initium */}
        <div className="mb-14">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              De Kracht van Geïntegreerde Synergie
            </h2>
            <p className="text-white/50 text-xs sm:text-sm max-w-xl mx-auto">
              Waar andere bedrijven afhankelijk zijn van externe partijen, bevindt de volledige waardeketen zich binnen Quantum Initium.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 bg-white/5 border-white/10 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-white font-bold text-sm mb-1.5">Algoritme Distributie</h3>
              <p className="text-white/50 text-xs leading-relaxed">
                Volledige controle over het stimuleren van streamingdiensten en reviews via veilige drip-feed methodes.
              </p>
            </Card>

            <Card className="p-5 bg-white/5 border-white/10 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-white font-bold text-sm mb-1.5">Collectief Verdienmodel</h3>
              <p className="text-white/50 text-xs leading-relaxed">
                Via de Verdienende Vrienden Club (VVC) profiteren leden mee van hardware nodes en holdingopbrengsten.
              </p>
            </Card>

            <Card className="p-5 bg-white/5 border-white/10 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="text-white font-bold text-sm mb-1.5">Eigen IP & Account Pool</h3>
              <p className="text-white/50 text-xs leading-relaxed">
                Geen risico op banwaves dankzij residentiële IP-adressen en echte actieve accounts via Logs.rent.
              </p>
            </Card>

            <Card className="p-5 bg-white/5 border-white/10 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-white font-bold text-sm mb-1.5">Holding Kwaliteitsgarantie</h3>
              <p className="text-white/50 text-xs leading-relaxed">
                KvK-geregistreerde organisatie, transparante facturatie met BTW en een vast betrouwbaar aanspreekpunt.
              </p>
            </Card>
          </div>
        </div>

        {/* Portfolio Overzicht */}
        <div className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[hsl(142,76%,45%)] mb-1">Het Netwerk</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Quantum Initium Portfoliobedrijven
              </h2>
            </div>
            <p className="text-white/50 text-xs max-w-md">
              Elke onderneming vervult een specifieke rol in de keten van technologie, media, finance en ledenkracht.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {portfolioEntities.map((entity) => {
              const IconComponent = entity.icon;
              return (
                <Card
                  key={entity.name}
                  className="p-6 bg-white/[0.04] hover:bg-white/[0.07] border-white/10 hover:border-white/20 transition-all rounded-2xl flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                        <IconComponent className="w-5 h-5 text-[hsl(142,76%,45%)]" />
                      </div>
                      <Badge className={`${entity.tagColor} text-[10px] border`}>
                        {entity.tag}
                      </Badge>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-1">{entity.name}</h3>
                    <p className="text-xs text-[hsl(199,89%,48%)] font-mono mb-2.5">{entity.category}</p>
                    <p className="text-white/60 text-xs leading-relaxed mb-4">
                      {entity.description}
                    </p>

                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-white/50 leading-relaxed mb-4">
                      <strong className="text-white/80 block mb-0.5">Holding Synergie:</strong>
                      {entity.synergy}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    {entity.url ? (
                      <a
                        href={entity.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[hsl(142,76%,45%)] hover:underline flex items-center gap-1"
                      >
                        Bezoek website
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : entity.internalRoute ? (
                      <a
                        href={entity.internalRoute}
                        onClick={(e) => {
                          if (entity.name.includes('VVC') && onGoVVC) {
                            e.preventDefault();
                            onGoVVC();
                          } else if (entity.name === 'BoostPlug' && onShop) {
                            e.preventDefault();
                            onShop();
                          }
                        }}
                        className="text-xs text-sky-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                      >
                        Bekijk details &rarr;
                      </a>
                    ) : (
                      <span className="text-[11px] text-white/40">Onderdeel van Quantum Initium</span>
                    )}
                    <span className="text-[10px] text-white/30 uppercase tracking-wider font-mono">Geverifieerd</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Corporate Trust Banner */}
        <Card className="p-8 bg-gradient-to-br from-white/10 via-[hsl(220,35%,8%)] to-[hsl(220,35%,5%)] border-white/15 rounded-3xl text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xl mb-12">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Samenwerken met Quantum Initium
            </h3>
            <p className="text-white/60 text-xs sm:text-sm max-w-xl leading-relaxed">
              Ben je een artiest, investeerder of ondernemer die wil aansluiten bij ons ecosysteem?
              Of wil je profiteren van onze infrastructuur als lid van de Verdienende Vrienden Club?
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Button
              onClick={() => {
                if (onGoVVC) onGoVVC();
                else window.location.hash = '#/vvc';
              }}
              className="w-full sm:w-auto bg-sky-500 hover:bg-sky-400 text-black font-semibold rounded-xl text-xs px-5 h-10 cursor-pointer"
            >
              <Users className="w-4 h-4 mr-1.5" />
              Naar Verdienende Vrienden Club
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (onShop) onShop();
                else window.location.hash = '#products';
              }}
              className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 rounded-xl text-xs px-5 h-10 cursor-pointer"
            >
              Bekijk BoostPlug Diensten
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
