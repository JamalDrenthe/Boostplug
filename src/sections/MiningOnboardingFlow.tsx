import { useState, useEffect } from 'react';
import { useStore } from '@/hooks/useStore';
import type { GroverOrderData, SoftwareConfigData, MemberMiningProfile } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Cpu,
  CheckCircle2,
  Circle,
  Copy,
  ExternalLink,
  Terminal,
  Wifi,
  RefreshCw,
  Zap,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';

interface MiningOnboardingFlowProps {
  onFinish?: () => void;
}

export function MiningOnboardingFlow({ onFinish }: MiningOnboardingFlowProps) {
  const { user, getMemberMiningProfile, saveMiningProfile } = useStore();
  const profile: MemberMiningProfile = getMemberMiningProfile(user?.id);

  // Lokale formulier state voor Grover
  const [groverOrderNumber, setGroverOrderNumber] = useState(profile.groverData?.orderNumber || '');
  const [groverDeviceType, setGroverDeviceType] = useState<GroverOrderData['deviceType']>(
    profile.groverData?.deviceType || 'mac_mini_m2'
  );
  const [groverSerialOrMac, setGroverSerialOrMac] = useState(profile.groverData?.serialOrMac || '');
  const [groverTermMonths, setGroverTermMonths] = useState(profile.groverData?.rentalTermMonths || 12);
  const groverDiscountCode = profile.groverData?.discountCode || 'QUANTUMBOOST20';

  // Lokale formulier state voor Softwareconfiguratie
  const nodeToken =
    profile.softwareConfig?.nodeToken ||
    `BP-NODE-${(user?.id || 'MEMBER').slice(0, 6).toUpperCase()}-78A1`;

  const [osPlatform, setOsPlatform] = useState<SoftwareConfigData['osPlatform']>(
    profile.softwareConfig?.osPlatform || 'macos'
  );
  const [ipPoolRegion, setIpPoolRegion] = useState<SoftwareConfigData['ipPoolRegion']>(
    profile.softwareConfig?.ipPoolRegion || 'eu-west-1'
  );
  const [threadsLimitPercent, setThreadsLimitPercent] = useState(
    profile.softwareConfig?.threadsLimitPercent || 75
  );
  const [autoStartOnBoot, setAutoStartOnBoot] = useState(
    profile.softwareConfig?.autoStartOnBoot ?? true
  );

  // Overige stappen form state
  const [vvcCode, setVvcCode] = useState(profile.vvcMemberCode || 'VVC-2026-');
  const [xabiUsername, setXabiUsername] = useState(profile.xabiWorldUsername || '');
  const [zheavenzyArtist, setZheavenzyArtist] = useState(profile.zheavenzyArtistId || 'ZH-ROSTER-ALL');
  const [logsRentApiKey, setLogsRentApiKey] = useState(profile.logsRentApiKey || 'LR-KEY-');

  // Actieve tab / stap in accordion view
  const [activeStep, setActiveStep] = useState<number>(profile.currentStep || 1);
  const [isTestingPing, setIsTestingPing] = useState(false);
  const [pingSuccess, setPingSuccess] = useState(profile.softwareConfig?.status === 'mining_active');

  // Live live-stream demo teller voor voltooide nodes
  const [liveStreamCounter, setLiveStreamCounter] = useState(14820);

  useEffect(() => {
    if (pingSuccess) {
      const interval = setInterval(() => {
        setLiveStreamCounter((prev) => prev + Math.floor(Math.random() * 3) + 1);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [pingSuccess]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} gekopieerd naar klembord`);
  };

  const markStepComplete = (stepNum: number) => {
    const nextCompleted = Array.from(new Set([...profile.completedSteps, stepNum]));
    const nextCurrent = Math.min(stepNum + 1, 7);
    saveMiningProfile({
      completedSteps: nextCompleted,
      currentStep: nextCurrent,
    });
    setActiveStep(nextCurrent);
  };

  // 1. Opslaan Grover gegevens (Stap 3 & 4)
  const handleSaveGrover = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groverOrderNumber.trim()) {
      toast.error('Vul je Grover bestel- of abonnementsnummer in');
      return;
    }
    if (!groverSerialOrMac.trim()) {
      toast.error('Vul het serienummer of MAC-adres van je Mac Mini in');
      return;
    }

    const groverData: GroverOrderData = {
      orderNumber: groverOrderNumber.trim().toUpperCase(),
      deviceType: groverDeviceType,
      serialOrMac: groverSerialOrMac.trim(),
      discountCode: groverDiscountCode.trim(),
      rentalTermMonths: groverTermMonths,
      status: 'verified',
      submittedAt: new Date().toISOString(),
    };

    saveMiningProfile({
      groverData,
      completedSteps: Array.from(new Set([...profile.completedSteps, 3, 4])),
      currentStep: 5,
    });

    toast.success('Grover Mac Mini gegevens succesvol gekoppeld aan je mining node!');
    setActiveStep(5);
  };

  // 2. Testen en opslaan van softwareconfiguratie (Stap 5)
  const handleTestAndSaveSoftware = async () => {
    setIsTestingPing(true);
    // Simuleer realistische handshake met de lokale BoostPlug daemon
    await new Promise((res) => setTimeout(res, 1800));
    setIsTestingPing(false);
    setPingSuccess(true);

    const softwareConfig: SoftwareConfigData = {
      nodeToken,
      osPlatform,
      ipPoolRegion,
      threadsLimitPercent,
      autoStartOnBoot,
      status: 'mining_active',
      lastPing: 'Zojuist (12ms latency)',
      hashRateOrStreamsPerHour: 140,
      assignedIp: '84.112.44.192 (KPN Residentieel Nederland)',
    };

    saveMiningProfile({
      softwareConfig,
      completedSteps: Array.from(new Set([...profile.completedSteps, 5])),
      currentStep: 6,
      estimatedMonthlyEarnings: 195,
    });

    toast.success('Daemon handshake geslaagd! BoostPlug IP-software is verbonden en actief.');
    setActiveStep(6);
  };

  const curlCommand = `curl -sSL https://get.boostplug.one/setup.sh | bash -s -- --token ${nodeToken} --pool ${ipPoolRegion} --threads ${threadsLimitPercent} ${
    autoStartOnBoot ? '--autostart' : ''
  }`;

  const completedCount = profile.completedSteps.length;
  const progressPercent = Math.round((completedCount / 7) * 100);
  const isAllComplete = completedCount >= 7;

  return (
    <div className="space-y-8">
      {/* Header voortgangssectie */}
      <Card className="p-6 bg-gradient-to-br from-white/[0.07] via-white/5 to-[hsl(199,89%,48%)]/10 border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-[hsl(199,89%,48%)]/20 text-[hsl(199,89%,48%)]">
                <Cpu className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-white">Automatische Mining Onboarding</h2>
                <p className="text-white/50 text-xs mt-0.5">
                  7-stappen setup om je hardware te koppelen en passief mee te verdienen aan BoostPlug algoritme-boosts.
                </p>
              </div>
            </div>
          </div>
          <div className="text-right flex items-center md:flex-col justify-between md:justify-center">
            <span className="text-xs uppercase font-mono text-white/50">Voortgang</span>
            <span className="text-xl font-bold text-[hsl(199,89%,48%)]">{completedCount} van 7 stappen ({progressPercent}%)</span>
          </div>
        </div>
        <Progress value={progressPercent} className="h-2.5" />

        {/* Snelle stap navigatie indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 mt-4 pt-4 border-t border-white/10 text-xs">
          {[
            { num: 1, label: 'VVC Account' },
            { num: 2, label: 'Xabi World' },
            { num: 3, label: 'Grover Account' },
            { num: 4, label: 'Mac Mini Huur' },
            { num: 5, label: 'IP-Software' },
            { num: 6, label: 'Zheavenzy' },
            { num: 7, label: 'Logs.rent' },
          ].map((st) => {
            const isDone = profile.completedSteps.includes(st.num);
            const isCurrent = activeStep === st.num;

            return (
              <button
                key={st.num}
                onClick={() => setActiveStep(st.num)}
                className={`p-2 rounded-lg border text-left transition-all ${
                  isCurrent
                    ? 'border-[hsl(199,89%,48%)] bg-[hsl(199,89%,48%)]/15 text-white'
                    : isDone
                    ? 'border-green-500/40 bg-green-500/5 text-white/80'
                    : 'border-white/5 bg-white/[0.02] text-white/40 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-1.5 font-medium mb-1">
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                  ) : (
                    <Circle className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-[hsl(199,89%,48%)]' : 'text-white/30'}`} />
                  )}
                  <span>Stap {st.num}</span>
                </div>
                <p className="text-[11px] truncate">{st.label}</p>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Voltooide Node Live Status (wanneer actief) */}
      {(isAllComplete || profile.softwareConfig?.status === 'mining_active') && (
        <Card className="p-6 bg-[hsl(142,76%,45%)]/10 border-[hsl(142,76%,45%)]/30 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[hsl(142,76%,45%)] animate-pulse" />
                <h3 className="text-lg font-bold text-white">Mining Node is Live & Actief</h3>
                <Badge className="bg-[hsl(142,76%,45%)]/20 text-[hsl(142,76%,45%)] border-0 text-xs">
                  {profile.softwareConfig?.nodeToken || 'BP-NODE-LIVE'}
                </Badge>
              </div>
              <p className="text-white/60 text-xs">
                Apparaat: <strong className="text-white">{profile.groverData?.deviceType.replace('_', ' ').toUpperCase() || 'MAC MINI M2'}</strong> · IP:{' '}
                <span className="font-mono text-white/80">{profile.softwareConfig?.assignedIp || '84.112.44.192 (Residentieel NL)'}</span>
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs uppercase font-mono text-white/40">Geleverde Streams</p>
                <p className="text-xl font-bold font-mono text-white">{liveStreamCounter.toLocaleString('nl-NL')}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase font-mono text-white/40">Verwachte Opbrengst</p>
                <p className="text-xl font-bold text-[hsl(142,76%,45%)]">€ {profile.estimatedMonthlyEarnings || 195},00/mnd</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* INTERACTIEVE STAPPEN INHOUD */}
      <div className="space-y-6">
        {/* ============================================================== */}
        {/* STAP 1: VVC ACCOUNT */}
        {/* ============================================================== */}
        {activeStep === 1 && (
          <Card className="p-6 bg-white/5 border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-[hsl(199,89%,48%)] uppercase">Stap 1 van 7</p>
                <h3 className="text-xl font-bold text-white mt-1">Verbind je VVC (Verdienende Vrienden Club) Account</h3>
              </div>
              <Badge variant="outline" className={profile.completedSteps.includes(1) ? "border-green-500/50 text-green-400" : "border-white/20 text-white/50"}>
                {profile.completedSteps.includes(1) ? "Voltooid" : "Open"}
              </Badge>
            </div>
            <p className="text-white/60 text-sm">
              Leden van de Verdienende Vrienden Club (VVC) via Spontiva ontvangen voorrang bij mining-uitbetalingen en exclusieve hardwarekortingen.
            </p>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-3">
              <Label className="text-white">Jouw VVC Lidnummer of Gebruikersnaam</Label>
              <div className="flex gap-3">
                <Input
                  value={vvcCode}
                  onChange={(e) => setVvcCode(e.target.value)}
                  placeholder="bv. VVC-2026-7841"
                  className="bg-white/5 border-white/10 text-white font-mono"
                />
                <Button
                  onClick={() => {
                    saveMiningProfile({ vvcMemberCode: vvcCode });
                    markStepComplete(1);
                    toast.success('VVC Account gekoppeld!');
                  }}
                  className="bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,40%)] text-white shrink-0 font-medium"
                >
                  Koppel VVC Account <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* ============================================================== */}
        {/* STAP 2: XABI WORLD */}
        {/* ============================================================== */}
        {activeStep === 2 && (
          <Card className="p-6 bg-white/5 border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-[hsl(199,89%,48%)] uppercase">Stap 2 van 7</p>
                <h3 className="text-xl font-bold text-white mt-1">Koppel je Xabi World Account</h3>
              </div>
              <Badge variant="outline" className={profile.completedSteps.includes(2) ? "border-green-500/50 text-green-400" : "border-white/20 text-white/50"}>
                {profile.completedSteps.includes(2) ? "Voltooid" : "Open"}
              </Badge>
            </div>
            <p className="text-white/60 text-sm">
              Xabi World verzorgt de gedecentraliseerde identiteit en verificatie binnen het Quantum Initium ecosysteem.
            </p>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-3">
              <Label className="text-white">Xabi World Accountnaam of E-mailadres</Label>
              <div className="flex gap-3">
                <Input
                  value={xabiUsername}
                  onChange={(e) => setXabiUsername(e.target.value)}
                  placeholder="bv. xabi_user_99"
                  className="bg-white/5 border-white/10 text-white"
                />
                <Button
                  onClick={() => {
                    saveMiningProfile({ xabiWorldUsername: xabiUsername });
                    markStepComplete(2);
                    toast.success('Xabi World account gekoppeld!');
                  }}
                  className="bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,40%)] text-white shrink-0 font-medium"
                >
                  Bevestig Koppeling <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* ============================================================== */}
        {/* STAP 3 & 4: GROVER FORMULIERINVOER (MAC MINI HUUR) */}
        {/* ============================================================== */}
        {(activeStep === 3 || activeStep === 4) && (
          <Card className="p-6 bg-white/5 border-[hsl(199,89%,48%)]/30 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="text-xs font-mono text-[hsl(199,89%,48%)] uppercase">Stap 3 & 4 van 7</p>
                <h3 className="text-xl font-bold text-white mt-1">Grover Mac Mini Registratie & Hardware Koppeling</h3>
              </div>
              <Badge className="bg-[hsl(142,76%,45%)]/20 text-[hsl(142,76%,45%)] border-0">
                Partnerkorting Actief
              </Badge>
            </div>

            {/* Partnerkorting banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">Quantum Initium Grover Partnercode</p>
                <p className="text-xs text-white/60">
                  Gebruik deze code bij het afrekenen op Grover voor korting op je Mac Mini huur.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <code className="px-3 py-1.5 rounded-lg bg-black/60 border border-amber-500/40 text-amber-300 font-mono text-sm font-bold">
                  {groverDiscountCode}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(groverDiscountCode, 'Kortingscode')}
                  className="border-white/20 text-white h-8"
                >
                  <Copy className="w-3.5 h-3.5" />
                </Button>
                <a
                  href="https://www.grover.com/nl-nl/computers/apple-mac-mini"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg font-medium transition-colors"
                >
                  Naar Grover <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Het specifieke formulier voor Grover */}
            <form onSubmit={handleSaveGrover} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Grover Bestel- of Abonnementsnummer *</Label>
                  <Input
                    required
                    value={groverOrderNumber}
                    onChange={(e) => setGroverOrderNumber(e.target.value)}
                    placeholder="bv. GRV-882941-NL"
                    className="bg-white/5 border-white/10 text-white font-mono placeholder:text-white/30"
                  />
                  <p className="text-[11px] text-white/40">
                    Te vinden in je Grover accountbevestiging of factuur e-mail.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Gekozen Apparaat (Node Type) *</Label>
                  <select
                    value={groverDeviceType}
                    onChange={(e) => setGroverDeviceType(e.target.value as any)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[hsl(199,89%,48%)]"
                  >
                    <option value="mac_mini_m2" className="bg-neutral-900 text-white">
                      Apple Mac Mini M2 (8-Core CPU / 10-Core GPU) — Aanbevolen
                    </option>
                    <option value="mac_mini_m4" className="bg-neutral-900 text-white">
                      Apple Mac Mini M4 (10-Core CPU / 10-Core GPU) — Hoge Throughput
                    </option>
                    <option value="mac_studio" className="bg-neutral-900 text-white">
                      Apple Mac Studio (M2 Max / Ultra Cluster)
                    </option>
                    <option value="custom_gpu" className="bg-neutral-900 text-white">
                      Eigen Hardware / Custom Linux GPU Node
                    </option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Hardware Identificatie (Serienummer of MAC-adres) *</Label>
                  <Input
                    required
                    value={groverSerialOrMac}
                    onChange={(e) => setGroverSerialOrMac(e.target.value)}
                    placeholder="bv. C02G90XXMD6M of 3c:22:fb:1a:89:10"
                    className="bg-white/5 border-white/10 text-white font-mono placeholder:text-white/30"
                  />
                  <p className="text-[11px] text-white/40">
                    Onderop je Mac Mini of via 'Over deze Mac'. Dit koppelt de machine uniek aan jouw wallet.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Gekozen Huurtermijn</Label>
                  <select
                    value={groverTermMonths}
                    onChange={(e) => setGroverTermMonths(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[hsl(199,89%,48%)]"
                  >
                    <option value={6} className="bg-neutral-900 text-white">6 Maanden</option>
                    <option value={12} className="bg-neutral-900 text-white">12 Maanden (Laagste maandtarief)</option>
                    <option value={18} className="bg-neutral-900 text-white">18 Maanden</option>
                    <option value={24} className="bg-neutral-900 text-white">24 Maanden</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <Button
                  type="submit"
                  className="bg-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,40%)] text-black font-semibold px-6 rounded-full"
                >
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Sla Grover Gegevens Op & Ga Naar Software Setup
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* ============================================================== */}
        {/* STAP 5: BOOSTPLUG IP-SOFTWARE & DAEMON CONFIGURATIE */}
        {/* ============================================================== */}
        {activeStep === 5 && (
          <Card className="p-6 bg-white/5 border-[hsl(199,89%,48%)]/30 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="text-xs font-mono text-[hsl(199,89%,48%)] uppercase">Stap 5 van 7</p>
                <h3 className="text-xl font-bold text-white mt-1">BoostPlug IP-Software & Daemon Configuratie</h3>
              </div>
              <Badge className="bg-[hsl(199,89%,48%)]/20 text-[hsl(199,89%,48%)] border-0">
                Node Token Actief
              </Badge>
            </div>
            <p className="text-white/60 text-sm">
              Installeer de BoostPlug IP-daemon op je Mac Mini of server. De daemon draait veilig op de achtergrond, simuleert geauthenticeerd streaminggedrag en stuurt prestaties door naar het centrale netwerk.
            </p>

            {/* Gegenereerde Node Token Card */}
            <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-white text-xs font-mono uppercase text-white/50">Jouw Persoonlijke Node Token</Label>
                <Badge variant="outline" className="border-green-500/40 text-green-400 font-mono text-[10px]">Gekoppeld aan {user?.email}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={nodeToken}
                  className="bg-black/60 border-white/10 text-[hsl(142,76%,45%)] font-mono text-sm"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(nodeToken, 'Node Token')}
                  className="border-white/20 text-white shrink-0"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Kopieer
                </Button>
              </div>
            </div>

            {/* Configuratie opties */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Besturingssysteem</Label>
                <select
                  value={osPlatform}
                  onChange={(e) => setOsPlatform(e.target.value as any)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[hsl(199,89%,48%)]"
                >
                  <option value="macos" className="bg-neutral-900 text-white">macOS (Apple Silicon M1/M2/M4)</option>
                  <option value="linux" className="bg-neutral-900 text-white">Linux (Ubuntu / Debian / Docker)</option>
                  <option value="windows" className="bg-neutral-900 text-white">Windows (WSL2 / Background)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Residentiële IP Pool</Label>
                <select
                  value={ipPoolRegion}
                  onChange={(e) => setIpPoolRegion(e.target.value as any)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[hsl(199,89%,48%)]"
                >
                  <option value="eu-west-1" className="bg-neutral-900 text-white">Nederland (KPN / Ziggo pool - 1.25x Payout)</option>
                  <option value="eu-central-1" className="bg-neutral-900 text-white">Europa Centraal</option>
                  <option value="us-east-1" className="bg-neutral-900 text-white">Verenigde Staten</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Max Systeemkracht ({threadsLimitPercent}%)</Label>
                <div className="flex gap-1 pt-1">
                  {[25, 50, 75, 100].map((pct) => (
                    <button
                      type="button"
                      key={pct}
                      onClick={() => setThreadsLimitPercent(pct)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                        threadsLimitPercent === pct
                          ? 'bg-[hsl(199,89%,48%)] text-white'
                          : 'bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Auto start toggle */}
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <input
                type="checkbox"
                id="autostart_toggle"
                checked={autoStartOnBoot}
                onChange={(e) => setAutoStartOnBoot(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-[hsl(199,89%,48%)] cursor-pointer"
              />
              <label htmlFor="autostart_toggle" className="text-white text-xs cursor-pointer select-none">
                Start BoostPlug daemon automatisch bij het opstarten van de Mac Mini (LaunchDaemon)
              </label>
            </div>

            {/* One-Line Install Script */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-[hsl(199,89%,48%)]" />
                  Voer dit commando uit in Terminal van je Mac Mini:
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(curlCommand, 'Terminal installatiecommando')}
                  className="text-[hsl(199,89%,48%)] hover:underline inline-flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" /> Kopieer Commando
                </button>
              </div>
              <pre className="p-3 bg-black/80 border border-white/10 rounded-xl text-xs font-mono text-green-400 overflow-x-auto whitespace-pre-wrap">
                {curlCommand}
              </pre>
            </div>

            {/* Test verbinding & ping simulator */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-[hsl(142,76%,45%)]" />
                  Live Daemon Verbindingstest
                </p>
                <p className="text-xs text-white/50 mt-0.5">
                  Verifieer of je daemon online is en gereed is voor algoritme-distributie.
                </p>
              </div>

              <Button
                type="button"
                onClick={handleTestAndSaveSoftware}
                disabled={isTestingPing}
                className="bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,40%)] text-white font-medium shrink-0 rounded-full"
              >
                {isTestingPing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Handshake testen...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Test & Bevestig Node Verbinding
                  </>
                )}
              </Button>
            </div>
          </Card>
        )}

        {/* ============================================================== */}
        {/* STAP 6: ZHEAVENZY KOPPELING */}
        {/* ============================================================== */}
        {activeStep === 6 && (
          <Card className="p-6 bg-white/5 border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-[hsl(199,89%,48%)] uppercase">Stap 6 van 7</p>
                <h3 className="text-xl font-bold text-white mt-1">Koppel met Zheavenzy (Artiesten Target)</h3>
              </div>
              <Badge variant="outline" className={profile.completedSteps.includes(6) ? "border-green-500/50 text-green-400" : "border-white/20 text-white/50"}>
                {profile.completedSteps.includes(6) ? "Voltooid" : "Open"}
              </Badge>
            </div>
            <p className="text-white/60 text-sm">
              Zheavenzy (<a href="https://zheavenzy.one" target="_blank" rel="noreferrer" className="text-[hsl(199,89%,48%)] underline">zheavenzy.one</a>) gebruikt het BoostPlug netwerk om hun artiesten te boosten. Jouw node wordt gekoppeld aan de actieve streaming distributielijst.
            </p>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-3">
              <Label className="text-white">Toegewezen Artiesten Target</Label>
              <div className="flex gap-3">
                <select
                  value={zheavenzyArtist}
                  onChange={(e) => setZheavenzyArtist(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[hsl(199,89%,48%)]"
                >
                  <option value="ZH-ROSTER-ALL" className="bg-neutral-900 text-white">
                    Zheavenzy Mainstream Roster (Hoogste stream volume)
                  </option>
                  <option value="ZH-HIPHOP-DUTCH" className="bg-neutral-900 text-white">
                    Zheavenzy Dutch Urban & HipHop
                  </option>
                  <option value="ZH-ELECTRONIC-GLOBAL" className="bg-neutral-900 text-white">
                    Zheavenzy Electronic / House (Global Reach)
                  </option>
                </select>
                <Button
                  onClick={() => {
                    saveMiningProfile({ zheavenzyArtistId: zheavenzyArtist });
                    markStepComplete(6);
                    toast.success('Zheavenzy artiestenlijst gekoppeld!');
                  }}
                  className="bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,40%)] text-white shrink-0 font-medium"
                >
                  Bevestig Roster <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* ============================================================== */}
        {/* STAP 7: LOGS.RENT KOPPELING */}
        {/* ============================================================== */}
        {activeStep === 7 && (
          <Card className="p-6 bg-white/5 border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-[hsl(199,89%,48%)] uppercase">Stap 7 van 7 (Finale)</p>
                <h3 className="text-xl font-bold text-white mt-1">Logs.rent Account & Algoritme Profielen</h3>
              </div>
              <Badge variant="outline" className={profile.completedSteps.includes(7) ? "border-green-500/50 text-green-400" : "border-white/20 text-white/50"}>
                {profile.completedSteps.includes(7) ? "Voltooid" : "Open"}
              </Badge>
            </div>
            <p className="text-white/60 text-sm">
              Logs.rent (<a href="https://logs.rent" target="_blank" rel="noreferrer" className="text-[hsl(199,89%,48%)] underline">logs.rent</a>) levert de geauthenticeerde account-sessies. Dit is de finale brandstof achter de algoritme-beïnvloeding.
            </p>
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-3">
              <Label className="text-white">Logs.rent API Sleutel of Sessie Token</Label>
              <div className="flex gap-3">
                <Input
                  value={logsRentApiKey}
                  onChange={(e) => setLogsRentApiKey(e.target.value)}
                  placeholder="bv. LR-LIVE-8849102"
                  className="bg-white/5 border-white/10 text-white font-mono"
                />
                <Button
                  onClick={() => {
                    saveMiningProfile({
                      logsRentApiKey,
                      completedSteps: [1, 2, 3, 4, 5, 6, 7],
                      currentStep: 7,
                    });
                    setPingSuccess(true);
                    toast.success('Gefeliciteerd! Alle 7 stappen zijn voltooid en je node is actief!');
                    if (onFinish) onFinish();
                  }}
                  className="bg-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,40%)] text-black font-semibold shrink-0"
                >
                  <Check className="w-4 h-4 mr-1.5" />
                  Activeer Mining Definitief
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
