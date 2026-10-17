import { useState } from 'react';
import { useStore } from '@/hooks/useStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  LogIn,
  Mail,
  Lock,
  ArrowLeft,
  Loader2,
  Sparkles,
  ShoppingBag,
  Pickaxe,
  ShieldCheck,
  Copy,
  Check,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { DEMO_ACCOUNTS_LIST, type DemoAccountConfig } from '@/data/demoAccounts';

interface LoginPageProps {
  onBack: () => void;
  onSuccess: () => void;
  onGoRegister: () => void;
}

export function LoginPage({ onBack, onSuccess, onGoRegister }: LoginPageProps) {
  const { login, loginAsDemo, loginWithGoogle } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeDemoLoading, setActiveDemoLoading] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleCopyPassword = () => {
    navigator.clipboard.writeText('demo1234');
    setCopiedPass(true);
    toast.success('Demowachtwoord (demo1234) gekopieerd!');
    setTimeout(() => setCopiedPass(false), 2000);
  };

  const handleQuickDemoLogin = async (demo: DemoAccountConfig) => {
    setActiveDemoLoading(demo.id);
    try {
      const res = await loginAsDemo(demo.role);
      if (res.ok) {
        toast.success(`Ingelogd als ${demo.name} (${demo.badge})!`);
        if (demo.role === 'admin') {
          window.location.hash = '#/admin';
        } else {
          onSuccess();
        }
      } else {
        toast.error(res.error || 'Demo login mislukt');
      }
    } catch {
      toast.error('Er is een fout opgetreden bij het inloggen');
    } finally {
      setActiveDemoLoading(null);
    }
  };

  const handleFillDemoCredentials = (demo: DemoAccountConfig) => {
    setEmail(demo.email);
    setPassword(demo.password);
    toast.info(`Gegevens voor ${demo.badge} ingevuld in formulier`);
  };

  const handleGoogleLogin = async (forceDev = false) => {
    setIsGoogleLoading(true);
    setAuthError(null);
    try {
      const res = await loginWithGoogle(forceDev ? { forceDevFallback: true } : undefined);
      if (res.isRedirecting) {
        toast.info('Je wordt doorgestuurd naar Google...');
        return;
      }
      if (res.ok) {
        toast.success('Ingelogd via Google!');
        onSuccess();
      } else {
        setAuthError(res.error || 'Google login mislukt');
        toast.error(res.error || 'Inloggen met Google mislukt', { duration: 6000 });
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Vul je e-mailadres en wachtwoord in');
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await login(email, password);
      if (!result.ok) {
        toast.error(result.error || 'Inloggen mislukt');
        return;
      }
      toast.success('Welkom terug!');
      if (email.toLowerCase().includes('admin') || email.toLowerCase() === 'info@boostplug.one') {
        window.location.hash = '#/admin';
      } else {
        onSuccess();
      }
    } catch {
      toast.error('Er is een onverwachte fout opgetreden bij het inloggen');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderDemoIcon = (type: 'customer' | 'member' | 'admin') => {
    switch (type) {
      case 'customer':
        return <ShoppingBag className="w-5 h-5 text-emerald-400" />;
      case 'member':
        return <Pickaxe className="w-5 h-5 text-sky-400" />;
      case 'admin':
        return <ShieldCheck className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <section className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          Terug naar home
        </button>

        <Card className="p-6 sm:p-8 bg-white/5 border-white/10 rounded-3xl shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[hsl(142,76%,45%)]/20 flex items-center justify-center">
              <LogIn className="w-7 h-7 text-[hsl(142,76%,45%)]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1.5">Inloggen</h1>
            <p className="text-white/60 text-xs sm:text-sm max-w-sm mx-auto">
              Welkom terug. Log direct in met een van onze voorgeconfigureerde demo accounts of je eigen inloggegevens.
            </p>
          </div>

          {/* ========================================================================= */}
          {/* DEMO ACCOUNTS QUICK-ACCESS CONTAINER */}
          {/* ========================================================================= */}
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-[hsl(142,76%,45%)]/30 relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[hsl(142,76%,45%)]/20 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-[hsl(142,76%,45%)]" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Direct Testen met Demo Accounts
                </span>
              </div>
              <Badge className="bg-[hsl(142,76%,45%)]/20 text-[hsl(142,76%,45%)] border-[hsl(142,76%,45%)]/40 text-[10px]">
                1-Klik Toegang
              </Badge>
            </div>

            <p className="text-white/60 text-xs mb-3.5 leading-relaxed">
              Ervaar het platform direct vanuit elk perspectief. Klik op een profiel om direct live data, facturen en telemetry te zien:
            </p>

            <div className="space-y-2.5">
              {DEMO_ACCOUNTS_LIST.map((demo) => {
                const isLoading = activeDemoLoading === demo.id;
                return (
                  <div
                    key={demo.id}
                    className="p-3.5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                        {renderDemoIcon(demo.iconType)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white font-semibold text-xs sm:text-sm">
                            {demo.name}
                          </span>
                          <Badge className={`${demo.badgeClass} text-[10px] px-2 py-0.5`}>
                            {demo.badge}
                          </Badge>
                        </div>
                        <p className="text-white/40 text-[11px] font-mono mt-0.5">
                          {demo.email}
                        </p>
                        <p className="text-white/60 text-xs mt-1 leading-snug">
                          {demo.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => handleFillDemoCredentials(demo)}
                        title="Gegevens in formulier zetten"
                        className="text-[11px] text-white/50 hover:text-white px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
                      >
                        Vul in
                      </button>
                      <Button
                        size="sm"
                        disabled={isLoading || isSubmitting}
                        onClick={() => handleQuickDemoLogin(demo)}
                        className={`text-xs font-semibold rounded-xl h-8 px-3.5 flex items-center gap-1.5 cursor-pointer ${
                          demo.role === 'customer'
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20'
                            : demo.role === 'member'
                            ? 'bg-sky-500 hover:bg-sky-400 text-black shadow-lg shadow-sky-500/20'
                            : 'bg-purple-500 hover:bg-purple-400 text-white shadow-lg shadow-purple-500/20'
                        }`}
                      >
                        {isLoading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            Inloggen
                            <ChevronRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Password Hint & Quick Copy */}
            <div className="mt-3.5 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-white/50">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-white/40" />
                Demowachtwoord voor alle accounts: <code className="text-white font-mono bg-white/10 px-1.5 py-0.5 rounded">demo1234</code>
              </span>
              <button
                type="button"
                onClick={handleCopyPassword}
                className="text-[11px] text-[hsl(142,76%,45%)] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedPass ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedPass ? 'Gekopieerd!' : 'Kopieer wachtwoord'}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <span className="w-full border-t border-white/10" />
            <span className="bg-transparent px-3 text-xs uppercase tracking-wider text-white/40">
              of log in met eigen account
            </span>
            <span className="w-full border-t border-white/10" />
          </div>

          {/* Google Login Button */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => handleGoogleLogin()}
              disabled={isGoogleLoading || isSubmitting}
              className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/15 text-white py-3 px-4 rounded-xl font-medium border border-white/10 transition-colors disabled:opacity-50 cursor-pointer text-sm"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-white" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              )}
              {isGoogleLoading ? 'Verbinden met Google...' : 'Inloggen met Google'}
            </button>

            {authError && (
              <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200 text-left">
                <p className="font-semibold text-amber-300 mb-1">Google login opmerking:</p>
                <p className="text-white/70 mb-2 leading-relaxed">{authError}</p>
                <button
                  type="button"
                  onClick={() => handleGoogleLogin(true)}
                  className="w-full py-2 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-medium rounded-lg text-xs transition-colors cursor-pointer text-center block"
                >
                  ⚡ Direct doorgaan als Beheerder (info@boostplug.one)
                </button>
              </div>
            )}
          </div>

          {/* Standard Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-white text-xs font-medium">E-mailadres</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jij@voorbeeld.nl of kies een demo account"
                  autoComplete="email"
                  className="pl-10 h-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-white text-xs font-medium">Wachtwoord</Label>
                <button
                  type="button"
                  onClick={handleCopyPassword}
                  className="text-[11px] text-[hsl(142,76%,45%)] hover:underline"
                >
                  Wachtwoord vergeten?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="pl-10 h-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl text-xs sm:text-sm"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,40%)] text-[hsl(220,35%,6%)] font-semibold h-11 rounded-xl text-sm transition-all shadow-lg shadow-[hsl(142,76%,45%)]/20 cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Inloggen met E-mail
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Footer & Registration Link */}
          <div className="border-t border-white/10 mt-6 pt-5 text-center space-y-3">
            <p className="text-white/50 text-xs sm:text-sm">
              Nog geen account?{' '}
              <button
                onClick={onGoRegister}
                className="text-[hsl(142,76%,45%)] hover:underline font-semibold cursor-pointer"
              >
                Registreer gratis als Klant of Lid
              </button>
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}
