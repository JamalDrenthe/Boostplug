import { useState, useMemo } from 'react';
import { useStore } from '@/hooks/useStore';
import { streamPlatforms, calculateStreamPrice, formatPrice } from '@/data/platforms';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Music2, 
  Cloud, 
  Radio, 
  Waves,
  Youtube,
  Apple,
  Plus,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

const iconMap: Record<string, React.ElementType> = {
  Music2,
  Apple,
  Youtube,
  Cloud,
  Radio,
  Waves,
};

interface StreamsSelectorProps {
  onCheckout: () => void;
}

export function StreamsSelector({ onCheckout }: StreamsSelectorProps) {
  const { currency, addToCart, cart } = useStore();
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1000);
  const [isPremium, setIsPremium] = useState(false);
  const [trackUrl, setTrackUrl] = useState('');
  const [artistName, setArtistName] = useState('');

  const platform = useMemo(() => 
    streamPlatforms.find(p => p.id === selectedPlatform),
    [selectedPlatform]
  );

  const streamType = useMemo(() => 
    platform?.types.find(t => t.id === selectedType),
    [platform, selectedType]
  );

  const price = useMemo(() => {
    if (!streamType) return 0;
    return calculateStreamPrice(streamType.basePrice, quantity, isPremium ? 'premium' : 'standard');
  }, [streamType, quantity, isPremium]);

  const handleAddToCart = () => {
    if (!platform || !streamType) return;

    const cartItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      category: 'streams' as const,
      platform: platform.id,
      platformName: platform.name,
      type: streamType.id,
      typeName: streamType.name,
      quantity,
      quality: isPremium ? 'premium' as const : 'standard' as const,
      price,
      currency,
      targetUrl: trackUrl,
    };

    addToCart(cartItem);
    toast.success(`${platform.name} ${streamType.name} toegevoegd aan winkelwagen!`);
    
    // Reset form
    setSelectedPlatform(null);
    setSelectedType(null);
    setQuantity(1000);
    setIsPremium(false);
    setTrackUrl('');
    setArtistName('');
  };

  const formatQuantity = (qty: number) => {
    if (qty >= 1000000) return `${(qty / 1000000).toFixed(1)}M`;
    if (qty >= 1000) return `${(qty / 1000).toFixed(qty >= 10000 ? 0 : 1)}K`;
    return qty.toString();
  };

  // Step 1: Platform Selection
  if (!selectedPlatform) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {streamPlatforms.map((platform) => {
            const Icon = iconMap[platform.icon] || Music2;
            return (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id)}
                className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[hsl(142,76%,45%)]/50 hover:bg-white/10 transition-all duration-300"
              >
                <div 
                  className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${platform.color}20` }}
                >
                  <Icon className="w-7 h-7" style={{ color: platform.color }} />
                </div>
                <p className="text-white font-medium text-sm">{platform.name}</p>
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                  <div 
                    className="absolute inset-0 rounded-2xl"
                    style={{ 
                      background: `linear-gradient(135deg, ${platform.color}10 0%, transparent 50%)`,
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {cart.length > 0 && (
          <div className="flex justify-center">
            <Button
              onClick={onCheckout}
              className="bg-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,40%)] text-[hsl(220,35%,6%)] font-semibold"
            >
              Ga naar afrekenen ({cart.length} items)
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Step 2: Type & Configuration
  return (
    <Card className="p-6 sm:p-8 bg-white/5 border-white/10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => {
            setSelectedPlatform(null);
            setSelectedType(null);
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
            const Icon = iconMap[platform.icon] || Music2;
            return <Icon className="w-5 h-5" style={{ color: platform.color }} />;
          })()}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">{platform?.name}</h3>
          <p className="text-sm text-white/50">Kies je boost type</p>
        </div>
      </div>

      {/* Type Selection */}
      {!selectedType ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {platform?.types.map((type) => (
            <button
              key={type.id}
              onClick={() => {
                setSelectedType(type.id);
                setQuantity(type.minQuantity);
              }}
              className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-[hsl(142,76%,45%)]/50 hover:bg-white/10 transition-all text-left"
            >
              <h4 className="text-lg font-medium text-white mb-1">{type.name}</h4>
              <p className="text-sm text-white/50 mb-4">{type.description}</p>
              <p className="text-[hsl(142,76%,45%)] font-semibold">
                Vanaf {formatPrice(type.basePrice * type.minQuantity, currency)}
              </p>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Quantity Slider */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-white">Hoeveelheid</Label>
              <Badge variant="outline" className="border-[hsl(142,76%,45%)] text-[hsl(142,76%,45%)]">
                {formatQuantity(quantity)} {streamType?.name}
              </Badge>
            </div>
            <Slider
              value={[quantity]}
              onValueChange={([v]) => setQuantity(v)}
              min={streamType?.minQuantity || 100}
              max={streamType?.maxQuantity || 100000}
              step={streamType?.minQuantity || 100}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-white/40 mt-1">
              <span>{formatQuantity(streamType?.minQuantity || 100)}</span>
              <span>{formatQuantity(streamType?.maxQuantity || 100000)}</span>
            </div>
          </div>

          {/* Quality Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[hsl(142,76%,45%)]/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[hsl(142,76%,45%)]" />
              </div>
              <div>
                <p className="text-white font-medium">Premium kwaliteit</p>
                <p className="text-sm text-white/50">Hogere retentie & betere distributie</p>
              </div>
            </div>
            <Switch
              checked={isPremium}
              onCheckedChange={setIsPremium}
            />
          </div>

          {/* Track URL Input */}
          <div>
            <Label className="text-white mb-2 block">Track/Artist URL (optioneel)</Label>
            <Input
              value={trackUrl}
              onChange={(e) => setTrackUrl(e.target.value)}
              placeholder={`https://open.spotify.com/track/...`}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
          </div>

          {/* Artist Name */}
          <div>
            <Label className="text-white mb-2 block">Artiest naam (optioneel)</Label>
            <Input
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              placeholder="Artiest naam"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
          </div>

          {/* Price Summary */}
          <div className="p-6 rounded-xl bg-gradient-to-r from-[hsl(142,76%,45%)]/10 to-[hsl(199,89%,48%)]/10 border border-[hsl(142,76%,45%)]/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/70">{formatQuantity(quantity)} × {streamType?.name}</span>
              <span className="text-white">{formatPrice(streamType ? streamType.basePrice * quantity : 0, currency)}</span>
            </div>
            {isPremium && (
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70">Premium (+50%)</span>
                <span className="text-[hsl(142,76%,45%)]">+{formatPrice(streamType ? streamType.basePrice * quantity * 0.5 : 0, currency)}</span>
              </div>
            )}
            <div className="border-t border-white/10 pt-3 mt-3">
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold">Totaal</span>
                <span className="text-2xl font-bold text-[hsl(142,76%,45%)]">{formatPrice(price, currency)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setSelectedType(null)}
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              Terug
            </Button>
            <Button
              onClick={handleAddToCart}
              className="flex-1 bg-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,40%)] text-[hsl(220,35%,6%)] font-semibold"
            >
              <Plus className="w-5 h-5 mr-2" />
              Toevoegen
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
