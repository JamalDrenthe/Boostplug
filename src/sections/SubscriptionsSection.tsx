import { useState } from 'react';
import { useStore } from '@/hooks/useStore';
import { SUBSCRIPTION_PLANS } from '@/data/subscriptions';
import { formatPrice } from '@/data/platforms';
import type { SubscriptionPlan } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Check,
  Sparkles,
  Repeat,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

interface SubscriptionsSectionProps {
  onRequireLogin: () => void;
  onGoAccount: () => void;
}

export function SubscriptionsSection({ onRequireLogin, onGoAccount }: SubscriptionsSectionProps) {
  const { currency, user, addSubscription, subscriptions } = useStore();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const openPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setEmail(user?.email ?? '');
    setDone(false);
  };

  const hasActivePlan = (planId: string) =>
    subscriptions.some(
      (s) => s.planId === planId && s.status === 'active' &&
        user && s.email.toLowerCase() === user.email.toLowerCase()
    );

  const handleSubscribe = async () => {
    if (!selectedPlan) return;
    const targetEmail = (user?.email || email).trim().toLowerCase();
    if (!targetEmail) {
      toast.error('Voer je e-mailadres in of log in');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(targetEmail)) {
      toast.error('Voer een geldig e-mailadres in');
      return;
    }
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const now = new Date();
    const next = new Date(now);
    next.setMonth(next.getMonth() + 1);
    addSubscription({
      id: `SUB-${Date.now().toString(36).toUpperCase()}`,
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      email: targetEmail,
      monthlyPrice: selectedPlan.monthlyPrice[currency],
      currency,
      status: 'active',
      startedAt: now.toISOString(),
      nextBillingAt: next.toISOString(),
    });
    setIsProcessing(false);
    setDone(true);
    toast.success(`Abonnement ${selectedPlan.name} geactiveerd!`);
  };

  return (
    <section id="abonnementen" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="eyebrow text-[hsl(142,76%,45%)] mb-4">VOOR KLANTEN</p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4">
            Abonnementen: continu{' '}
            <span className="text-gradient">algoritme-beïnvloeding</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Geen eenmalige piek, maar een maandelijkse boost die het algoritme
            blijvend beïnvloedt. Kies een plan en wij doen de rest — maandelijks
            opzegbaar.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`relative p-8 rounded-2xl transition-colors ${
                plan.popular
                  ? 'bg-white/[0.07] border-[hsl(142,76%,45%)]/40'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[hsl(142,76%,45%)] text-[hsl(220,35%,6%)] border-0 px-4">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Meest gekozen
                </Badge>
              )}
              <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
              <p className="text-white/50 text-sm mt-1 mb-6">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-semibold text-white tracking-tight">
                  {formatPrice(plan.monthlyPrice[currency], currency)}
                </span>
                <span className="text-white/40 text-sm"> /maand</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-white/70">
                    <Check className="w-4 h-4 text-[hsl(142,76%,45%)] shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => openPlan(plan)}
                className={`w-full rounded-full font-medium ${
                  plan.popular
                    ? 'bg-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,40%)] text-[hsl(220,35%,6%)]'
                    : 'bg-white/10 hover:bg-white/15 text-white border border-white/15'
                }`}
              >
                <Repeat className="w-4 h-4 mr-2" />
                {hasActivePlan(plan.id) ? 'Actief — verleng' : `Kies ${plan.name}`}
              </Button>
            </Card>
          ))}
        </div>

        <p className="text-center text-white/40 text-sm mt-8">
          VVC-leden krijgen via Spontiva ledenvoordeel op abonnementen.{' '}
          <a href="#/leden" className="text-[hsl(142,76%,45%)] hover:text-white transition-colors">
            Meer over de leden-kant
          </a>
        </p>
      </div>

      {/* Subscribe dialog */}
      <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
        <DialogContent className="bg-[hsl(220,20%,12%)] border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {done ? 'Abonnement actief' : `${selectedPlan?.name} abonnement`}
            </DialogTitle>
          </DialogHeader>
          {done ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-[hsl(142,76%,45%)]" />
              <p className="text-white/70 mb-6">
                Je {selectedPlan?.name}-abonnement is geactiveerd. Beheer het in
                je accountcentrum.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => {
                    setSelectedPlan(null);
                    if (user) onGoAccount();
                  }}
                  className="bg-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,40%)] text-[hsl(220,35%,6%)] rounded-full px-6"
                >
                  {user ? 'Naar mijn account' : 'Sluiten'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-5 pt-2">
              <div className="rounded-xl bg-white/5 border border-white/10 p-4 flex items-center justify-between">
                <span className="text-white/70 text-sm">
                  {selectedPlan?.name} · maandelijks opzegbaar
                </span>
                <span className="text-white font-semibold">
                  {selectedPlan && formatPrice(selectedPlan.monthlyPrice[currency], currency)}/mnd
                </span>
              </div>
              {!user && (
                <div className="space-y-2">
                  <Label htmlFor="sub-email" className="text-white/70">E-mailadres</Label>
                  <Input
                    id="sub-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jij@voorbeeld.nl"
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <p className="text-white/40 text-xs">
                    <button onClick={onRequireLogin} className="text-[hsl(142,76%,45%)] hover:underline">
                      Log in
                    </button>{' '}
                    om je abonnement aan je account te koppelen.
                  </p>
                </div>
              )}
              <Button
                onClick={handleSubscribe}
                disabled={isProcessing}
                className="w-full bg-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,40%)] text-[hsl(220,35%,6%)] rounded-full font-medium py-6"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verwerken...
                  </>
                ) : (
                  `Activeer abonnement — ${selectedPlan && formatPrice(selectedPlan.monthlyPrice[currency], currency)}/mnd`
                )}
              </Button>
              <p className="text-white/30 text-xs text-center">
                Demo-checkout: er wordt geen echte betaling verwerkt.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
