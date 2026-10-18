import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Users,
  Coins,
  Cpu,
  Building2,
  TrendingUp,
  CheckCircle2,
  Zap,
  Gift,
  Compass,
  KeyRound,
  Music2,
} from 'lucide-react';

interface VVCPageProps {
  onBack: () => void;
  onJoin?: () => void;
  onGoQuantumInitium?: () => void;
}

interface VVCPillar {
  name: string;
  category: string;
  tag: string;
  tagColor: string;
  description: string;
  benefit: string;
  ctaText?: string;
  ctaAction?: string;
  icon: typeof Users;
}

const vvcPillars: VVCPillar[] = [
  {
    name: 'BoostPlug Hardware Nodes',
    category: 'Passief Inkomen',
    tag: '€150 - €400 / mnd',
    tagColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    description: 'Zet een energiezuinige Apple Silicon Mac mini in als achtergrondnode. De software simuleert streaming-interacties en betaalt maandelijks uit.',
    benefit: 'Gemiddeld 145 streams/uur via je eigen residentiële verbinding zonder dat je eigen internet merkbaar vertraagt.',
    ctaText: 'Start als Node Operator',
    icon: Cpu,
  },
  {
    name: 'Grover Hardware Partnerprogramma',
    category: 'Hardware Lease',
    tag: 'Korting QUANTUMBOOST20',
    tagColor: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    description: 'Geen dure aanschafkosten vooraf. Leden leasen direct een Mac mini M2 of M4 via Grover met onze exclusieve holding-partnerkorting.',
    benefit: 'Flexibel maandelijks opzegbaar of met gunstige 12-maands leasetermijnen inclusief Grover Care dekking.',
    ctaText: 'Bekijk Grover Voordeel',
    icon: Zap,
  },
  {
    name: 'Spontiva Ledenvoordelen',
    category: 'Clubtoegang & Lifestyle',
    tag: 'Tot 30% Korting',
    tagColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    description: 'Spontiva fungeert als het ledenplatform van de Verdienende Vrienden Club. Hier vind je exclusieve tarieven voor alle BoostPlug diensten.',
    benefit: 'Leden betalen aanzienlijk lagere tarieven voor streams, reviews en promotiecampagnes van hun eigen projecten.',
    ctaText: 'Spontiva Ledenvoordeel',
    icon: Compass,
  },
  {
    name: 'Zheavenzy Muzieksamenwerking',
    category: 'Artiesten & Publishing',
    tag: 'Royalty Delen',
    tagColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    description: 'Als VVC-lid ben je nauw verbonden met zheavenzy.one. Jouw node draait gecontroleerde streamingsessies en je deelt mee in het succes van opkomende artiesten.',
    benefit: 'Toegang tot exclusieve luistersessies, VIP-gastenlijsten en distributiekansen voor eigen muziek en artiesten.',
    ctaText: 'Naar Zheavenzy',
    icon: Music2,
  },
  {
    name: 'Logs.rent Residentiële Beloningen',
    category: 'Data & IP Infrastructuur',
    tag: 'Veilig & Schoon',
    tagColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    description: 'Jouw residentiële Nederlandse IP-adres helpt streamingalgoritmes te voorzien van echte, niet-geflagde interacties.',
    benefit: '100% legale, veilige achtergrondactiviteit die volledig gescheiden blijft van je persoonlijke surfgedrag.',
    ctaText: 'Meer over IP Pools',
    icon: KeyRound,
  },
  {
    name: 'Investbotiq Financiële Kennis',
    category: 'Fintech & Vermogen',
    tag: 'Mastermind',
    tagColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    description: 'Krijg toegang tot periodieke masterclasses, kwantitatieve marktinformatie en holding-analyses van Investbotiq.',
    benefit: 'Leer hoe het holding-ecosysteem kapitaal beheert en ontwikkel je eigen vaardigheden in geautomatiseerde financiën.',
    ctaText: 'Fintech Inzichten',
    icon: TrendingUp,
  },
];

