import { useState } from 'react';
import { useStore } from '@/hooks/useStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { UserPlus, Mail, Lock, User, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface RegisterPageProps {
  onBack: () => void;
  onSuccess: () => void;
  onGoLogin: () => void;
}

export function RegisterPage({ onBack, onSuccess, onGoLogin }: RegisterPageProps) {
  const { register } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
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
    setTimeout(() => {
      const result = register(name, email, password);
      setIsSubmitting(false);
      if (!result.ok) {
        toast.error(result.error || 'Registreren mislukt');
        return;
      }
      toast.success('Account aangemaakt — welkom bij BoostPlug!');
      onSuccess();
    }, 400);
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
              Registreer om bestellingen te volgen en sneller af te rekenen.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
              className="w-full bg-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,40%)] text-[hsl(220,35%,6%)] font-semibold py-6"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Account aanmaken'
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
