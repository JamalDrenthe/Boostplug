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
    <section id="products" className="relative py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="eyebrow text-[hsl(142,76%,45%)] mb-4">VOOR KLANTEN — EENMALIGE BOOSTS</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Kies je <span className="text-gradient">boost pakket</span>
          </h2>
          <p className="text-white/60 max-w-xl mx-auto">
            Selecteer het platform en de hoeveelheid die bij je past. 
            Directe levering gegarandeerd.
          </p>
        </div>

        {/* Product Selector */}
        <div className="relative">
          {activeCategory === 'streams' ? (
            <StreamsSelector onCheckout={onCheckout} />
          ) : (
            <ReviewsSelector onCheckout={onCheckout} />
          )}
        </div>

        {/* How It Works */}
        <HowItWorks />

        {/* FAQ */}
        <FAQ />
      </div>
    </section>
  );
}
