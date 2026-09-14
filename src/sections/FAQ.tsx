import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Is BoastPlug veilig om te gebruiken?',
    answer: 'Ja, absoluut. We werken met geavanceerde distributiemethoden die volledig veilig zijn voor je accounts. Onze streams en reviews komen van echte, actieve gebruikers. We hebben strikte kwaliteitscontroles en leveren nooit bots of fake accounts.',
  },
  {
    question: 'Hoe snel wordt mijn bestelling geleverd?',
    answer: 'Streams beginnen meestal binnen 1-24 uur na betaling. Reviews worden geplaatst binnen 24-72 uur, afhankelijk van het platform. Je kunt de voortgang realtime volgen via onze tracking pagina.',
  },
  {
    question: 'Heb ik een account nodig?',
    answer: 'Nee, dat is het mooie! Bij BoastPlug werken we met guest checkout. Je hebt geen account nodig - alleen je email adres voor de bestelbevestiging en tracking updates.',
  },
  {
    question: 'Welke betaalmethoden accepteren jullie?',
    answer: 'We accepteren iDEAL (Nederland), creditcard (Visa, Mastercard, American Express), PayPal, en diverse andere lokale betaalmethoden. Alle betalingen worden veilig verwerkt via Stripe.',
  },
  {
    question: 'Kan ik mijn bestelling annuleren?',
    answer: 'Zolang je bestelling nog niet is gestart met verwerken, kun je deze annuleren en krijg je het volledige bedrag terug. Neem contact op met onze support via de tracking pagina.',
  },
  {
    question: 'Wat als mijn reviews niet worden geplaatst?',
    answer: 'We garanderen plaatsing van alle reviews. Mocht er onverhoopt iets misgaan, dan krijg je automatisch een refund of we proberen het opnieuw - jij bepaalt.',
  },
  {
    question: 'Zijn de reviews echt of nep?',
    answer: 'Onze reviews worden geschreven door echte mensen met actieve accounts op de betreffende platforms. Ze zijn uniek, relevant en voldoen aan alle richtlijnen van het platform.',
  },
  {
    question: 'Kan ik zelf de review tekst bepalen?',
    answer: 'Ja, bij de meeste platforms kun je optioneel je eigen review tekst invoeren. Laat je het leeg? Dan schrijft ons team een professionele, relevante review voor je.',
  },
];

export function FAQ() {
  return (
    <section className="py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Veelgestelde <span className="text-gradient">vragen</span>
        </h2>
        <p className="text-white/60 max-w-xl mx-auto">
          Alles wat je wilt weten over BoastPlug. Staat je vraag er niet tussen? 
          Neem contact op met onze support.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border border-white/10 rounded-xl px-6 bg-white/5 data-[state=open]:bg-white/10"
            >
              <AccordionTrigger className="text-white hover:text-[hsl(142,76%,45%)] text-left py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-white/60 pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
