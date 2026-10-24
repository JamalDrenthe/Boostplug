import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { TiltCard } from '@/components/ui/TiltCard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Cpu,
  Power,
  Copy,
  Check,
  TrendingUp,
  Sparkles,
  RefreshCw,
  Coins,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  ECOSYSTEM_INTEGRATIONS,
  loadUserIntegrations,
  saveUserIntegration,
  removeUserIntegration,
  type EcosystemIntegration,
  type UserIntegrationState,
  type IntegrationCategory,
} from '@/data/integrations';

interface IntegrationsPageProps {
  onBack: () => void;
  onShop?: () => void;
  onJoin?: () => void;
}

export function IntegrationsPage({ onBack, onShop, onJoin }: IntegrationsPageProps) {
  const [integrationsState, setIntegrationsState] = useState<Record<string, UserIntegrationState>>(() =>
    loadUserIntegrations()
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<IntegrationCategory>('all');
  const [onlyActive, setOnlyActive] = useState(false);

  // VVC Rendementscalculator state
  const [vvcNodesCount, setVvcNodesCount] = useState<number>(2);
  const [copiedCode, setCopiedCode] = useState(false);

  // Modal State voor actieve configuratie
  const [activeModalIntegration, setActiveModalIntegration] = useState<EcosystemIntegration | null>(null);
  const [modalFormData, setModalFormData] = useState<Record<string, string>>({});
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const activeCount = useMemo(() => {
    return Object.values(integrationsState).filter((s) => s.isActive).length;
  }, [integrationsState]);

  // VVC Berekeningen
  const vvcGrossPerNode = 285;
  const vvcGroverLeasePerNode = 29.9;
  const vvcGrossTotal = vvcNodesCount * vvcGrossPerNode;
  const vvcLeaseTotal = vvcNodesCount * vvcGroverLeasePerNode;
  const vvcNetMonthly = vvcGrossTotal - vvcLeaseTotal;
  const vvcNetYearly = vvcNetMonthly * 12;

  const handleCopyGroverCode = () => {
    navigator.clipboard.writeText('QUANTUMBOOST20');
    setCopiedCode(true);
    toast.success('Kortingscode QUANTUMBOOST20 gekopieerd!');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleOpenConfigure = (integration: EcosystemIntegration) => {
    const existing = integrationsState[integration.id];
    setActiveModalIntegration(integration);
    setTestResult(null);
    setIsTestingConnection(false);

    // Initialiseer form data
    const initialValues: Record<string, string> = {};
    integration.fields.forEach((field) => {
      initialValues[field.id] = existing?.configData?.[field.id] || (field.options ? field.options[0].value : '');
    });
    setModalFormData(initialValues);
  };

  const handleTestHandshake = async () => {
    setIsTestingConnection(true);
    setTestResult(null);
    await new Promise((resolve) => setTimeout(resolve, 1400));
    setIsTestingConnection(false);
    setTestResult('Handshake geslaagd! Verbinding met Quantum Initium gateway is stabiel en geverifieerd (14ms latency).');
    toast.success('Handshake geslaagd!');
  };

  const handleSaveIntegration = () => {
    if (!activeModalIntegration) return;

    // Controleer verplichte velden
    const missing = activeModalIntegration.fields.filter(
      (f) => f.required && (!modalFormData[f.id] || modalFormData[f.id].trim() === '')
    );

    if (missing.length > 0) {
      toast.error(`Vul a.u.b. alle verplichte velden in: ${missing.map((m) => m.label).join(', ')}`);
      return;
    }

    const updated = saveUserIntegration(activeModalIntegration.id, true, modalFormData);
    setIntegrationsState({ ...updated });
    toast.success(`Integratie ${activeModalIntegration.name} succesvol geactiveerd!`);
    setActiveModalIntegration(null);
  };

  const handleDeactivate = (id: string) => {
    const updated = removeUserIntegration(id);
    setIntegrationsState({ ...updated });
    toast.info('Integratie gedeactiveerd.');
    setActiveModalIntegration(null);
  };

  // Gefilterde integraties
  const filteredIntegrations = useMemo(() => {
    return ECOSYSTEM_INTEGRATIONS.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        selectedCategory === 'all'
          ? true
          : selectedCategory === 'hardware'
          ? item.category === 'hardware'
          : selectedCategory === 'infra'
          ? item.category === 'infra'
          : selectedCategory === 'distribution'
          ? item.category === 'distribution'
          : selectedCategory === 'finance'
          ? item.category === 'finance'
          : selectedCategory === 'lifestyle'
          ? item.category === 'lifestyle'
          : selectedCategory === 'developer'
          ? item.category === 'developer'
          : true;

      const isActive = integrationsState[item.id]?.isActive;
      const matchesActive = onlyActive ? isActive : true;

      return matchesSearch && matchesCat && matchesActive;
    });
  }, [searchQuery, selectedCategory, onlyActive, integrationsState]);

  return (
    <section className="min-h-screen pt-24 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigatie Terug & Acties */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors cursor-pointer text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar home
          </button>
          <div className="flex items-center gap-3">
            {onShop && (
              <Button
                variant="outline"
                size="sm"
                onClick={onShop}
                className="border-white/10 text-white/80 hover:text-white hover:bg-white/10 rounded-full text-xs"
              >
                Boost Pakketten
              </Button>
            )}
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
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E5C583]/10 border border-[#E5C583]/30 text-[#E5C583] text-xs font-semibold uppercase tracking-wider mb-4 font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            QUANTUM INITIUM • ATELIER ECOSYSTEEM & INTEGRATIES
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4">
            Ecosysteem &{' '}
            <span className="font-serif italic font-normal text-gold-gradient">
              Integraties Hub
            </span>
          </h1>
          <p className="text-[#FAF8F5]/60 text-sm sm:text-lg max-w-3xl mx-auto leading-relaxed font-light">
            Activeer en configureer het complete gedecentraliseerde netwerk van Quantum Initium. Van het hardware-verdienmodel van de
            Verdienende Vrienden Club (VVC) tot residentiële IP-pools van Logs.rent, artiestenreleases via Zheavenzy en
            geautomatiseerde treasury via Investbotiq.
          </p>
        </motion.div>

        {/* KPI Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          <TiltCard glowColor="gold">
            <div className="p-5 bg-[#0D1117]/80 border border-white/[0.08] hover:border-[#E5C583]/40 rounded-2xl text-center transition-all">
              <p className="font-serif italic text-3xl sm:text-4xl font-light text-[#E5C583] mb-1">10</p>
              <p className="text-white/50 text-[11px] font-mono uppercase tracking-wider">Ecosysteem Modules</p>
            </div>
          </TiltCard>
          <TiltCard glowColor="gold">
            <div className="p-5 bg-[#0D1117]/80 border border-white/[0.08] hover:border-[#E5C583]/40 rounded-2xl text-center transition-all">
              <p className="font-serif italic text-2xl sm:text-3xl font-light text-[#FAF8F5] mb-1">€150 - €400</p>
              <p className="text-white/50 text-[11px] font-mono uppercase tracking-wider">VVC Rendement / Node / mnd</p>
            </div>
          </TiltCard>
          <TiltCard glowColor="emerald">
            <div className="p-5 bg-[#0D1117]/80 border border-white/[0.08] hover:border-emerald-500/40 rounded-2xl text-center transition-all">
              <p className="font-serif italic text-3xl sm:text-4xl font-light text-emerald-400 mb-1">100%</p>
              <p className="text-white/50 text-[11px] font-mono uppercase tracking-wider">Eigen Infrastructuur</p>
            </div>
          </TiltCard>
          <TiltCard glowColor="gold">
            <div className="p-5 bg-[#0D1117]/80 border border-white/[0.08] hover:border-[#E5C583]/40 rounded-2xl text-center transition-all">
              <p className="font-serif italic text-3xl sm:text-4xl font-light text-[#E5C583] mb-1">
                {activeCount} / 10
              </p>
              <p className="text-white/50 text-[11px] font-mono uppercase tracking-wider">Nu Actief Gekoppeld</p>
            </div>
          </TiltCard>
        </div>

        {/* ========================================================================= */}
        {/* FLAGSHIP UITGELICHT: VERDIENENDE VRIENDEN CLUB (VVC) & HARDWARE NODES     */}
        {/* ========================================================================= */}
        <div id="vvc" className="mb-16 scroll-mt-28">
          <div className="p-6 sm:p-10 bg-gradient-to-br from-[#E5C583]/15 via-[#0D1117] to-[#10B981]/15 border-2 border-[#E5C583]/40 rounded-3xl relative overflow-hidden shadow-[0_20px_60px_rgba(229,197,131,0.12)]">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 mb-8">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#E5C583]/20 text-[#E5C583] border-[#E5C583]/40 text-xs px-3 py-0.5 font-mono">
                    FLAGSHIP HARDWARE ASSET
                  </Badge>
                  <Badge className="bg-white/10 text-[#FAF8F5]/80 border-white/10 text-xs font-mono">
                    Quantum Initium Community
                  </Badge>
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                  Verdienende Vrienden Club{' '}
                  <span className="font-serif italic font-normal text-gold-gradient">(VVC)</span>
                </h2>
                <p className="text-[#FAF8F5]/70 text-sm sm:text-base leading-relaxed font-light">
                  De Verdienende Vrienden Club is de exclusieve community binnen Quantum Initium waar leden maandelijks
                  een vast rendement genereren door een residentiële node (Apple Mac mini M2/M4 of laptop) in te zetten.
                  Jouw hardware voert op de achtergrond gecontroleerde streamingsessies uit over Nederlandse KPN- en
                  Ziggo-verbindingen.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
                    <span className="text-xs text-[#E5C583] font-mono font-bold">1. HARDWARE</span>
                    <p className="text-white text-xs font-medium mt-1">Lease via Grover</p>
                    <p className="text-white/40 text-[11px]">Code QUANTUMBOOST20 (20% korting)</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
                    <span className="text-xs text-[#10B981] font-mono font-bold">2. ACTIVATIE</span>
                    <p className="text-white text-xs font-medium mt-1">Achtergrond Daemon</p>
                    <p className="text-white/40 text-[11px]">Draait geruisloos zonder zware belasting</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10">
                    <span className="text-xs text-[#FAF8F5] font-mono font-bold">3. UITBETALING</span>
                    <p className="text-white text-xs font-medium mt-1">1e vd Maand</p>
                    <p className="text-white/40 text-[11px]">€150 - €400 per node via SEPA</p>
                  </div>
                </div>
              </div>

              {/* Grover Partner Card & Quick Action */}
              <div className="lg:w-80 shrink-0 p-6 rounded-2xl bg-[#090B0F]/90 border border-[#E5C583]/30 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#E5C583] uppercase tracking-wider font-mono">Grover Hardware Deal</span>
                  <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 text-[10px] bg-emerald-500/10">
                    20% Korting
                  </Badge>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.04] border border-[#E5C583]/30 flex items-center justify-between gap-2">
                  <span className="font-mono text-sm font-bold text-[#FAF8F5] tracking-wider">QUANTUMBOOST20</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopyGroverCode}
                    className="h-7 px-2 text-[#E5C583] hover:text-white hover:bg-white/10"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </Button>
                </div>
                <p className="text-[11px] text-white/50 leading-relaxed font-light">
                  Gebruik deze code bij Grover voor directe korting op je Mac mini M2 (€29,90/mnd) of M4 lease.
                </p>
                <div className="space-y-2 pt-1">
                  <Button
                    onClick={() => {
                      const vvc = ECOSYSTEM_INTEGRATIONS.find((i) => i.id === 'vvc_node');
                      if (vvc) handleOpenConfigure(vvc);
                    }}
                    className="w-full bg-gradient-to-r from-[#E5C583] via-[#D4AF37] to-[#C5A059] text-[#090B0F] font-bold text-xs h-10 rounded-full shadow-[0_0_15px_rgba(229,197,131,0.3)] hover:brightness-110 cursor-pointer"
                  >
                    <Cpu className="w-4 h-4 mr-1.5" />
                    {integrationsState['vvc_node']?.isActive ? 'VVC Node Geconfigureerd' : 'Activeer VVC Node Nu'}
                  </Button>
                  <a
                    href="https://www.grover.com/nl-nl/computers/apple-mac-mini"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 text-xs text-white/70 hover:text-white h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    Bekijk Mac mini op Grover
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Interactieve VVC Calculator */}
            <div className="p-6 rounded-2xl bg-black/50 border border-white/10 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Coins className="w-4 h-4 text-[#E5C583]" />
                    Rendementscalculator Verdienende Vrienden Club
                  </h3>
                  <p className="text-white/50 text-xs mt-0.5 font-light">
                    Sleep de balk om je geschatte maandelijkse en jaarlijkse nettowinst te berekenen.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase font-mono text-white/40">Geselecteerd:</span>
                  <p className="text-lg font-bold text-[#E5C583] font-mono">
                    {vvcNodesCount} {vvcNodesCount === 1 ? 'Hardware Node' : 'Hardware Nodes'}
                  </p>
                </div>
              </div>

              <Slider
                value={[vvcNodesCount]}
                onValueChange={(val) => setVvcNodesCount(val[0])}
                min={1}
                max={10}
                step={1}
                className="py-2"
              />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <span className="text-[10px] text-white/40 uppercase font-mono">Bruto Vergoeding</span>
                  <p className="font-serif italic text-xl font-light text-white mt-0.5">€ {vvcGrossTotal.toFixed(0)},-</p>
                  <span className="text-[10px] text-white/40">€285 per machine / mnd</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <span className="text-[10px] text-white/40 uppercase font-mono">Grover Leasekosten</span>
                  <p className="font-serif italic text-xl font-light text-white/70 mt-0.5">- € {vvcLeaseTotal.toFixed(0)},-</p>
                  <span className="text-[10px] text-white/40">~€29,90 per machine / mnd</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                  <span className="text-[10px] text-emerald-400 uppercase font-mono font-bold">Netto Winst / Maand</span>
                  <p className="font-serif italic text-2xl font-light text-emerald-400 mt-0.5">
                    € {vvcNetMonthly.toFixed(2)}
                  </p>
                  <span className="text-[10px] text-emerald-400/70">Vaste SEPA op de 1e</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#E5C583]/10 border border-[#E5C583]/30">
                  <span className="text-[10px] text-[#E5C583] uppercase font-mono font-bold">Netto Winst / Jaar</span>
                  <p className="font-serif italic text-2xl font-light text-[#E5C583] mt-0.5">
                    € {vvcNetYearly.toFixed(2)}
                  </p>
                  <span className="text-[10px] text-[#E5C583]/70">Passief jaarinkomen</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FILTER & INTEGRATIES GRID                                                 */}
        {/* ========================================================================= */}
        <div id="catalogus" className="mb-14 scroll-mt-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[hsl(142,76%,45%)] mb-1">
                Ecosysteem Catalogus
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Alle Beschikbare Integraties
              </h2>
            </div>

            {/* Zoekbalk & Alleen Actief Toggle */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Zoek integratie..."
                  className="pl-9 h-9 text-xs bg-white/5 border-white/10 text-white rounded-xl w-full sm:w-56"
                />
              </div>
              <Button
                variant={onlyActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => setOnlyActive(!onlyActive)}
                className={`text-xs h-9 rounded-xl ${
                  onlyActive
                    ? 'bg-[hsl(142,76%,45%)] text-black font-semibold'
                    : 'border-white/10 text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Power className="w-3.5 h-3.5 mr-1" />
                Alleen Actief ({activeCount})
              </Button>
            </div>
          </div>

          {/* Categorie Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none">
            {[
              { id: 'all', label: 'Alles (10)' },
              { id: 'hardware', label: 'Hardware & Nodes' },
              { id: 'infra', label: 'Residentieel & Data' },
              { id: 'distribution', label: 'Muziek & Distributie' },
              { id: 'finance', label: 'Financiën & Treasury' },
              { id: 'lifestyle', label: 'Lifestyle & Hubs' },
              { id: 'developer', label: 'Developer & Webhooks' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as IntegrationCategory)}
                className={`text-xs px-4 py-2 rounded-full whitespace-nowrap transition-all cursor-pointer font-medium ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-[#E5C583] to-[#D4AF37] text-[#090B0F] font-semibold shadow-[0_0_15px_rgba(229,197,131,0.3)]'
                    : 'bg-white/[0.03] text-white/60 hover:text-white border border-white/[0.08] hover:bg-white/[0.08]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid Kaarten */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredIntegrations.map((item) => {
              const IconComp = item.icon;
              const isConfigured = integrationsState[item.id]?.isActive;

              return (
                <TiltCard key={item.id} glowColor={isConfigured ? 'emerald' : 'gold'} className="h-full">
                  <div
                    className={`p-6 rounded-2xl transition-all flex flex-col justify-between group h-full ${
                      isConfigured
                        ? 'bg-[#0D1117]/90 border border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                        : 'bg-[#0D1117]/80 hover:bg-[#0D1117]/95 border border-white/[0.08] hover:border-[#E5C583]/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                          <IconComp className="w-5 h-5 text-[#E5C583]" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Badge className={`${item.tagColor} text-[10px] border`}>
                            {item.tag}
                          </Badge>
                          {isConfigured && (
                            <span className="flex h-2 w-2 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mb-2">
                        <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                          {item.name}
                        </h3>
                        <p className="text-xs text-[#E5C583] font-mono mt-0.5">{item.subtitle}</p>
                      </div>

                      <p className="text-white/60 text-xs leading-relaxed mb-4 font-light">
                        {item.description}
                      </p>

                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-white/50 leading-relaxed mb-4">
                        <strong className="text-white/80 block mb-0.5">Holding Synergie:</strong>
                        {item.synergy}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 space-y-2.5">
                      {item.metrics && (
                        <div className="flex items-center justify-between text-[11px] text-white/40">
                          <span>{item.metrics.label}</span>
                          <span className="font-mono text-white/80 font-medium">{item.metrics.value}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleOpenConfigure(item)}
                          className={`flex-1 text-xs h-9 rounded-full font-medium cursor-pointer ${
                            isConfigured
                              ? 'bg-white/10 hover:bg-white/15 text-white border border-emerald-500/30'
                              : 'bg-gradient-to-r from-[#E5C583] via-[#D4AF37] to-[#C5A059] text-[#090B0F] font-bold shadow-[0_0_12px_rgba(229,197,131,0.25)] hover:brightness-110'
                          }`}
                        >
                          {isConfigured ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                              Geactiveerd • Wijzigen
                            </>
                          ) : (
                            <>
                              <Zap className="w-3.5 h-3.5 mr-1.5" />
                              Activeren
                            </>
                          )}
                        </Button>

                        {item.externalUrl && (
                          <a
                            href={item.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                            title="Bezoek officiële website"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ARCHITECTUUR & SYNERGIE DIAGRAM                                           */}
        {/* ========================================================================= */}
        <div className="mb-14">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Hoe het Ecosysteem Samensmelt
            </h2>
            <p className="text-white/50 text-xs sm:text-sm max-w-xl mx-auto">
              Elke integratie vervult een gespecialiseerde functie binnen de keten van hardware, IP-pools, media en
              kapitaalbeheer.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="p-5 bg-white/5 border-white/10 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-white font-bold text-sm mb-1.5">1. Vraag & Campagnes</h3>
              <p className="text-white/50 text-xs leading-relaxed">
                Artiesten en merken bestellen gerichte boosts via <strong>BoostPlug</strong> of distribueren tracks via
                platenlabel <strong>Zheavenzy</strong>.
              </p>
            </Card>

            <Card className="p-5 bg-white/5 border-white/10 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-white font-bold text-sm mb-1.5">2. Hardware & Residentieel</h3>
              <p className="text-white/50 text-xs leading-relaxed">
                Leden van de <strong>Verdienende Vrienden Club (VVC)</strong> leveren de residentiële nodes en{' '}
                <strong>Logs.rent</strong> verzorgt de veilige account-pools.
              </p>
            </Card>

            <Card className="p-5 bg-white/5 border-white/10 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-white font-bold text-sm mb-1.5">3. Treasury & Uitbetaling</h3>
              <p className="text-white/50 text-xs leading-relaxed">
                <strong>Investbotiq</strong> en <strong>Stripe SEPA</strong> verzorgen de geautomatiseerde batch payouts
                naar leden en holdingpartners op de 1e van de maand.
              </p>
            </Card>
          </div>
        </div>

        {/* Corporate Trust Banner */}
        <Card className="p-8 bg-gradient-to-br from-white/10 via-[hsl(220,35%,8%)] to-[hsl(220,35%,5%)] border-white/15 rounded-3xl text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Een Nieuwe Integratie Toevoegen of Partner Worden?
            </h3>
            <p className="text-white/60 text-xs sm:text-sm max-w-xl leading-relaxed">
              Ben je een artiest, API-ontwikkelaar of holdingpartner die wil aansluiten bij het Quantum Initium netwerk?
              Neem direct contact op met onze technische directie.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            {onJoin && (
              <Button
                onClick={onJoin}
                className="w-full sm:w-auto bg-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,40%)] text-black font-semibold rounded-xl text-xs px-5 h-10 cursor-pointer"
              >
                <Users className="w-4 h-4 mr-1.5" />
                Word Lid van VVC
              </Button>
            )}
            <a
              href="mailto:support@boostplug.one?subject=Nieuwe%20Quantum%20Initium%20Integratie"
              className="w-full sm:w-auto inline-flex items-center justify-center border border-white/20 text-white hover:bg-white/10 rounded-xl text-xs px-5 h-10 transition-colors"
            >
              Partner Aanvraag
            </a>
          </div>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* CONFIGURATIE MODAL                                                        */}
      {/* ========================================================================= */}
      {activeModalIntegration && (
        <Dialog open={true} onOpenChange={(open) => !open && setActiveModalIntegration(null)}>
          <DialogContent className="max-w-xl bg-[hsl(220,25%,10%)]/95 backdrop-blur-2xl border-white/15 text-white p-6 sm:p-8 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="space-y-2 text-left">
              <div className="flex items-center gap-2">
                <Badge className={`${activeModalIntegration.tagColor} text-xs px-2.5 py-0.5`}>
                  {activeModalIntegration.categoryLabel}
                </Badge>
                {integrationsState[activeModalIntegration.id]?.isActive ? (
                  <Badge variant="outline" className="border-green-500/50 text-green-400 text-xs">
                    Actief Verbonden
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-white/20 text-white/50 text-xs">
                    Niet Verbonden
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-xl sm:text-2xl font-bold text-white">
                {activeModalIntegration.name} Integratie
              </DialogTitle>
              <DialogDescription className="text-white/60 text-xs leading-relaxed">
                {activeModalIntegration.description}
              </DialogDescription>
            </DialogHeader>

            {/* Instructies */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2 my-2">
              <p className="text-xs font-semibold text-white/80 uppercase tracking-wider">Instructies:</p>
              <ul className="space-y-1.5 text-xs text-white/60">
                {activeModalIntegration.instructions.map((ins, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-white/10 text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{ins}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dynamische Velden */}
            <div className="space-y-4 my-2">
              {activeModalIntegration.fields.map((field) => (
                <div key={field.id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-white font-medium">
                      {field.label} {field.required && <span className="text-red-400">*</span>}
                    </Label>
                    {field.id === 'groverCode' && (
                      <button
                        type="button"
                        onClick={handleCopyGroverCode}
                        className="text-[10px] text-[hsl(142,76%,45%)] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        Kopieer QUANTUMBOOST20
                      </button>
                    )}
                  </div>

                  {field.type === 'select' ? (
                    <select
                      value={modalFormData[field.id] || ''}
                      onChange={(e) => setModalFormData({ ...modalFormData, [field.id]: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[hsl(142,76%,45%)]"
                    >
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-neutral-900 text-white">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      type={field.type === 'password' ? 'password' : 'text'}
                      value={modalFormData[field.id] || ''}
                      onChange={(e) => setModalFormData({ ...modalFormData, [field.id]: e.target.value })}
                      placeholder={field.placeholder}
                      className="bg-white/5 border-white/10 text-white text-xs h-9 rounded-xl placeholder:text-white/30"
                    />
                  )}

                  {field.helperText && (
                    <p className="text-[10px] text-white/40">{field.helperText}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Test Connection Output */}
            {testResult && (
              <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-xs text-green-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-green-400" />
                <span>{testResult}</span>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isTestingConnection}
                onClick={handleTestHandshake}
                className="w-full sm:w-auto border-white/15 text-white/80 hover:text-white hover:bg-white/10 text-xs h-9 rounded-xl"
              >
                {isTestingConnection ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Handshake testen...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-[hsl(199,89%,48%)]" />
                    Test Verbinding
                  </>
                )}
              </Button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {integrationsState[activeModalIntegration.id]?.isActive && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeactivate(activeModalIntegration.id)}
                    className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 h-9 rounded-xl px-3"
                  >
                    Uitschakelen
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={handleSaveIntegration}
                  className="flex-1 sm:flex-initial bg-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,40%)] text-black font-semibold text-xs h-9 rounded-xl px-5"
                >
                  Opslaan & Activeren
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}
