import { 
  MousePointerClick, 
  CreditCard, 
  Rocket,
  TrendingUp,
  LineChart,
  BarChart3
} from 'lucide-react';

const steps = [
  {
    icon: MousePointerClick,
    title: 'Kies je platform',
    description: 'Kies je streamingdienst of reviewplatform en selecteer het gewenste volume.',
    color: 'hsl(142,76%,45%)',
  },
  {
    icon: CreditCard,
    title: 'Afrekenen zonder account',
    description: 'Geen verplichte registratie. Vul je link in en betaal via iDEAL, Bancontact of kaart.',
    color: 'hsl(199,89%,48%)',
  },
  {
    icon: Rocket,
    title: 'Drip-feed distributie',
    description: 'De order start snel en wordt natuurlijk verspreid via actieve residentiële verbindingen.',
    color: 'hsl(142,76%,45%)',
  },
];

const stats = [
  { value: '1.850+', label: 'Geverifieerde campagnes', icon: TrendingUp },
  { value: '145 /uur', label: 'Capaciteit per node', icon: LineChart },
  { value: '99,4%', label: 'Retentiescore', icon: BarChart3 },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 scroll-mt-24">
      <div className="text-center mb-16">
        <p className="eyebrow text-[hsl(199,89%,48%)] mb-4">WERKWIJZE</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Hoe het <span className="text-gradient">werkt</span>
        </h2>
        <p className="text-white/60 max-w-xl mx-auto">
          In drie stappen naar meer organische tractie. Eenvoudig, discreet en met live ordertracking.
        </p>
      </div>

      {/* Steps */}
      <div className="grid md:grid-cols-3 gap-8 mb-20">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-white/20 to-transparent" />
            )}
            
            <div className="text-center">
              <div 
                className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center relative"
                style={{ backgroundColor: `${step.color}15` }}
              >
                <step.icon className="w-10 h-10" style={{ color: step.color }} />
                <div 
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ backgroundColor: step.color, color: 'hsl(220,35%,6%)' }}
                >
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-white/60">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 sm:gap-8">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/10 text-center"
          >
            <stat.icon className="w-8 h-8 mx-auto mb-4 text-[hsl(142,76%,45%)]" />
            <p className="text-2xl sm:text-4xl font-bold text-white mb-2">{stat.value}</p>
            <p className="text-sm text-white/50">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
