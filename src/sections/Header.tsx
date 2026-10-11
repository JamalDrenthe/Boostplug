import { useState, useEffect } from 'react';
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
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onCheckout: () => void;
  onTracking: () => void;
  onAccount: () => void;
  onHome: () => void;
  onAbout: () => void;
  onAdmin?: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export function Header({ onCheckout, onTracking, onAccount, onHome, onAbout, onAdmin, onNavigateSection }: HeaderProps) {
  const { cart, currency, setCurrency, locale, setLocale, user } = useStore();
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
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
        isScrolled 
          ? 'bg-[hsl(220,35%,6%)]/95 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#" onClick={(e) => { e.preventDefault(); onHome(); }} className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[hsl(220,30%,15%)] to-[hsl(220,35%,8%)] border border-white/10 group-hover:border-[hsl(142,76%,45%)]/50 transition-colors" />
              <div className="relative flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[hsl(142,76%,45%)] shadow-[0_0_8px_hsl(142,76%,45%)] animate-pulse" />
                <div className="w-2.5 h-2.5 rounded-full bg-[hsl(199,89%,48%)] shadow-[0_0_8px_hsl(199,89%,48%)] animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              BOOST<span className="text-[hsl(142,76%,45%)]">PLUG</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <button 
              onClick={(e) => handleSectionClick(e, 'products')} 
              className="text-sm text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              Producten
            </button>
            <button 
              onClick={(e) => handleSectionClick(e, 'abonnementen')} 
              className="text-sm text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              Abonnementen
            </button>
            <a 
              href="#/leden" 
              className="text-sm text-[hsl(142,76%,45%)]/80 hover:text-[hsl(142,76%,45%)] transition-colors cursor-pointer"
            >
              Voor leden
            </a>
            <button 
              onClick={(e) => handleSectionClick(e, 'how-it-works')} 
              className="text-sm text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              Hoe het werkt
            </button>
            <button 
              onClick={onTracking}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              Track bestelling
            </button>
            <button
              onClick={onAbout}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              Over ons
            </button>
            {(user?.accountType === 'admin' || user?.email?.toLowerCase() === 'info@jamaldrenthe.com') && (
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
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Currency Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="hidden sm:flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/10"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm">{currency}</span>
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
                  className="hidden sm:flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/10"
                >
                  <span className="text-sm uppercase">{locale}</span>
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

            {/* Account / Login — pill per design-md */}
            <Button
              size="sm"
              onClick={() => {
                if (user) {
                  onAccount();
                } else {
                  window.location.hash = '#/login';
                }
              }}
              className={`flex items-center gap-2 rounded-full px-5 ${
                user
                  ? 'bg-white/10 text-white border border-white/15 hover:bg-white/15'
                  : 'bg-[hsl(142,76%,45%)] text-[hsl(220,35%,6%)] hover:bg-[hsl(142,76%,40%)] font-medium'
              }`}
            >
              {user ? (
                <>
                  <User className="w-4 h-4" />
                  <span className="hidden md:inline text-sm">{user.name.split(' ')[0]}</span>
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
              className="relative flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/10"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <Badge 
                  variant="default" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[hsl(142,76%,45%)] text-[hsl(220,35%,6%)] text-xs font-bold"
                >
                  {cartItemCount}
                </Badge>
              )}
              <span className="hidden lg:inline text-sm">
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
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[hsl(220,30%,15%)] to-[hsl(220,35%,8%)] border border-white/10" />
                  <div className="relative flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[hsl(142,76%,45%)]" />
                    <div className="w-2 h-2 rounded-full bg-[hsl(199,89%,48%)]" />
                  </div>
                </div>
                <span className="text-lg font-bold text-white">
                  BOOST<span className="text-[hsl(142,76%,45%)]">PLUG</span>
                </span>
              </div>
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

            <nav className="flex flex-col gap-3">
              <button 
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  handleSectionClick(e, 'products');
                }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left w-full cursor-pointer"
              >
                <Zap className="w-5 h-5 text-[hsl(142,76%,45%)]" />
                <span className="text-white">Producten</span>
              </button>
              <button 
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  handleSectionClick(e, 'abonnementen');
                }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left w-full cursor-pointer"
              >
                <Zap className="w-5 h-5 text-[hsl(199,89%,48%)]" />
                <span className="text-white">Abonnementen</span>
              </button>
              <a 
                href="#/leden" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <User className="w-5 h-5 text-[hsl(142,76%,45%)]" />
                <span className="text-white">Voor leden</span>
              </a>
              <button 
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  handleSectionClick(e, 'how-it-works');
                }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left w-full cursor-pointer"
              >
                <Zap className="w-5 h-5 text-[hsl(142,76%,45%)]" />
                <span className="text-white">Hoe het werkt</span>
              </button>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onTracking();
                }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left cursor-pointer"
              >
                <Search className="w-5 h-5 text-[hsl(199,89%,48%)]" />
                <span className="text-white">Track bestelling</span>
              </button>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onAbout();
                }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left cursor-pointer"
              >
                <Zap className="w-5 h-5 text-[hsl(199,89%,48%)]" />
                <span className="text-white">Over ons</span>
              </button>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onCheckout();
                }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left cursor-pointer"
              >
                <Package className="w-5 h-5 text-[hsl(142,76%,45%)]" />
                <span className="text-white">Winkelwagen ({cartItemCount})</span>
              </button>
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (user) {
                    onAccount();
                  } else {
                    window.location.hash = '#/login';
                  }
                }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left cursor-pointer"
              >
                {user ? (
                  <User className="w-5 h-5 text-[hsl(142,76%,45%)]" />
                ) : (
                  <LogIn className="w-5 h-5 text-[hsl(142,76%,45%)]" />
                )}
                <span className="text-white">{user ? `Mijn account` : 'Inloggen'}</span>
              </button>
              {(user?.accountType === 'admin' || user?.email?.toLowerCase() === 'info@jamaldrenthe.com') && (
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onAdmin) onAdmin();
                    else window.location.hash = '#/admin';
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[hsl(142,76%,45%)]/10 border border-[hsl(142,76%,45%)]/30 hover:bg-[hsl(142,76%,45%)]/20 transition-colors text-left cursor-pointer"
                >
                  <ShieldCheck className="w-5 h-5 text-[hsl(142,76%,45%)]" />
                  <span className="text-white font-medium">Controlecentrum (Admin)</span>
                </button>
              )}
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
    </header>
  );
}
