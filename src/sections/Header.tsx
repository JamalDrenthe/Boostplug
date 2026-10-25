import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/hooks/useStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Globe, 
  Menu, 
  X,
  Search,
  Package,
  Zap,
  User,
  LogIn,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  Pickaxe,
  Users,
  ChevronDown,
  Layers,
  Briefcase,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BoostPlugLogo } from '@/components/common/BoostPlugLogo';

interface HeaderProps {
  onCheckout: () => void;
  onTracking: () => void;
  onAccount: () => void;
  onHome: () => void;
  onAbout: () => void;
  onAdmin?: () => void;
  onIntegrations?: () => void;
  onQuantumInitium?: () => void;
  onVVC?: () => void;
  onVacancies?: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export function Header({
  onCheckout,
  onTracking,
  onAccount,
  onHome,
  onAbout,
  onAdmin,
  onIntegrations,
  onQuantumInitium,
  onVVC,
  onVacancies,
  onNavigateSection,
}: HeaderProps) {
  const handleGoIntegrations = onIntegrations || onQuantumInitium || onVVC;
  const { cart, currency, setCurrency, locale, setLocale, user, isDemoUser, loginAsDemo } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 30);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleSectionClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    if (onNavigateSection) {
      onNavigateSection(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const cartItemCount = cart.length;
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const currencySymbol = currency === 'EUR' ? '€' : '£';

  return (
    <motion.header 
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#090B0F]/90 backdrop-blur-2xl border-b border-[#E5C583]/20 shadow-[0_12px_40px_rgba(0,0,0,0.7)]' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#" onClick={(e) => { e.preventDefault(); onHome(); }} className="flex items-center group">
            <BoostPlugLogo size="md" />
          </a>

          {/* Desktop Navigation */}
          {/* Desktop Navigation with Smart Dropdowns */}
          <nav className="hidden lg:flex items-center gap-3.5 xl:gap-5">
            <button 
              onClick={(e) => handleSectionClick(e, 'products')} 
              className="text-sm text-white/70 hover:text-white transition-colors cursor-pointer py-1 font-medium"
            >
              Producten
            </button>
            <button 
              onClick={(e) => handleSectionClick(e, 'abonnementen')} 
              className="text-sm text-white/70 hover:text-white transition-colors cursor-pointer py-1 font-medium"
            >
              Abonnementen
            </button>
            <a 
              href="#/leden" 
              className="text-sm text-[hsl(142,76%,45%)]/90 hover:text-[hsl(142,76%,45%)] transition-colors cursor-pointer py-1 font-medium"
            >
              Voor leden
            </a>

            {/* Integraties Dropdown (Quantum Initium & VVC) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  onClick={() => {
                    if (handleGoIntegrations) handleGoIntegrations();
                    else window.location.hash = '#/integraties';
                  }}
                  className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors cursor-pointer py-1 font-medium group"
                >
                  <Layers className="w-3.5 h-3.5 text-[hsl(142,76%,45%)]" />
                  <span>Integraties</span>
                  <ChevronDown className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-transform duration-200" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-[#0D1117]/95 backdrop-blur-2xl border border-[#E5C583]/25 w-72 p-2 rounded-2xl shadow-2xl text-white">
                <div className="px-2.5 py-1.5 border-b border-white/10 mb-1">
                  <p className="text-[10px] font-semibold text-[#E5C583] uppercase tracking-wider font-serif">Quantum Initium Ecosysteem</p>
                </div>
                <DropdownMenuItem
                  onClick={() => {
                    if (handleGoIntegrations) handleGoIntegrations();
                    else window.location.hash = '#/integraties';
                  }}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/10 cursor-pointer focus:bg-white/10"
                >
                  <div className="w-8 h-8 rounded-lg bg-[hsl(142,76%,45%)]/20 text-[hsl(142,76%,45%)] flex items-center justify-center shrink-0 mt-0.5">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs text-white">Integraties Hub</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[hsl(142,76%,45%)]/20 text-[hsl(142,76%,45%)]">10 modules</span>
                    </div>
                    <p className="text-[11px] text-white/50 mt-0.5 leading-snug">Het complete netwerk activeren</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    if (handleGoIntegrations) handleGoIntegrations();
                    else window.location.hash = '#/integraties#vvc';
                  }}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-sky-500/10 cursor-pointer focus:bg-sky-500/10"
                >
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs text-sky-300">Verdienende Vrienden Club</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-400">VVC</span>
                    </div>
                    <p className="text-[11px] text-white/50 mt-0.5 leading-snug">Hardware verdienmodel • €150-€400/mnd</p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Info / Meer Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors cursor-pointer py-1 font-medium group">
                  <span>Info</span>
                  <ChevronDown className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-transform duration-200" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-[#0D1117]/95 backdrop-blur-2xl border border-[#E5C583]/25 w-64 p-2 rounded-2xl shadow-2xl text-white">
                <div className="px-2.5 py-1.5 border-b border-white/10 mb-1">
                  <p className="text-[10px] font-semibold text-[#E5C583] uppercase tracking-wider font-serif">Ondersteuning & Overzicht</p>
                </div>
                <DropdownMenuItem
                  onClick={onTracking}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/10 cursor-pointer focus:bg-white/10"
                >
                  <div className="w-8 h-8 rounded-lg bg-[hsl(199,89%,48%)]/20 text-[hsl(199,89%,48%)] flex items-center justify-center shrink-0 mt-0.5">
                    <Search className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-xs text-white">Track bestelling</span>
                    <p className="text-[11px] text-white/50 mt-0.5 leading-snug">Live status van streams & reviews</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => handleSectionClick(e, 'how-it-works')}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/10 cursor-pointer focus:bg-white/10"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-xs text-white">Hoe het werkt</span>
                    <p className="text-[11px] text-white/50 mt-0.5 leading-snug">Drip-feed & veilige werking</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onAbout}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/10 cursor-pointer focus:bg-white/10"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-xs text-white">Over ons</span>
                    <p className="text-[11px] text-white/50 mt-0.5 leading-snug">Missie, holding en kwaliteitsgarantie</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    if (onVacancies) onVacancies();
                    else window.location.hash = '#/vacatures';
                  }}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#E5C583]/10 cursor-pointer focus:bg-[#E5C583]/10"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#E5C583]/20 text-[#E5C583] flex items-center justify-center shrink-0 mt-0.5">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs text-white">Carrières & Vacatures</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#E5C583]/20 text-[#E5C583] font-mono">Djobba</span>
                    </div>
                    <p className="text-[11px] text-white/50 mt-0.5 leading-snug">Werken bij BoostPlug & Quantum Initium</p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {(user?.accountType === 'admin' || (user?.email && ['info@boostplug.one', 'info@jamaldrenthe.com'].includes(user.email.toLowerCase()))) && (
              <button
                onClick={onAdmin || (() => { window.location.hash = '#/admin'; })}
                className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[hsl(142,76%,45%)]/15 text-[hsl(142,76%,45%)] border border-[hsl(142,76%,45%)]/30 hover:bg-[hsl(142,76%,45%)]/25 transition-colors flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin
              </button>
            )}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 xl:gap-3.5">
            {/* Currency Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="hidden xl:flex items-center gap-1.5 text-white/70 hover:text-white hover:bg-white/10 px-2.5 h-8"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span className="text-xs">{currency}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[hsl(220,20%,12%)] border-white/10">
                <DropdownMenuItem 
                  onClick={() => setCurrency('EUR')}
                  className={`text-white/80 hover:text-white hover:bg-white/10 cursor-pointer ${currency === 'EUR' ? 'bg-white/10' : ''}`}
                >
                  <span className="mr-2">€</span> EUR
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setCurrency('GBP')}
                  className={`text-white/80 hover:text-white hover:bg-white/10 cursor-pointer ${currency === 'GBP' ? 'bg-white/10' : ''}`}
                >
                  <span className="mr-2">£</span> GBP
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="hidden xl:flex items-center gap-1 text-white/70 hover:text-white hover:bg-white/10 px-2 h-8"
                >
                  <span className="text-xs uppercase font-medium">{locale}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[hsl(220,20%,12%)] border-white/10">
                <DropdownMenuItem 
                  onClick={() => setLocale('nl')}
                  className={`text-white/80 hover:text-white hover:bg-white/10 cursor-pointer ${locale === 'nl' ? 'bg-white/10' : ''}`}
                >
                  🇳🇱 Nederlands
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setLocale('en')}
                  className={`text-white/80 hover:text-white hover:bg-white/10 cursor-pointer ${locale === 'en' ? 'bg-white/10' : ''}`}
                >
                  🇬🇧 English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Demo Accounts Dropdown Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="hidden md:flex items-center gap-1.5 rounded-full border-[#E5C583]/30 bg-[#E5C583]/5 hover:bg-[#E5C583]/15 hover:border-[#E5C583]/60 text-[#FAF8F5] text-xs px-3 h-8 cursor-pointer transition-all duration-300"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#E5C583]" />
                  <span className="font-medium">Demo</span>
                  {isDemoUser && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#0D1117]/95 backdrop-blur-2xl border border-[#E5C583]/25 w-64 p-2 text-white shadow-2xl rounded-2xl">
                <div className="px-2 py-1.5 border-b border-white/10 mb-1">
                  <p className="text-xs font-bold text-[#E5C583] flex items-center gap-1.5 font-serif">
                    <Sparkles className="w-3.5 h-3.5 text-[#E5C583]" />
                    Demo Accounts
                  </p>
                  <p className="text-[10px] text-white/50">Wissel direct tussen persona's</p>
                </div>
                <DropdownMenuItem 
                  onClick={async () => {
                    await loginAsDemo('customer');
                    toast.success('Ingelogd als Klant Demo (Nova Sound)');
                    window.location.hash = '#/account';
                  }}
                  className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-white/10 cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs text-white">Klant Demo</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400">Nova Sound</span>
                    </div>
                    <p className="text-[10px] text-white/50">Spotify 50k streams & facturen</p>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem 
                  onClick={async () => {
                    await loginAsDemo('member');
                    toast.success('Ingelogd als Lid Demo (Lars van Dijk)');
                    window.location.hash = '#/account';
                  }}
                  className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-white/10 cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Pickaxe className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs text-white">Lid Demo</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-sky-500/20 text-sky-400">Node</span>
                    </div>
                    <p className="text-[10px] text-white/50">M2 Mac mini Grover • €285/mnd</p>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem 
                  onClick={async () => {
                    await loginAsDemo('admin');
                    toast.success('Ingelogd als Hoofdbeheerder');
                    window.location.hash = '#/admin';
                  }}
                  className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-white/10 cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#E5C583]/20 text-[#E5C583] flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs text-white">Admin Demo</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-[#E5C583]/20 text-[#E5C583]">Beheer</span>
                    </div>
                    <p className="text-[10px] text-white/50">Controlecentrum • Live sync</p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Account / Login — atelier pill */}
            <Button
              size="sm"
              onClick={() => {
                if (user) {
                  onAccount();
                } else {
                  window.location.hash = '#/login';
                }
              }}
              className={`flex items-center gap-2 rounded-full px-5 h-9 transition-all duration-300 ${
                user
                  ? 'bg-white/10 text-white border border-[#E5C583]/30 hover:border-[#E5C583]/60 hover:bg-[#E5C583]/10'
                  : 'bg-gradient-to-r from-[#E5C583] via-[#D4AF37] to-[#C5A059] text-[#090B0F] hover:brightness-110 font-semibold shadow-[0_0_15px_rgba(229,197,131,0.25)]'
              }`}
            >
              {user ? (
                <>
                  <User className="w-4 h-4 text-[#E5C583]" />
                  <span className="hidden md:inline text-sm font-medium">{user.name.split(' ')[0]}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span className="hidden md:inline text-sm">Inloggen</span>
                </>
              )}
            </Button>

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onCheckout}
              className="relative flex items-center gap-1.5 text-white/80 hover:text-white hover:bg-white/10 px-2.5 h-9 rounded-full"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartItemCount > 0 && (
                <Badge 
                  variant="default" 
                  className="absolute -top-1 -right-1 h-4 w-4 min-w-[1rem] flex items-center justify-center p-0 bg-gradient-to-r from-[#E5C583] to-[#D4AF37] text-[#090B0F] text-[10px] font-bold shadow-[0_0_8px_rgba(229,197,131,0.5)] border-0"
                >
                  {cartItemCount}
                </Badge>
              )}
              <span className="hidden xl:inline text-xs font-medium">
                {cartItemCount > 0 ? `${currencySymbol}${cartTotal.toFixed(2)}` : 'Winkelwagen'}
              </span>
            </Button>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
              className="lg:hidden text-white/70 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-200 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Slide-out Panel */}
        <div 
          className={`absolute top-0 right-0 bottom-0 w-full sm:w-80 bg-[hsl(220,35%,6%)] border-l border-white/10 p-6 flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  onHome();
                }}
              >
                <BoostPlugLogo size="sm" />
              </a>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Sluit menu"
                className="text-white/70 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <nav className="flex flex-col gap-4">
              {/* Categorie: Diensten */}
              <div>
                <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2 px-1">Diensten & Catalogus</p>
                <div className="flex flex-col gap-1.5">
                  <button 
                    onClick={(e) => {
                      setIsMobileMenuOpen(false);
                      handleSectionClick(e, 'products');
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left w-full cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-[hsl(142,76%,45%)]" />
                    <span className="text-white text-sm font-medium">Producten</span>
                  </button>
                  <button 
                    onClick={(e) => {
                      setIsMobileMenuOpen(false);
                      handleSectionClick(e, 'abonnementen');
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left w-full cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-[hsl(199,89%,48%)]" />
                    <span className="text-white text-sm font-medium">Abonnementen</span>
                  </button>
                </div>
              </div>

              {/* Categorie: Ecosysteem & Integraties */}
              <div>
                <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2 px-1">Ecosysteem & Integraties</p>
                <div className="flex flex-col gap-1.5">
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (handleGoIntegrations) handleGoIntegrations();
                      else window.location.hash = '#/integraties';
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[hsl(142,76%,45%)]/10 border border-[hsl(142,76%,45%)]/20 hover:bg-[hsl(142,76%,45%)]/20 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Layers className="w-4 h-4 text-[hsl(142,76%,45%)]" />
                      <span className="text-white text-sm font-medium">Integraties</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[hsl(142,76%,45%)]/20 text-[hsl(142,76%,45%)] font-mono">
                      10 modules
                    </span>
                  </button>
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (handleGoIntegrations) handleGoIntegrations();
                      else window.location.hash = '#/integraties#vvc';
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 hover:bg-sky-500/20 transition-colors text-left cursor-pointer"
                  >
                    <Users className="w-4 h-4 text-sky-400" />
                    <span className="text-sky-300 text-sm font-medium">Verdienende Vrienden Club (VVC)</span>
                  </button>
                  <a 
                    href="#/leden" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <User className="w-4 h-4 text-white/60" />
                    <span className="text-white text-sm font-medium">Voor leden</span>
                  </a>
                </div>
              </div>

              {/* Categorie: Informatie & Tracking */}
              <div>
                <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2 px-1">Informatie & Tracking</p>
                <div className="flex flex-col gap-1.5">
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onTracking();
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left cursor-pointer"
                  >
                    <Search className="w-4 h-4 text-[hsl(199,89%,48%)]" />
                    <span className="text-white text-sm">Track bestelling</span>
                  </button>
                  <button 
                    onClick={(e) => {
                      setIsMobileMenuOpen(false);
                      handleSectionClick(e, 'how-it-works');
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left w-full cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="text-white text-sm">Hoe het werkt</span>
                  </button>
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onAbout();
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-white text-sm">Over ons</span>
                  </button>
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (onVacancies) onVacancies();
                      else window.location.hash = '#/vacatures';
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#E5C583]/10 border border-[#E5C583]/20 hover:bg-[#E5C583]/20 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-4 h-4 text-[#E5C583]" />
                      <span className="text-white text-sm font-medium">Carrières & Vacatures</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#E5C583]/20 text-[#E5C583] font-mono">
                      Djobba
                    </span>
                  </button>
                </div>
              </div>

              {/* Categorie: Account & Beheer */}
              <div>
                <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-2 px-1">Account & Beheer</p>
                <div className="flex flex-col gap-1.5">
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (user) {
                        onAccount();
                      } else {
                        window.location.hash = '#/login';
                      }
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-[hsl(142,76%,45%)]/15 border border-[hsl(142,76%,45%)]/30 text-white hover:bg-[hsl(142,76%,45%)]/25 transition-colors text-left cursor-pointer"
                  >
                    {user ? (
                      <User className="w-4 h-4 text-[hsl(142,76%,45%)]" />
                    ) : (
                      <LogIn className="w-4 h-4 text-[hsl(142,76%,45%)]" />
                    )}
                    <span className="text-white text-sm font-medium">{user ? `Mijn account (${user.name.split(' ')[0]})` : 'Inloggen / Registreren'}</span>
                  </button>

                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onCheckout();
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left cursor-pointer"
                  >
                    <Package className="w-4 h-4 text-[hsl(142,76%,45%)]" />
                    <span className="text-white text-sm">Winkelwagen ({cartItemCount})</span>
                  </button>

                  {(user?.accountType === 'admin' || (user?.email && ['info@boostplug.one', 'info@jamaldrenthe.com'].includes(user.email.toLowerCase()))) && (
                    <button 
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        if (onAdmin) onAdmin();
                        else window.location.hash = '#/admin';
                      }}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 transition-colors text-left cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-purple-400" />
                      <span className="text-white text-sm font-medium">Controlecentrum (Admin)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile Demo Accounts Switcher */}
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 space-y-2 mt-2">
                <div className="flex items-center justify-between text-xs font-semibold text-white">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Demo Accounts
                  </span>
                  <span className="text-[10px] text-white/50 font-normal">1-klik wissel</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={async () => {
                      setIsMobileMenuOpen(false);
                      await loginAsDemo('customer');
                      toast.success('Ingelogd als Klant Demo');
                      window.location.hash = '#/account';
                    }}
                    className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-medium text-center cursor-pointer"
                  >
                    🟢 Klant
                  </button>
                  <button
                    onClick={async () => {
                      setIsMobileMenuOpen(false);
                      await loginAsDemo('member');
                      toast.success('Ingelogd als Lid Demo');
                      window.location.hash = '#/account';
                    }}
                    className="p-2 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[11px] font-medium text-center cursor-pointer"
                  >
                    🔵 Lid
                  </button>
                  <button
                    onClick={async () => {
                      setIsMobileMenuOpen(false);
                      await loginAsDemo('admin');
                      toast.success('Ingelogd als Admin Demo');
                      window.location.hash = '#/admin';
                    }}
                    className="p-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[11px] font-medium text-center cursor-pointer"
                  >
                    🟣 Admin
                  </button>
                </div>
              </div>
            </nav>
          </div>

          <div className="space-y-4 pt-6 mt-6 border-t border-white/10">
            <div>
              <p className="text-xs text-white/50 mb-2 font-mono uppercase">Valuta</p>
              <div className="flex gap-2">
                <Button
                  variant={currency === 'EUR' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrency('EUR')}
                  className={`flex-1 ${currency === 'EUR' ? 'bg-[hsl(142,76%,45%)] text-[hsl(220,35%,6%)]' : 'border-white/20 text-white'}`}
                >
                  € EUR
                </Button>
                <Button
                  variant={currency === 'GBP' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrency('GBP')}
                  className={`flex-1 ${currency === 'GBP' ? 'bg-[hsl(142,76%,45%)] text-[hsl(220,35%,6%)]' : 'border-white/20 text-white'}`}
                >
                  £ GBP
                </Button>
              </div>
            </div>

            <div>
              <p className="text-xs text-white/50 mb-2 font-mono uppercase">Taal</p>
              <div className="flex gap-2">
                <Button
                  variant={locale === 'nl' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLocale('nl')}
                  className={`flex-1 ${locale === 'nl' ? 'bg-[hsl(142,76%,45%)] text-[hsl(220,35%,6%)]' : 'border-white/20 text-white'}`}
                >
                  🇳🇱 NL
                </Button>
                <Button
                  variant={locale === 'en' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLocale('en')}
                  className={`flex-1 ${locale === 'en' ? 'bg-[hsl(142,76%,45%)] text-[hsl(220,35%,6%)]' : 'border-white/20 text-white'}`}
                >
                  🇬🇧 EN
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
