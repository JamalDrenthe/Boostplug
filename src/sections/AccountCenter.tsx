import { useState } from 'react';
import { useStore } from '@/hooks/useStore';
import { formatPrice } from '@/data/platforms';
import type { OrderStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  User,
  Mail,
  Package,
  LogOut,
  ArrowLeft,
  ShoppingBag,
  Search,
  Copy,
  Repeat,
  Calendar,
  Pickaxe,
  Cpu,
  Globe,
  TrendingUp,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { MiningOnboardingFlow } from '@/sections/MiningOnboardingFlow';

interface AccountCenterProps {
  onBack: () => void;
  onTrack: (token: string) => void;
  onShop: () => void;
  onAdmin?: () => void;
}

const statusLabels: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: 'In afwachting', className: 'border-amber-500/50 text-amber-400' },
  processing: { label: 'In behandeling', className: 'border-blue-500/50 text-blue-400' },
  delivered: { label: 'Afgeleverd', className: 'border-green-500/50 text-green-400' },
  partial: { label: 'Gedeeltelijk', className: 'border-yellow-500/50 text-yellow-400' },
  failed: { label: 'Mislukt', className: 'border-red-500/50 text-red-400' },
  refunded: { label: 'Terugbetaald', className: 'border-purple-500/50 text-purple-400' },
};

