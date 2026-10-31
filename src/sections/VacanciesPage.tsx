import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/hooks/useStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TiltCard } from '@/components/ui/TiltCard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Briefcase,
  Search,
  MapPin,
  Coins,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Send,
  Zap,
  Layers,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import type { Vacancy, JobApplication } from '@/types';
import { 
  getVacanciesFromFirestore, 
  subscribeToVacancies, 
  submitJobApplicationToFirestore,
  syncVacancyToDjobba 
} from '@/lib/firebase';
import { testDjobbaHandshake } from '@/lib/djobbaApi';

interface VacanciesPageProps {
  onBack: () => void;
  onIntegrations?: () => void;
}

export function VacanciesPage({ onBack, onIntegrations }: VacanciesPageProps) {
  const { user } = useStore();
  const isAdmin = user?.accountType === 'admin' || (user?.email && ['info@boostplug.one', 'info@jamaldrenthe.com'].includes(user.email.toLowerCase()));

  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedContract, setSelectedContract] = useState<string>('all');

  // Modal State voor vacature details & solliciteren
  const [activeVacancy, setActiveVacancy] = useState<Vacancy | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState<JobApplication | null>(null);
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);

  // Form State
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [dbaStatus, setDbaStatus] = useState<'zzp' | 'loondienst' | 'payroll'>('zzp');
  const [motivation, setMotivation] = useState('');

  // Syncing state voor Djobba
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [djobbaStatus, setDjobbaStatus] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getVacanciesFromFirestore().then((initial) => {
      if (mounted) {
        setVacancies(initial);
        setLoading(false);
      }
    });

    const unsubscribe = subscribeToVacancies((updated) => {
      if (mounted) {
        setVacancies(updated);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const handleTestDjobba = async () => {
    setDjobbaStatus('Testen van verbinding met Djobba.works gateway...');
    const result = await testDjobbaHandshake();
    setDjobbaStatus(result.message);
    toast.success(result.message);
  };

  const handleSyncToDjobba = async (e: React.MouseEvent, vacancyId: string) => {
    e.stopPropagation();
    setSyncingId(vacancyId);
    try {
      const res = await syncVacancyToDjobba(vacancyId);
      if (res.success) {
        toast.success(res.message);
        if (res.vacancy) {
          setVacancies((prev) => prev.map((v) => (v.id === vacancyId ? res.vacancy! : v)));
          if (activeVacancy?.id === vacancyId) {
            setActiveVacancy(res.vacancy);
          }
        }
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Fout bij synchroniseren met Djobba');
    } finally {
      setSyncingId(null);
    }
  };

  const filteredVacancies = useMemo(() => {
    return vacancies.filter((vac) => {
      if (vac.status === 'closed') return false;
      const matchesSearch = 
        vac.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vac.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vac.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDept = selectedDepartment === 'all' || vac.department === selectedDepartment;
      const matchesContract = selectedContract === 'all' || vac.employmentType === selectedContract;

      return matchesSearch && matchesDept && matchesContract;
    });
  }, [vacancies, searchQuery, selectedDepartment, selectedContract]);

  const handleOpenDetail = (vac: Vacancy) => {
    setActiveVacancy(vac);
    setIsApplying(false);
    setApplicationSuccess(null);
  };

  const handleStartApply = (vac: Vacancy) => {
    setActiveVacancy(vac);
    setIsApplying(true);
    setApplicationSuccess(null);
    setFullName(user?.name || '');
    setEmail(user?.email || '');
    setPhone(user?.phone || '');
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVacancy) return;

    if (!fullName.trim() || !email.trim()) {
      toast.error('Vul a.u.b. je naam en e-mailadres in');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Vul een geldig e-mailadres in');
      return;
    }

    setIsSubmittingApp(true);
    try {
      const app = await submitJobApplicationToFirestore({
        vacancyId: activeVacancy.id,
        vacancyTitle: activeVacancy.title,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        linkedinUrl: linkedinUrl.trim() || undefined,
        portfolioUrl: portfolioUrl.trim() || undefined,
        dbaStatus,
        motivation: motivation.trim() || undefined,
      });

      setApplicationSuccess(app);
      toast.success(`Sollicitatie voor "${activeVacancy.title}" succesvol ingediend!`);
    } catch {
      toast.error('Er ging iets mis bij het versturen van je sollicitatie.');
    } finally {
      setIsSubmittingApp(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors cursor-pointer text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar home
          </button>
          <div className="flex items-center gap-3">
            {onIntegrations && (
              <Button
                variant="outline"
                size="sm"
                onClick={onIntegrations}
                className="border-white/10 text-white/80 hover:text-white hover:bg-white/10 rounded-full text-xs"
              >
                <Layers className="w-3.5 h-3.5 mr-1.5 text-[#E5C583]" />
                Ecosysteem & Integraties
              </Button>
            )}
            <a
              href="https://djobba.works"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#E5C583] hover:text-white px-3.5 py-1.5 rounded-full bg-[#E5C583]/10 border border-[#E5C583]/25 hover:bg-[#E5C583]/20 transition-all flex items-center gap-1.5 font-mono"
            >
              djobba.works
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E5C583]/10 border border-[#E5C583]/30 text-[#E5C583] text-xs font-semibold uppercase tracking-wider mb-4 font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            TALENT & GATEWAY • QUANTUM INITIUM SUBHOLDING 03
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4">
            Carrières &{' '}
            <span className="font-serif italic font-normal text-gold-gradient">
              Vacatures
            </span>
          </h1>
          <p className="text-[#FAF8F5]/60 text-sm sm:text-lg max-w-3xl mx-auto leading-relaxed font-light">
            Bouw mee aan de gedecentraliseerde architectuur van BoostPlug en het bredere holdingnetwerk van Quantum Initium.
            Alle vacatures zijn direct gekoppeld aan <strong>DJOBBA.works</strong> met gegarandeerde 72-uurs factoring via Xabi World Rails
            en 100% Nederlandse Wet DBA-compliance.
          </p>
        </motion.div>

        {/* DJOBBA.works Gateway Highlight Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#E5C583]/15 via-[#0D1117] to-[#10B981]/10 border border-[#E5C583]/30 shadow-2xl relative overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <Badge className="bg-[#E5C583] text-[#090B0F] font-bold text-xs px-2.5 py-0.5">
                  DJOBBA INTEGRATED API
                </Badge>
                <span className="text-xs text-white/50 font-mono">Xabi World Rails v2.4</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Directe koppeling met de DJOBBA.works Talent Engine
              </h2>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
                Elke geplaatste vacature in Firestore wordt via onze webhook-architectuur in realtime gesynchroniseerd met de 
                developer-grade staffing engine van Djobba.works. Freelancers genieten van geautomatiseerde facturatie en 72-uurs uitbetalingen.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestDjobba}
                className="border-[#E5C583]/40 bg-white/5 text-[#E5C583] hover:bg-[#E5C583] hover:text-[#090B0F] rounded-full text-xs h-10 px-4 transition-all cursor-pointer font-medium"
              >
                <Zap className="w-3.5 h-3.5 mr-1.5" />
                Test Djobba Gateway
              </Button>
              <a
                href="https://djobba.works"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#E5C583] to-[#D4AF37] text-[#090B0F] font-bold text-xs shadow-[0_0_15px_rgba(229,197,131,0.3)] hover:brightness-110 transition-all"
              >
                <span>Bezoek Djobba.works</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {djobbaStatus && (
            <div className="mt-4 pt-3 border-t border-white/10 text-xs text-[#E5C583] font-mono flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{djobbaStatus}</span>
            </div>
          )}
        </motion.div>

        {/* Filter & Search Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E5C583]" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Zoek functie, technologie (Go, Rust, Spotify, DBA)..."
                className="pl-10 pr-4 h-11 bg-[#0D1117]/90 border border-white/10 hover:border-[#E5C583]/40 focus:border-[#E5C583] rounded-full text-xs sm:text-sm text-white placeholder:text-white/30 transition-all shadow-inner"
              />
            </div>

            {/* Contract Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs text-white/40 mr-1 hidden sm:inline font-mono">Dienstverband:</span>
              {[
                { id: 'all', label: 'Alle vormen' },
                { id: 'Freelance / DBA', label: 'Freelance / DBA' },
                { id: 'Full-time', label: 'Full-time' },
                { id: 'Part-time', label: 'Part-time' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedContract(c.id)}
                  className={`text-xs px-3.5 py-1.5 rounded-full transition-all cursor-pointer font-medium whitespace-nowrap ${
                    selectedContract === c.id
                      ? 'bg-gradient-to-r from-[#E5C583] to-[#D4AF37] text-[#090B0F] font-bold shadow-[0_0_12px_rgba(229,197,131,0.3)]'
                      : 'bg-white/[0.04] text-white/60 hover:text-white border border-white/[0.08]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'all', label: `Alle Afdelingen (${vacancies.length})` },
              { id: 'Engineering', label: 'Engineering' },
              { id: 'Growth', label: 'Growth & Streaming' },
              { id: 'Security & Anti-Detection', label: 'Security & Anti-Detection' },
              { id: 'Community & Nodes', label: 'Community & Nodes' },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDepartment(d.id)}
                className={`text-xs px-4 py-2 rounded-full transition-all cursor-pointer font-medium whitespace-nowrap ${
                  selectedDepartment === d.id
                    ? 'bg-[#FAF8F5] text-[#090B0F] font-bold'
                    : 'bg-[#0D1117]/80 text-white/60 hover:text-white border border-white/[0.08]'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Vacancies Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw className="w-8 h-8 mx-auto animate-spin text-[#E5C583] mb-4" />
            <p className="text-white/50 text-sm">Vacatures inladen vanuit Firestore & Djobba gateway...</p>
          </div>
        ) : filteredVacancies.length === 0 ? (
          <div className="p-12 rounded-3xl bg-[#0D1117]/80 border border-white/10 text-center space-y-4">
            <Briefcase className="w-12 h-12 mx-auto text-white/30" />
            <h3 className="text-lg font-bold text-white">Geen vacatures gevonden</h3>
            <p className="text-xs text-white/50 max-w-md mx-auto">
              Er zijn momenteel geen openstaande functies die matchen met je zoekcriteria. Pas je filters aan of neem contact op voor een open sollicitatie.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedDepartment('all');
                setSelectedContract('all');
              }}
              className="border-white/20 text-white hover:bg-white/10 rounded-full text-xs"
            >
              Reset filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredVacancies.map((vacancy) => {
              const isSynced = vacancy.djobbaSync?.synced;

              return (
                <TiltCard key={vacancy.id} glowColor="gold" className="h-full">
                  <div 
                    onClick={() => handleOpenDetail(vacancy)}
                    className="p-7 rounded-3xl bg-[#0D1117]/80 hover:bg-[#0D1117]/95 border border-white/[0.08] hover:border-[#E5C583]/40 transition-all flex flex-col justify-between h-full group cursor-pointer shadow-lg"
                  >
                    <div>
                      {/* Tags & Badges */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Badge className="bg-[#E5C583]/15 text-[#E5C583] border border-[#E5C583]/30 text-[10px] font-mono">
                            {vacancy.department}
                          </Badge>
                          <Badge className="bg-white/[0.05] text-white/70 border-white/10 text-[10px]">
                            {vacancy.employmentType}
                          </Badge>
                          {vacancy.dbaCompliant && (
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/25 text-[10px] font-mono">
                              DBA-Conform
                            </Badge>
                          )}
                        </div>

                        {/* Djobba status badge */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {isSynced ? (
                            <span 
                              className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center gap-1 font-mono"
                              title={`Gesynchroniseerd met Djobba: ${vacancy.djobbaSync?.djobbaJobId}`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Djobba Live
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/10 font-mono">
                              Intern
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-white group-hover:text-[#E5C583] transition-colors mb-2 leading-snug">
                        {vacancy.title}
                      </h3>

                      {/* Location & Rate */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-white/50 mb-4 font-mono">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#E5C583]" />
                          {vacancy.location}
                        </span>
                        {vacancy.salaryRange && (
                          <span className="flex items-center gap-1 text-[#E5C583]">
                            <Coins className="w-3.5 h-3.5" />
                            {vacancy.salaryRange}
                          </span>
                        )}
                      </div>

                      {/* Description preview */}
                      <p className="text-xs text-white/60 leading-relaxed line-clamp-3 mb-5 font-light">
                        {vacancy.description}
                      </p>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {vacancy.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.03] text-white/60 border border-white/[0.06] font-mono"
                          >
                            {tag}
                          </span>
                        ))}
                        {vacancy.tags.length > 4 && (
                          <span className="text-[10px] px-1.5 py-0.5 text-white/40 font-mono">
                            +{vacancy.tags.length - 4}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#E5C583] group-hover:underline flex items-center gap-1">
                          Bekijk vacature & details
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isAdmin && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => handleSyncToDjobba(e, vacancy.id)}
                            disabled={syncingId === vacancy.id}
                            className="h-8 px-2.5 text-xs text-[#E5C583] hover:text-white hover:bg-[#E5C583]/10 border border-[#E5C583]/20 rounded-full"
                            title="Direct syncen met Djobba API"
                          >
                            {syncingId === vacancy.id ? (
                              <RefreshCw className="w-3 h-3 animate-spin mr-1" />
                            ) : (
                              <Zap className="w-3 h-3 mr-1" />
                            )}
                            Sync Djobba
                          </Button>
                        )}

                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartApply(vacancy);
                          }}
                          className="bg-gradient-to-r from-[#E5C583] via-[#D4AF37] to-[#C5A059] text-[#090B0F] font-bold text-xs h-8 px-4 rounded-full shadow-[0_0_12px_rgba(229,197,131,0.25)] hover:brightness-110 cursor-pointer"
                        >
                          Solliciteer
                        </Button>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        )}

        {/* Open Application CTA */}
        <div className="mt-16 p-8 rounded-3xl bg-[#0D1117]/80 border border-white/[0.08] text-center space-y-4">
          <h3 className="text-xl font-bold text-white">Staat jouw droomrol er niet tussen?</h3>
          <p className="text-xs sm:text-sm text-white/60 max-w-xl mx-auto font-light leading-relaxed">
            Het Quantum Initium ecosysteem groeit snel met initiatieven in hardware, muziek, treasury en lifestyle. 
            Stuur een open sollicitatie of meld je direct aan in de Djobba.works talentenpool.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="mailto:talent@boostplug.one?subject=Open%20Sollicitatie%20BoostPlug%20/%20Quantum%20Initium"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/15 transition-all"
            >
              Open Sollicitatie Sturen
            </a>
            <a
              href="https://djobba.works"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#E5C583] to-[#D4AF37] text-[#090B0F] text-xs font-bold shadow-[0_0_15px_rgba(229,197,131,0.3)] hover:brightness-110 transition-all"
            >
              Aanmelden bij Djobba.works Pool
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VACATURE DETAIL & SOLLICITATIE MODAL                                      */}
      {/* ========================================================================= */}
      <Dialog open={!!activeVacancy} onOpenChange={() => setActiveVacancy(null)}>
        <DialogContent className="max-w-2xl bg-[#0D1117]/95 backdrop-blur-2xl border border-[#E5C583]/30 text-white p-6 sm:p-8 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
          {activeVacancy && !isApplying && (
            <div>
              <DialogHeader className="text-left space-y-2 mb-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-[#E5C583]/15 text-[#E5C583] border border-[#E5C583]/30 text-xs font-mono">
                    {activeVacancy.department}
                  </Badge>
                  <Badge className="bg-white/10 text-white/70 text-xs">
                    {activeVacancy.employmentType}
                  </Badge>
                  {activeVacancy.dbaCompliant && (
                    <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-mono">
                      Wet DBA-Conform
                    </Badge>
                  )}
                  {activeVacancy.djobbaSync?.synced && (
                    <Badge className="bg-emerald-500/10 text-emerald-300 text-xs font-mono">
                      Djobba Job #{activeVacancy.djobbaSync.djobbaJobId}
                    </Badge>
                  )}
                </div>

                <DialogTitle className="text-xl sm:text-2xl font-bold text-white tracking-tight pt-1">
                  {activeVacancy.title}
                </DialogTitle>
                <div className="flex flex-wrap items-center gap-4 text-xs text-white/50 font-mono">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#E5C583]" />
                    {activeVacancy.location}
                  </span>
                  {activeVacancy.salaryRange && (
                    <span className="flex items-center gap-1 text-[#E5C583]">
                      <Coins className="w-3.5 h-3.5" />
                      {activeVacancy.salaryRange}
                    </span>
                  )}
                </div>
              </DialogHeader>

              {/* Overzicht & Details */}
              <div className="space-y-6 text-xs sm:text-sm text-white/80 font-light">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#E5C583] font-mono mb-2">
                    Over deze functie
                  </h4>
                  <p className="leading-relaxed text-white/70">{activeVacancy.description}</p>
                </div>

                {activeVacancy.responsibilities.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#E5C583] font-mono mb-2">
                      Wat je gaat doen
                    </h4>
                    <ul className="space-y-2">
                      {activeVacancy.responsibilities.map((r, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-white/70">
                          <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeVacancy.requirements.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#E5C583] font-mono mb-2">
                      Wat wij vragen
                    </h4>
                    <ul className="space-y-2">
                      {activeVacancy.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-white/70">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#E5C583] shrink-0 mt-2" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeVacancy.benefits.length > 0 && (
                  <div className="p-4 rounded-2xl bg-[#E5C583]/5 border border-[#E5C583]/20 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#E5C583] font-mono">
                      Wat wij bieden (inclusief Djobba.works voordelen)
                    </h4>
                    <ul className="space-y-1.5 text-xs text-white/70">
                      {activeVacancy.benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-[#E5C583] shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Djobba Gateway Info Card */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Gegarandeerde DBA-conformiteit via Djobba
                    </p>
                    <p className="text-[11px] text-white/50 mt-0.5">
                      Factoring via Xabi World Rails binnen 72 uur. Geen debiteurenrisico voor freelancers.
                    </p>
                  </div>
                  {isAdmin && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => handleSyncToDjobba(e, activeVacancy.id)}
                      disabled={syncingId === activeVacancy.id}
                      className="border-[#E5C583]/40 text-[#E5C583] text-xs shrink-0 rounded-full"
                    >
                      {syncingId === activeVacancy.id ? 'Syncing...' : 'Re-sync Djobba'}
                    </Button>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between gap-3">
                <Button
                  variant="outline"
                  onClick={() => setActiveVacancy(null)}
                  className="border-white/15 text-white/70 hover:text-white rounded-full text-xs h-10 px-5"
                >
                  Sluiten
                </Button>
                <Button
                  onClick={() => setIsApplying(true)}
                  className="bg-gradient-to-r from-[#E5C583] via-[#D4AF37] to-[#C5A059] text-[#090B0F] font-bold text-xs h-10 px-6 rounded-full shadow-[0_0_15px_rgba(229,197,131,0.3)] hover:brightness-110 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  Direct Solliciteren
                </Button>
              </div>
            </div>
          )}

          {/* Sollicitatie Formulier */}
          {activeVacancy && isApplying && !applicationSuccess && (
            <div>
              <DialogHeader className="text-left space-y-2 mb-6">
                <button
                  type="button"
                  onClick={() => setIsApplying(false)}
                  className="text-xs text-white/50 hover:text-white flex items-center gap-1 cursor-pointer font-mono mb-1"
                >
                  ← Terug naar functieomschrijving
                </button>
                <DialogTitle className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Solliciteer op {activeVacancy.title}
                </DialogTitle>
                <DialogDescription className="text-xs text-white/60">
                  Vul onderstaand formulier in. Je gegevens worden veilig opgeslagen in Firestore en geregistreerd in de Djobba.works talentenpool.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-white/80">Volledige Naam *</Label>
                    <Input
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Bijv. Alex de Vries"
                      className="bg-white/[0.04] border-white/10 text-white text-xs h-9 rounded-xl focus:border-[#E5C583]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-white/80">E-mailadres *</Label>
                    <Input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@voorbeeld.nl"
                      className="bg-white/[0.04] border-white/10 text-white text-xs h-9 rounded-xl focus:border-[#E5C583]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-white/80">Telefoonnummer (optioneel)</Label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+31 6 12345678"
                      className="bg-white/[0.04] border-white/10 text-white text-xs h-9 rounded-xl focus:border-[#E5C583]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-white/80">Voorkeur Werkvorm (DBA)</Label>
                    <select
                      value={dbaStatus}
                      onChange={(e) => setDbaStatus(e.target.value as any)}
                      className="w-full bg-[#0D1117] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E5C583] h-9"
                    >
                      <option value="zzp">ZZP / Freelance (DBA-conform via Djobba)</option>
                      <option value="loondienst">Vast dienstverband</option>
                      <option value="payroll">Payroll via Xabi World Rails</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-white/80">LinkedIn Profiel URL</Label>
                    <Input
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      className="bg-white/[0.04] border-white/10 text-white text-xs h-9 rounded-xl focus:border-[#E5C583]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-white/80">GitHub / Portfolio URL</Label>
                    <Input
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      placeholder="https://github.com/... of website"
                      className="bg-white/[0.04] border-white/10 text-white text-xs h-9 rounded-xl focus:border-[#E5C583]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-white/80">Korte Toelichting / Motivatie</Label>
                  <Textarea
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    placeholder="Vertel kort over je relevante ervaring en waarom je graag bij BoostPlug / Quantum Initium wilt werken..."
                    className="bg-white/[0.04] border-white/10 text-white text-xs min-h-[90px] rounded-xl focus:border-[#E5C583]"
                    maxLength={2000}
                  />
                  <p className="text-[10px] text-white/40 font-mono">
                    {motivation.length}/2000 tekens
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsApplying(false)}
                    className="border-white/15 text-white/70 hover:text-white rounded-full text-xs h-10 px-5"
                  >
                    Terug
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmittingApp}
                    className="bg-gradient-to-r from-[#E5C583] via-[#D4AF37] to-[#C5A059] text-[#090B0F] font-bold text-xs h-10 px-7 rounded-full shadow-[0_0_15px_rgba(229,197,131,0.3)] hover:brightness-110 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingApp ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                        Versturen...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 mr-1.5" />
                        Sollicitatie Indienen
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Sollicitatie Succes Bevestiging */}
          {activeVacancy && applicationSuccess && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <DialogTitle className="text-2xl font-serif italic text-[#E5C583]">
                Sollicitatie Succesvol Ontvangen!
              </DialogTitle>
              <p className="text-xs sm:text-sm text-white/70 max-w-md mx-auto leading-relaxed font-light">
                Bedankt voor je interesse in de rol van <strong>{activeVacancy.title}</strong>. 
                Je sollicitatie is geregistreerd onder referentie:
              </p>
              <div className="inline-block p-3 rounded-2xl bg-black/50 border border-white/10 font-mono text-sm text-[#E5C583]">
                {applicationSuccess.id}
              </div>
              <p className="text-xs text-white/50 max-w-sm mx-auto">
                Ons talent team van Quantum Initium & Djobba.works neemt binnen 2 werkdagen contact met je op via {applicationSuccess.email}.
              </p>
              <div className="pt-4">
                <Button
                  onClick={() => {
                    setActiveVacancy(null);
                    setApplicationSuccess(null);
                  }}
                  className="bg-gradient-to-r from-[#E5C583] to-[#D4AF37] text-[#090B0F] font-bold text-xs rounded-full px-8 h-10"
                >
                  Sluiten
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
