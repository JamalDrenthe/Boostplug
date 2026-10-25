import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/hooks/useStore';
import { reviewPlatforms, REVIEW_CATEGORIES, formatPrice } from '@/data/platforms';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { TiltCard } from '@/components/ui/TiltCard';
import { CompanyLogo } from '@/components/common/CompanyLogos';
import { 
  MapPin, 
  Star, 
  Package, 
  Smartphone, 
  Car, 
  Music,
  Building2,
  ShoppingCart,
  Plane,
  ShoppingBag,
  Utensils,
  Mic,
  Building,
  MessageSquare,
  Play,
  Check,
  Plus,
  Clock,
  AlertCircle,
  Search,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

const iconMap: Record<string, React.ElementType> = {
  MapPin,
  Star,
  Package,
  Smartphone,
  Car,
  Music,
  Building2,
  ShoppingCart,
  Plane,
  ShoppingBag,
  Utensils,
  Mic,
  Building,
  MessageSquare,
  Play,
};

interface ReviewsSelectorProps {
  onCheckout: () => void;
}

export function ReviewsSelector({ onCheckout }: ReviewsSelectorProps) {
  const { currency, addToCart, cart } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [targetUrl, setTargetUrl] = useState('');
  const [targetName, setTargetName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const platform = useMemo(() => 
    reviewPlatforms.find(p => p.id === selectedPlatform),
    [selectedPlatform]
  );

  const price = useMemo(() => {
    if (!platform) return 0;
    return platform.price[currency] * quantity;
  }, [platform, quantity, currency]);

  const isUrlValid = useMemo(() => {
    if (!platform?.requiresUrl) return true;
    if (!targetUrl) return false;
    if (!platform.urlPattern) return true;
    return platform.urlPattern.test(targetUrl);
  }, [platform, targetUrl]);

  const filteredPlatforms = useMemo(() => {
    let platforms = reviewPlatforms.filter(p => p.active);
    
    if (selectedCategory) {
      platforms = platforms.filter(p => p.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      platforms = platforms.filter(p => 
        p.name.toLowerCase().includes(query) ||
        REVIEW_CATEGORIES[p.category].name.toLowerCase().includes(query)
      );
    }
    
    return platforms;
  }, [selectedCategory, searchQuery]);

  const handleAddToCart = () => {
    if (!platform) return;
    if (platform.requiresUrl && !isUrlValid) {
      toast.error('Voer een geldige URL in');
      return;
    }

    const cartItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      category: 'reviews' as const,
      platform: platform.id,
      platformName: platform.name,
      quantity,
      price,
      currency,
      targetUrl: platform.requiresUrl ? targetUrl : undefined,
      reviewText: reviewText || undefined,
      rating: platform.requiresRating ? rating : undefined,
    };

    addToCart(cartItem);
    toast.success(`${quantity} ${platform.name} review(s) toegevoegd!`);
    
    // Reset form
    setSelectedPlatform(null);
    setQuantity(1);
    setRating(5);
    setTargetUrl('');
    setTargetName('');
    setReviewText('');
  };

  // Step 1: Category & Platform Selection
  if (!selectedPlatform) {
    return (
      <div className="space-y-8">
        {/* Search */}
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E5C583]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Zoek platform (Trustpilot, Google Maps, App Store, Tripadvisor...)"
            className="pl-11 pr-4 py-5 bg-[#0D1117]/80 border border-white/[0.08] hover:border-[#E5C583]/40 focus:border-[#E5C583]/60 text-white placeholder:text-white/30 rounded-full text-sm transition-all shadow-inner"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
              selectedCategory === null
                ? 'bg-gradient-to-r from-[#E5C583] to-[#D4AF37] text-[#090B0F] font-semibold shadow-[0_0_15px_rgba(229,197,131,0.3)]'
                : 'bg-white/[0.03] text-white/70 hover:text-white border border-white/[0.08] hover:bg-white/[0.08]'
            }`}
          >
            Alle suites
          </button>
          {Object.entries(REVIEW_CATEGORIES).map(([key, { name, icon }]) => {
            const Icon = iconMap[icon] || Star;
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
                  selectedCategory === key
                    ? 'bg-gradient-to-r from-[#E5C583] to-[#D4AF37] text-[#090B0F] font-semibold shadow-[0_0_15px_rgba(229,197,131,0.3)]'
                    : 'bg-white/[0.03] text-white/70 hover:text-white border border-white/[0.08] hover:bg-white/[0.08]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {name}
              </button>
            );
          })}
        </div>

        {/* Platform Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {filteredPlatforms.map((platform, idx) => {
            return (
              <motion.div
                key={platform.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(idx * 0.03, 0.3) }}
              >
                <TiltCard glowColor="gold" className="h-full">
                  <button
                    onClick={() => setSelectedPlatform(platform.id)}
                    className="w-full text-left p-5 rounded-2xl bg-[#0D1117]/80 border border-white/[0.08] hover:border-[#E5C583]/40 transition-all duration-300 flex flex-col justify-between group h-full cursor-pointer"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-md"
                          style={{ backgroundColor: `${platform.color}15`, border: `1px solid ${platform.color}30` }}
                        >
                          <CompanyLogo name={platform.id} size={22} colored={true} />
                        </div>
                        {platform.riskLevel === 'high' && (
                          <AlertCircle className="w-4 h-4 text-amber-400" />
                        )}
                      </div>
                      <h4 className="text-white font-medium text-sm group-hover:text-[#E5C583] transition-colors mb-1">
                        {platform.name}
                      </h4>
                      <p className="text-[#E5C583] font-serif italic text-base font-medium">
                        {formatPrice(platform.price[currency], currency)}
                        <span className="text-[11px] font-sans font-normal text-white/40 ml-1">/review</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-white/[0.06] text-[11px] text-white/40 font-mono">
                      <Clock className="w-3 h-3 text-[#E5C583]" />
                      {platform.estimatedDelivery}
                    </div>
                  </button>
                </TiltCard>
              </motion.div>
            );
          })}
        </motion.div>

        {cart.length > 0 && (
          <div className="flex justify-center">
            <Button
              onClick={onCheckout}
              className="bg-gradient-to-r from-[#E5C583] via-[#D4AF37] to-[#C5A059] text-[#090B0F] font-semibold px-8 py-6 rounded-full shadow-[0_0_20px_rgba(229,197,131,0.3)] hover:brightness-110 cursor-pointer"
            >
              Ga naar afrekenen ({cart.length} {cart.length === 1 ? 'item' : 'items'})
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Step 2: Configuration
  return (
    <Card className="p-6 sm:p-10 bg-[#0D1117]/90 backdrop-blur-2xl border border-[#E5C583]/20 shadow-2xl rounded-3xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
        <button
          onClick={() => {
            setSelectedPlatform(null);
          }}
          className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-white/60 hover:text-[#E5C583] transition-colors cursor-pointer font-mono"
        >
          <ArrowLeft className="w-4 h-4" />
          Terug naar suites
        </button>
        <div className="h-4 w-px bg-white/20" />
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
          style={{ backgroundColor: `${platform?.color}20` }}
        >
          {platform && (
            <CompanyLogo name={platform.id} size={22} colored={true} />
          )}
        </div>
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>{platform?.name}</span>
            <span className="font-serif italic text-[#E5C583] font-normal text-lg">Reputatie Curatie</span>
          </h3>
          <p className="text-xs text-white/50">Geverifieerde residentiële reviews met natuurlijke context</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Quantity */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
          <div className="flex items-center justify-between mb-4">
            <Label className="text-[#FAF8F5] font-medium text-sm">Aantal gewenste reviews</Label>
            <Badge variant="outline" className="border-[#E5C583]/50 text-[#E5C583] bg-[#E5C583]/10 px-3 py-1 font-mono text-xs">
              {quantity} {quantity === 1 ? 'review' : 'reviews'}
            </Badge>
          </div>
          <Slider
            value={[quantity]}
            onValueChange={([v]) => setQuantity(v)}
            min={1}
            max={platform?.maxQuantity || 10}
            step={1}
            className="py-4"
          />
        </div>

        {/* Rating */}
        {platform?.requiresRating && (
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
            <Label className="text-[#FAF8F5] font-medium text-sm mb-3 block">Gewenste waardering</Label>
            <div className="flex gap-2.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    rating >= star
                      ? 'bg-gradient-to-r from-[#E5C583] to-[#D4AF37] text-[#090B0F] shadow-[0_0_12px_rgba(229,197,131,0.4)]'
                      : 'bg-white/[0.03] text-white/30 hover:bg-white/[0.08]'
                  }`}
                >
                  <Star className="w-5 h-5" fill={rating >= star ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Target URL */}
        {platform?.requiresUrl && (
          <div>
            <Label className="text-white/80 text-xs mb-2 block font-medium">
              {platform.category === 'local_search' ? 'Bedrijf URL / Google Maps Link' : 
               platform.category === 'apps' ? 'App Store / Play Store Link' : 'Product / Winkelpagina URL'}
            </Label>
            <Input
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder={platform.urlExample}
              className={`bg-white/[0.04] border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-[#E5C583]/50 ${
                targetUrl && !isUrlValid ? 'border-red-500' : ''
              } ${targetUrl && isUrlValid ? 'border-emerald-500' : ''}`}
            />
            {targetUrl && !isUrlValid && (
              <p className="text-red-400 text-xs mt-2 flex items-center gap-1 font-mono">
                <AlertCircle className="w-3.5 h-3.5" />
                Ongeldige URL indeling. Voorbeeld: {platform.urlExample}
              </p>
            )}
            {targetUrl && isUrlValid && (
              <p className="text-emerald-400 text-xs mt-2 flex items-center gap-1 font-mono">
                <Check className="w-3.5 h-3.5" />
                Geldig platform adres geverifieerd
              </p>
            )}
          </div>
        )}

        {/* Target Name (for platforms without URL) */}
        {!platform?.requiresUrl && (
          <div>
            <Label className="text-white/80 text-xs mb-2 block font-medium">Bedrijf of Account Identificatie</Label>
            <Input
              value={targetName}
              onChange={(e) => setTargetName(e.target.value)}
              placeholder="Naam van het bedrijf of profiel"
              className="bg-white/[0.04] border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-[#E5C583]/50"
            />
          </div>
        )}

        {/* Review Text */}
        {platform?.requiresText && (
          <div>
            <Label className="text-white/80 text-xs mb-2 block font-medium">
              Review Tekst Briefing <span className="text-[#E5C583]/60">(optioneel)</span>
            </Label>
            <Textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Laat leeg voor een natuurlijke, professioneel geschreven review door het BoostPlug redactieteam..."
              className="bg-white/[0.04] border-white/10 text-white placeholder:text-white/30 min-h-[110px] rounded-xl focus:border-[#E5C583]/50"
              maxLength={500}
            />
            <p className="text-xs text-white/40 mt-2 font-mono">
              {reviewText.length}/500 tekens
              {!reviewText && ' · Redactie schrijft branchespecifieke review met gevarieerde zinsbouw'}
            </p>
          </div>
        )}

        {/* Price Summary */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#E5C583]/10 via-[#0D1117] to-[#10B981]/10 border border-[#E5C583]/25 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/70 text-sm font-light">{quantity} × {platform?.name} residentiële review</span>
            <span className="text-white font-mono text-sm">{formatPrice(platform ? platform.price[currency] * quantity : 0, currency)}</span>
          </div>
          <div className="border-t border-white/10 pt-4 mt-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-white/50 font-mono block">Totaal investering</span>
                <span className="text-xs text-white/40">Inclusief plaatsingsgarantie & vervangingsdekking</span>
              </div>
              <span className="font-serif italic text-3xl font-light text-[#E5C583]">
                {formatPrice(price, currency)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs text-[#E5C583]/80 font-mono">
            <Clock className="w-3.5 h-3.5" />
            Geschatte spreiding: {platform?.estimatedDelivery} (natuurlijke drip-feed)
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => setSelectedPlatform(null)}
            className="flex-1 border-white/15 text-white hover:bg-white/10 rounded-full h-12 cursor-pointer"
          >
            Terug
          </Button>
          <Button
            onClick={handleAddToCart}
            disabled={platform?.requiresUrl && !isUrlValid}
            className="flex-1 bg-gradient-to-r from-[#E5C583] via-[#D4AF37] to-[#C5A059] text-[#090B0F] font-bold rounded-full h-12 shadow-[0_0_20px_rgba(229,197,131,0.3)] hover:brightness-110 disabled:opacity-50 cursor-pointer"
          >
            <Plus className="w-5 h-5 mr-2" />
            Toevoegen aan selectie
          </Button>
        </div>
      </div>
    </Card>
  );
}
