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

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[hsl(220,35%,6%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[hsl(220,30%,15%)] to-[hsl(220,35%,8%)] border border-white/10" />
                <div className="relative flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[hsl(142,76%,45%)]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[hsl(199,89%,48%)]" />
                </div>
              </div>
              <span className="text-xl font-bold text-white">
                BOAST<span className="text-[hsl(142,76%,45%)]">PLUG</span>
              </span>
            </div>
            <p className="text-white/50 mb-6">
              Boost je online aanwezigheid met streams en reviews. 
              Geen account nodig, directe levering.
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
            <h4 className="text-white font-semibold mb-6">Producten</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white/50 hover:text-white transition-colors flex items-center gap-2">
                  <Music2 className="w-4 h-4" />
                  Spotify Streams
                </a>
              </li>
              <li>
                <a href="#" className="text-white/50 hover:text-white transition-colors flex items-center gap-2">
                  <Music2 className="w-4 h-4" />
                  Apple Music
                </a>
              </li>
              <li>
                <a href="#" className="text-white/50 hover:text-white transition-colors flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Google Reviews
                </a>
              </li>
              <li>
                <a href="#" className="text-white/50 hover:text-white transition-colors flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Trustpilot
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-6">Bedrijf</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white/50 hover:text-white transition-colors">
                  Over ons
                </a>
              </li>
              <li>
                <a href="#" className="text-white/50 hover:text-white transition-colors">
                  Hoe het werkt
                </a>
              </li>
              <li>
                <a href="#" className="text-white/50 hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-white/50 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-6">Juridisch</h4>
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
              <span className="text-sm">support@boastplug.com</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} BoastPlug. Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </footer>
  );
}