export function AccountCenter({ onBack, onTrack, onShop, onAdmin }: AccountCenterProps) {
  const { user, orders, subscriptions, cancelSubscription, logout, currency, getMemberMiningProfile } = useStore();
  const [openPanel, setOpenPanel] = useState<string | null>(null);

  if (!user) {
    return null;
  }

  const myOrders = orders.filter(
    (order) => order.email.toLowerCase() === user.email.toLowerCase()
  );

  const mySubscriptions = subscriptions.filter(
    (sub) => sub.email.toLowerCase() === user.email.toLowerCase()
  );

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast.success('Trackingnummer gekopieerd!');
  };

  return (
    <section className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Terug naar home
        </button>

        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Mijn <span className="text-gradient">account</span>
          </h1>
          <Button
            variant="outline"
            onClick={() => {
              logout();
              toast.success('Je bent uitgelogd');
              onBack();
            }}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Uitloggen
          </Button>
        </div>

        {/* Profiel */}
        <Card className="p-6 bg-white/5 border-white/10 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[hsl(142,76%,45%)]/20 flex items-center justify-center">
              <User className="w-8 h-8 text-[hsl(142,76%,45%)]" />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl font-semibold text-white">{user.name}</h2>
                {user.accountType === 'admin' ? (
                  <Badge variant="outline" className="border-[hsl(142,76%,45%)] text-[hsl(142,76%,45%)] bg-[hsl(142,76%,45%)]/10 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                    Hoofdbeheerder (Admin)
                  </Badge>
                ) : user.accountType === 'member' ? (
                  <Badge variant="outline" className="border-[hsl(199,89%,48%)]/50 text-[hsl(199,89%,48%)]">
                    <Pickaxe className="w-3 h-3 mr-1" />
                    Lidaccount
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-[hsl(142,76%,45%)]/50 text-[hsl(142,76%,45%)]">
                    <ShoppingBag className="w-3 h-3 mr-1" />
                    Klantaccount
                  </Badge>
                )}
              </div>
              <p className="text-white/50 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user.email}
              </p>
              <p className="text-white/30 text-sm mt-1">
                {user.accountType === 'admin' ? 'Beheerder' : user.accountType === 'member' ? 'Lid' : 'Klant'} sinds {new Date(user.createdAt).toLocaleDateString('nl-NL')}
              </p>
            </div>
          </div>
        </Card>

        {/* Admin Dashboard banner */}
        {user.accountType === 'admin' && (
          <Card className="p-6 bg-gradient-to-r from-[hsl(142,76%,45%)]/15 via-white/5 to-[hsl(199,89%,48%)]/15 border-[hsl(142,76%,45%)]/30 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-5 h-5 text-[hsl(142,76%,45%)]" />
                  <h3 className="text-lg font-bold text-white">Controlecentrum Beheerder</h3>
                </div>
                <p className="text-white/60 text-sm">
                  Beheer live bestellingen, pas statussen en voortgang aan, monitor abonnementen en bekijk de Firebase status.
                </p>
              </div>
              <Button
                onClick={onAdmin || (() => { window.location.hash = '#/admin'; })}
                className="bg-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,40%)] text-black font-semibold shrink-0 rounded-full px-6"
              >
                Open Admin Paneel
              </Button>
            </div>
          </Card>
        )}

        {/* Leden dashboard — alleen voor lidaccounts */}
        {user.accountType === 'member' && (
          <Card className="p-6 bg-white/5 border-[hsl(199,89%,48%)]/20 mb-8">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
              <Pickaxe className="w-5 h-5 text-[hsl(199,89%,48%)]" />
              Leden dashboard
            </h3>
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              {/* Mining setup */}
              <button
                onClick={() => setOpenPanel(openPanel === 'mining' ? null : 'mining')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  openPanel === 'mining'
                    ? 'border-[hsl(199,89%,48%)] bg-[hsl(199,89%,48%)]/10'
                    : 'border-white/10 bg-white/5 hover:border-[hsl(199,89%,48%)]/40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <Cpu className="w-6 h-6 text-[hsl(199,89%,48%)] mb-3" />
                  <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${openPanel === 'mining' ? 'rotate-180' : ''}`} />
                </div>
                <p className="text-white font-medium text-sm mb-1">Mining setup</p>
                <p className="text-white/40 text-xs">
                  Lever rekenkracht via IP-software en GPU aan het BoostPlug-netwerk.
                </p>
              </button>
              {/* Ecosysteem */}
              <button
                onClick={() => setOpenPanel(openPanel === 'eco' ? null : 'eco')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  openPanel === 'eco'
                    ? 'border-[hsl(199,89%,48%)] bg-[hsl(199,89%,48%)]/10'
                    : 'border-white/10 bg-white/5 hover:border-[hsl(199,89%,48%)]/40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <Globe className="w-6 h-6 text-[hsl(199,89%,48%)] mb-3" />
                  <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${openPanel === 'eco' ? 'rotate-180' : ''}`} />
                </div>
                <p className="text-white font-medium text-sm mb-1">Ecosysteem</p>
                <p className="text-white/40 text-xs">
                  Accounts via Logs.rent · VVC-leden krijgen voordeel via Spontiva.
                </p>
              </button>
              {/* Verdiensten */}
              <button
                onClick={() => setOpenPanel(openPanel === 'earn' ? null : 'earn')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  openPanel === 'earn'
                    ? 'border-[hsl(199,89%,48%)] bg-[hsl(199,89%,48%)]/10'
                    : 'border-white/10 bg-white/5 hover:border-[hsl(199,89%,48%)]/40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <TrendingUp className="w-6 h-6 text-[hsl(199,89%,48%)] mb-3" />
                  <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${openPanel === 'earn' ? 'rotate-180' : ''}`} />
                </div>
                <p className="text-white font-medium text-sm mb-1">Verdiensten</p>
                <p className="text-white/40 text-xs">
                  Verdien mee aan de algoritme-boosts van klanten zoals Zheavenzy.
                </p>
              </button>
            </div>

            {/* Uitklapbaar detailpaneel */}
            {openPanel === 'mining' && (
              <div className="mb-6 pt-2">
                <MiningOnboardingFlow onFinish={() => setOpenPanel('earn')} />
              </div>
            )}
            {openPanel === 'eco' && (
              <div className="p-5 rounded-xl bg-[hsl(199,89%,48%)]/5 border border-[hsl(199,89%,48%)]/20 mb-6">
                <p className="text-white font-medium text-sm mb-4">Het BoostPlug-ecosysteem</p>
                <div className="space-y-3">
                  <a
                    href="https://zheavenzy.one"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:border-[hsl(199,89%,48%)]/40 transition-colors"
                  >
                    <div>
                      <p className="text-white text-sm font-medium">Zheavenzy.one</p>
                      <p className="text-white/40 text-xs">Boostt hun artiesten via BoostPlug</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[hsl(199,89%,48%)]" />
                  </a>
                  <a
                    href="https://logs.rent"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:border-[hsl(199,89%,48%)]/40 transition-colors"
                  >
                    <div>
                      <p className="text-white text-sm font-medium">Logs.rent</p>
                      <p className="text-white/40 text-xs">Levert de accounts die het algoritme beïnvloeden</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[hsl(199,89%,48%)]" />
                  </a>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                    <div>
                      <p className="text-white text-sm font-medium">VVC via Spontiva</p>
                      <p className="text-white/40 text-xs">VVC-leden krijgen ledenvoordeel op BoostPlug</p>
                    </div>
                    <Badge variant="outline" className="border-[hsl(142,76%,45%)]/50 text-[hsl(142,76%,45%)]">Voordeel</Badge>
                  </div>
                </div>
              </div>
            )}
            {openPanel === 'earn' && (() => {
              const prof = getMemberMiningProfile(user.id);
              const isNodeActive = prof.softwareConfig?.status === 'mining_active';
              return (
                <div className="p-5 rounded-xl bg-[hsl(199,89%,48%)]/5 border border-[hsl(199,89%,48%)]/20 mb-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-white font-medium text-sm">Mining Verdiensten & Node Status</p>
                    <Badge variant="outline" className={isNodeActive ? "border-green-500/50 text-green-400 bg-green-500/10" : "border-amber-500/50 text-amber-400"}>
                      {isNodeActive ? "Node Actief & Leverend" : "Setup Onvoltooid"}
                    </Badge>
                  </div>
                  <ul className="space-y-1.5 text-xs text-white/60">
                    <li>• Klanten (oa. Zheavenzy) kopen boosts via BoostPlug</li>
                    <li>• Jouw hardware levert de GPU- en IP-rekenkracht voor de streaming simulatoren</li>
                    <li>• Jouw aandeel wordt maandelijks uitgekeerd op basis van je actieve stream volume</li>
                  </ul>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <span className="text-white/40 text-xs uppercase font-mono">Verwachte Maandopbrengst</span>
                      <p className="text-xl font-bold text-[hsl(142,76%,45%)]">
                        € {isNodeActive ? (prof.estimatedMonthlyEarnings || 195) : '0'},00
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <span className="text-white/40 text-xs uppercase font-mono">Geleverde Snelheid</span>
                      <p className="text-xl font-bold text-white">
                        {isNodeActive ? `${prof.softwareConfig?.hashRateOrStreamsPerHour || 140} streams/uur` : '0 streams/uur'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}
            <p className="text-white/30 text-xs">
              Mining-statistieken en uitbetalingen worden hier getoond zodra jouw mining-account actief is.
            </p>
          </Card>
        )}

        {/* Abonnementen */}
        <Card className="p-6 bg-white/5 border-white/10 mb-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Repeat className="w-5 h-5 text-[hsl(199,89%,48%)]" />
              Mijn abonnementen ({mySubscriptions.length})
            </h3>
            <Button
              onClick={onShop}
              size="sm"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Bekijk abonnementen
            </Button>
          </div>

          {mySubscriptions.length === 0 ? (
            <p className="text-white/40 text-sm py-6 text-center">
              Nog geen abonnementen. Maandelijkse boosts houden het algoritme warm voor je.
            </p>
          ) : (
            <div className="space-y-4">
              {mySubscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between flex-wrap gap-3"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="text-white font-medium">{sub.planName}</p>
                      <Badge
                        variant="outline"
                        className={
                          sub.status === 'active'
                            ? 'border-green-500/50 text-green-400'
                            : 'border-white/30 text-white/40'
                        }
                      >
                        {sub.status === 'active' ? 'Actief' : 'Opgezegd'}
                      </Badge>
                    </div>
                    <p className="text-white/40 text-sm mt-1 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" />
                      Volgende verlenging:{' '}
                      {new Date(sub.nextBillingAt).toLocaleDateString('nl-NL')}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-white font-semibold">
                      {formatPrice(sub.monthlyPrice, sub.currency)}/mnd
                    </span>
                    {sub.status === 'active' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          cancelSubscription(sub.id);
                          toast.success('Abonnement opgezegd');
                        }}
                        className="border-white/20 text-white/70 hover:bg-white/10"
                      >
                        Opzeggen
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Bestellingen */}
        <Card className="p-6 bg-white/5 border-white/10">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-[hsl(142,76%,45%)]" />
              Mijn bestellingen ({myOrders.length})
            </h3>
            <Button
              onClick={onShop}
              size="sm"
              className="bg-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,40%)] text-[hsl(220,35%,6%)]"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Nieuwe bestelling
            </Button>
          </div>

          {myOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-white/50 mb-2">Nog geen bestellingen op dit account.</p>
              <p className="text-white/30 text-sm mb-6">
                Bestellingen die je doet met {user.email} verschijnen hier automatisch.
              </p>
              <Button
                onClick={onShop}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Bekijk producten
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {myOrders.map((order) => {
                const status = statusLabels[order.status];
                return (
                  <div
                    key={order.id}
                    className="p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                      <div>
                        <p className="text-white font-medium">{order.orderNumber}</p>
                        <p className="text-white/40 text-sm">
                          {new Date(order.createdAt).toLocaleDateString('nl-NL')} ·{' '}
                          {order.items.length} item(s)
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={status.className}>
                          {status.label}
                        </Badge>
                        <span className="text-white font-semibold">
                          {formatPrice(order.totalPrice, order.currency || currency)}
                        </span>
                      </div>
                    </div>
                    <Progress value={order.deliveryProgress} className="h-2 mb-3" />
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 text-white/40 text-sm">
                        <span>Tracking:</span>
                        <code className="text-[hsl(142,76%,45%)]">{order.trackingToken}</code>
                        <button
                          onClick={() => copyToken(order.trackingToken)}
                          className="hover:text-white transition-colors"
                          aria-label="Kopieer trackingnummer"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onTrack(order.trackingToken)}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Volg bestelling
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}
