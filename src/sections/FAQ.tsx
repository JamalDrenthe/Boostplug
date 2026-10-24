import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'Is BoostPlug veilig om te gebruiken?',
    answer: 'Ja, absoluut. We werken met geavanceerde distributiemethoden die volledig veilig zijn voor je accounts. Onze streams en reviews komen van echte, actieve residentiële gebruikers via het gedecentraliseerde hardwarenetwerk van Quantum Initium. We leveren nooit bots of datacenter-proxies.',
  },
  {
    question: 'Hoe snel wordt mijn bestelling geleverd?',
    answer: 'Streams beginnen discreet binnen 1-24 uur na bevestiging en worden via een natuurlijke curve verdeeld. Reviews worden geplaatst met een natuurlijke tussentijd van 24-72 uur. Je volgt de live voortgang met je persoonlijke audit token.',
  },
  {
    question: 'Heb ik een account nodig?',
    answer: 'Nee. Bij BoostPlug bestel je direct via guest checkout: je hebt geen account nodig, alleen je e-mailadres voor de orderbevestiging en je unieke realtime trackingtoken.',
  },
  {
    question: 'Welke betaalmethoden accepteren jullie?',
    answer: 'We accepteren iDEAL (Nederland), creditcard (Visa, Mastercard, American Express), PayPal, Bancontact en diverse andere lokale betaalmethoden. Alle betalingen worden veilig verwerkt via Stripe met officiële KvK-facturatie.',
  },
  {
    question: 'Kan ik mijn bestelling annuleren?',
    answer: 'Zolang je bestelling nog niet is gestart met verwerken, kun je deze kosteloos annuleren en krijg je het volledige bedrag direct gerestitueerd via Stripe.',
  },
  {
    question: 'Wat als mijn reviews niet worden geplaatst?',
    answer: 'We garanderen plaatsing van alle reviews met onze 30-dagen retentiebescherming. Mocht er onverhoopt iets wegvallen, dan wordt dit kosteloos herplaatst of gerestitueerd.',
  },
  {
    question: 'Zijn de reviews echt of nep?',
    answer: 'Onze reviews worden geplaatst via actieve residentiële accounts op de betreffende platforms. Ze worden natuurlijk verdeeld en sluiten inhoudelijk exact aan op je bedrijf of branche.',
  },
  {
    question: 'Wie zit er achter BoostPlug?',
    answer: 'BoostPlug is een geregistreerde onderneming van Quantum Initium, het holdingnetwerk waaronder ook WoningVry, Spontiva, Investbotiq, VVC (Verdienende Vrienden Club), Immigratie Punt en Xabi World vallen. Dit garandeert duidelijke juridische processen, transparante facturatie en een vast Nederlands aanspreekpunt.',
  },
  {
    question: 'Kan ik zelf de review tekst bepalen?',
    answer: 'Ja, bij alle suites kun je optioneel je eigen gewenste tekst of richtlijnen opgeven. Laat je het veld open, dan schrijft ons ervaren redactieteam een hoogwaardige, contextuele review.',
  },
];

export function FAQ() {
  return (
    <section className="py-24">
      <motion.div 
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E5C583]/10 border border-[#E5C583]/20 mb-4">
          <HelpCircle className="w-3.5 h-3.5 text-[#E5C583]" />
          <p className="text-[11px] font-semibold text-[#E5C583] tracking-[0.2em] uppercase font-mono">
            VRAGEN & TRANSPARANTIE
          </p>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
          Veelgestelde{' '}
          <span className="font-serif italic font-normal text-gold-gradient">
            Vragen
          </span>
        </h2>
        <p className="text-[#FAF8F5]/60 max-w-xl mx-auto text-sm sm:text-base font-light leading-relaxed">
          Alles wat je wilt weten over veilige residentiële distributie, privacy en de holding-garantie.
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
            >
              <AccordionItem 
                value={`item-${index}`}
                className="border border-white/[0.08] hover:border-[#E5C583]/40 rounded-2xl px-6 bg-[#0D1117]/80 data-[state=open]:border-[#E5C583]/40 data-[state=open]:bg-[#0D1117]/95 transition-all shadow-sm overflow-hidden"
              >
                <AccordionTrigger className="text-white hover:text-[#E5C583] text-left py-5 text-sm sm:text-base font-medium tracking-wide">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-white/60 pb-5 text-xs sm:text-sm font-light leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
