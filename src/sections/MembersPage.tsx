import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Cpu,
  Globe,
  Coins,
  Music2,
  KeyRound,
  Users,
  Network,
  ArrowRight,
} from 'lucide-react';

interface MembersPageProps {
  onBack: () => void;
  onJoin: () => void;
  onShop: () => void;
}

const ecosystem = [
  {
    icon: Cpu,
    title: 'Leden & mining',
    text: 'Onze leden zijn verantwoordelijk voor de mining. Via IP-software en GPU-kracht draaien zij het netwerk dat BoostPlug aandrijft.',
  },
  {
    icon: Music2,
    title: 'Zheavenzy',
    text: 'Zheavenzy gebruikt BoostPlug om hun artiesten te boosten — van opkomende namen tot gevestigde acts op zheavenzy.one.',
  },
  {
    icon: KeyRound,
    title: 'Logs.rent',
    text: 'Logs.rent levert de accounts waarmee het algoritme wordt beïnvloed — de brandstof achter elke boost.',
  },
  {
    icon: Users,
    title: 'VVC via Spontiva',
    text: 'Leden van de Verdienende Vrienden Club kunnen via Spontiva gebruikmaken van BoostPlug, onderdeel van het Quantum Initium-ecosysteem.',
  },
];

export function MembersPage({ onBack, onJoin, onShop }: MembersPageProps) {
  return (
    <section className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Terug naar home
        </button>

        <div className="text-center mb-14">
          <p className="eyebrow text-[hsl(199,89%,48%)] mb-4">VOOR LEDEN</p>
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white mb-4">
            De leden-kant van <span className="text-gradient">BoostPlug</span>
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Klanten kopen boosts. Leden maken ze mogelijk — en verdienen eraan.
            Dat is de kracht van BoostPlug: het algoritme beïnvloeden.
          </p>
        </div>

        {/* Twee kanten */}
        <div className="grid md:grid-cols-2 gap-6 mb-14">
          <Card className="p-8 bg-white/5 border-white/10 rounded-2xl">
            <p className="eyebrow text-[hsl(142,76%,45%)] mb-3">KANT 1 — KLANTEN</p>
            <h3 className="text-xl font-semibold text-white mb-3">Je bereik laten groeien</h3>
            <p className="text-white/55 text-sm mb-6">
              Artiesten, merken en ondernemers bestellen streams, followers en
              reviews — eenmalig of als maandelijks abonnement.
            </p>
            <Button
              variant="outline"
              onClick={onShop}
              className="border-white/20 text-white hover:bg-white/10 rounded-full"
            >
              Bekijk producten
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
          <Card className="p-8 bg-[hsl(142,76%,45%)]/[0.06] border-[hsl(142,76%,45%)]/30 rounded-2xl">
            <p className="eyebrow text-[hsl(142,76%,45%)] mb-3">KANT 2 — LEDEN</p>
            <h3 className="text-xl font-semibold text-white mb-3">Verdien met je netwerkkracht</h3>
            <p className="text-white/55 text-sm mb-6">
              Leden leveren de mining-capaciteit — IP-software en GPU — waarmee
              BoostPlug algoritmes beïnvloedt. Jij draait mee, jij verdient mee.
            </p>
            <Button
              onClick={onJoin}
              className="bg-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,40%)] text-[hsl(220,35%,6%)] rounded-full font-medium"
            >
              <Coins className="w-4 h-4 mr-2" />
              Word lid
            </Button>
          </Card>
        </div>

        {/* Hoe het werkt voor leden */}
        <Card className="p-6 sm:p-10 bg-white/5 border-white/10 rounded-2xl mb-14">
          <p className="eyebrow text-[hsl(199,89%,48%)] mb-3">ZO WERKT HET</p>
          <h2 className="text-2xl font-semibold text-white mb-8 tracking-tight">
            Van GPU-kracht naar algoritme-impact
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <div>
              <div className="w-11 h-11 rounded-xl bg-[hsl(142,76%,45%)]/15 flex items-center justify-center mb-4">
                <Cpu className="w-5 h-5 text-[hsl(142,76%,45%)]" />
              </div>
              <h4 className="text-white font-medium mb-2">1. Mining</h4>
              <p className="text-white/50 text-sm">
                Leden draaien de mining via IP-software en GPU — het fundament
                van het BoostPlug-netwerk.
              </p>
            </div>
            <div>
              <div className="w-11 h-11 rounded-xl bg-[hsl(199,89%,48%)]/15 flex items-center justify-center mb-4">
                <KeyRound className="w-5 h-5 text-[hsl(199,89%,48%)]" />
              </div>
              <h4 className="text-white font-medium mb-2">2. Accounts & reach</h4>
              <p className="text-white/50 text-sm">
                Via Logs.rent komen de accounts beschikbaar waarmee het
                algoritme wordt beïnvloed.
              </p>
            </div>
            <div>
              <div className="w-11 h-11 rounded-xl bg-[hsl(142,76%,45%)]/15 flex items-center justify-center mb-4">
                <Globe className="w-5 h-5 text-[hsl(142,76%,45%)]" />
              </div>
              <h4 className="text-white font-medium mb-2">3. Algoritme-boost</h4>
              <p className="text-white/50 text-sm">
                Klanten en partners zoals Zheavenzy boosten hun artiesten —
                dat is de kracht van BoostPlug.
              </p>
            </div>
          </div>
        </Card>

        {/* Ecosysteem */}
        <div className="mb-14">
          <div className="text-center mb-10">
            <p className="eyebrow text-[hsl(142,76%,45%)] mb-3">ECOSYSTEEM</p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              Verbonden binnen Quantum Initium
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {ecosystem.map(({ icon: Icon, title, text }) => (
              <Card key={title} className="p-6 bg-white/5 border-white/10 rounded-2xl">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[hsl(142,76%,45%)]/15 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[hsl(142,76%,45%)]" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">{title}</h4>
                    <p className="text-white/50 text-sm">{text}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Card className="p-8 sm:p-10 text-center bg-gradient-to-br from-[hsl(142,76%,45%)]/10 to-[hsl(199,89%,48%)]/10 border-white/10 rounded-2xl">
          <Network className="w-10 h-10 mx-auto mb-4 text-[hsl(142,76%,45%)]" />
          <h2 className="text-2xl font-semibold text-white mb-3 tracking-tight">
            Sluit je aan bij het netwerk
          </h2>
          <p className="text-white/60 max-w-xl mx-auto mb-6">
            Maak een account aan om lid te worden van het BoostPlug-netwerk.
            VVC-leden koppelen via Spontiva.
          </p>
          <Button
            size="lg"
            onClick={onJoin}
            className="bg-[hsl(142,76%,45%)] hover:bg-[hsl(142,76%,40%)] text-[hsl(220,35%,6%)] font-medium rounded-full px-8"
          >
            Word lid van BoostPlug
          </Button>
        </Card>
      </div>
    </section>
  );
}
