import { useState, useMemo } from 'react';
import { useStore, type StoredUser } from '@/hooks/useStore';
import { formatPrice } from '@/data/platforms';
import type { OrderStatus, SubscriptionStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ShieldCheck,
  Package,
  Repeat,
  Pickaxe,
  Search,
  ExternalLink,
  Copy,
  Trash2,
  RefreshCw,
  Database,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  PlusCircle,
  Cpu,
  ArrowLeft,
  Sliders,
  DollarSign,
} from 'lucide-react';
import { toast } from 'sonner';

interface AdminDashboardProps {
  onBack: () => void;
  onTrack: (token: string) => void;
}

const statusConfig: Record<OrderStatus, { label: string; badgeClass: string; icon: typeof Clock }> = {
  pending: { label: 'In afwachting', badgeClass: 'border-amber-500/50 text-amber-400 bg-amber-500/10', icon: Clock },
  processing: { label: 'In behandeling', badgeClass: 'border-blue-500/50 text-blue-400 bg-blue-500/10', icon: RefreshCw },
  delivered: { label: 'Afgeleverd', badgeClass: 'border-green-500/50 text-green-400 bg-green-500/10', icon: CheckCircle2 },
  partial: { label: 'Gedeeltelijk', badgeClass: 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10', icon: AlertCircle },
  failed: { label: 'Mislukt', badgeClass: 'border-red-500/50 text-red-400 bg-red-500/10', icon: AlertCircle },
  refunded: { label: 'Terugbetaald', badgeClass: 'border-purple-500/50 text-purple-400 bg-purple-500/10', icon: AlertCircle },
};

export function AdminDashboard({ onBack, onTrack }: AdminDashboardProps) {
  const { 
    orders, 
    updateOrderStatus, 
    deleteOrder, 
    subscriptions, 
    updateSubscriptionStatus,
    currency, 
    user, 
    isFirebaseConfigured, 
    seedDemoData, 
    syncWithFirebase, 
    getAllUsers 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'subscriptions' | 'members' | 'firebase'>('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [isSyncing, setIsSyncing] = useState(false);

  // Gefilterde bestellingen
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.trackingToken.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  // Alleen geautoriseerde admins
  if (user?.accountType !== 'admin') {
    return (
      <section className="min-h-screen pt-28 pb-16 px-4">
        <div className="max-w-md mx-auto text-center">
          <Card className="p-8 bg-white/5 border-red-500/30">
            <ShieldCheck className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Toegang geweigerd</h2>
            <p className="text-white/60 text-sm mb-6">
              Je hebt beheerdersrechten nodig om het controlecentrum te openen. Log in met info@jamaldrenthe.com.
            </p>
            <Button onClick={onBack} variant="outline" className="border-white/20 text-white">
              Terug
            </Button>
          </Card>
        </div>
      </section>
    );
  }

  // KPI Berekeningen
  const totalRevenueEUR = orders
    .filter(o => o.currency === 'EUR' && o.status !== 'refunded')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const totalRevenueGBP = orders
    .filter(o => o.currency === 'GBP' && o.status !== 'refunded')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const activeSubCount = subscriptions.filter(s => s.status === 'active').length;
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
  const processingOrdersCount = orders.filter(o => o.status === 'processing').length;
  const deliveredOrdersCount = orders.filter(o => o.status === 'delivered').length;
  const usersList: StoredUser[] = getAllUsers();
  const membersList = usersList.filter(u => u.accountType === 'member');

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} gekopieerd naar klembord`);
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    const result = await syncWithFirebase();
    setIsSyncing(false);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.info(result.message);
    }
  };

  const exportDataJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      orders,
      subscriptions,
      users: usersList,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `boostplug-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Gegevens geëxporteerd als JSON bestand');
  };

  return (
    <section className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigatie & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-3 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Terug naar webshop
            </button>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Controlecentrum <span className="text-gradient">Admin</span>
              </h1>
              <Badge className="bg-[hsl(142,76%,45%)]/20 text-[hsl(142,76%,45%)] border-[hsl(142,76%,45%)]/40 px-3 py-1">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                info@jamaldrenthe.com
              </Badge>
              <Badge variant="outline" className={isFirebaseConfigured ? "border-green-500/50 text-green-400" : "border-amber-500/50 text-amber-400"}>
                <Database className="w-3 h-3 mr-1" />
                {isFirebaseConfigured ? "Firebase: boostplug-dev (Live)" : "Firebase: boostplug-dev (Fallback)"}
              </Badge>
            </div>
            <p className="text-white/50 text-sm mt-1">
              Beheer live bestellingen, leveringsvoortgang, abonnementen en het algoritme-miningnetwerk.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualSync}
              disabled={isSyncing}
              className="border-white/15 text-white hover:bg-white/10"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isSyncing ? 'animate-spin' : ''}`} />
              Firebase Sync
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={seedDemoData}
              className="border-white/15 text-white hover:bg-white/10"
            >
              <PlusCircle className="w-3.5 h-3.5 mr-1.5 text-[hsl(142,76%,45%)]" />
              Laad Demo Data
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportDataJSON}
              className="border-white/15 text-white hover:bg-white/10"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export
            </Button>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 bg-white/5 border-white/10 relative overflow-hidden">
            <div className="flex items-center justify-between text-white/50 mb-3">
              <span className="text-xs uppercase tracking-wider font-mono">Totale Omzet</span>
              <DollarSign className="w-4 h-4 text-[hsl(142,76%,45%)]" />
            </div>
            <div className="text-2xl font-bold text-white">
              {formatPrice(totalRevenueEUR, 'EUR')}
              {totalRevenueGBP > 0 && (
                <span className="text-sm font-normal text-white/50 ml-2">
                  + {formatPrice(totalRevenueGBP, 'GBP')}
                </span>
              )}
            </div>
            <p className="text-xs text-white/40 mt-2">
              Uit {orders.length} geregistreerde bestellingen
            </p>
          </Card>

          <Card className="p-5 bg-white/5 border-white/10 relative overflow-hidden">
            <div className="flex items-center justify-between text-white/50 mb-3">
              <span className="text-xs uppercase tracking-wider font-mono">Bestellingen Status</span>
              <Package className="w-4 h-4 text-[hsl(199,89%,48%)]" />
            </div>
            <div className="text-2xl font-bold text-white flex items-baseline gap-2">
              <span>{orders.length}</span>
              <span className="text-xs font-normal text-amber-400">({pendingOrdersCount} open)</span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-white/50">
              <span className="text-blue-400">{processingOrdersCount} in behandeling</span>
              <span>•</span>
              <span className="text-green-400">{deliveredOrdersCount} voltooid</span>
            </div>
          </Card>

          <Card className="p-5 bg-white/5 border-white/10 relative overflow-hidden">
            <div className="flex items-center justify-between text-white/50 mb-3">
              <span className="text-xs uppercase tracking-wider font-mono">Abonnementen</span>
              <Repeat className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white">
              {activeSubCount} <span className="text-sm font-normal text-white/50">actief</span>
            </div>
            <p className="text-xs text-white/40 mt-2">
              Maandelijkse continue boosts
            </p>
          </Card>

          <Card className="p-5 bg-white/5 border-white/10 relative overflow-hidden">
            <div className="flex items-center justify-between text-white/50 mb-3">
              <span className="text-xs uppercase tracking-wider font-mono">Mining Netwerk</span>
              <Cpu className="w-4 h-4 text-[hsl(199,89%,48%)]" />
            </div>
            <div className="text-2xl font-bold text-white flex items-baseline gap-2">
              <span>{membersList.length}</span>
              <span className="text-sm font-normal text-white/50">leden-nodes</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-[hsl(142,76%,45%)]">
              <span className="w-2 h-2 rounded-full bg-[hsl(142,76%,45%)] animate-pulse" />
              Netwerk actief (99.8% uptime)
            </div>
          </Card>
        </div>

        {/* Tabs Component */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'orders' | 'subscriptions' | 'members' | 'firebase')} className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl">
            <TabsTrigger value="orders" className="data-[state=active]:bg-white/10 text-white flex items-center gap-2">
              <Package className="w-4 h-4" />
              Bestellingen ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="data-[state=active]:bg-white/10 text-white flex items-center gap-2">
              <Repeat className="w-4 h-4" />
              Abonnementen ({subscriptions.length})
            </TabsTrigger>
            <TabsTrigger value="members" className="data-[state=active]:bg-white/10 text-white flex items-center gap-2">
              <Pickaxe className="w-4 h-4" />
              Leden & Mining ({membersList.length})
            </TabsTrigger>
            <TabsTrigger value="firebase" className="data-[state=active]:bg-white/10 text-white flex items-center gap-2">
              <Database className="w-4 h-4" />
              Firebase & Systeem
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: BESTELLINGEN BEHEER */}
          <TabsContent value="orders" className="space-y-4">
            <Card className="p-4 bg-white/5 border-white/10 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Zoek op ordernummer, klant e-mail of tracking token..."
                  className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>

              {/* Status Filters */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {(['all', 'pending', 'processing', 'delivered', 'failed', 'refunded'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      statusFilter === st
                        ? 'bg-white/20 text-white'
                        : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {st === 'all' ? 'Alle' : statusConfig[st].label}
                  </button>
                ))}
              </div>
            </Card>

            {filteredOrders.length === 0 ? (
              <Card className="p-12 text-center bg-white/5 border-white/10">
                <Package className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/60 font-medium">Geen bestellingen gevonden</p>
                <p className="text-white/40 text-sm mt-1">
                  Pas je zoekopdracht aan of klik op "Laad Demo Data" bovenaan om voorbeeldorders te bekijken.
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const currentStatus = statusConfig[order.status] || statusConfig.pending;
                  const StatusIcon = currentStatus.icon;

                  return (
                    <Card key={order.id} className="p-6 bg-white/5 border-white/10 hover:border-white/20 transition-all space-y-5">
                      {/* Bovenste rij: Order info & Status badge */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                        <div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-lg font-bold text-white font-mono">{order.orderNumber}</span>
                            <Badge variant="outline" className={currentStatus.badgeClass}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {currentStatus.label}
                            </Badge>
                            <span className="text-sm font-semibold text-white">
                              {formatPrice(order.totalPrice, order.currency || currency)}
                            </span>
                          </div>
                          <p className="text-xs text-white/40 mt-1">
                            Geplaatst op {new Date(order.createdAt).toLocaleString('nl-NL')} · Klant: <span className="text-white/80">{order.email}</span>
                          </p>
                        </div>

                        {/* Inline status & progress beheer */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <select
                            value={order.status}
                            onChange={(e) => {
                              const newStatus = e.target.value as OrderStatus;
                              const newProg = newStatus === 'delivered' ? 100 : newStatus === 'pending' ? 0 : order.deliveryProgress;
                              updateOrderStatus(order.id, newStatus, newProg);
                              toast.success(`Status gewijzigd naar "${statusConfig[newStatus].label}"`);
                            }}
                            className="bg-white/10 border border-white/20 text-white rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-[hsl(142,76%,45%)]"
                          >
                            <option value="pending" className="bg-neutral-900 text-white">In afwachting</option>
                            <option value="processing" className="bg-neutral-900 text-white">In behandeling</option>
                            <option value="delivered" className="bg-neutral-900 text-white">Afgeleverd (100%)</option>
                            <option value="partial" className="bg-neutral-900 text-white">Gedeeltelijk</option>
                            <option value="failed" className="bg-neutral-900 text-white">Mislukt</option>
                            <option value="refunded" className="bg-neutral-900 text-white">Terugbetaald</option>
                          </select>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              if (confirm(`Weet je zeker dat je order ${order.orderNumber} wilt verwijderen?`)) {
                                deleteOrder(order.id);
                                toast.success(`Order ${order.orderNumber} verwijderd`);
                              }
                            }}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 px-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Items overzicht */}
                      <div className="space-y-2">
                        <span className="text-xs font-mono text-white/40 uppercase">Bestelde items ({order.items.length})</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="p-3 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                              <div>
                                <p className="font-medium text-white">{item.platformName} — {item.typeName || item.category}</p>
                                <p className="text-white/40">
                                  {item.quantity.toLocaleString('nl-NL')} eenheden {item.quality ? `(${item.quality})` : ''}
                                  {item.rating ? ` · ${item.rating} sterren` : ''}
                                </p>
                                {item.targetUrl && (
                                  <a 
                                    href={item.targetUrl} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-[hsl(199,89%,48%)] hover:underline inline-flex items-center gap-1 mt-0.5 truncate max-w-xs"
                                  >
                                    {item.targetUrl}
                                    <ExternalLink className="w-3 h-3 shrink-0" />
                                  </a>
                                )}
                              </div>
                              <span className="font-semibold text-white ml-2">
                                {formatPrice(item.price, item.currency || order.currency || currency)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Leveringsvoortgang beheer */}
                      <div className="space-y-2 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/60 flex items-center gap-1.5">
                            <Sliders className="w-3.5 h-3.5 text-[hsl(142,76%,45%)]" />
                            Leveringsvoortgang: <strong className="text-white">{order.deliveryProgress}%</strong>
                          </span>
                          <div className="flex items-center gap-1">
                            {[0, 25, 50, 75, 100].map((step) => (
                              <button
                                key={step}
                                onClick={() => {
                                  const newStatus = step === 100 ? 'delivered' : step === 0 ? 'pending' : 'processing';
                                  updateOrderStatus(order.id, newStatus, step);
                                  toast.success(`Voortgang ingesteld op ${step}%`);
                                }}
                                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                                  order.deliveryProgress === step
                                    ? 'bg-[hsl(142,76%,45%)] text-black font-bold'
                                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                                }`}
                              >
                                {step}%
                              </button>
                            ))}
                          </div>
                        </div>
                        <Progress value={order.deliveryProgress} className="h-2" />
                      </div>

                      {/* Onderste balk met tracking token en snelle links */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-white/50 pt-2 border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <span>Tracking:</span>
                          <code className="text-[hsl(142,76%,45%)] font-mono bg-white/5 px-2 py-0.5 rounded border border-white/10">
                            {order.trackingToken}
                          </code>
                          <button
                            onClick={() => handleCopy(order.trackingToken, 'Trackingtoken')}
                            className="text-white/50 hover:text-white transition-colors"
                            title="Kopieer tracking token"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const url = `${window.location.origin}/#/track/${order.trackingToken}`;
                              handleCopy(url, 'Klant tracking link');
                            }}
                            className="border-white/15 text-white/80 hover:text-white h-7 text-xs"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Kopieer Link
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onTrack(order.trackingToken)}
                            className="border-[hsl(142,76%,45%)]/40 text-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,45%)]/10 h-7 text-xs"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Bekijk Klantpagina
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* TAB 2: ABONNEMENTEN BEHEER */}
          <TabsContent value="subscriptions" className="space-y-4">
            <Card className="p-6 bg-white/5 border-white/10">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Repeat className="w-5 h-5 text-purple-400" />
                  Lopende Abonnementen ({subscriptions.length})
                </h3>
                <span className="text-xs text-white/40">
                  Automatische maandelijkse boosts voor algoritme-impact
                </span>
              </div>

              {subscriptions.length === 0 ? (
                <p className="text-white/40 text-sm text-center py-8">
                  Nog geen actieve abonnementen geregistreerd.
                </p>
              ) : (
                <div className="space-y-3">
                  {subscriptions.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-white text-base">{sub.planName} Plan</span>
                          <Badge
                            variant="outline"
                            className={
                              sub.status === 'active'
                                ? 'border-green-500/50 text-green-400 bg-green-500/10'
                                : 'border-white/20 text-white/40'
                            }
                          >
                            {sub.status === 'active' ? 'Actief' : 'Opgezegd'}
                          </Badge>
                          <span className="text-sm font-mono text-[hsl(142,76%,45%)]">
                            {formatPrice(sub.monthlyPrice, sub.currency)}/mnd
                          </span>
                        </div>
                        <p className="text-xs text-white/50 mt-1">
                          Klant: <strong className="text-white/80">{sub.email}</strong> · Gestart: {new Date(sub.startedAt).toLocaleDateString('nl-NL')} · Volgende facturering: {new Date(sub.nextBillingAt).toLocaleDateString('nl-NL')}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const newStatus: SubscriptionStatus = sub.status === 'active' ? 'cancelled' : 'active';
                            updateSubscriptionStatus(sub.id, newStatus);
                            toast.success(`Abonnement gemarkeerd als ${newStatus}`);
                          }}
                          className="border-white/15 text-white hover:bg-white/10 text-xs"
                        >
                          {sub.status === 'active' ? 'Opzeggen' : 'Heractiveren'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* TAB 3: LEDEN & MINING OVERZICHT */}
          <TabsContent value="members" className="space-y-4">
            <Card className="p-6 bg-white/5 border-white/10">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-[hsl(199,89%,48%)]" />
                    Leden & Algoritme-Mining Netwerk
                  </h3>
                  <p className="text-white/50 text-xs mt-1">
                    Leden leveren GPU-kracht en IP-software om het algoritme te beïnvloeden namens artiesten en merken.
                  </p>
                </div>
                <Badge className="bg-[hsl(199,89%,48%)]/20 text-[hsl(199,89%,48%)] border-[hsl(199,89%,48%)]/30">
                  7-stappen Onboarding
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                  <span className="text-xs font-mono text-white/50 uppercase">Ecosysteem Partners</span>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between p-2 rounded bg-white/5">
                      <span className="text-white">Zheavenzy (zheavenzy.one)</span>
                      <Badge variant="outline" className="text-green-400 border-green-500/40">Gekoppeld</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-white/5">
                      <span className="text-white">Logs.rent (Account profiles)</span>
                      <Badge variant="outline" className="text-green-400 border-green-500/40">Gekoppeld</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-white/5">
                      <span className="text-white">VVC via Spontiva</span>
                      <Badge variant="outline" className="text-green-400 border-green-500/40">Actief</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-white/5">
                      <span className="text-white">Quantum Initium Holding</span>
                      <Badge variant="outline" className="text-blue-400 border-blue-500/40">Moederorganisatie</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                  <span className="text-xs font-mono text-white/50 uppercase">Geregistreerde Gebruikers ({usersList.length})</span>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {usersList.map((u) => (
                      <div key={u.id} className="flex items-center justify-between p-2 rounded bg-white/5 text-xs">
                        <div>
                          <p className="font-medium text-white">{u.name}</p>
                          <p className="text-white/40">{u.email}</p>
                        </div>
                        <Badge variant="outline" className={
                          u.accountType === 'admin' 
                            ? 'text-[hsl(142,76%,45%)] border-[hsl(142,76%,45%)]/40' 
                            : u.accountType === 'member'
                            ? 'text-[hsl(199,89%,48%)] border-[hsl(199,89%,48%)]/40'
                            : 'text-white/60 border-white/20'
                        }>
                          {u.accountType}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* TAB 4: FIREBASE & SYSTEEM STATUS */}
          <TabsContent value="firebase" className="space-y-4">
            <Card className="p-6 bg-white/5 border-white/10 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-[hsl(142,76%,45%)]" />
                  Firebase Backend Configuratie
                </h3>
                <p className="text-white/50 text-xs mt-1">
                  Overzicht van de actieve cloud database en beveiligingsregels voor BoostPlug.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-white/40 uppercase font-mono">Firebase Project ID</p>
                  <p className="text-lg font-bold text-white mt-1">boostplug-dev</p>
                  <p className="text-xs text-white/40 mt-1">Geregistreerd in .firebaserc</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-white/40 uppercase font-mono">Firestore Rules</p>
                  <p className="text-lg font-bold text-[hsl(142,76%,45%)] mt-1">Actief & Beveiligd</p>
                  <p className="text-xs text-white/40 mt-1">Alleen admin info@jamaldrenthe.com</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-white/40 uppercase font-mono">Client SDK Status</p>
                  <p className="text-lg font-bold text-white mt-1">
                    {isFirebaseConfigured ? 'Live Verbonden' : 'Dev Fallback'}
                  </p>
                  <p className="text-xs text-white/40 mt-1">
                    {isFirebaseConfigured ? 'Directe Firestore sync' : 'Lokaal gesynchroniseerd'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                <p className="text-xs font-mono text-[hsl(142,76%,45%)] mb-2">firestore.rules overzicht:</p>
                <pre className="text-xs text-white/70 font-mono overflow-x-auto p-2 bg-black/60 rounded">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() { return request.auth != null; }
    function isAdmin() {
      return signedIn() && (
        request.auth.token.email == 'info@jamaldrenthe.com' ||
        request.auth.token.get('admin', false) == true
      );
    }
    match /{document=**} {
      allow read, write: if isAdmin();
    }
  }
}`}
                </pre>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={handleManualSync}
                  disabled={isSyncing}
                  className="bg-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,40%)] text-black font-semibold"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                  Synchroniseer Alle Bestellingen naar Firestore
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
