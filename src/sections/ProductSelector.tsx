import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/hooks/useStore';
import { StreamsSelector } from '@/sections/StreamsSelector';
import { ReviewsSelector } from '@/sections/ReviewsSelector';
import { HowItWorks } from '@/sections/HowItWorks';
import { FAQ } from '@/sections/FAQ';

interface ProductSelectorProps {
  onCheckout: () => void;
}

export function ProductSelector({ onCheckout }: ProductSelectorProps) {
  const { activeCategory } = useStore();

  return (
    <section id="products" className="relative py-24 px-4 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E5C583]/10 border border-[#E5C583]/20 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5C583] animate-pulse" />
            <p className="text-[11px] font-semibold text-[#E5C583] tracking-[0.2em] uppercase font-mono">
              CURATED DIGITAL ASSETS • EENMALIGE DIRECTE BOOSTS
            </p>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Selecteer je{' '}
            <span className="font-serif italic font-normal text-gold-gradient">
              Bespoke Groeipakket
            </span>
          </h2>
          <p className="text-[#FAF8F5]/60 max-w-xl mx-auto text-sm sm:text-base font-light leading-relaxed">
            Kies het gewenste platform en volume met chirurgische precisie. 
            Directe residentiële distributie met discrete drip-feed en realtime audit logs.
          </p>
        </motion.div>

        {/* Product Selector with AnimatePresence */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {activeCategory === 'streams' ? (
              <motion.div
                key="streams"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                <StreamsSelector onCheckout={onCheckout} />
              </motion.div>
            ) : (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                <ReviewsSelector onCheckout={onCheckout} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* How It Works */}
        <HowItWorks />

        {/* FAQ */}
        <FAQ />
      </div>
    </section>
  );
}
