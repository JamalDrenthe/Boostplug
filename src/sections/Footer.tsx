import { 
  Music2, 
  Star, 
  Shield, 
  Clock, 
  Mail,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react';
import { BoostPlugLogo } from '@/components/common/BoostPlugLogo';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[hsl(220,35%,6%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <BoostPlugLogo size="md" subtitle="QUANTUM INITIUM HOLDING" />
            </div>
            <p className="text-white/50 mb-6">
              Boost je online aanwezigheid met streams en reviews. 
              Geen account nodig, directe levering.
            </p>
            <p className="text-white/50 mb-6">
              BoostPlug is een onderneming van{' '}
              <a
                href="#/integraties"
                className="text-[hsl(142,76%,45%)] hover:text-white transition-colors font-medium"
              >
                Quantum Initium
              </a>
              {' '}— naast onder meer Verdienende Vrienden Club (VVC), Spontiva, Investbotiq, Zheavenzy en WoningVry.
            </p>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="eyebrow text-white/60 mb-6">Producten</h4>
            <ul className="space-y-3">
              <li>
                <a href="#products" className="text-white/50 hover:text-white transition-colors flex items-center gap-2">
                  <Music2 className="w-4 h-4" />
                  Spotify Streams
                </a>
              </li>
              <li>
                <a href="#products" className="text-white/50 hover:text-white transition-colors flex items-center gap-2">
                  <Music2 className="w-4 h-4" />
                  Apple Music
                </a>
              </li>
              <li>
                <a href="#products" className="text-white/50 hover:text-white transition-colors flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Google Reviews
                </a>
              </li>
              <li>
                <a href="#products" className="text-white/50 hover:text-white transition-colors flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Trustpilot
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="eyebrow text-white/60 mb-6">Bedrijf</h4>
            <ul className="space-y-3">
              <li>
                <a href="#/over-ons" className="text-white/50 hover:text-white transition-colors">
                  Over ons
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-white/50 hover:text-white transition-colors">
                  Hoe het werkt
                </a>
              </li>
              <li>
                <a href="#/leden" className="text-white/50 hover:text-white transition-colors">
                  Voor leden
                </a>
              </li>
              <li>
                <a href="#/vacatures" className="text-white/70 hover:text-[#E5C583] transition-colors flex items-center gap-1.5 font-medium">
                  Vacatures & Djobba
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#E5C583]/20 text-[#E5C583] font-mono">Talent</span>
                </a>
              </li>
              <li>
                <a href="#/integraties" className="text-white/70 hover:text-[hsl(142,76%,45%)] transition-colors flex items-center gap-1.5 font-medium">
                  Integraties & Ecosysteem
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[hsl(142,76%,45%)]/20 text-[hsl(142,76%,45%)] font-mono">10</span>
                </a>
              </li>
              <li>
                <a href="#/integraties#vvc" className="text-sky-400 hover:text-sky-300 transition-colors font-medium">
                  VVC Hardware Nodes
                </a>
              </li>
              <li>
                <a href="#/account" className="text-white/50 hover:text-white transition-colors">
                  Mijn account
                </a>
              </li>
              <li>
                <a href="mailto:support@boostplug.one" className="text-white/50 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="eyebrow text-white/60 mb-6">Juridisch</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white/50 hover:text-white transition-colors">
                  Algemene voorwaarden
                </a>
              </li>
              <li>
                <a href="#" className="text-white/50 hover:text-white transition-colors">
                  Privacy policy
                </a>
              </li>
              <li>
                <a href="#" className="text-white/50 hover:text-white transition-colors">
                  Cookie policy
                </a>
              </li>
              <li>
                <a href="#" className="text-white/50 hover:text-white transition-colors">
                  Refund policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-2 text-white/40">
              <Shield className="w-5 h-5" />
              <span className="text-sm">SSL Beveiligd</span>
            </div>
            <div className="flex items-center gap-2 text-white/40">
              <Clock className="w-5 h-5" />
              <span className="text-sm">24/7 Support</span>
            </div>
            <div className="flex items-center gap-2 text-white/40">
              <Mail className="w-5 h-5" />
              <span className="text-sm">support@boostplug.one</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} BoostPlug — een onderneming van Quantum Initium. Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </footer>
  );
}
