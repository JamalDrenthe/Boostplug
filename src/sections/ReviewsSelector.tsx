import { useState, useMemo } from 'react';
import { useStore } from '@/hooks/useStore';
import { reviewPlatforms, REVIEW_CATEGORIES, formatPrice } from '@/data/platforms';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
  Search
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
      <div className="space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Zoek platform..."
            className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-white/30"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === null
                ? 'bg-[hsl(199,89%,48%)] text-white'
                : 'bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            Alle
          </button>
          {Object.entries(REVIEW_CATEGORIES).map(([key, { name, icon }]) => {
            const Icon = iconMap[icon] || Star;
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === key
                    ? 'bg-[hsl(199,89%,48%)] text-white'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {name}
              </button>
            );
          })}
        </div>

        {/* Platform Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPlatforms.map((platform) => {
            const Icon = iconMap[platform.icon] || Star;
            return (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id)}
                className="group relative p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[hsl(199,89%,48%)]/50 hover:bg-white/10 transition-all duration-300 text-left"
              >
                <div className="flex items-start justify-between mb-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${platform.color}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: platform.color }} />
                  </div>
                  {platform.riskLevel === 'high' && (
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                  )}
                </div>
                <h4 className="text-white font-medium text-sm mb-1">{platform.name}</h4>
                <p className="text-[hsl(199,89%,48%)] font-semibold text-sm">
                  {formatPrice(platform.price[currency], currency)}
                </p>
                <div className="flex items-center gap-1 mt-2 text-xs text-white/40">
                  <Clock className="w-3 h-3" />
                  {platform.estimatedDelivery}
                </div>
              </button>
            );
          })}
        </div>

        {cart.length > 0 && (
          <div className="flex justify-center">
            <Button
              onClick={onCheckout}
              className="bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,43%)] text-white font-semibold"
            >
              Ga naar afrekenen ({cart.length} items)
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Step 2: Configuration
  return (
    <Card className="p-6 sm:p-8 bg-white/5 border-white/10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => {
            setSelectedPlatform(null);
          }}
          className="text-white/50 hover:text-white transition-colors"
        >
          ← Terug
        </button>
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${platform?.color}20` }}
        >
          {platform && (() => {
            const Icon = iconMap[platform.icon] || Star;
            return <Icon className="w-5 h-5" style={{ color: platform.color }} />;
          })()}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">{platform?.name}</h3>
          <p className="text-sm text-white/50">Configureer je review pakket</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Quantity */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Label className="text-white">Aantal reviews</Label>
            <Badge variant="outline" className="border-[hsl(199,89%,48%)] text-[hsl(199,89%,48%)]">
              {quantity}
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
          <div>
            <Label className="text-white mb-3 block">Gewenste rating</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    rating >= star
                      ? 'bg-[hsl(199,89%,48%)] text-white'
                      : 'bg-white/5 text-white/30 hover:bg-white/10'
                  }`}
                >
                  <Star className="w-6 h-6" fill={rating >= star ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Target URL */}
        {platform?.requiresUrl && (
          <div>
            <Label className="text-white mb-2 block">
              {platform.category === 'local_search' ? 'Bedrijf URL' : 
               platform.category === 'apps' ? 'App URL' : 'Product URL'}
            </Label>
            <Input
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder={platform.urlExample}
              className={`bg-white/5 border-white/10 text-white placeholder:text-white/30 ${
                targetUrl && !isUrlValid ? 'border-red-500' : ''
              } ${targetUrl && isUrlValid ? 'border-green-500' : ''}`}
            />
            {targetUrl && !isUrlValid && (
              <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Ongeldige URL. Voorbeeld: {platform.urlExample}
              </p>
            )}
            {targetUrl && isUrlValid && (
              <p className="text-green-400 text-sm mt-2 flex items-center gap-1">
                <Check className="w-4 h-4" />
                Geldige URL
              </p>
            )}
          </div>
        )}

        {/* Target Name (for platforms without URL) */}
        {!platform?.requiresUrl && (
          <div>
            <Label className="text-white mb-2 block">Bedrijf/Account naam</Label>
            <Input
              value={targetName}
              onChange={(e) => setTargetName(e.target.value)}
              placeholder="Naam van het bedrijf of account"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
          </div>
        )}

        {/* Review Text */}
        {platform?.requiresText && (
          <div>
            <Label className="text-white mb-2 block">
              Review tekst <span className="text-white/50">(optioneel)</span>
            </Label>
            <Textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Laat leeg voor een professionele review door BoostPlug..."
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[100px]"
              maxLength={500}
            />
            <p className="text-xs text-white/40 mt-2">
              {reviewText.length}/500 karakters
              {!reviewText && ' · Laat leeg voor een professionele review door BoostPlug'}
            </p>
          </div>
        )}

        {/* Price Summary */}
        <div className="p-6 rounded-xl bg-gradient-to-r from-[hsl(199,89%,48%)]/10 to-[hsl(142,76%,45%)]/10 border border-[hsl(199,89%,48%)]/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/70">{quantity} × {platform?.name} review</span>
            <span className="text-white">{formatPrice(platform ? platform.price[currency] * quantity : 0, currency)}</span>
          </div>
          <div className="border-t border-white/10 pt-3 mt-3">
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">Totaal</span>
              <span className="text-2xl font-bold text-[hsl(199,89%,48%)]">{formatPrice(price, currency)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 text-sm text-white/50">
            <Clock className="w-4 h-4" />
            Geschatte levering: {platform?.estimatedDelivery}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => setSelectedPlatform(null)}
            className="flex-1 border-white/20 text-white hover:bg-white/10"
          >
            Terug
          </Button>
          <Button
            onClick={handleAddToCart}
            disabled={platform?.requiresUrl && !isUrlValid}
            className="flex-1 bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,43%)] text-white font-semibold disabled:opacity-50"
          >
            <Plus className="w-5 h-5 mr-2" />
            Toevoegen
          </Button>
        </div>
      </div>
    </Card>
  );
}
