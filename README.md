# BoostPlug

BoostPlug is een Nederlandstalige storefront voor het samenstellen en volgen van
promotiepakketten voor muziekplatforms en online reviews. Bezoekers kiezen een
platform, configureren de gewenste hoeveelheid of reviewopties, voegen producten
toe aan een winkelwagen en doorlopen een lokale demo-checkout.

## Functionaliteiten

- Selecteren van boosts voor Spotify, Apple Music, YouTube Music, SoundCloud,
  Deezer en Tidal.
- Configureren van streams, views, followers, likes en andere platformgerichte
  opties met hoeveelheid- en kwaliteitskeuzes.
- Bestellen van reviews voor onder andere Google Maps, Trustpilot, Amazon,
  appstores, Yelp, TripAdvisor en andere diensten.
- Winkelwagen met prijsberekening, valuta-keuze en verwijderen van items.
- Demo-checkout met e-mailadres, voorwaarden en gegenereerde ordergegevens.
- Ordertracking via een trackingnummer en hash-route (`#/track`).
- FAQ, werkwijze, testimonials en responsive navigatie.

## Tech stack

- React 19 met TypeScript
- Vite 7
- Tailwind CSS 3
- Radix UI en shadcn/ui-componenten
- Lucide React voor iconen
- React Hook Form, Zod, Recharts en Sonner
- ESLint 9

## Lokaal starten

Vereist: Node.js 20 of nieuwer.

```bash
npm install
npm run dev
```

Open daarna de lokale URL die Vite toont. Voor een productiebuild:

```bash
npm run build
npm run preview
```

## Scripts

| Script | Beschrijving |
| --- | --- |
| `npm run dev` | Start de Vite-ontwikkelserver met hot module replacement. |
| `npm run build` | Voert TypeScript-buildchecks uit en maakt een productiebuild. |
| `npm run lint` | Controleert de code met ESLint. |
| `npm run preview` | Serveert de productiebuild lokaal. |

## Projectstructuur

```text
.
├── src/
│   ├── components/ui/       Herbruikbare interfacecomponenten
│   ├── data/                Platformen, producten en prijslogica
│   ├── hooks/               Store- en responsive hooks
│   ├── sections/            Header, hero, selectors, checkout en tracking
│   ├── types/               TypeScript-domeintypen
│   ├── App.tsx              Hoofdcomponent en eenvoudige hash-routing
│   ├── App.css              Applicatiespecifieke stijlen
│   └── index.css            Globale stijlen en Tailwind-lagen
├── index.html               HTML-entrypoint
├── tailwind.config.js       Tailwind-configuratie
├── vite.config.ts           Vite-configuratie
└── package.json             Scripts en afhankelijkheden
```

De checkout en ordertracking werken momenteel volledig lokaal in de browser en
gebruiken geen externe betaal- of orderbackend.
