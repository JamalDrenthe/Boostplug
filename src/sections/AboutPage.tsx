import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Building2,
  Music2,
  Star,
  Shield,
  Rocket,
  ExternalLink,
  Network,
} from 'lucide-react';

interface AboutPageProps {
  onBack: () => void;
  onShop: () => void;
}

const siblings = [
  'WoningVry',
  'Spontiva',
  'Investbotiq',
  'VVC (Verdienende Vrienden Club)',
  'Immigratie Punt',
  'Xabi World',
];

export function AboutPage({ onBack, onShop }: AboutPageProps) {
  return (
    <section className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Terug naar home
        </button>

        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Over <span className="text-gradient">BoostPlug</span>
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            BoostPlug helpt artiesten, merken en ondernemers sneller zichtbaar te worden.
            Met één platform bestel je streams, followers en reviews voor de platforms die
            er voor jou toe doen.
          </p>
        </div>

        {/* Wat we doen */}
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 bg-white/5 border-white/10">
            <div className="w-12 h-12 rounded-xl bg-[hsl(142,76%,45%)]/20 flex items-center justify-center mb-4">
              <Music2 className="w-6 h-6 text-[hsl(142,76%,45%)]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Streams & followers</h3>
            <p className="text-white/50 text-sm">
              Boosts voor Spotify, Apple Music, YouTube Music, SoundCloud, Deezer en Tidal —
              van streams en plays tot followers en subscribers.
            </p>
          </Card>
          <Card className="p-6 bg-white/5 border-white/10">
            <div className="w-12 h-12 rounded-xl bg-[hsl(199,89%,48%)]/20 flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-[hsl(199,89%,48%)]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Reviews</h3>
            <p className="text-white/50 text-sm">
              Reviews op Google Maps, Trustpilot, Amazon, appstores, Yelp, TripAdvisor en
              meer — geschreven door echte mensen met actieve accounts.
            </p>
          </Card>
        </div>

        {/* Waarom */}
        <Card className="p-6 sm:p-8 bg-white/5 border-white/10 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-[hsl(142,76%,45%)]" />
            Waarom BoostPlug
          </h3>
          <ul className="space-y-3 text-white/60">
            <li className="flex gap-3">
              <Shield className="w-5 h-5 text-[hsl(142,76%,45%)] shrink-0 mt-0.5" />
              Guest checkout zonder verplicht account — alleen je e-mailadres voor
              bevestiging en tracking.
            </li>
            <li className="flex gap-3">
              <Rocket className="w-5 h-5 text-[hsl(142,76%,45%)] shrink-0 mt-0.5" />
              Directe levering met realtime ordertracking via je eigen trackingnummer.
            </li>
            <li className="flex gap-3">
              <Building2 className="w-5 h-5 text-[hsl(142,76%,45%)] shrink-0 mt-0.5" />
              Professionele processen en kwaliteitscontrole: geen bots, geen fake accounts.
            </li>
          </ul>
        </Card>

        {/* Het ecosysteem */}
        <Card className="p-6 sm:p-8 bg-white/5 border-white/10 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Network className="w-5 h-5 text-[hsl(199,89%,48%)]" />
            Het ecosysteem: klanten en leden
          </h3>
          <p className="text-white/60 mb-4">
            BoostPlug heeft twee kanten. Aan de ene kant klanten die hun bereik
            willen vergroten; aan de andere kant leden die het netwerk draaiende
            houden via mining met IP-software en GPU. Samen met{' '}
            <span className="text-white/80">Zheavenzy</span> (boosten van artiesten)
            en <span className="text-white/80">Logs.rent</span> (accounts die het
            algoritme beïnvloeden) vormt dat de kracht van BoostPlug: het
            algoritme beïnvloeden. VVC-leden kunnen via Spontiva gebruikmaken van
            BoostPlug.
          </p>
          <a
            href="#/leden"
            className="text-[hsl(142,76%,45%)] hover:text-white transition-colors inline-flex items-center gap-1 text-sm"
          >
            Ontdek de leden-kant
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </Card>

        {/* Quantum Initium Holding */}
        <Card className="p-6 sm:p-8 bg-white/5 border-white/10 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[hsl(142,76%,45%)]/20 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-[hsl(142,76%,45%)]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Onderdeel van Quantum Initium Holding
              </h3>
              <p className="text-white/60 mb-4">
                BoostPlug is een onderneming van{' '}
                <a
                  href="https://quantuminitium.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[hsl(142,76%,45%)] hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  Quantum Initium Holding
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                , de holding waaronder ook {siblings.slice(0, -1).join(', ')} en{' '}
                {siblings[siblings.length - 1]} vallen. Die ruggensteuning staat voor
                professionele processen, betrouwbare levering en een vast aanspreekpunt.
              </p>
              <div className="flex flex-wrap gap-2">
                {siblings.map((name) => (
                  <span
                    key={name}
                    className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="text-center">
          <Button
            size="lg"
            onClick={onShop}
            className="bg-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,40%)] text-[hsl(220,35%,6%)] font-semibold px-8 py-6 text-lg rounded-full"
          >
            Bekijk de producten
          </Button>
        </div>
      </div>
    </section>
  );
}
