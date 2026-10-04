import { useState, useEffect } from 'react';
import { useStore } from '@/hooks/useStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Globe, 
  Menu, 
  Search,
  Package,
  Zap,
  User,
  LogIn
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface HeaderProps {
  onCheckout: () => void;
  onTracking: () => void;
  onAccount: () => void;
  onHome: () => void;
  onAbout: () => void;
}

export function Header({ onCheckout, onTracking, onAccount, onHome, onAbout }: HeaderProps) {
  const { cart, currency, setCurrency, locale, setLocale, user } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartItemCount = cart.length;
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const currencySymbol = currency === 'EUR' ? '€' : '£';

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[hsl(220,35%,6%)]/90 backdrop-blur-xl border-b border-white/10' 
          : 'bg-transparent'
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
            <a href="#products" onClick={onHome} className="text-sm text-white/70 hover:text-white transition-colors">
              Producten
            </a>
            <a href="#how-it-works" onClick={onHome} className="text-sm text-white/70 hover:text-white transition-colors">
              Hoe het werkt
            </a>
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

            {/* Account / Login */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (user) {
                  onAccount();
                } else {
                  window.location.hash = '#/login';
                }
              }}
              className="flex items-center gap-2 text-white/70 hover:text-white hover:bg-white/10"
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

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="lg:hidden text-white/70 hover:text-white hover:bg-white/10"
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-full sm:w-80 bg-[hsl(220,35%,6%)] border-white/10"
              >
                <div className="flex flex-col gap-6 mt-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[hsl(220,30%,15%)] to-[hsl(220,35%,8%)] border border-white/10" />
                      <div className="relative flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[hsl(142,76%,45%)]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[hsl(199,89%,48%)]" />
                      </div>
                    </div>
                    <span className="text-xl font-bold text-white">
                      BOOST<span className="text-[hsl(142,76%,45%)]">PLUG</span>
                    </span>
                  </div>

                  <nav className="flex flex-col gap-4">
                    <a 
                      href="#products" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <Zap className="w-5 h-5 text-[hsl(142,76%,45%)]" />
                      <span className="text-white">Producten</span>
                    </a>
                    <button 
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onTracking();
                      }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left"
                    >
                      <Search className="w-5 h-5 text-[hsl(199,89%,48%)]" />
                      <span className="text-white">Track bestelling</span>
                    </button>
                    <button 
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onAbout();
                      }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left"
                    >
                      <Zap className="w-5 h-5 text-[hsl(199,89%,48%)]" />
                      <span className="text-white">Over ons</span>
                    </button>
                    <button 
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onCheckout();
                      }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left"
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
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left"
                    >
                      {user ? (
                        <User className="w-5 h-5 text-[hsl(142,76%,45%)]" />
                      ) : (
                        <LogIn className="w-5 h-5 text-[hsl(142,76%,45%)]" />
                      )}
                      <span className="text-white">{user ? `Mijn account` : 'Inloggen'}</span>
                    </button>
                  </nav>

                  <div className="border-t border-white/10 pt-4">
                    <p className="text-sm text-white/50 mb-3">Valuta</p>
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

                  <div className="border-t border-white/10 pt-4">
                    <p className="text-sm text-white/50 mb-3">Taal</p>
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
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
