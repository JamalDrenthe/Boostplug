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
} from 'lucide-react';
import { toast } from 'sonner';

interface AccountCenterProps {
  onBack: () => void;
  onTrack: (token: string) => void;
  onShop: () => void;
}

const statusLabels: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: 'In afwachting', className: 'border-amber-500/50 text-amber-400' },
  processing: { label: 'In behandeling', className: 'border-blue-500/50 text-blue-400' },
  delivered: { label: 'Afgeleverd', className: 'border-green-500/50 text-green-400' },
  partial: { label: 'Gedeeltelijk', className: 'border-yellow-500/50 text-yellow-400' },
  failed: { label: 'Mislukt', className: 'border-red-500/50 text-red-400' },
  refunded: { label: 'Terugbetaald', className: 'border-purple-500/50 text-purple-400' },
};

export function AccountCenter({ onBack, onTrack, onShop }: AccountCenterProps) {
  const { user, orders, logout, currency } = useStore();

  if (!user) {
    return null;
  }

  const myOrders = orders.filter(
    (order) => order.email.toLowerCase() === user.email.toLowerCase()
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
              <h2 className="text-xl font-semibold text-white">{user.name}</h2>
              <p className="text-white/50 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user.email}
              </p>
              <p className="text-white/30 text-sm mt-1">
                Lid sinds {new Date(user.createdAt).toLocaleDateString('nl-NL')}
              </p>
            </div>
          </div>
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
