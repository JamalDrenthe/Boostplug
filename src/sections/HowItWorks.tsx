import { motion } from 'framer-motion';
import { 
  MousePointerClick, 
  CreditCard, 
  Rocket,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { TiltCard } from '@/components/ui/TiltCard';

const steps = [
  {
    icon: MousePointerClick,
    stepNum: '01',
    title: 'Curatie & Parameters',
    description: 'Selecteer streamingdiensten of reviewsuites en bepaal het gewenste volume met verfijnde sliders.',
    color: '#E5C583',
  },
  {
    icon: CreditCard,
    stepNum: '02',
    title: 'Discreet Afrekenen',
    description: 'Geen registratieverplichting. Directe veilige betaling via Stripe met direct realtime audit tracking token.',
    color: '#FAF8F5',
  },
  {
    icon: Rocket,
    stepNum: '03',
    title: 'Drip-Feed Residentieel',
    description: 'Natuurlijke, gespreide allocatie via actieve residentiële netwerkverbindingen zonder verdachte pieken.',
    color: '#10B981',
  },
];

const stats = [
  { value: '1.850+', label: 'Geverifieerde campagnes', detail: '100% traceerbaar met KvK-garantie' },
  { value: '145 /uur', label: 'Capaciteit per residentiële node', detail: 'Hardware-gevalideerd door VVC' },
  { value: '99,4%', label: 'Statistische retentiescore', detail: 'Algoritmisch veilig voor Spotify & Google' },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 scroll-mt-24">
      <motion.div 
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E5C583]/10 border border-[#E5C583]/20 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#E5C583]" />
          <p className="text-[11px] font-semibold text-[#E5C583] tracking-[0.2em] uppercase font-mono">
            DISCRETE ARCHITECTUUR
          </p>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
          Hoe ons netwerk{' '}
          <span className="font-serif italic font-normal text-gold-gradient">
            functioneert
          </span>
        </h2>
        <p className="text-[#FAF8F5]/60 max-w-xl mx-auto text-sm sm:text-base font-light leading-relaxed">
          In drie transparante stappen naar organische tractie en een onweerstaanbare online autoriteit.
        </p>
      </motion.div>

      {/* Steps */}
      <div className="grid md:grid-cols-3 gap-6 mb-20">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <TiltCard glowColor="gold" className="h-full">
              <div className="p-8 rounded-3xl bg-[#0D1117]/80 border border-white/[0.08] hover:border-[#E5C583]/40 transition-all h-full flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-serif italic text-3xl font-light text-[#E5C583]/80 group-hover:text-[#E5C583] transition-colors">
                      {step.stepNum}
                    </span>
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg"
                      style={{ backgroundColor: `${step.color}15`, border: `1px solid ${step.color}30` }}
                    >
                      <step.icon className="w-5 h-5" style={{ color: step.color }} />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#E5C583] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/50 leading-relaxed font-light">
                    {step.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center gap-2 text-[11px] text-[#E5C583]/80 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Strikt residentieel & KvK conform</span>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((stat, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="p-8 rounded-3xl bg-[#0D1117]/70 border border-[#E5C583]/20 text-center relative overflow-hidden group hover:border-[#E5C583]/50 transition-all"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E5C583]/5 rounded-full blur-2xl group-hover:bg-[#E5C583]/10 transition-colors pointer-events-none" />
            <p className="font-serif italic text-4xl sm:text-5xl font-light text-[#E5C583] mb-2 tracking-tight">
              {stat.value}
            </p>
            <p className="text-sm font-medium text-white mb-1">{stat.label}</p>
            <p className="text-xs text-white/40 font-mono">{stat.detail}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
