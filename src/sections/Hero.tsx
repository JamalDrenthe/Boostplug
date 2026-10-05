import { useStore } from '@/hooks/useStore';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Music2, 
  Star, 
  Shield, 
  Clock, 
  ChevronDown,
  CheckCircle2,
  Building2,
  ArrowRight,
  Users
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
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-20 px-4 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[hsl(142,76%,45%)]/10 rounded-full blur-[150px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[hsl(199,89%,48%)]/10 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
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
        {/* Eyebrow */}
        <p className="eyebrow text-[hsl(142,76%,45%)] mb-6 animate-slide-up">
          Algoritme-beïnvloeding · Onderdeel van Quantum Initium Holding
        </p>

        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold leading-[1.02] text-white mb-6 animate-slide-up" style={{ animationDelay: '0.1s', letterSpacing: '-0.045em' }}>
          Boost je{' '}
          <span className="text-gradient">online aanwezigheid</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-white/55 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          Verhoog je streams, followers en reviews met één klik — of word lid en
          verdien mee aan het netwerk. De kracht van BoostPlug: het algoritme beïnvloeden.
        </p>

        {/* Category Tabs */}
        <div className="flex justify-center mb-10 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Tabs 
            value={activeCategory} 
            onValueChange={(v) => setActiveCategory(v as 'streams' | 'reviews')}
            className="bg-white/5 backdrop-blur-xl rounded-full p-1.5 border border-white/10"
          >
            <TabsList className="bg-transparent h-auto p-0 gap-1">
              <TabsTrigger 
                value="streams"
                className="data-[state=active]:bg-[hsl(142,76%,45%)] data-[state=active]:text-[hsl(220,35%,6%)] px-6 py-2.5 rounded-full text-white/70 hover:text-white transition-all font-medium"
              >
                <Music2 className="w-4 h-4 mr-2" />
                Streams
              </TabsTrigger>
              <TabsTrigger 
                value="reviews"
                className="data-[state=active]:bg-[hsl(199,89%,48%)] data-[state=active]:text-white px-6 py-2.5 rounded-full text-white/70 hover:text-white transition-all font-medium"
              >
                <Star className="w-4 h-4 mr-2" />
                Reviews
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* CTA Buttons — pill style per awesome-design-md */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <Button 
            size="lg"
            onClick={scrollToProducts}
            className="bg-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,40%)] text-[hsl(220,35%,6%)] font-semibold px-8 py-6 text-base rounded-full transition-all hover:scale-[1.03]"
          >
            Start nu
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button 
            size="lg"
            onClick={onMembers}
            className="bg-white/10 hover:bg-white/15 text-white border border-white/15 font-medium px-8 py-6 text-base rounded-full"
          >
            <Users className="w-5 h-5 mr-2" />
            Voor leden
          </Button>
          <Button 
            variant="ghost"
            size="lg"
            onClick={scrollToProducts}
            className="text-white/60 hover:text-white hover:bg-white/5 px-6 py-6 text-base rounded-full"
          >
            Bekijk prijzen
          </Button>
        </div>

        {/* Trust Indicators — mono label row */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center gap-2 text-white/45">
            <CheckCircle2 className="w-4 h-4 text-[hsl(142,76%,45%)]" />
            <span className="text-sm">10.000+ tevreden klanten</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/15" />
          <div className="flex items-center gap-2 text-white/45">
            <Shield className="w-4 h-4 text-[hsl(142,76%,45%)]" />
            <span className="text-sm">100% veilig & discreet</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/15" />
          <div className="flex items-center gap-2 text-white/45">
            <Clock className="w-4 h-4 text-[hsl(142,76%,45%)]" />
            <span className="text-sm">Directe levering</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/15" />
          <div className="flex items-center gap-2 text-white/45">
            <Building2 className="w-4 h-4 text-[hsl(142,76%,45%)]" />
            <span className="text-sm">Quantum Initium Holding</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-white/30" />
        </div>
      </div>
    </section>
  );
}
