import { useState } from 'react';
import { useStore } from '@/hooks/useStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, Mail, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface LoginPageProps {
  onBack: () => void;
  onSuccess: () => void;
  onGoRegister: () => void;
}

export function LoginPage({ onBack, onSuccess, onGoRegister }: LoginPageProps) {
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Vul je e-mailadres en wachtwoord in');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      const result = login(email, password);
      setIsSubmitting(false);
      if (!result.ok) {
        toast.error(result.error || 'Inloggen mislukt');
        return;
      }
      toast.success('Welkom terug!');
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
              <LogIn className="w-7 h-7 text-[hsl(142,76%,45%)]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Inloggen</h1>
            <p className="text-white/50 text-sm">
              Log in met je klant- of lidaccount — je accounttype wordt automatisch herkend.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,40%)] text-[hsl(220,35%,6%)] font-semibold py-6 rounded-full"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Inloggen'
              )}
            </Button>
          </form>

          <div className="border-t border-white/10 mt-6 pt-6 text-center space-y-3">
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-[hsl(142,76%,45%)] font-medium text-xs uppercase tracking-wider mb-1">Klantaccount</p>
                <p className="text-white/40 text-xs">Bestellingen, tracking & abonnementen</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-[hsl(199,89%,48%)] font-medium text-xs uppercase tracking-wider mb-1">Lidaccount</p>
                <p className="text-white/40 text-xs">Mining, verdiensten & ecosysteem</p>
              </div>
            </div>
            <p className="text-white/50 text-sm">
              Nog geen account?{' '}
              <button
                onClick={onGoRegister}
                className="text-[hsl(142,76%,45%)] hover:text-white transition-colors font-medium"
              >
                Registreer gratis
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
