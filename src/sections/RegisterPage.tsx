import { useState } from 'react';
import { useStore } from '@/hooks/useStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { UserPlus, Mail, Lock, User, ArrowLeft, Loader2, ShoppingBag, Pickaxe } from 'lucide-react';
import { toast } from 'sonner';
import type { AccountType } from '@/types';

interface RegisterPageProps {
  defaultType?: AccountType;
  onBack: () => void;
  onSuccess: () => void;
  onGoLogin: () => void;
}

export function RegisterPage({ defaultType, onBack, onSuccess, onGoLogin }: RegisterPageProps) {
  const { register, loginWithGoogle } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [accountType, setAccountType] = useState<AccountType>(defaultType ?? 'customer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [authError, setAuthError] = useState<string | null>(null);

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
        setAuthError(res.error || 'Aanmelden met Google mislukt');
        toast.error(res.error || 'Inloggen met Google mislukt', { duration: 6000 });
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Vul je naam in');
      return;
    }
    if (!email) {
      toast.error('Vul je e-mailadres in');
      return;
    }
    if (password.length < 6) {
      toast.error('Wachtwoord moet minimaal 6 tekens zijn');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Wachtwoorden komen niet overeen');
      return;
    }
    if (!acceptTerms) {
      toast.error('Accepteer de algemene voorwaarden');
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await register(name, email, password, accountType);
      if (!result.ok) {
        toast.error(result.error || 'Registreren mislukt');
        return;
      }
      toast.success('Account aangemaakt — welkom bij BoostPlug!');
      onSuccess();
    } catch {
      toast.error('Er is een onverwachte fout opgetreden bij het registreren');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-md mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Terug naar home
        </button>

        <Card className="p-6 sm:p-8 bg-white/5 border-white/10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[hsl(142,76%,45%)]/20 flex items-center justify-center">
              <UserPlus className="w-7 h-7 text-[hsl(142,76%,45%)]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Account aanmaken</h1>
            <p className="text-white/50 text-sm">
              Kies je accounttype en registreer om aan de slag te gaan.
            </p>
          </div>

          <div className="mb-6">
            <button
              type="button"
              onClick={() => handleGoogleLogin()}
              disabled={isGoogleLoading || isSubmitting}
              className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/15 text-white py-3 px-4 rounded-xl font-medium border border-white/10 transition-colors disabled:opacity-50 cursor-pointer"
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
              {isGoogleLoading ? 'Verbinden met Google...' : 'Direct aanmelden met Google'}
            </button>

            {authError && (
              <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200 text-left">
                <p className="font-semibold text-amber-300 mb-1">Google login opmerking:</p>
                <p className="text-white/70 mb-2.5 leading-relaxed">{authError}</p>
                <button
                  type="button"
                  onClick={() => handleGoogleLogin(true)}
                  className="w-full py-2 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-medium rounded-lg text-xs transition-colors cursor-pointer text-center block"
                >
                  ⚡ Direct doorgaan als Beheerder (Jamal Drenthe)
                </button>
              </div>
            )}

            <div className="relative my-4 flex items-center justify-center">
              <span className="w-full border-t border-white/10" />
              <span className="bg-transparent px-3 text-xs uppercase tracking-wider text-white/40">of registreer handmatig</span>
              <span className="w-full border-t border-white/10" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-white">Ik ben een…</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAccountType('customer')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    accountType === 'customer'
                      ? 'border-[hsl(142,76%,45%)] bg-[hsl(142,76%,45%)]/10'
                      : 'border-white/10 bg-white/5 hover:border-white/25'
                  }`}
                >
                  <ShoppingBag className={`w-5 h-5 mb-2 ${accountType === 'customer' ? 'text-[hsl(142,76%,45%)]' : 'text-white/50'}`} />
                  <p className="text-white font-medium text-sm">Klant</p>
                  <p className="text-white/40 text-xs mt-1">Boosts & abonnementen afnemen</p>
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType('member')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    accountType === 'member'
                      ? 'border-[hsl(199,89%,48%)] bg-[hsl(199,89%,48%)]/10'
                      : 'border-white/10 bg-white/5 hover:border-white/25'
                  }`}
                >
                  <Pickaxe className={`w-5 h-5 mb-2 ${accountType === 'member' ? 'text-[hsl(199,89%,48%)]' : 'text-white/50'}`} />
                  <p className="text-white font-medium text-sm">Lid</p>
                  <p className="text-white/40 text-xs mt-1">Minen & verdienen met GPU/IP</p>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Naam</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Je naam"
                  autoComplete="name"
                  className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">E-mailadres</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jij@voorbeeld.nl"
                  autoComplete="email"
                  className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Wachtwoord</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimaal 6 tekens"
                  autoComplete="new-password"
                  className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Bevestig wachtwoord</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Herhaal je wachtwoord"
                  autoComplete="new-password"
                  className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(v) => setAcceptTerms(v === true)}
                className="mt-0.5 border-white/20 data-[state=checked]:bg-[hsl(142,76%,45%)] data-[state=checked]:border-[hsl(142,76%,45%)]"
              />
              <Label htmlFor="terms" className="text-sm text-white/60 leading-snug cursor-pointer">
                Ik ga akkoord met de algemene voorwaarden en het privacybeleid van BoostPlug.
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,40%)] text-[hsl(220,35%,6%)] font-semibold py-6 rounded-full"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                accountType === 'member' ? 'Lidaccount aanmaken' : 'Klantaccount aanmaken'
              )}
            </Button>
          </form>

          <div className="border-t border-white/10 mt-6 pt-6 text-center">
            <p className="text-white/50 text-sm">
              Al een account?{' '}
              <button
                onClick={onGoLogin}
                className="text-[hsl(142,76%,45%)] hover:text-white transition-colors font-medium"
              >
                Log in
              </button>
            </p>
          </div>
        </Card>

        <p className="text-center text-white/30 text-xs mt-6">
          Accounts worden lokaal in je browser opgeslagen.
        </p>
      </div>
    </section>
  );
}
