import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/hooks/useStore';
import { streamPlatforms, calculateStreamPrice, formatPrice } from '@/data/platforms';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { TiltCard } from '@/components/ui/TiltCard';
import { 
  Music2, 
  Cloud, 
  Radio, 
  Waves,
  Youtube,
  Apple,
  Plus,
  Sparkles,
  ArrowLeft
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
      <div className="space-y-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {streamPlatforms.map((platform, idx) => {
            const Icon = iconMap[platform.icon] || Music2;
            return (
              <motion.div
                key={platform.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <TiltCard glowColor="gold" className="h-full">
                  <button
                    onClick={() => setSelectedPlatform(platform.id)}
                    className="w-full text-center p-6 rounded-2xl bg-[#0D1117]/80 border border-white/[0.08] hover:border-[#E5C583]/40 transition-all duration-300 flex flex-col items-center justify-center group h-full cursor-pointer"
                  >
                    <div 
                      className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg"
                      style={{ backgroundColor: `${platform.color}15`, border: `1px solid ${platform.color}30` }}
                    >
                      <Icon className="w-7 h-7" style={{ color: platform.color }} />
                    </div>
                    <p className="text-[#FAF8F5] font-medium text-sm tracking-wide group-hover:text-[#E5C583] transition-colors">
                      {platform.name}
                    </p>
                    <span className="text-[11px] text-white/40 mt-1">
                      {platform.types.length} audiosuites
                    </span>
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

  // Step 2: Type & Configuration
  return (
    <Card className="p-6 sm:p-10 bg-[#0D1117]/90 backdrop-blur-2xl border border-[#E5C583]/20 shadow-2xl rounded-3xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
        <button
          onClick={() => {
            setSelectedPlatform(null);
            setSelectedType(null);
          }}
          className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-white/60 hover:text-[#E5C583] transition-colors cursor-pointer font-mono"
        >
          <ArrowLeft className="w-4 h-4" />
          Terug naar overzicht
        </button>
        <div className="h-4 w-px bg-white/20" />
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${platform?.color}20` }}
        >
          {platform && (() => {
            const Icon = iconMap[platform.icon] || Music2;
            return <Icon className="w-5 h-5" style={{ color: platform.color }} />;
          })()}
        </div>
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>{platform?.name}</span>
            <span className="font-serif italic text-[#E5C583] font-normal text-lg">Studio Allocatie</span>
          </h3>
          <p className="text-xs text-white/50">Selecteer pakket, frequentie en distributie-parameters</p>
        </div>
      </div>

      {/* Type Selection */}
      {!selectedType ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {platform?.types.map((type) => (
            <TiltCard key={type.id} glowColor="gold" className="h-full">
              <button
                onClick={() => {
                  setSelectedType(type.id);
                  setQuantity(type.minQuantity);
                }}
                className="w-full h-full p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#E5C583]/40 transition-all text-left flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-base font-semibold text-white group-hover:text-[#E5C583] transition-colors">
                      {type.name}
                    </h4>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#E5C583]/10 text-[#E5C583] border border-[#E5C583]/20">
                      Tier 1
                    </span>
                  </div>
                  <p className="text-xs text-white/50 mb-5 leading-relaxed">{type.description}</p>
                </div>
                <div className="pt-4 border-t border-white/[0.06]">
                  <p className="text-xs text-white/40">Tarief</p>
                  <p className="text-[#E5C583] font-serif italic text-lg font-medium">
                    Vanaf {formatPrice(type.basePrice * type.minQuantity, currency)}
                  </p>
                </div>
              </button>
            </TiltCard>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Quantity Slider */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-[#FAF8F5] font-medium text-sm">Gewenst volume</Label>
              <Badge variant="outline" className="border-[#E5C583]/50 text-[#E5C583] bg-[#E5C583]/10 px-3 py-1 font-mono text-xs">
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
            <div className="flex justify-between text-xs text-white/40 mt-1 font-mono">
              <span>Min: {formatQuantity(streamType?.minQuantity || 100)}</span>
              <span>Max: {formatQuantity(streamType?.maxQuantity || 100000)}</span>
            </div>
          </div>

          {/* Quality Toggle */}
          <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#E5C583]/10 border border-[#E5C583]/30 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#E5C583]" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">Residentiële High-Retention Audits</p>
                <p className="text-xs text-white/50">Verhoogde dwell time, volledige tracks & organische algoritmische versterking</p>
              </div>
            </div>
            <Switch
              checked={isPremium}
              onCheckedChange={setIsPremium}
            />
          </div>

          {/* Track URL Input */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-white/80 text-xs mb-2 block font-medium">Track / Album / Playlist Link</Label>
              <Input
                value={trackUrl}
                onChange={(e) => setTrackUrl(e.target.value)}
                placeholder="https://open.spotify.com/track/..."
                className="bg-white/[0.04] border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-[#E5C583]/50"
              />
            </div>
            <div>
              <Label className="text-white/80 text-xs mb-2 block font-medium">Artiest / Label Identificatie (optioneel)</Label>
              <Input
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                placeholder="Bijv. Nova Sound Studio"
                className="bg-white/[0.04] border-white/10 text-white placeholder:text-white/30 rounded-xl focus:border-[#E5C583]/50"
              />
            </div>
          </div>

          {/* Price Summary */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#E5C583]/10 via-[#0D1117] to-[#10B981]/10 border border-[#E5C583]/25 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/70 text-sm font-light">{formatQuantity(quantity)} × {streamType?.name}</span>
              <span className="text-white font-mono text-sm">{formatPrice(streamType ? streamType.basePrice * quantity : 0, currency)}</span>
            </div>
            {isPremium && (
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70 text-sm font-light">High-Retention Premium allocatie (+50%)</span>
                <span className="text-[#E5C583] font-mono text-sm">+{formatPrice(streamType ? streamType.basePrice * quantity * 0.5 : 0, currency)}</span>
              </div>
            )}
            <div className="border-t border-white/10 pt-4 mt-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-white/50 font-mono block">Totaal investering</span>
                  <span className="text-xs text-white/40">Inclusief BTW & realtime trackingtoken</span>
                </div>
                <span className="font-serif italic text-3xl font-light text-[#E5C583]">
                  {formatPrice(price, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setSelectedType(null)}
              className="flex-1 border-white/15 text-white hover:bg-white/10 rounded-full h-12 cursor-pointer"
            >
              Terug
            </Button>
            <Button
              onClick={handleAddToCart}
              className="flex-1 bg-gradient-to-r from-[#E5C583] via-[#D4AF37] to-[#C5A059] text-[#090B0F] font-bold rounded-full h-12 shadow-[0_0_20px_rgba(229,197,131,0.3)] hover:brightness-110 cursor-pointer"
            >
              <Plus className="w-5 h-5 mr-2" />
              Toevoegen aan selectie
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