export function VVCPage({ onBack, onJoin, onGoQuantumInitium }: VVCPageProps) {
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
                if (onGoQuantumInitium) onGoQuantumInitium();
                else window.location.hash = '#/quantum-initium';
              }}
              className="border-emerald-500/40 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 text-xs rounded-full"
            >
              <Building2 className="w-3.5 h-3.5 mr-1.5" />
              Quantum Initium &rarr;
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (onJoin) onJoin();
                else window.location.hash = '#/register/lid';
              }}
              className="bg-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,40%)] text-black font-semibold text-xs rounded-full px-4"
            >
              <Coins className="w-3.5 h-3.5 mr-1.5" />
              Word Direct Lid
            </Button>
          </div>
        </div>

        {/* Hero Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Users className="w-3.5 h-3.5" />
            Community & Verdienmodel
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4">
            Verdienende <span className="text-[hsl(199,89%,48%)]">Vrienden Club</span>
          </h1>
          <p className="text-white/60 text-sm sm:text-lg max-w-3xl mx-auto leading-relaxed">
            De Verdienende Vrienden Club (VVC) is de exclusieve community binnen het Quantum Initium ecosysteem.
            Samen bouwen leden aan een gedecentraliseerd netwerk en verdienen maandelijks met hardware nodes en holdingvoordelen.
          </p>
        </div>

        {/* KPI Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="p-4 sm:p-5 bg-white/5 border-white/10 rounded-2xl text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-white mb-1">€150 - €400</p>
            <p className="text-white/50 text-xs font-medium uppercase tracking-wider">Vergoeding per Node / mnd</p>
          </Card>
          <Card className="p-4 sm:p-5 bg-white/5 border-white/10 rounded-2xl text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-[hsl(142,76%,45%)] mb-1">1e vd Maand</p>
            <p className="text-white/50 text-xs font-medium uppercase tracking-wider">Vaste SEPA Uitbetaling</p>
          </Card>
          <Card className="p-4 sm:p-5 bg-white/5 border-white/10 rounded-2xl text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-sky-400 mb-1">Grover Deal</p>
            <p className="text-white/50 text-xs font-medium uppercase tracking-wider">Code QUANTUMBOOST20</p>
          </Card>
          <Card className="p-4 sm:p-5 bg-white/5 border-white/10 rounded-2xl text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-purple-400 mb-1">100%</p>
            <p className="text-white/50 text-xs font-medium uppercase tracking-wider">Legale Achtergrondsoftware</p>
          </Card>
        </div>

        {/* 4 Pijlers van VVC */}
        <div className="mb-14">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Waarom Leden Kiezen voor VVC
            </h2>
            <p className="text-white/50 text-xs sm:text-sm max-w-xl mx-auto">
              Een transparante club waar vriendschap, geavanceerde technologie en financieel rendement hand in hand gaan.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 bg-white/5 border-white/10 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-white font-bold text-sm mb-1.5">Hardware Mining Nodes</h3>
              <p className="text-white/50 text-xs leading-relaxed">
                Lease een Mac mini via Grover en laat de officiële BoostPlug client geruisloos op de achtergrond draaien.
              </p>
            </Card>

            <Card className="p-5 bg-white/5 border-white/10 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-3">
                <Gift className="w-5 h-5" />
              </div>
              <h3 className="text-white font-bold text-sm mb-1.5">Spontiva Ledenvoordeel</h3>
              <p className="text-white/50 text-xs leading-relaxed">
                Ontvang exclusieve clubkortingen tot wel 30% op al je eigen streaming- en reviewboosts.
              </p>
            </Card>

            <Card className="p-5 bg-white/5 border-white/10 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
                <Coins className="w-5 h-5" />
              </div>
              <h3 className="text-white font-bold text-sm mb-1.5">Maandelijkse Cashflow</h3>
              <p className="text-white/50 text-xs leading-relaxed">
                Elke maand rond de 1e worden alle streams getotaliseerd en direct gestort op je geverifieerde SEPA IBAN.
              </p>
            </Card>

            <Card className="p-5 bg-white/5 border-white/10 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-white font-bold text-sm mb-1.5">Quantum Initium Netwerkvoordeel</h3>
              <p className="text-white/50 text-xs leading-relaxed">
                Als VVC-lid sta je in directe verbinding met het Quantum Initium ecosysteem en profiteer je mee van nieuwe initiatieven.
              </p>
            </Card>
          </div>
        </div>

        {/* 6 Voordelen & Inkomstenstromen Grid */}
        <div className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-1">De Voordelen</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                VVC Inkomsten- & Voordelenstromen
              </h2>
            </div>
            <p className="text-white/50 text-xs max-w-md">
              Verdien niet alleen aan je eigen node, maar geniet van privileges over het gehele Quantum Initium ecosysteem.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {vvcPillars.map((pillar) => {
              const IconComponent = pillar.icon;
              return (
                <Card
                  key={pillar.name}
                  className="p-6 bg-white/[0.04] hover:bg-white/[0.07] border-white/10 hover:border-white/20 transition-all rounded-2xl flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                        <IconComponent className="w-5 h-5 text-sky-400" />
                      </div>
                      <Badge className={`${pillar.tagColor} text-[10px] border`}>
                        {pillar.tag}
                      </Badge>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-1">{pillar.name}</h3>
                    <p className="text-xs text-[hsl(142,76%,45%)] font-mono mb-2.5">{pillar.category}</p>
                    <p className="text-white/60 text-xs leading-relaxed mb-4">
                      {pillar.description}
                    </p>

                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-white/50 leading-relaxed mb-4">
                      <strong className="text-white/80 block mb-0.5">Ledenvoordeel:</strong>
                      {pillar.benefit}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        if (onJoin) onJoin();
                        else window.location.hash = '#/register/lid';
                      }}
                      className="text-xs text-sky-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                    >
                      {pillar.ctaText} &rarr;
                    </button>
                    <span className="text-[10px] text-white/30 uppercase tracking-wider font-mono">VVC Exclusief</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* 3-Stappenplan naar Lidmaatschap */}
        <Card className="p-6 sm:p-10 bg-white/5 border-white/10 rounded-3xl mb-14">
          <div className="text-center mb-8">
            <p className="text-xs font-bold uppercase tracking-wider text-[hsl(142,76%,45%)] mb-2">Eenvoudig Starten</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              In 3 Stappen Actief in de Verdienende Vrienden Club
            </h2>
            <p className="text-white/50 text-xs sm:text-sm max-w-xl mx-auto">
              Iedereen met een stabiele internetverbinding kan deelnemen als hardware node operator.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-full bg-[hsl(142,76%,45%)]/20 text-[hsl(142,76%,45%)] font-bold text-sm flex items-center justify-center mb-3">
                  1
                </span>
                <h3 className="text-white font-bold text-base mb-1.5">Lidaccount Aanmaken</h3>
                <p className="text-white/50 text-xs leading-relaxed">
                  Registreer gratis je account als Lid. Hiermee krijg je direct toegang tot je persoonlijke node-dashboard en telemetry.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-[11px] text-white/40">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Binnen 2 minuten geregeld
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 font-bold text-sm flex items-center justify-center mb-3">
                  2
                </span>
                <h3 className="text-white font-bold text-base mb-1.5">Hardware Activeren</h3>
                <p className="text-white/50 text-xs leading-relaxed">
                  Lease een Mac mini M2 via Grover met onze exclusieve partnercode <code className="text-white font-mono bg-white/10 px-1 py-0.5 rounded">QUANTUMBOOST20</code> en installeer de lichte achtergrondclient.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-[11px] text-white/40">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                Volledig plug-and-play
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 font-bold text-sm flex items-center justify-center mb-3">
                  3
                </span>
                <h3 className="text-white font-bold text-base mb-1.5">Maandelijks Uitbetaald</h3>
                <p className="text-white/50 text-xs leading-relaxed">
                  Vul je IBAN in je profiel in. Zodra je node online is, volg je live je stream-opbrengst en ontvang je maandelijks je vergoeding (€150-€400/mnd).
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-[11px] text-white/40">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                Vaste SEPA overschrijving
              </div>
            </div>
          </div>
        </Card>

        {/* CTA Banner */}
        <Card className="p-8 bg-gradient-to-br from-white/10 via-[hsl(220,35%,8%)] to-[hsl(220,35%,5%)] border-white/15 rounded-3xl text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xl mb-12">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Klaar om te Verdienen met je Hardware?
            </h3>
            <p className="text-white/60 text-xs sm:text-sm max-w-xl leading-relaxed">
              Sluit je vandaag nog aan bij de Verdienende Vrienden Club en zet jouw residentiële hardware node in voor veilige streamingdistributie binnen Quantum Initium.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Button
              onClick={() => {
                if (onJoin) onJoin();
                else window.location.hash = '#/register/lid';
              }}
              className="w-full sm:w-auto bg-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,40%)] text-black font-semibold rounded-xl text-xs px-6 h-11 shadow-lg shadow-[hsl(142,76%,45%)]/20 cursor-pointer"
            >
              <Coins className="w-4 h-4 mr-1.5" />
              Word Direct Lid van VVC
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (onGoQuantumInitium) onGoQuantumInitium();
                else window.location.hash = '#/quantum-initium';
              }}
              className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 rounded-xl text-xs px-5 h-11 cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 mr-1.5" />
              Over Quantum Initium
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
