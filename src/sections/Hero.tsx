import { useStore } from '@/hooks/useStore';
import { Button } from '@/components/ui/button';
import { 
  Music2, 
  Star, 
  ShieldCheck, 
  Clock, 
  ChevronDown, 
  CheckCircle2, 
  Building2, 
  ArrowRight, 
  Users, 
  Sparkles,
  Layers,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LuxuryScene3D } from '@/components/3d/LuxuryScene3D';

interface HeroProps {
  onMembers: () => void;
}

export function Hero({ onMembers }: HeroProps) {
  const { activeCategory, setActiveCategory } = useStore();

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[94vh] flex flex-col items-center justify-center pt-32 pb-24 px-4 overflow-hidden">
      {/* 3D Luxury Interactive Background Scene */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
        <LuxuryScene3D className="w-[850px] h-[850px] opacity-75 sm:opacity-90 transform -translate-y-8 scale-90 sm:scale-100" />
        
        {/* Ambient Warm Vignette & Silk Sheen */}
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(229, 197, 131, 0.12) 0%, rgba(16, 185, 129, 0.04) 40%, transparent 70%)',
          }}
        />
        <div 
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Luxury Atelier Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-[#E5C583]/30 backdrop-blur-xl mb-8 shadow-[0_4px_20px_-5px_rgba(229,197,131,0.2)]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#E5C583] animate-pulse" />
          <p className="eyebrow text-[#E5C583] tracking-[0.2em] text-[10.5px]">
            ATELIER DIGITAL · RESIDENTIËLE DISTRIBUTIE · QUANTUM INITIUM
          </p>
          <Sparkles className="w-3.5 h-3.5 text-[#E5C583]/80" />
        </motion.div>

        {/* Main Heading with High-Fashion Editorial Typography */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.4rem] font-bold leading-[1.03] text-white mb-6 tracking-tight"
        >
          Bespoke Bereik &amp;{' '}
          <span className="font-serif italic font-normal text-gold-gradient block sm:inline">
            Digitale Status
          </span>
        </motion.h1>

        {/* Subheading in Cashmere White */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg md:text-xl text-[#E8E5DF]/75 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
        >
          Exclusieve streaming- en reviewgroei via gecontroleerde residentiële drip-feed distributie. Of activeer een hardware node binnen het Quantum Initium ecosysteem voor een vaste maandelijkse vergoeding.
        </motion.p>

        {/* Fluid Category Selector with Framer Motion layoutId */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center mb-10"
        >
          <div className="relative inline-flex p-1.5 rounded-full bg-black/40 backdrop-blur-2xl border border-white/[0.12] shadow-2xl">
            <button
              onClick={() => setActiveCategory('streams')}
              className={`relative z-10 flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                activeCategory === 'streams' ? 'text-black font-semibold' : 'text-white/70 hover:text-white'
              }`}
            >
              <Music2 className="w-4 h-4" />
              <span>Streaming Distributie</span>
            </button>

            <button
              onClick={() => setActiveCategory('reviews')}
              className={`relative z-10 flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                activeCategory === 'reviews' ? 'text-black font-semibold' : 'text-white/70 hover:text-white'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Geverifieerde Reviews</span>
            </button>

            {/* Sliding Fluid Indicator */}
            {activeCategory === 'streams' ? (
              <motion.div
                layoutId="heroTabIndicator"
                className="absolute inset-1.5 w-[calc(50%-6px)] rounded-full bg-gradient-to-r from-[#F5E6CA] via-[#E5C583] to-[#DFB86C] shadow-[0_4px_20px_rgba(229,197,131,0.35)]"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            ) : (
              <motion.div
                layoutId="heroTabIndicator"
                className="absolute inset-1.5 left-[calc(50%+3px)] w-[calc(50%-6px)] rounded-full bg-gradient-to-r from-[#A7F3D0] via-[#34D399] to-[#10B981] shadow-[0_4px_20px_rgba(16,185,129,0.35)]"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </div>
        </motion.div>

        {/* CTA Buttons in Luxury Atelier Styling */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Button 
              size="lg"
              onClick={scrollToProducts}
              className="relative overflow-hidden bg-gradient-to-r from-[#F5E6CA] via-[#E5C583] to-[#DFB86C] hover:from-[#FFF1D7] hover:to-[#E6C275] text-[#14120D] font-bold px-8 py-6 text-sm sm:text-base rounded-full shadow-[0_8px_30px_-5px_rgba(229,197,131,0.4)] transition-all cursor-pointer group"
            >
              <span className="relative z-10 flex items-center gap-2">
                Configureer Campagne
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Button 
              size="lg"
              onClick={onMembers}
              className="bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.15] hover:border-[#E5C583]/40 font-medium px-8 py-6 text-sm sm:text-base rounded-full backdrop-blur-xl transition-all cursor-pointer shadow-lg"
            >
              <Users className="w-4 h-4 mr-2 text-[#E5C583]" />
              Voor Leden &amp; VVC Nodes
            </Button>
          </motion.div>

          <motion.a 
            href="#/integraties"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#E5C583] hover:text-[#FAF3E3] px-5 py-3 rounded-full hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>10 Ecosysteem Integraties</span>
          </motion.a>
        </motion.div>

        {/* Quality Seal & Trust Ribbon in Fine Horology Style */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.55 }}
          className="inline-flex flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 py-3.5 rounded-2xl bg-white/[0.025] border border-white/[0.08] backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]"
        >
          <div className="flex items-center gap-2 text-[#E8E5DF]/70 text-xs sm:text-sm">
            <CheckCircle2 className="w-4 h-4 text-[#E5C583]" />
            <span>99,4% Drip-Feed Retentie</span>
          </div>
          <div className="hidden sm:block w-px h-3.5 bg-white/10" />
          <div className="flex items-center gap-2 text-[#E8E5DF]/70 text-xs sm:text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Echte residentiële KPN/Ziggo nodes</span>
          </div>
          <div className="hidden sm:block w-px h-3.5 bg-white/10" />
          <div className="flex items-center gap-2 text-[#E8E5DF]/70 text-xs sm:text-sm">
            <Clock className="w-4 h-4 text-[#E5C583]" />
            <span>Actief binnen 15 minuten</span>
          </div>
          <div className="hidden sm:block w-px h-3.5 bg-white/10" />
          <div className="flex items-center gap-2 text-[#E8E5DF]/70 text-xs sm:text-sm">
            <Building2 className="w-4 h-4 text-sky-400" />
            <span>Quantum Initium</span>
          </div>
        </motion.div>

        {/* Subtle Luxury Scroll Indicator */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 animate-bounce opacity-40 hover:opacity-100 transition-opacity">
          <ChevronDown className="w-5 h-5 text-[#E5C583]" />
        </div>
      </div>
    </section>
  );
}
