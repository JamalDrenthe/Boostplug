import { useState, useEffect } from 'react';
import { useStore } from '@/hooks/useStore';
import { formatPrice } from '@/data/platforms';
import type { Order, OrderStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { LucideIcon } from 'lucide-react';
import { 
  Search, 
  ArrowLeft, 
  Package, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  Mail,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

interface TrackingSectionProps {
  initialToken: string;
  onBack: () => void;
}

interface StatusConfig {
  label: string;
  color: string;
  icon: LucideIcon;
  description: string;
}

const statusConfig: Record<OrderStatus, StatusConfig> = {
  pending: { 
    label: 'In afwachting', 
    color: 'bg-amber-500', 
    icon: Clock,
    description: 'Je bestelling is ontvangen en wordt binnenkort verwerkt.'
  },
  processing: { 
    label: 'In behandeling', 
    color: 'bg-blue-500', 
    icon: RefreshCw,
    description: 'Je bestelling wordt momenteel verwerkt.'
  },
  delivered: { 
    label: 'Afgeleverd', 
    color: 'bg-green-500', 
    icon: CheckCircle2,
    description: 'Je bestelling is succesvol afgeleverd!'
  },
  partial: { 
    label: 'Gedeeltelijk', 
    color: 'bg-yellow-500', 
    icon: AlertCircle,
    description: 'Je bestelling is gedeeltelijk afgeleverd.'
  },
  failed: { 
    label: 'Mislukt', 
    color: 'bg-red-500', 
    icon: AlertCircle,
    description: 'Er is iets misgegaan. Neem contact op met support.'
  },
  refunded: { 
    label: 'Terugbetaald', 
    color: 'bg-purple-500', 
    icon: CheckCircle2,
    description: 'Je bestelling is terugbetaald.'
  },
};

export function TrackingSection({ initialToken, onBack }: TrackingSectionProps) {
  const { getOrderByToken, orders } = useStore();
  const [searchToken, setSearchToken] = useState(initialToken);
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (initialToken) {
      handleSearch(initialToken);
    }
  }, [initialToken, orders]);

  const handleSearch = (token: string = searchToken) => {
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      const order = getOrderByToken(token.toLowerCase());
      setSearchedOrder(order || null);
      setIsSearching(false);
      
      if (!order && token) {
        toast.error('Bestelling niet gevonden. Controleer je tracking nummer.');
      }
    }, 500);
  };

  const status = searchedOrder ? statusConfig[searchedOrder.status] : null;
  const StatusIcon = status?.icon || Package;

  return (
    <section className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Terug naar home
        </button>

        {/* Search */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Track je <span className="text-gradient">bestelling</span>
          </h2>
          <p className="text-white/60 mb-8">
            Vul je tracking nummer in om de status van je bestelling te bekijken.
          </p>
          
          <div className="flex gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <Input
                value={searchToken}
                onChange={(e) => setSearchToken(e.target.value)}
                placeholder="Tracking nummer (bijv. abc123xyz)"
                className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button
              onClick={() => handleSearch()}
              disabled={isSearching || !searchToken}
              className="bg-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,40%)] text-[hsl(220,35%,6%)]"
            >
              {isSearching ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                'Zoeken'
              )}
            </Button>
          </div>
        </div>

        {/* Order Details */}
        {searchedOrder && status && (
          <div className="space-y-6 animate-scale-in">
            {/* Status Card */}
            <Card className="p-6 bg-white/5 border-white/10">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-2xl ${status.color}/20 flex items-center justify-center`}>
                  <StatusIcon className={`w-8 h-8 ${status.color.replace('bg-', 'text-')}`} />
                </div>
                <div>
                  <p className="text-sm text-white/50 mb-1">Bestelling {searchedOrder.orderNumber}</p>
                  <h3 className="text-2xl font-bold text-white">{status.label}</h3>
                </div>
              </div>
              
              <Progress 
                value={searchedOrder.deliveryProgress} 
                className="h-3 mb-4"
              />
              
              <p className="text-white/60">{status.description}</p>
            </Card>

            {/* Order Items */}
            <Card className="p-6 bg-white/5 border-white/10">
              <h4 className="text-lg font-semibold text-white mb-4">Bestelde items</h4>
              <div className="space-y-3">
                {searchedOrder.items.map((item: any, index: number) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[hsl(142,76%,45%)]/20 flex items-center justify-center">
                        <span className="text-[hsl(142,76%,45%)] font-bold">
                          {item.category === 'streams' ? '♪' : '★'}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{item.platformName}</p>
                        <p className="text-sm text-white/50">
                          {item.typeName || `${item.quantity} review(s)`}
                          {item.quality === 'premium' && (
                            <Badge variant="outline" className="ml-2 border-[hsl(142,76%,45%)] text-[hsl(142,76%,45%)] text-xs">
                              Premium
                            </Badge>
                          )}
                        </p>
                      </div>
                    </div>
                    <span className="text-white font-semibold">
                      {formatPrice(item.price, searchedOrder.currency)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-white/10 mt-4 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Totaal</span>
                  <span className="text-xl font-bold text-[hsl(142,76%,45%)]">
                    {formatPrice(searchedOrder.totalPrice * 1.21, searchedOrder.currency)}
                  </span>
                </div>
              </div>
            </Card>

            {/* Contact Support */}
            <Card className="p-6 bg-white/5 border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[hsl(199,89%,48%)]/20 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-[hsl(199,89%,48%)]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium mb-1">Hulp nodig?</h4>
                  <p className="text-sm text-white/50">Neem contact op met onze support</p>
                </div>
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Contact
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* No Order Found */}
        {!searchedOrder && searchToken && !isSearching && (
          <Card className="p-8 text-center bg-white/5 border-white/10">
            <Package className="w-16 h-16 mx-auto mb-4 text-white/20" />
            <h3 className="text-xl font-semibold text-white mb-2">Geen bestelling gevonden</h3>
            <p className="text-white/50">
              We konden geen bestelling vinden met dit tracking nummer. 
              Controleer of je het juiste nummer hebt ingevoerd.
            </p>
          </Card>
        )}
      </div>
    </section>
  );
}
