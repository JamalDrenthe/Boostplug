import { useStore } from '@/hooks/useStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Music2, 
  Star, 
  TrendingUp, 
  Shield, 
  Clock, 
  Zap,
  ChevronDown,
  CheckCircle2,
  Building2
} from 'lucide-react';

interface HeroProps {
  onMembers: () => void;
}

export function Hero({ onMembers }: HeroProps) {
  const { activeCategory, setActiveCategory } = useStore();

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-16 px-4 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[hsl(142,76%,45%)]/10 rounded-full blur-[150px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[hsl(199,89%,48%)]/10 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-slide-up">
          <Badge variant="default" className="bg-[hsl(142,76%,45%)]/20 text-[hsl(142,76%,45%)] border-0">
            <Zap className="w-3 h-3 mr-1" />
            Nieuw
          </Badge>
          <span className="text-sm text-white/70">Onderdeel van Quantum Initium Holding</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Boost je{' '}
          <span className="text-gradient">online aanwezigheid</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          Verhoog je streams, followers en reviews met één klik — of word lid en
          verdien mee aan het netwerk. De kracht van BoostPlug: het algoritme beïnvloeden.
        </p>

        {/* Category Tabs */}
        <div className="flex justify-center mb-10 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Tabs 
            value={activeCategory} 
            onValueChange={(v) => setActiveCategory(v as 'streams' | 'reviews')}
            className="bg-white/5 backdrop-blur-xl rounded-2xl p-1.5 border border-white/10"
          >
            <TabsList className="bg-transparent h-auto p-0 gap-1">
              <TabsTrigger 
                value="streams"
                className="data-[state=active]:bg-[hsl(142,76%,45%)] data-[state=active]:text-[hsl(220,35%,6%)] px-6 py-3 rounded-xl text-white/70 hover:text-white transition-all"
              >
                <Music2 className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Streams</span>
                <span className="sm:hidden">Music</span>
              </TabsTrigger>
              <TabsTrigger 
                value="reviews"
                className="data-[state=active]:bg-[hsl(199,89%,48%)] data-[state=active]:text-white px-6 py-3 rounded-xl text-white/70 hover:text-white transition-all"
              >
                <Star className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Reviews</span>
                <span className="sm:hidden">Stars</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <Button 
            size="lg"
            onClick={scrollToProducts}
            className="bg-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,40%)] text-[hsl(220,35%,6%)] font-semibold px-8 py-6 text-lg rounded-xl shadow-glow hover:shadow-[0_0_30px_hsl(142,76%,45%)/0.5] transition-all"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            Start nu
          </Button>
          <Button 
            variant="outline"
            size="lg"
            onClick={scrollToProducts}
            className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl"
          >
            Bekijk prijzen
          </Button>
          <Button 
            variant="ghost"
            size="lg"
            onClick={onMembers}
            className="text-white/70 hover:text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl"
          >
            Word lid & verdien mee →
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center gap-2 text-white/50">
            <CheckCircle2 className="w-5 h-5 text-[hsl(142,76%,45%)]" />
            <span className="text-sm">10.000+ tevreden klanten</span>
          </div>
          <div className="flex items-center gap-2 text-white/50">
            <Shield className="w-5 h-5 text-[hsl(142,76%,45%)]" />
            <span className="text-sm">100% veilig & discreet</span>
          </div>
          <div className="flex items-center gap-2 text-white/50">
            <Clock className="w-5 h-5 text-[hsl(142,76%,45%)]" />
            <span className="text-sm">Directe levering</span>
          </div>
          <div className="flex items-center gap-2 text-white/50">
            <Building2 className="w-5 h-5 text-[hsl(142,76%,45%)]" />
            <span className="text-sm">Een onderneming van Quantum Initium Holding</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-white/30" />
        </div>
      </div>
    </section>
  );
}
