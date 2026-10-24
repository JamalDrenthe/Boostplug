import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/hooks/useStore';
import { SUBSCRIPTION_PLANS } from '@/data/subscriptions';
import { formatPrice } from '@/data/platforms';
import type { SubscriptionPlan } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TiltCard } from '@/components/ui/TiltCard';
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
    <section id="abonnementen" className="py-24 px-4 scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E5C583]/10 border border-[#E5C583]/20 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5C583] animate-pulse" />
            <p className="text-[11px] font-semibold text-[#E5C583] tracking-[0.2em] uppercase font-mono">
              CONTINUE DRIP-FEED GROEI
            </p>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Abonnementen voor continue{' '}
            <span className="font-serif italic font-normal text-gold-gradient">
              Algoritmische Tractie
            </span>
          </h2>
          <p className="text-[#FAF8F5]/60 max-w-2xl mx-auto text-sm sm:text-base font-light leading-relaxed">
            Geen eenmalige onnatuurlijke piek, maar een gestage residentiële distributie die jouw 
            streaming-statistieken en reviews organisch beschermt en structureel versterkt. Maandelijks opzegbaar.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {SUBSCRIPTION_PLANS.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <TiltCard glowColor={plan.popular ? 'gold' : 'emerald'} className="h-full">
                <div
                  className={`relative p-8 rounded-3xl transition-all h-full flex flex-col justify-between ${
                    plan.popular
                      ? 'bg-gradient-to-b from-[#E5C583]/15 via-[#0D1117]/95 to-[#0D1117] border-2 border-[#E5C583]/60 shadow-[0_20px_50px_rgba(229,197,131,0.15)]'
                      : 'bg-[#0D1117]/80 border border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-[#E5C583] to-[#D4AF37] text-[#090B0F] border-0 px-4 py-1 text-xs font-bold shadow-[0_0_15px_rgba(229,197,131,0.5)]">
                        <Sparkles className="w-3.5 h-3.5 mr-1" />
                        MEEST GEKOZEN ATELIER TIER
                      </Badge>
                    </div>
                  )}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-white tracking-tight">{plan.name}</h3>
                      {plan.popular && (
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#E5C583]/20 text-[#E5C583] border border-[#E5C583]/30">
                          Elite
                        </span>
                      )}
                    </div>
                    <p className="text-white/50 text-xs mb-6 min-h-[36px] leading-relaxed">{plan.description}</p>
                    <div className="mb-8 pb-6 border-b border-white/[0.08]">
                      <span className="font-serif italic text-4xl sm:text-5xl font-light text-[#FAF8F5] tracking-tight">
                        {formatPrice(plan.monthlyPrice[currency], currency)}
                      </span>
                      <span className="text-white/40 text-xs font-mono ml-1.5">/maand</span>
                    </div>
                    <ul className="space-y-3.5 mb-8">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-xs sm:text-sm text-white/80">
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.popular ? 'text-[#E5C583]' : 'text-[#10B981]'}`} />
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button
                    onClick={() => openPlan(plan)}
                    className={`w-full rounded-full font-semibold h-12 transition-all cursor-pointer ${
                      plan.popular
                        ? 'bg-gradient-to-r from-[#E5C583] via-[#D4AF37] to-[#C5A059] text-[#090B0F] shadow-[0_0_20px_rgba(229,197,131,0.35)] hover:brightness-110'
                        : 'bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/15'
                    }`}
                  >
                    <Repeat className="w-4 h-4 mr-2" />
                    {hasActivePlan(plan.id) ? 'Actief — verleng plan' : `Kies ${plan.name}`}
                  </Button>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-white/40 text-xs sm:text-sm mt-10 font-light">
          VVC-leden krijgen via het Quantum Initium ecosysteem automatisch ledenvoordeel.{' '}
          <a href="#/integraties" className="text-[#E5C583] hover:underline transition-colors font-medium">
            Bekijk de integraties & hardware nodes →
          </a>
        </p>
      </div>

      {/* Subscribe dialog */}
      <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
        <DialogContent className="bg-[#0D1117]/95 backdrop-blur-2xl border border-[#E5C583]/25 text-white sm:max-w-md shadow-2xl rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif italic text-[#E5C583]">
              {done ? 'Abonnement Geactiveerd' : `${selectedPlan?.name} Abonnement Activatie`}
            </DialogTitle>
          </DialogHeader>
          {done ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-[#10B981]" />
              <p className="text-white/80 mb-6 text-sm">
                Je {selectedPlan?.name}-abonnement is succesvol gekoppeld. Drip-feed allocatie start binnen 24 uur.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => {
                    setSelectedPlan(null);
                    if (user) onGoAccount();
                  }}
                  className="bg-gradient-to-r from-[#E5C583] to-[#D4AF37] text-[#090B0F] font-bold rounded-full px-7 h-11"
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
