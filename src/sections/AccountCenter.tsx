import { useState, useMemo, useEffect } from 'react';
import { useStore } from '@/hooks/useStore';
import { formatPrice } from '@/data/platforms';
import type { Order, OrderStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
  TrendingUp,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  CreditCard,
  Building2,
  Users,
  HelpCircle,
  RefreshCw,
  Zap,
  Sliders,
  Send,
  Printer,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { toast } from 'sonner';
import { MiningOnboardingFlow } from '@/sections/MiningOnboardingFlow';

interface AccountCenterProps {
  onBack: () => void;
  onTrack: (token: string) => void;
  onShop: () => void;
  onAdmin?: () => void;
  onQuantumInitium?: () => void;
  onVVC?: () => void;
}

const statusConfig: Record<OrderStatus, { label: string; badgeClass: string; icon: React.ComponentType<{ className?: string }> }> = {
  pending: { label: 'In afwachting', badgeClass: 'border-amber-500/50 text-amber-400 bg-amber-500/10', icon: Clock },
  processing: { label: 'In behandeling', badgeClass: 'border-blue-500/50 text-blue-400 bg-blue-500/10', icon: RefreshCw },
  delivered: { label: 'Afgeleverd', badgeClass: 'border-green-500/50 text-green-400 bg-green-500/10', icon: CheckCircle2 },
  partial: { label: 'Gedeeltelijk', badgeClass: 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10', icon: Clock },
  failed: { label: 'Mislukt', badgeClass: 'border-red-500/50 text-red-400 bg-red-500/10', icon: ShieldAlert },
  refunded: { label: 'Terugbetaald', badgeClass: 'border-purple-500/50 text-purple-400 bg-purple-500/10', icon: RotateCcwFallback },
};

function RotateCcwFallback({ className }: { className?: string }) {
  return <RefreshCw className={className} />;
}

export function AccountCenter({
  onBack,
  onTrack,
  onShop,
  onAdmin,
  onQuantumInitium,
  onVVC,
}: AccountCenterProps) {
  const {
    user,
    orders,
    subscriptions,
    cancelSubscription,
    logout,
    currency,
    setCurrency,
    getMemberMiningProfile,
    updateUserProfile,
    reorderCart,
    isDemoUser,
    loginAsDemo,
  } = useStore();

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [orderFilter, setOrderFilter] = useState<'all' | 'processing' | 'delivered' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Formulier state voor profiel
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [companyOrArtist, setCompanyOrArtist] = useState(user?.companyOrArtistName || '');
  const [kvkOrVat, setKvkOrVat] = useState(user?.kvkOrVat || '');
  const [street, setStreet] = useState(user?.billingAddress?.street || '');
  const [postalCode, setPostalCode] = useState(user?.billingAddress?.postalCode || '');
  const [city, setCity] = useState(user?.billingAddress?.city || '');
  const [country, setCountry] = useState(user?.billingAddress?.country || 'Nederland');
  const [ibanPayout, setIbanPayout] = useState(user?.ibanPayout || '');
  const [ibanHolder, setIbanHolder] = useState(user?.ibanHolder || user?.name || '');
  const [emailNotifications, setEmailNotifications] = useState(user?.emailNotifications ?? true);

  // Synchroniseer formulier state als demo profiel of user wisselt
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setCompanyOrArtist(user.companyOrArtistName || '');
      setKvkOrVat(user.kvkOrVat || '');
      setStreet(user.billingAddress?.street || '');
      setPostalCode(user.billingAddress?.postalCode || '');
      setCity(user.billingAddress?.city || '');
      setCountry(user.billingAddress?.country || 'Nederland');
      setIbanPayout(user.ibanPayout || '');
      setIbanHolder(user.ibanHolder || user.name || '');
      setEmailNotifications(user.emailNotifications ?? true);
    }
  }, [user]);

  // Support formulier state
  const [supportSubject, setSupportSubject] = useState('Bestelling & Voortgang');
  const [supportMessage, setSupportMessage] = useState('');
  const [isSupportSent, setIsSupportSent] = useState(false);

  if (!user) {
    return null;
  }

  const isAdmin = user.accountType === 'admin' || ['info@boostplug.one', 'info@jamaldrenthe.com'].includes(user.email.toLowerCase());

  // Gefilterde bestellingen van huidige gebruiker
  const myOrders = useMemo(() => {
    return orders.filter(
      (order) => order.email.toLowerCase() === user.email.toLowerCase()
    );
  }, [orders, user.email]);

  const displayedOrders = useMemo(() => {
    return myOrders.filter((order) => {
      if (orderFilter !== 'all' && order.status !== orderFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesNumber = order.orderNumber.toLowerCase().includes(query);
        const matchesToken = order.trackingToken.toLowerCase().includes(query);
        const matchesItem = order.items.some(
          (i) =>
            i.platformName.toLowerCase().includes(query) ||
            (i.typeName && i.typeName.toLowerCase().includes(query)) ||
            (i.targetUrl && i.targetUrl.toLowerCase().includes(query))
        );
        return matchesNumber || matchesToken || matchesItem;
      }
      return true;
    });
  }, [myOrders, orderFilter, searchQuery]);

  // Abonnementen van huidige gebruiker
  const mySubscriptions = useMemo(() => {
    return subscriptions.filter(
      (sub) => sub.email.toLowerCase() === user.email.toLowerCase()
    );
  }, [subscriptions, user.email]);

  // Statistieken
  const totalSpent = useMemo(() => {
    return myOrders
      .filter((o) => o.status !== 'refunded')
      .reduce((sum, o) => sum + o.totalPrice, 0);
  }, [myOrders]);

  const activeOrdersCount = useMemo(() => {
    return myOrders.filter((o) => o.status === 'processing' || o.status === 'pending').length;
  }, [myOrders]);

  const memberProfile = getMemberMiningProfile(user.id);

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast.success('Trackingnummer gekopieerd naar klembord!');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: name.trim() || user.name,
      phone: phone.trim(),
      companyOrArtistName: companyOrArtist.trim(),
      kvkOrVat: kvkOrVat.trim(),
      billingAddress: {
        street: street.trim(),
        postalCode: postalCode.trim(),
        city: city.trim(),
        country: country.trim(),
      },
      ibanPayout: ibanPayout.trim(),
      ibanHolder: ibanHolder.trim(),
      emailNotifications,
    });
    toast.success('Profiel en factuurvoorkeuren opgeslagen!');
  };

  const handleUpgradeToMember = () => {
    updateUserProfile({ accountType: 'member' });
    toast.success('Account geüpgraded naar Lidaccount! Welkom in het netwerk.');
    setActiveTab('mining');
  };

  const handleReorder = (order: Order) => {
    reorderCart(order.items);
    toast.success(`${order.items.length} item(s) toegevoegd aan je winkelwagen`);
    onShop();
  };

  const handleSendSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) {
      toast.error('Vul a.u.b. een bericht in');
      return;
    }
    const mailto = `mailto:support@boostplug.one?subject=${encodeURIComponent(
      `[Support ${user.name}] ${supportSubject}`
    )}&body=${encodeURIComponent(
      `Hallo BoostPlug Support,\n\nKlant: ${user.name} (${user.email})\nOnderwerp: ${supportSubject}\n\nBericht:\n${supportMessage}\n\nAccount ID: ${user.id}`
    )}`;
    window.open(mailto, '_blank');
    setIsSupportSent(true);
    toast.success('Supportvenster geopend via support@boostplug.one');
  };

  const printReceipt = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Pop-up geblokkeerd. Sta pop-ups toe om facturen af te drukken.');
      return;
    }
    const itemsHtml = order.items
      .map(
        (i) => `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
            <strong>${i.platformName} — ${i.typeName || (i.category === 'streams' ? 'Streams' : 'Reviews')}</strong>
            <br><small style="color: #64748b;">Aantal: ${i.quantity.toLocaleString('nl-NL')} ${i.quality ? `(${i.quality})` : ''} • Link: ${i.targetUrl || 'Geen'}</small>
          </td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600;">
            ${formatPrice(i.price, order.currency || currency)}
          </td>
        </tr>
      `
      )
      .join('');

    const vatAmount = (order.totalPrice * 0.21) / 1.21;
    const subtotal = order.totalPrice - vatAmount;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Factuur ${order.orderNumber} — BoostPlug</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; margin: 40px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 20px; }
          .logo { font-size: 26px; font-weight: 900; letter-spacing: -0.5px; }
          .logo span { color: #16a34a; }
          .tag { font-size: 12px; color: #64748b; margin-top: 4px; }
          .meta { margin-top: 30px; display: flex; justify-content: space-between; }
          table { width: 100%; border-collapse: collapse; margin-top: 30px; }
          th { text-align: left; padding: 10px 0; border-bottom: 2px solid #0f172a; font-size: 13px; text-transform: uppercase; color: #64748b; }
          .totals { margin-top: 20px; float: right; width: 300px; }
          .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
          .total-row { font-size: 18px; font-weight: 800; border-top: 2px solid #0f172a; margin-top: 8px; padding-top: 8px; }
          .footer { margin-top: 80px; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">BOOST<span>PLUG</span></div>
            <div class="tag">Streaming & Reviews Growth Platform</div>
            <div class="tag">Een onderneming van Quantum Initium</div>
          </div>
          <div style="text-align: right;">
            <h2 style="margin: 0; font-size: 20px;">FACTUUR / BEWIJS</h2>
            <p style="margin: 4px 0; font-size: 13px; color: #64748b;">Nr: ${order.orderNumber}</p>
            <p style="margin: 4px 0; font-size: 13px; color: #64748b;">Datum: ${new Date(order.createdAt).toLocaleDateString('nl-NL')}</p>
            <p style="margin: 4px 0; font-size: 13px; color: #16a34a; font-weight: 600;">Status: VOLDAAN</p>
          </div>
        </div>

        <div class="meta">
          <div>
            <strong>Gefactureerd aan:</strong><br>
            ${user.name}<br>
            ${user.companyOrArtistName ? `${user.companyOrArtistName}<br>` : ''}
            ${user.email}<br>
            ${user.billingAddress?.street ? `${user.billingAddress.street}<br>${user.billingAddress.postalCode || ''} ${user.billingAddress.city || ''}` : ''}
          </div>
          <div style="text-align: right;">
            <strong>Dienstverlener:</strong><br>
            BoostPlug Global Network<br>
            support@boostplug.one<br>
            KvK / Onderneming: Quantum Initium<br>
            Tracking Token: ${order.trackingToken}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Omschrijving & Link</th>
              <th style="text-align: right;">Bedrag</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="totals">
          <div class="row"><span>Subtotaal (excl. BTW):</span><span>${formatPrice(subtotal, order.currency || currency)}</span></div>
          <div class="row"><span>BTW (21%):</span><span>${formatPrice(vatAmount, order.currency || currency)}</span></div>
          <div class="row total-row"><span>Totaal Voldaan:</span><span>${formatPrice(order.totalPrice, order.currency || currency)}</span></div>
        </div>

        <div style="clear: both;"></div>

        <div class="footer">
          Dank voor je vertrouwen in BoostPlug. Bestellingen worden veilig via het drip-feed algoritmenetwerk verwerkt.<br>
          Vragen? Neem direct contact op via support@boostplug.one.
        </div>
        <script>
          window.print();
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <section className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigatie Terug */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors cursor-pointer text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar home
          </button>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={onAdmin || (() => { window.location.hash = '#/admin'; })}
                className="border-[hsl(142,76%,45%)]/40 text-[hsl(142,76%,45%)] bg-[hsl(142,76%,45%)]/10 hover:bg-[hsl(142,76%,45%)]/20"
              >
                <ShieldCheck className="w-4 h-4 mr-1.5" />
                Controlecentrum (Admin)
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout();
                toast.success('Je bent uitgelogd');
                onBack();
              }}
              className="border-white/20 text-white/70 hover:text-white hover:bg-white/10"
            >
              <LogOut className="w-4 h-4 mr-1.5" />
              Uitloggen
            </Button>
          </div>
        </div>

        {/* DEMO ACCOUNTS QUICK SWITCHER BANNER */}
        {isDemoUser && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-sky-500/15 to-purple-500/15 border border-white/15 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-xs uppercase tracking-wider">Demo Modus Actief</span>
                  <Badge className="bg-white/10 text-white text-[10px] border-white/20">
                    {user.name} ({user.accountType === 'customer' ? 'Klantaccount' : user.accountType === 'member' ? 'Lidaccount' : 'Admin'})
                  </Badge>
                </div>
                <p className="text-white/60 text-xs mt-0.5">
                  Wissel met 1 klik naar een ander demo profiel om functionaliteiten en live data te testen:
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                size="sm"
                variant={user.accountType === 'customer' ? 'default' : 'outline'}
                onClick={async () => {
                  await loginAsDemo('customer');
                  setActiveTab('overview');
                  toast.success('Gewisseld naar Klantaccount (Nova Sound Studio)');
                }}
                className={`text-xs h-8 rounded-xl cursor-pointer ${
                  user.accountType === 'customer'
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-black font-semibold'
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                Klant Demo
              </Button>

              <Button
                size="sm"
                variant={user.accountType === 'member' ? 'default' : 'outline'}
                onClick={async () => {
                  await loginAsDemo('member');
                  setActiveTab('mining');
                  toast.success('Gewisseld naar Lidaccount (Lars van Dijk)');
                }}
                className={`text-xs h-8 rounded-xl cursor-pointer ${
                  user.accountType === 'member'
                    ? 'bg-sky-500 hover:bg-sky-400 text-black font-semibold'
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                <Pickaxe className="w-3.5 h-3.5 mr-1 text-sky-400" />
                Lid Demo
              </Button>

              <Button
                size="sm"
                variant={user.accountType === 'admin' ? 'default' : 'outline'}
                onClick={async () => {
                  await loginAsDemo('admin');
                  toast.success('Gewisseld naar Hoofdbeheerder (Admin)');
                  window.location.hash = '#/admin';
                }}
                className={`text-xs h-8 rounded-xl cursor-pointer ${
                  user.accountType === 'admin'
                    ? 'bg-purple-500 hover:bg-purple-400 text-white font-semibold'
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-purple-400" />
                Admin Demo
              </Button>
            </div>
          </div>
        )}

        {/* Hero Profiel Card */}
        <Card className="p-6 sm:p-8 bg-gradient-to-br from-white/10 via-[hsl(220,35%,8%)] to-[hsl(220,35%,5%)] border-white/15 rounded-3xl mb-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Linker Avatar & Info */}
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[hsl(142,76%,45%)]/30 to-[hsl(199,89%,48%)]/30 border border-white/20 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[hsl(142,76%,45%)] border-2 border-[hsl(220,35%,6%)] flex items-center justify-center" title="Actief">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {user.name}
                  </h1>
                  {isAdmin ? (
                    <Badge className="bg-[hsl(142,76%,45%)]/20 text-[hsl(142,76%,45%)] border-[hsl(142,76%,45%)]/50 px-2.5 py-0.5">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                      Hoofdbeheerder
                    </Badge>
                  ) : user.accountType === 'member' ? (
                    <Badge className="bg-[hsl(199,89%,48%)]/20 text-[hsl(199,89%,48%)] border-[hsl(199,89%,48%)]/50 px-2.5 py-0.5">
                      <Pickaxe className="w-3.5 h-3.5 mr-1" />
                      Lidaccount (Node Operator)
                    </Badge>
                  ) : (
                    <Badge className="bg-white/10 text-white/80 border-white/20 px-2.5 py-0.5">
                      <ShoppingBag className="w-3.5 h-3.5 mr-1 text-[hsl(142,76%,45%)]" />
                      Klantaccount
                    </Badge>
                  )}
                </div>

                <p className="text-white/60 text-sm mt-1 flex items-center gap-2 flex-wrap">
                  <Mail className="w-3.5 h-3.5 text-white/40" />
                  <span>{user.email}</span>
                  <span className="text-white/20">•</span>
                  <Calendar className="w-3.5 h-3.5 text-white/40" />
                  <span className="text-white/40">Lid sinds {new Date(user.createdAt).toLocaleDateString('nl-NL')}</span>
                </p>
              </div>
            </div>

            {/* Rechter Snelle Acties */}
            <div className="flex items-center gap-3 flex-wrap">
              <Button
                onClick={onShop}
                className="bg-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,40%)] text-[hsl(220,35%,6%)] font-semibold rounded-xl px-5 py-2.5 shadow-lg shadow-[hsl(142,76%,45%)]/20"
              >
                <Zap className="w-4 h-4 mr-2" />
                Nieuwe Boost Bestellen
              </Button>
              {user.accountType === 'customer' && (
                <Button
                  onClick={handleUpgradeToMember}
                  variant="outline"
                  className="border-[hsl(199,89%,48%)]/40 text-[hsl(199,89%,48%)] bg-[hsl(199,89%,48%)]/10 hover:bg-[hsl(199,89%,48%)]/20 rounded-xl"
                >
                  <Pickaxe className="w-4 h-4 mr-1.5" />
                  Word Lid & Verdien
                </Button>
              )}
            </div>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 mt-6 border-t border-white/10">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-white/40 text-xs uppercase tracking-wider font-mono">Bestellingen</span>
              <p className="text-xl font-bold text-white mt-0.5">
                {myOrders.length} <span className="text-xs font-normal text-white/50">({activeOrdersCount} actief)</span>
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-white/40 text-xs uppercase tracking-wider font-mono">Abonnementen</span>
              <p className="text-xl font-bold text-[hsl(199,89%,48%)] mt-0.5">
                {mySubscriptions.filter(s => s.status === 'active').length} <span className="text-xs font-normal text-white/50">actief</span>
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-white/40 text-xs uppercase tracking-wider font-mono">
                {user.accountType === 'member' ? 'Maandinkomsten' : 'Totaal Geïnvesteerd'}
              </span>
              <p className="text-xl font-bold text-[hsl(142,76%,45%)] mt-0.5">
                {user.accountType === 'member'
                  ? `€ ${memberProfile.estimatedMonthlyEarnings || 195},00`
                  : formatPrice(totalSpent, currency)}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-white/40 text-xs uppercase tracking-wider font-mono">Algoritme Status</span>
              <p className="text-xs font-medium text-emerald-400 mt-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                100% Organisch Drip-Feed
              </p>
            </div>
          </div>
        </Card>

        {/* Tabbed Navigatie Structuur */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10 p-1.5 rounded-2xl flex flex-wrap h-auto gap-1">
            <TabsTrigger
              value="overview"
              className="rounded-xl px-4 py-2.5 text-xs sm:text-sm data-[state=active]:bg-[hsl(142,76%,45%)] data-[state=active]:text-black font-medium transition-all"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Overzicht
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="rounded-xl px-4 py-2.5 text-xs sm:text-sm data-[state=active]:bg-[hsl(142,76%,45%)] data-[state=active]:text-black font-medium transition-all"
            >
              <Package className="w-4 h-4 mr-2" />
              Bestellingen & Tracking
              {myOrders.length > 0 && (
                <span className="ml-2 text-xs px-1.5 py-0.2 rounded-full bg-white/20">
                  {myOrders.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="subscriptions"
              className="rounded-xl px-4 py-2.5 text-xs sm:text-sm data-[state=active]:bg-[hsl(142,76%,45%)] data-[state=active]:text-black font-medium transition-all"
            >
              <Repeat className="w-4 h-4 mr-2" />
              Abonnementen
              {mySubscriptions.filter(s => s.status === 'active').length > 0 && (
                <span className="ml-2 text-xs px-1.5 py-0.2 rounded-full bg-white/20">
                  {mySubscriptions.filter(s => s.status === 'active').length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="mining"
              className="rounded-xl px-4 py-2.5 text-xs sm:text-sm data-[state=active]:bg-[hsl(142,76%,45%)] data-[state=active]:text-black font-medium transition-all"
            >
              <Pickaxe className="w-4 h-4 mr-2" />
              {user.accountType === 'member' ? 'Leden Mining & Node' : 'Lidmaatschap & Verdien'}
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="rounded-xl px-4 py-2.5 text-xs sm:text-sm data-[state=active]:bg-[hsl(142,76%,45%)] data-[state=active]:text-black font-medium transition-all"
            >
              <User className="w-4 h-4 mr-2" />
              Profiel & Facturatie
            </TabsTrigger>
            <TabsTrigger
              value="quantum-initium"
              className="rounded-xl px-4 py-2.5 text-xs sm:text-sm data-[state=active]:bg-[hsl(142,76%,45%)] data-[state=active]:text-black font-medium transition-all"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Quantum Initium
            </TabsTrigger>
            <TabsTrigger
              value="vvc"
              className="rounded-xl px-4 py-2.5 text-xs sm:text-sm data-[state=active]:bg-sky-500 data-[state=active]:text-black font-medium transition-all text-sky-400"
            >
              <Users className="w-4 h-4 mr-2" />
              Verdienende Vrienden Club
            </TabsTrigger>
            <TabsTrigger
              value="support"
              className="rounded-xl px-4 py-2.5 text-xs sm:text-sm data-[state=active]:bg-[hsl(142,76%,45%)] data-[state=active]:text-black font-medium transition-all"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Support & FAQ
            </TabsTrigger>
          </TabsList>

          {/* ========================================================= */}
          {/* TAB 1: OVERZICHT (DASHBOARD) */}
          {/* ========================================================= */}
          <TabsContent value="overview" className="space-y-6">
            {/* Welkomstbanner */}
            <Card className="p-6 bg-gradient-to-r from-emerald-500/10 via-cyan-500/5 to-transparent border-white/10 rounded-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[hsl(142,76%,45%)]" />
                    Welkom in je controlecentrum, {user.name}
                  </h3>
                  <p className="text-white/60 text-sm mt-1 max-w-2xl leading-relaxed">
                    Hier beheer je al je streaming boosts, live ordertracking, maandelijkse abonnementen en je hardware-koppeling binnen Quantum Initium.
                  </p>
                </div>
                <Button
                  onClick={onShop}
                  size="sm"
                  className="bg-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,40%)] text-black font-semibold rounded-full shrink-0"
                >
                  Direct Boosten
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </Card>

            {/* Recente Bestellingen Widget */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 bg-white/5 border-white/10 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-base font-semibold text-white flex items-center gap-2">
                      <Package className="w-4 h-4 text-[hsl(142,76%,45%)]" />
                      Meest recente bestellingen
                    </h4>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs text-[hsl(142,76%,45%)] hover:underline"
                    >
                      Alles bekijken ({myOrders.length})
                    </button>
                  </div>

                  {myOrders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="w-10 h-10 text-white/20 mx-auto mb-2" />
                      <p className="text-white/50 text-sm">Nog geen bestellingen geplaatst.</p>
                      <Button onClick={onShop} size="sm" variant="outline" className="mt-3 border-white/20 text-white">
                        Producten bekijken
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {myOrders.slice(0, 3).map((order) => {
                        const status = statusConfig[order.status] || statusConfig.pending;
                        const StatusIcon = status.icon;
                        return (
                          <div
                            key={order.id}
                            className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-white font-medium text-sm">{order.orderNumber}</span>
                                <Badge variant="outline" className={`text-[10px] py-0 px-1.5 ${status.badgeClass}`}>
                                  <StatusIcon className="w-2.5 h-2.5 mr-1" />
                                  {status.label}
                                </Badge>
                              </div>
                              <p className="text-white/40 text-xs mt-0.5">
                                {order.items.length} dienst(en) • {formatPrice(order.totalPrice, order.currency || currency)}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onTrack(order.trackingToken)}
                              className="text-xs text-white/70 hover:text-white"
                            >
                              <Search className="w-3.5 h-3.5 mr-1" />
                              Track
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
                  <span>Drip-feed bescherming: Actief</span>
                  <span>Realtime Firestore: Verbonden</span>
                </div>
              </Card>

              {/* Actieve Abonnementen Widget */}
              <Card className="p-6 bg-white/5 border-white/10 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-base font-semibold text-white flex items-center gap-2">
                      <Repeat className="w-4 h-4 text-[hsl(199,89%,48%)]" />
                      Doorlopende Boost Abonnementen
                    </h4>
                    <button
                      onClick={() => setActiveTab('subscriptions')}
                      className="text-xs text-[hsl(199,89%,48%)] hover:underline"
                    >
                      Beheren
                    </button>
                  </div>

                  {mySubscriptions.length === 0 ? (
                    <div className="text-center py-8">
                      <Repeat className="w-10 h-10 text-white/20 mx-auto mb-2" />
                      <p className="text-white/50 text-sm">Geen actief maandabonnement.</p>
                      <p className="text-white/30 text-xs mt-1 max-w-xs mx-auto">
                        Maandelijkse boosts houden streamingalgoritmes permanent opgewarmd.
                      </p>
                      <Button
                        onClick={() => setActiveTab('subscriptions')}
                        size="sm"
                        className="mt-3 bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,42%)] text-white"
                      >
                        Bekijk plannen
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {mySubscriptions.map((sub) => (
                        <div
                          key={sub.id}
                          className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium text-sm">{sub.planName}</span>
                              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-[10px]">
                                {sub.status === 'active' ? 'Actief' : 'Gepauzeerd'}
                              </Badge>
                            </div>
                            <p className="text-white/40 text-xs mt-0.5">
                              Volgende verlenging: {new Date(sub.nextBillingAt).toLocaleDateString('nl-NL')}
                            </p>
                          </div>
                          <span className="text-white font-semibold text-sm">
                            {formatPrice(sub.monthlyPrice, sub.currency)}/mnd
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-white/10 text-xs text-white/40">
                  Maandelijks opzegbaar via je account zonder verborgen kosten.
                </div>
              </Card>
            </div>

            {/* Snelle Boost Launcher */}
            <Card className="p-6 bg-white/5 border-white/10 rounded-2xl">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/60 mb-4 font-mono">
                Snelle Boost Launcher
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={onShop}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all text-left group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#1DB954]/20 flex items-center justify-center text-[#1DB954] mb-2 group-hover:scale-110 transition-transform">
                    <Zap className="w-4 h-4" />
                  </div>
                  <p className="text-white font-medium text-sm">Spotify Streams</p>
                  <p className="text-white/40 text-xs mt-0.5">Drip-feed & Premium</p>
                </button>

                <button
                  onClick={onShop}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-rose-500/50 hover:bg-rose-500/10 transition-all text-left group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#FA2D48]/20 flex items-center justify-center text-[#FA2D48] mb-2 group-hover:scale-110 transition-transform">
                    <Zap className="w-4 h-4" />
                  </div>
                  <p className="text-white font-medium text-sm">Apple Music</p>
                  <p className="text-white/40 text-xs mt-0.5">Plays & Followers</p>
                </button>

                <button
                  onClick={onShop}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/50 hover:bg-amber-500/10 transition-all text-left group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#FBBC05]/20 flex items-center justify-center text-[#FBBC05] mb-2 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <p className="text-white font-medium text-sm">Google Reviews</p>
                  <p className="text-white/40 text-xs mt-0.5">Echte profielen</p>
                </button>

                <button
                  onClick={onShop}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-teal-500/50 hover:bg-teal-500/10 transition-all text-left group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#00B67A]/20 flex items-center justify-center text-[#00B67A] mb-2 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <p className="text-white font-medium text-sm">Trustpilot</p>
                  <p className="text-white/40 text-xs mt-0.5">5-sterren reputatie</p>
                </button>
              </div>
            </Card>

            {/* Holding Kwaliteitswaarborg */}
            <Card className="p-5 bg-gradient-to-r from-white/5 via-white/5 to-[hsl(142,76%,45%)]/5 border-white/10 rounded-2xl flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-[hsl(142,76%,45%)] shrink-0" />
                <div>
                  <p className="text-white font-medium text-sm">Quantum Initium Kwaliteitsgarantie</p>
                  <p className="text-white/50 text-xs">
                    Geen bots, veilige drip-feed algoritmesimulaties en 100% retentiebescherming.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('ecosystem')}
                className="text-xs text-[hsl(142,76%,45%)] hover:underline flex items-center gap-1"
              >
                Lees meer over het ecosysteem
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </Card>
          </TabsContent>

          {/* ========================================================= */}
          {/* TAB 2: BESTELLINGEN & LIVE TRACKING */}
          {/* ========================================================= */}
          <TabsContent value="orders" className="space-y-6">
            <Card className="p-6 bg-white/5 border-white/10 rounded-2xl">
              {/* Header & Filter Controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-[hsl(142,76%,45%)]" />
                    Bestellingenbeheer ({myOrders.length})
                  </h3>
                  <p className="text-white/50 text-xs mt-0.5">
                    Volg de live voortgang van je streams en reviews via realtime tracking.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative">
                    <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Zoek op nr, token of platform..."
                      className="pl-9 h-9 text-xs bg-white/5 border-white/10 w-48 sm:w-60 text-white rounded-xl"
                    />
                  </div>
                  <Button
                    onClick={onShop}
                    size="sm"
                    className="h-9 bg-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,40%)] text-black font-semibold rounded-xl"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
                    Nieuwe Bestelling
                  </Button>
                </div>
              </div>

              {/* Status Tabs Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 mb-6">
                <button
                  onClick={() => setOrderFilter('all')}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    orderFilter === 'all'
                      ? 'bg-white/20 text-white'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Alle ({myOrders.length})
                </button>
                <button
                  onClick={() => setOrderFilter('processing')}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    orderFilter === 'processing'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  In behandeling ({myOrders.filter((o) => o.status === 'processing').length})
                </button>
                <button
                  onClick={() => setOrderFilter('delivered')}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    orderFilter === 'delivered'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Afgeleverd ({myOrders.filter((o) => o.status === 'delivered').length})
                </button>
                <button
                  onClick={() => setOrderFilter('pending')}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    orderFilter === 'pending'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  In afwachting ({myOrders.filter((o) => o.status === 'pending').length})
                </button>
              </div>

              {/* Bestellingen Lijst */}
              {displayedOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/60 font-medium">Geen bestellingen gevonden</p>
                  <p className="text-white/40 text-xs mt-1">
                    {searchQuery ? 'Geen resultaten voor je zoekopdracht.' : 'Je hebt nog geen bestellingen met dit filter.'}
                  </p>
                  {searchQuery && (
                    <Button
                      onClick={() => setSearchQuery('')}
                      variant="outline"
                      size="sm"
                      className="mt-4 border-white/20 text-white"
                    >
                      Filters wissen
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {displayedOrders.map((order) => {
                    const status = statusConfig[order.status] || statusConfig.pending;
                    const StatusIcon = status.icon;

                    return (
                      <div
                        key={order.id}
                        className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all space-y-4"
                      >
                        {/* Order Top Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="text-base font-bold text-white font-mono">{order.orderNumber}</span>
                              <Badge variant="outline" className={status.badgeClass}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {status.label}
                              </Badge>
                            </div>
                            <p className="text-white/40 text-xs mt-1">
                              Besteld op {new Date(order.createdAt).toLocaleDateString('nl-NL', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="text-lg font-bold text-white">
                              {formatPrice(order.totalPrice, order.currency || currency)}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => printReceipt(order)}
                              className="border-white/20 text-white/70 hover:text-white hover:bg-white/10 text-xs"
                              title="Factuur afdrukken / opslaan"
                            >
                              <Printer className="w-3.5 h-3.5 mr-1" />
                              Factuur
                            </Button>
                          </div>
                        </div>

                        {/* Order Items Breakdown */}
                        <div className="p-3.5 rounded-xl bg-black/30 border border-white/5 space-y-2">
                          <p className="text-xs uppercase font-mono text-white/40 mb-1">Geleverde diensten:</p>
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1 text-white/80">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-white">{item.platformName}</span>
                                <span className="text-white/40">—</span>
                                <span>{item.quantity.toLocaleString('nl-NL')} {item.typeName || (item.category === 'streams' ? 'Streams' : 'Reviews')}</span>
                                {item.quality && (
                                  <Badge className="bg-white/10 text-[10px] py-0 px-1 border-none text-white/60">
                                    {item.quality}
                                  </Badge>
                                )}
                              </div>
                              {item.targetUrl && (
                                <a
                                  href={item.targetUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[hsl(199,89%,48%)] hover:underline flex items-center gap-1 text-[11px] truncate max-w-xs"
                                >
                                  {item.targetUrl.replace(/^https?:\/\//, '')}
                                  <ExternalLink className="w-3 h-3 shrink-0" />
                                </a>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Voortgangsbalk */}
                        <div>
                          <div className="flex justify-between items-center text-xs text-white/60 mb-1.5">
                            <span>Drip-feed Algoritme Levering</span>
                            <span className="font-semibold text-white">{order.deliveryProgress}% voltooid</span>
                          </div>
                          <Progress value={order.deliveryProgress} className="h-2" />
                        </div>

                        {/* Acties & Tracking Token Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                          <div className="flex items-center gap-2 text-xs text-white/50">
                            <span>Tracking Token:</span>
                            <code className="text-[hsl(142,76%,45%)] font-mono bg-white/5 px-2 py-0.5 rounded border border-white/10">
                              {order.trackingToken}
                            </code>
                            <button
                              onClick={() => copyToken(order.trackingToken)}
                              className="text-white/50 hover:text-white p-1"
                              title="Kopieer token"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReorder(order)}
                              className="border-white/20 text-white hover:bg-white/10 text-xs"
                            >
                              <RefreshCw className="w-3.5 h-3.5 mr-1" />
                              Opnieuw Bestellen
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => onTrack(order.trackingToken)}
                              className="bg-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,40%)] text-black font-semibold text-xs rounded-lg"
                            >
                              <Search className="w-3.5 h-3.5 mr-1" />
                              Live Tracking Openen
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* ========================================================= */}
          {/* TAB 3: ABONNEMENTEN & DRIP-FEED */}
          {/* ========================================================= */}
          <TabsContent value="subscriptions" className="space-y-6">
            <Card className="p-6 bg-white/5 border-white/10 rounded-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Repeat className="w-5 h-5 text-[hsl(199,89%,48%)]" />
                    Maandelijkse Algoritme Abonnementen
                  </h3>
                  <p className="text-white/50 text-xs mt-0.5">
                    Continue maandelijkse voeding van streaming-algoritmes zorgt voor stabiele plaatsing in Release Radar & Discover Weekly.
                  </p>
                </div>
                <Button
                  onClick={onShop}
                  size="sm"
                  className="bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,42%)] text-white font-semibold rounded-xl"
                >
                  <Zap className="w-3.5 h-3.5 mr-1.5" />
                  Nieuw Abonnement
                </Button>
              </div>

              {mySubscriptions.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center mb-6">
                  <Repeat className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <h4 className="text-base font-semibold text-white">Geen actief abonnement</h4>
                  <p className="text-white/50 text-sm max-w-md mx-auto mt-1 mb-6 leading-relaxed">
                    Eenmalige pieken in streams vallen snel stil. Met een doorlopend BoostPlug abonnement leveren we elke dag een natuurlijke drip-feed stroom om algoritmes warm te houden.
                  </p>
                  <Button
                    onClick={onShop}
                    className="bg-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,40%)] text-black font-semibold rounded-full px-6"
                  >
                    Bekijk Maandplannen
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 mb-8">
                  {mySubscriptions.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="text-lg font-bold text-white">{sub.planName} Plan</h4>
                          <Badge
                            className={
                              sub.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                : 'bg-white/10 text-white/50 border-white/20'
                            }
                          >
                            {sub.status === 'active' ? 'Actief & Leverend' : 'Opgezegd'}
                          </Badge>
                        </div>
                        <p className="text-white/50 text-xs mt-1">
                          Gestart op {new Date(sub.startedAt).toLocaleDateString('nl-NL')} • Volgende factuurcyclus:{' '}
                          <strong className="text-white">{new Date(sub.nextBillingAt).toLocaleDateString('nl-NL')}</strong>
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-white/60">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(142,76%,45%)]" />
                          <span>Dagelijkse drip-feed • Algoritme optimalisatie • Maandelijks opzegbaar</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-2xl font-bold text-white">
                            {formatPrice(sub.monthlyPrice, sub.currency)}
                          </span>
                          <span className="text-white/40 text-xs block">/maand</span>
                        </div>

                        {sub.status === 'active' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              cancelSubscription(sub.id);
                              toast.success(`Abonnement ${sub.planName} succesvol opgezegd`);
                            }}
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs"
                          >
                            Opzeggen
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Waarom een abonnement? Info Grid */}
              <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <Clock className="w-5 h-5 text-[hsl(142,76%,45%)] mb-2" />
                  <p className="text-white font-medium text-sm">Gegarandeerde Drip-Feed</p>
                  <p className="text-white/40 text-xs mt-1">
                    Streams worden over de dag gespreid voor een organisch en veilig patroon.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <TrendingUp className="w-5 h-5 text-[hsl(199,89%,48%)] mb-2" />
                  <p className="text-white font-medium text-sm">Release Radar Trigger</p>
                  <p className="text-white/40 text-xs mt-1">
                    Houdt Spotify en Apple Music getriggerd zodat je vaker in officiële playlists komt.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 mb-2" />
                  <p className="text-white font-medium text-sm">Altijd Opzegbaar</p>
                  <p className="text-white/40 text-xs mt-1">
                    Geen wurgcontracten. Met één klik stop te zetten in je account.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* ========================================================= */}
          {/* TAB 4: LEDEN MINING & HARDWARE NODES */}
          {/* ========================================================= */}
          <TabsContent value="mining" className="space-y-6">
            {user.accountType === 'member' ? (
              <div className="space-y-6">
                {/* Node Dashboard Hero */}
                <Card className="p-6 bg-gradient-to-br from-[hsl(199,89%,48%)]/15 via-white/5 to-transparent border-[hsl(199,89%,48%)]/30 rounded-2xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <Cpu className="w-6 h-6 text-[hsl(199,89%,48%)]" />
                        <h3 className="text-xl font-bold text-white">Mijn Mining Node Status</h3>
                      </div>
                      <p className="text-white/60 text-xs mt-1">
                        Jouw node levert residentiële achtergrondcapaciteit aan het BoostPlug distributienetwerk.
                      </p>
                    </div>

                    <Badge
                      className={
                        memberProfile.softwareConfig?.status === 'mining_active'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      }
                    >
                      <span className="w-2 h-2 rounded-full bg-current mr-1.5 animate-pulse" />
                      {memberProfile.softwareConfig?.status === 'mining_active'
                        ? 'Node Online & Verdienend'
                        : 'Onboarding In Progress'}
                    </Badge>
                  </div>

                  {/* Telemetrie Kaarten */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                      <span className="text-white/40 text-xs uppercase font-mono">Verwachte Maandopbrengst</span>
                      <p className="text-lg font-bold text-[hsl(142,76%,45%)] mt-0.5">
                        € {memberProfile.estimatedMonthlyEarnings || 195},00
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                      <span className="text-white/40 text-xs uppercase font-mono">Geleverde Snelheid</span>
                      <p className="text-lg font-bold text-white mt-0.5">
                        {memberProfile.softwareConfig?.hashRateOrStreamsPerHour || 140} streams/u
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                      <span className="text-white/40 text-xs uppercase font-mono">Regio IP-Pool</span>
                      <p className="text-lg font-bold text-white mt-0.5">
                        {memberProfile.softwareConfig?.ipPoolRegion || 'eu-west-1'}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                      <span className="text-white/40 text-xs uppercase font-mono">Grover Hardware</span>
                      <p className="text-lg font-bold text-white mt-0.5 capitalize">
                        {memberProfile.groverData?.deviceType?.replace(/_/g, ' ') || 'Mac mini M2'}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Uitbetalingsgegevens IBAN */}
                <Card className="p-6 bg-white/5 border-white/10 rounded-2xl">
                  <h4 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[hsl(142,76%,45%)]" />
                    Uitbetalingen & Bankrekening
                  </h4>
                  <p className="text-white/50 text-xs mb-4">
                    Verdiensten worden maandelijks rond de 1e van de maand automatisch overgemaakt naar jouw SEPA bankrekening.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white/70 text-xs">IBAN Rekeningnummer</Label>
                      <Input
                        value={ibanPayout}
                        onChange={(e) => setIbanPayout(e.target.value)}
                        placeholder="NL91 ABNA 0417 1234 56"
                        className="bg-white/5 border-white/10 text-white mt-1 h-9 font-mono"
                      />
                    </div>
                    <div>
                      <Label className="text-white/70 text-xs">Tenaamstelling rekening</Label>
                      <Input
                        value={ibanHolder}
                        onChange={(e) => setIbanHolder(e.target.value)}
                        placeholder="bijv. J. Drenthe"
                        className="bg-white/5 border-white/10 text-white mt-1 h-9"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleSaveProfile}
                    size="sm"
                    className="mt-4 bg-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,40%)] text-black font-semibold text-xs rounded-lg"
                  >
                    IBAN Gegevens Opslaan
                  </Button>
                </Card>

                {/* Volledige Onboarding Flow */}
                <Card className="p-6 bg-white/5 border-white/10 rounded-2xl">
                  <div className="mb-6">
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Pickaxe className="w-5 h-5 text-[hsl(199,89%,48%)]" />
                      7-Stappen Onboarding & Configuratie Checklist
                    </h4>
                    <p className="text-white/50 text-xs mt-1">
                      Volg deze checklist om je Grover hardware te leasen, de daemon te installeren en je IP-node te activeren.
                    </p>
                  </div>
                  <MiningOnboardingFlow onFinish={() => toast.success('Mining configuratie bijgewerkt!')} />
                </Card>
              </div>
            ) : (
              /* Klant upgrade showcase naar Member */
              <Card className="p-8 bg-gradient-to-br from-[hsl(199,89%,48%)]/10 via-white/5 to-[hsl(142,76%,45%)]/10 border-[hsl(199,89%,48%)]/30 rounded-3xl text-center">
                <Pickaxe className="w-16 h-16 text-[hsl(199,89%,48%)] mx-auto mb-4" />
                <Badge className="bg-[hsl(199,89%,48%)]/20 text-[hsl(199,89%,48%)] border-[hsl(199,89%,48%)]/40 mb-3 px-3 py-1">
                  Verdienende Vrienden Club • Node Mining
                </Badge>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Word BoostPlug Lid & Zet Hardware In
                </h3>
                <p className="text-white/60 text-sm max-w-xl mx-auto mb-6 leading-relaxed">
                  BoostPlug heeft twee kanten: klanten bestellen boosts, en leden maken de levering mogelijk door met residentiële hardware nodes het netwerk te draaien. Als lid verdien je maandelijks mee aan campagnes voor klanten en labels zoals Zheavenzy.
                </p>

                <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8 text-left">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-xs text-[hsl(142,76%,45%)] font-mono font-bold">STAP 1</span>
                    <p className="text-white font-semibold text-sm mt-1">Lease via Grover</p>
                    <p className="text-white/40 text-xs mt-1">Mac mini M2/M4 met kortingscode QUANTUMBOOST20.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-xs text-[hsl(199,89%,48%)] font-mono font-bold">STAP 2</span>
                    <p className="text-white font-semibold text-sm mt-1">Installeer Daemon</p>
                    <p className="text-white/40 text-xs mt-1">Koppel de achtergrondsoftware veilig aan je IP-pool.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-xs text-amber-400 font-mono font-bold">STAP 3</span>
                    <p className="text-white font-semibold text-sm mt-1">Ontvang Uitkering</p>
                    <p className="text-white/40 text-xs mt-1">Verdien €150 - €400+ per actieve node per maand.</p>
                  </div>
                </div>

                <Button
                  onClick={handleUpgradeToMember}
                  size="lg"
                  className="bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,42%)] text-white font-semibold rounded-full px-8 py-6 text-base shadow-xl shadow-[hsl(199,89%,48%)]/20 cursor-pointer"
                >
                  <Pickaxe className="w-5 h-5 mr-2" />
                  Activeer Direct Mijn Lidaccount
                </Button>
              </Card>
            )}
          </TabsContent>

          {/* ========================================================= */}
          {/* TAB 5: PROFIEL, FACTURATIE & BEVEILIGING */}
          {/* ========================================================= */}
          <TabsContent value="profile" className="space-y-6">
            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Persoonlijke Gegevens */}
              <Card className="p-6 bg-white/5 border-white/10 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                  <User className="w-5 h-5 text-[hsl(142,76%,45%)]" />
                  Persoonlijke Gegevens
                </h3>
                <p className="text-white/50 text-xs mb-6">
                  Beheer je contactgegevens voor bestelbevestigingen en communicatie.
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/70 text-xs">Volledige Naam</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-white/5 border-white/10 text-white mt-1 h-9 rounded-xl"
                      placeholder="bijv. Jamal Drenthe"
                    />
                  </div>
                  <div>
                    <Label className="text-white/70 text-xs">E-mailadres (Gekoppeld account)</Label>
                    <Input
                      value={user.email}
                      disabled
                      className="bg-white/5 border-white/10 text-white/50 mt-1 h-9 rounded-xl cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <Label className="text-white/70 text-xs">Telefoonnummer (Optioneel voor WhatsApp alerts)</Label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-white/5 border-white/10 text-white mt-1 h-9 rounded-xl"
                      placeholder="+31 6 12345678"
                    />
                  </div>
                  <div>
                    <Label className="text-white/70 text-xs">Artiestennaam of Bedrijfsnaam</Label>
                    <Input
                      value={companyOrArtist}
                      onChange={(e) => setCompanyOrArtist(e.target.value)}
                      className="bg-white/5 border-white/10 text-white mt-1 h-9 rounded-xl"
                      placeholder="bijv. Zheavenzy Music / Quantum Holding"
                    />
                  </div>
                </div>
              </Card>

              {/* Facturatie & Zakelijke Informatie */}
              <Card className="p-6 bg-white/5 border-white/10 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[hsl(199,89%,48%)]" />
                  Factuuradres & Zakelijke Gegevens
                </h3>
                <p className="text-white/50 text-xs mb-6">
                  Deze gegevens worden automatisch vermeld op je downloadbare PDF-facturen en aankoopbewijzen.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="text-white/70 text-xs">KvK of BTW-nummer (voor ondernemers)</Label>
                    <Input
                      value={kvkOrVat}
                      onChange={(e) => setKvkOrVat(e.target.value)}
                      className="bg-white/5 border-white/10 text-white mt-1 h-9 rounded-xl"
                      placeholder="bijv. NL123456789B01 / KvK 8829102"
                    />
                  </div>
                  <div>
                    <Label className="text-white/70 text-xs">Straat & Huisnummer</Label>
                    <Input
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="bg-white/5 border-white/10 text-white mt-1 h-9 rounded-xl"
                      placeholder="bijv. Keizersgracht 123"
                    />
                  </div>
                  <div>
                    <Label className="text-white/70 text-xs">Postcode</Label>
                    <Input
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="bg-white/5 border-white/10 text-white mt-1 h-9 rounded-xl"
                      placeholder="1015 CJ"
                    />
                  </div>
                  <div>
                    <Label className="text-white/70 text-xs">Woonplaats</Label>
                    <Input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="bg-white/5 border-white/10 text-white mt-1 h-9 rounded-xl"
                      placeholder="Amsterdam"
                    />
                  </div>
                  <div>
                    <Label className="text-white/70 text-xs">Land</Label>
                    <Input
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="bg-white/5 border-white/10 text-white mt-1 h-9 rounded-xl"
                      placeholder="Nederland"
                    />
                  </div>
                </div>
              </Card>

              {/* Voorkeuren & Notificaties */}
              <Card className="p-6 bg-white/5 border-white/10 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-amber-400" />
                  Voorkeuren & Notificaties
                </h3>
                <p className="text-white/50 text-xs mb-6">
                  Stel je gewenste valuta en statusmeldingen in.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                    <div>
                      <p className="text-white font-medium text-sm">Standaard Valuta</p>
                      <p className="text-white/40 text-xs">Kies tussen Euro en Britse Pond</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={currency === 'EUR' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrency('EUR')}
                        className={currency === 'EUR' ? 'bg-[hsl(142,76%,45%)] text-black font-semibold' : 'border-white/20 text-white'}
                      >
                        € EUR
                      </Button>
                      <Button
                        type="button"
                        variant={currency === 'GBP' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrency('GBP')}
                        className={currency === 'GBP' ? 'bg-[hsl(142,76%,45%)] text-black font-semibold' : 'border-white/20 text-white'}
                      >
                        £ GBP
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                    <div>
                      <p className="text-white font-medium text-sm">E-mailnotificaties over leveringsmijlpalen</p>
                      <p className="text-white/40 text-xs">Ontvang updates bij 25%, 50% en 100% voltooide levering.</p>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                </div>
              </Card>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="lg"
                  className="bg-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,40%)] text-black font-semibold rounded-full px-8 shadow-lg shadow-[hsl(142,76%,45%)]/20"
                >
                  Wijzigingen Opslaan
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* ========================================================= */}
          {/* TAB 6: QUANTUM INITIUM */}
          {/* ========================================================= */}
          <TabsContent value="quantum-initium" className="space-y-6">
            <Card className="p-6 bg-white/5 border-white/10 rounded-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[hsl(142,76%,45%)]/20 flex items-center justify-center shrink-0">
                    <Building2 className="w-6 h-6 text-[hsl(142,76%,45%)]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-white">Quantum Initium</h3>
                      <Badge className="bg-[hsl(142,76%,45%)]/20 text-[hsl(142,76%,45%)] border-[hsl(142,76%,45%)]/30 text-[10px]">
                        Multi-Venture Ecosysteem
                      </Badge>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed max-w-2xl">
                      BoostPlug opereert als distributieplatform binnen{' '}
                      <strong className="text-white">Quantum Initium</strong>, in directe samenwerking met zusterondernemingen voor muziekdistributie (Zheavenzy), residentiële account-infrastructuur (Logs.rent) en hardware nodes (VVC).
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    if (onQuantumInitium) onQuantumInitium();
                    else window.location.hash = '#/quantum-initium';
                  }}
                  className="bg-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,40%)] text-black font-semibold rounded-full shrink-0 shadow-lg shadow-[hsl(142,76%,45%)]/20"
                >
                  Bekijk Quantum Initium Hub
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              {/* Partners Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-bold text-sm">Zheavenzy</span>
                      <ExternalLink className="w-4 h-4 text-[hsl(142,76%,45%)]" />
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed">
                      Muziek- en artiestenplatform op zheavenzy.one. BoostPlug verzorgt gerichte streamingdistributie voor hun artiestenrooster.
                    </p>
                  </div>
                  <a
                    href="https://zheavenzy.one"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[hsl(142,76%,45%)] hover:underline mt-4 block"
                  >
                    Bezoek zheavenzy.one &rarr;
                  </a>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-bold text-sm">Logs.rent</span>
                      <ExternalLink className="w-4 h-4 text-[hsl(199,89%,48%)]" />
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed">
                      Leverancier van geverifieerde accounts en residentiële IP-pools voor veilige drip-feed streaming en reviewplaatsing.
                    </p>
                  </div>
                  <a
                    href="https://logs.rent"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[hsl(199,89%,48%)] hover:underline mt-4 block"
                  >
                    Bezoek logs.rent &rarr;
                  </a>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-bold text-sm">VVC via Spontiva</span>
                      <Badge className="bg-amber-500/20 text-amber-400 text-[10px]">Ledenvoordeel</Badge>
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed">
                      Leden van de Verdienende Vrienden Club ontvangen via Spontiva speciale tarieven en exclusieve voordelen op alle BoostPlug diensten.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (onVVC) onVVC();
                      else window.location.hash = '#/vvc';
                    }}
                    className="text-xs text-sky-400 hover:underline mt-4 text-left block"
                  >
                    Ontdek VVC &rarr;
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-bold text-sm">Investbotiq</span>
                      <span className="text-xs text-white/40 font-mono">Fintech</span>
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed">
                      Geautomatiseerde kwantitatieve analyses en holding-technologie voor stabiele en schaalbare bedrijfsvoering.
                    </p>
                  </div>
                  <span className="text-xs text-white/30 mt-4 block">Quantum Initium Portfolio</span>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-bold text-sm">WoningVry</span>
                      <span className="text-xs text-white/40 font-mono">Real Estate</span>
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed">
                      Vastgoedplatform en innovatieve woonoplossingen binnen het holding-ecosysteem.
                    </p>
                  </div>
                  <span className="text-xs text-white/30 mt-4 block">Quantum Initium Portfolio</span>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-bold text-sm">Xabi World</span>
                      <span className="text-xs text-white/40 font-mono">Creative Media</span>
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed">
                      Internationale media- en cultuurproducties versterkt door het BoostPlug distributienetwerk.
                    </p>
                  </div>
                  <span className="text-xs text-white/30 mt-4 block">Quantum Initium Portfolio</span>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* ========================================================= */}
          {/* TAB 7: VERDIENENDE VRIENDEN CLUB (VVC) */}
          {/* ========================================================= */}
          <TabsContent value="vvc" className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-sky-500/10 via-white/5 to-transparent border-sky-500/20 rounded-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/20 flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-sky-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-white">Verdienende Vrienden Club (VVC)</h3>
                      <Badge className="bg-sky-500/20 text-sky-300 border-sky-500/30 text-[10px]">
                        Besloten Community
                      </Badge>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed max-w-2xl">
                      De besloten community binnen Quantum Initium voor node-operators en partners. Genereer een maandelijks rendement door residentiële streaming-nodes te draaien en profiteer van netwerkvoordelen.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    if (onVVC) onVVC();
                    else window.location.hash = '#/vvc';
                  }}
                  className="bg-sky-400 hover:bg-sky-300 text-black font-semibold rounded-full shrink-0 shadow-lg shadow-sky-500/20"
                >
                  Bekijk Volledige VVC Pagina
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              {/* VVC Highlights Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-bold text-sm">Grover Hardware Lease</span>
                      <Badge className="bg-emerald-500/20 text-emerald-300 text-[10px]">20% Korting</Badge>
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed mb-3">
                      Huur kant-en-klare Apple Silicon Mac Minis of laptops via Grover. VVC-leden ontvangen 20% korting op de eerste maand.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[11px] text-white/40">Kortingscode:</span>
                    <code className="text-xs font-mono bg-black/40 px-2 py-0.5 rounded text-sky-300 border border-sky-500/20">
                      QUANTUMBOOST20
                    </code>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-bold text-sm">SEPA Uitbetalingen</span>
                      <span className="text-xs text-sky-400 font-mono">1e vd maand</span>
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed">
                      Verdien €150 tot €400 per maand per actieve node. Automatisch en foutloos overgemaakt naar je geregistreerde IBAN.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-white/5 text-[11px] text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 100% Legale achtergrondsoftware
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-bold text-sm">Spontiva & Netwerk Voordelen</span>
                      <Badge className="bg-purple-500/20 text-purple-300 text-[10px]">Clubtarieven</Badge>
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed">
                      Toegang tot besloten meetups, Spontiva hospitality packages en holding masterclasses over fintech en algoritmes.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-white/5 text-[11px] text-white/40">
                    Synergie met Zheavenzy & Logs.rent
                  </div>
                </div>
              </div>

              {/* Bottom Quick Action Box */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-sky-500/10 border border-sky-500/20 gap-3">
                <div className="text-xs text-sky-200 text-center sm:text-left">
                  Actief lid worden of extra nodes toevoegen aan je hardware cluster?
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    onClick={() => setActiveTab('mining')}
                    variant="outline"
                    className="border-sky-500/30 text-sky-300 hover:bg-sky-500/20"
                  >
                    Node Dashboard
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      if (onVVC) onVVC();
                      else window.location.hash = '#/vvc';
                    }}
                    className="bg-sky-400 hover:bg-sky-300 text-black font-semibold"
                  >
                    Alles over VVC
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* ========================================================= */}
          {/* TAB 7: SUPPORT, HULP & FAQ */}
          {/* ========================================================= */}
          <TabsContent value="support" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Direct Contact Formulier */}
              <Card className="p-6 bg-white/5 border-white/10 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Mail className="w-5 h-5 text-[hsl(142,76%,45%)]" />
                    Klantenservice Ticket
                  </h3>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-[10px]">
                    Reactietijd &lt; 2 uur
                  </Badge>
                </div>
                <p className="text-white/50 text-xs mb-6">
                  Vragen over een bestelling, factuur of lidmaatschap? Ons supportteam staat 24/7 klaar.
                </p>

                {isSupportSent && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Je e-mailclient is geopend met je ticket. Ons team antwoordt z.s.m. via support@boostplug.one.</span>
                  </div>
                )}

                <form onSubmit={handleSendSupport} className="space-y-4">
                  <div>
                    <Label className="text-white/70 text-xs">Onderwerp</Label>
                    <select
                      value={supportSubject}
                      onChange={(e) => setSupportSubject(e.target.value)}
                      className="w-full mt-1 h-9 rounded-xl bg-[#0f172a] border border-white/10 text-white text-xs px-3 focus:outline-none focus:border-[hsl(142,76%,45%)]"
                    >
                      <option value="Bestelling & Voortgang">Bestelling & Leveringsvoortgang</option>
                      <option value="Factuur & Betaling">Factuur of Betaling</option>
                      <option value="Abonnement Wijzigen">Abonnement Wijzigen of Pauzeren</option>
                      <option value="Lid Mining Vraag">Lidmaatschap & Mining Hardware</option>
                      <option value="Algemene Vraag">Overige Vraag</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-white/70 text-xs">Jouw Bericht</Label>
                    <textarea
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      rows={5}
                      placeholder="Beschrijf je vraag of bestelnummer..."
                      className="w-full mt-1 rounded-xl bg-[#0f172a] border border-white/10 text-white text-xs p-3 focus:outline-none focus:border-[hsl(142,76%,45%)]"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,40%)] text-black font-semibold rounded-xl text-xs"
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    Verstuur naar support@boostplug.one
                  </Button>
                </form>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
                  <span>Directe e-mail: support@boostplug.one</span>
                  <span>SSL Beveiligd</span>
                </div>
              </Card>

              {/* Veelgestelde Vragen (FAQ) Accordion */}
              <Card className="p-6 bg-white/5 border-white/10 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[hsl(199,89%,48%)]" />
                  Veelgestelde Vragen
                </h3>

                <Accordion type="single" collapsible className="w-full space-y-2">
                  <AccordionItem value="faq-1" className="border-white/10">
                    <AccordionTrigger className="text-white hover:text-[hsl(142,76%,45%)] text-left text-xs py-3">
                      Hoe snel start mijn bestelling na betaling?
                    </AccordionTrigger>
                    <AccordionContent className="text-white/60 text-xs leading-relaxed">
                      Bestellingen worden binnen 15 tot 60 minuten geactiveerd in ons geautomatiseerde netwerk. De voortgang is direct live te volgen in het tabblad 'Bestellingen & Tracking'.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faq-2" className="border-white/10">
                    <AccordionTrigger className="text-white hover:text-[hsl(142,76%,45%)] text-left text-xs py-3">
                      Wat houdt de 'drip-feed' methode in?
                    </AccordionTrigger>
                    <AccordionContent className="text-white/60 text-xs leading-relaxed">
                      In plaats van 50.000 streams in 1 minuut te dumpen (wat algoritmes triggert en streams laat wegvallen), leveren wij gelijkmatig verspreid over meerdere dagen via echte IP-adressen. Zo detecteren Spotify en Apple Music een natuurlijke virale groei.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faq-3" className="border-white/10">
                    <AccordionTrigger className="text-white hover:text-[hsl(142,76%,45%)] text-left text-xs py-3">
                      Kan ik een officiële factuur met BTW downloaden?
                    </AccordionTrigger>
                    <AccordionContent className="text-white/60 text-xs leading-relaxed">
                      Ja! Bij elke bestelling in het tabblad 'Bestellingen' kun je direct op de knop 'Factuur' klikken om een printklare PDF factuur met BTW-specificatie en KvK/holding gegevens te downloaden.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faq-4" className="border-white/10">
                    <AccordionTrigger className="text-white hover:text-[hsl(142,76%,45%)] text-left text-xs py-3">
                      Hoe word ik lid en wat kan ik verdienen met mining?
                    </AccordionTrigger>
                    <AccordionContent className="text-white/60 text-xs leading-relaxed">
                      Leden leasen een energiezuinige Mac mini via Grover met onze partnerkorting en draaien onze achtergrondsoftware. De maandelijkse vergoeding ligt gemiddeld tussen de €150 en €400 per actieve node en wordt rond de 1e van de maand uitgekeerd.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faq-5" className="border-white/10">
                    <AccordionTrigger className="text-white hover:text-[hsl(142,76%,45%)] text-left text-xs py-3">
                      Hoe zeg ik een maandelijks abonnement op?
                    </AccordionTrigger>
                    <AccordionContent className="text-white/60 text-xs leading-relaxed">
                      Ga naar het tabblad 'Abonnementen' en klik op 'Opzeggen'. Je abonnement loopt netjes door tot de reeds betaalde einddatum en wordt daarna nooit meer automatisch verlengd.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
