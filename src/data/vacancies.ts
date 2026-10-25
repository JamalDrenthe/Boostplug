import type { Vacancy } from '@/types';

export const INITIAL_VACANCIES: Vacancy[] = [
  {
    id: 'vac-eng-01',
    title: 'Senior Distributed Systems Engineer (Residentiële Nodes & Daemons)',
    department: 'Engineering',
    location: 'Amsterdam / Hybride',
    employmentType: 'Freelance / DBA',
    experienceLevel: 'Senior',
    salaryRange: '€85 - €115 /uur (SABI Rails factoring)',
    dbaCompliant: true,
    quantumSubholding: 'Subholding 03: Talent & Gateway',
    status: 'active',
    createdAt: '2026-10-15T10:00:00.000Z',
    description: 'Als Senior Distributed Systems Engineer ontwerp en optimaliseer je de lichtgewicht daemons die draaien op het netwerk van Apple Silicon (M2/M4) Mac mini nodes van de Verdienende Vrienden Club. Je bouwt schaalbare, veilige en onopvallende achtergrondprocessen over Nederlandse KPN- en Ziggo-verbindingen.',
    responsibilities: [
      'Architectuur en optimalisatie van de macOS/Linux achtergrond daemons voor gecontroleerde streamingsessies',
      'Integratie van residentiële proxy-rotatie en automatische failover mechanismen',
      'Samenwerken met het security team om zero-footprint memory en cpu profielen te waarborgen (<5% load)',
      'Koppeling met de centrale Quantum Initium telemetrie gateway voor realtime uptime en latency audits',
    ],
    requirements: [
      'Minimaal 5 jaar ervaring met Go, Rust of modern C++/TypeScript',
      'Diepgaande kennis van POSIX, macOS launchd services en socket networking',
      'Ervaring met residentiële netwerktopologieën, NAT traversal en TLS fingerprinting',
      'Zelfstandig kunnen opereren binnen het Nederlandse DBA-wetgevingskader voor ZZP/Freelance',
    ],
    niceToHave: [
      'Ervaring met Apple Silicon optimalisaties (Metal / Grand Central Dispatch)',
      'Affiniteit met gedecentraliseerde compute-netwerken en crypto-treasury',
    ],
    benefits: [
      'Uurtarief tussen €85 en €115 per uur met gegarandeerde 72-uurs uitbetaling via SABI Rails',
      'Volledig DBA-conform contract geauditeerd door Djobba.works compliance',
      'Hardware lease budget voor eigen Apple hardware via Grover',
      'Toegang tot het besloten Quantum Initium investeerdersnetwerk',
    ],
    tags: ['Go', 'Rust', 'macOS Daemon', 'Apple Silicon', 'Networking', 'DBA-Conform'],
    djobbaSync: {
      synced: true,
      djobbaJobId: 'DJB-ENG-2026-X901',
      syncedAt: '2026-10-18T14:22:00.000Z',
      status: 'synced',
      syncResponse: 'Geverifieerd op Djobba.works pool met SABI Rails factoring garantie',
      targetUrl: 'https://djobba.works/jobs/boostplug-vac-eng-01',
    },
  },
  {
    id: 'vac-growth-02',
    title: 'Growth & Streaming Algorithms Lead',
    department: 'Growth',
    location: 'Amsterdam / Remote',
    employmentType: 'Full-time',
    experienceLevel: 'Lead',
    salaryRange: '€5.500 - €7.800 /mnd + Equity bonus',
    dbaCompliant: true,
    quantumSubholding: 'Subholding 01: Core Infra & Music',
    status: 'active',
    createdAt: '2026-10-18T11:30:00.000Z',
    description: 'Je leidt de algoritmische strategie achter onze muziek- en audioboost suites. Je analyseert de nieuwste aanbevelingsalgoritmes van Spotify (Discover Weekly, Release Radar), Apple Music en YouTube om veilige en effectieve drip-feed curatiecurves te ontwerpen voor topartiesten en independent labels.',
    responsibilities: [
      'Ontwerpen van statistische spreidingsmodellen (drip-feed) die naadloos opgaan in organisch luistergedrag',
      'Aansturen van data-analyses rond skip-rates, dwell-time en playlist-conversies',
      'Begeleiden van releases voor labels aangesloten bij partner Zheavenzy',
      'Rapporteren van audit-resultaten en platformupdates aan het management',
    ],
    requirements: [
      'Aantoonbare track record binnen music-tech, streaming distributie of digitaal labelmanagement',
      'Grondige kennis van streaming platform algoritmes en antifraude detectiesystemen',
      'Ervaring met data-analyse tools (Python, SQL of geavanceerde dashboards)',
      'Sterke communicatieve vaardigheden in het Nederlands en Engels',
    ],
    niceToHave: [
      'Bestaand netwerk binnen de Nederlandse of internationale muziekindustrie',
      'Ervaring met A/B testing van promotiecampagnes op schaal',
    ],
    benefits: [
      'Aantrekkelijk salaris van €5.500 - €7.800 met Quantum Initium holding winstdeling',
      'Hybride werken: modern atelier kantoor in Amsterdam of deels remote',
      'Volledige regie over het growth-budget en de technologische tools',
      '28 vakantiedagen en pensioenopbouw',
    ],
    tags: ['Spotify Algorithms', 'Music Tech', 'Growth', 'Data Analytics', 'Streaming'],
    djobbaSync: {
      synced: true,
      djobbaJobId: 'DJB-GRO-2026-M442',
      syncedAt: '2026-10-19T09:15:00.000Z',
      status: 'synced',
      syncResponse: 'Succesvol gematcht op Djobba.works met 4 geverifieerde kandidaten',
      targetUrl: 'https://djobba.works/jobs/boostplug-vac-growth-02',
    },
  },
  {
    id: 'vac-sec-03',
    title: 'Anti-Detection & Residential Network Specialist',
    department: 'Security & Anti-Detection',
    location: 'Remote (Nederland/EU)',
    employmentType: 'Freelance / DBA',
    experienceLevel: 'Senior',
    salaryRange: '€95 - €130 /uur',
    dbaCompliant: true,
    quantumSubholding: 'Subholding 03: Talent & Gateway',
    status: 'active',
    createdAt: '2026-10-20T14:00:00.000Z',
    description: 'Als Anti-Detection Specialist ben je de poortwachter van de integriteit van ons netwerk. Je analyseert continu browser-fingerprints, TCP/IP-stacks en gedragsbiometrie om ervoor te zorgen dat elke stream en review 100% ondetecteerbaar en betrouwbaar wordt afgeleverd.',
    responsibilities: [
      'Reverse engineering van geavanceerde anti-bot en gedragsheuristieken (Cloudflare, DataDome, Arkose)',
      'Ontwikkelen van residentiële browser-profielen met natuurlijke canvas, audio-context en hardware hashes',
      'Beheer en monitoring van de Logs.rent residentiële IP-subnetten en ISP allocaties',
      'Uitvoeren van continue kwaliteits- en retentie-audits op geleverde orders',
    ],
    requirements: [
      'Expertise in Chromium internals, CDP (Chrome DevTools Protocol) en browser fingerprinting mitigatie',
      'Diepgaand inzicht in TLS client hellos, JA3/JA4 fingerprints en HTTP/2/3 frames',
      'Ervaring met Python, Node.js en gedistribueerde proxy architecturen',
      'DBA-zelfstandigheid (ZZP)',
    ],
    niceToHave: [
      'Kennis van machine learning detectiemodellen',
      'Ervaring met mobile device profiling (iOS/Android)',
    ],
    benefits: [
      'Top-tier uurtarief van €95 tot €130 per uur',
      '72-uurs liquiditeit en automatische facturatie via SABI Rails',
      'Vrijheid om volledig remote te werken vanuit Nederland of de EU',
      'Werken aan state-of-the-art netwerkbeveiliging en hardware orchestratie',
    ],
    tags: ['Anti-Detection', 'JA4 Fingerprinting', 'Residential IP', 'Chromium', 'DBA'],
    djobbaSync: {
      synced: true,
      djobbaJobId: 'DJB-SEC-2026-B109',
      syncedAt: '2026-10-21T16:45:00.000Z',
      status: 'synced',
      syncResponse: 'Gepubliceerd via Djobba.works Talent Gateway',
      targetUrl: 'https://djobba.works/jobs/boostplug-vac-sec-03',
    },
  },
  {
    id: 'vac-eng-04',
    title: 'Full-Stack TypeScript & Platform Architect',
    department: 'Engineering',
    location: 'Amsterdam / Hybride',
    employmentType: 'Full-time',
    experienceLevel: 'Medior / Senior',
    salaryRange: '€4.800 - €6.800 /mnd',
    dbaCompliant: true,
    quantumSubholding: 'Subholding 03: Talent & Gateway',
    status: 'active',
    createdAt: '2026-10-22T08:30:00.000Z',
    description: 'Help ons platform uitbreiden met nieuwe high-fashion atelier interfaces, real-time Firestore syncs en naadloze API-verbindingen met Djobba.works, Stripe, en de Quantum Initium holding services.',
    responsibilities: [
      'Bouwen van hoogwaardige UI componenten met React, TypeScript, Tailwind CSS en Framer Motion',
      'Optimaliseren van Firestore datamodellen en Cloud Functions voor realtime order updates',
      'Onderhouden van veilige REST en webhook integraties met partnerplatformen',
      'Zorgen voor uitstekende responsive performance (LCP, INP) en esthetische perfectie',
    ],
    requirements: [
      'Minimaal 3 jaar professionele ervaring met React en modern TypeScript',
      'Oog voor verfijnd UI/UX design, micro-animaties en esthetische verfijning',
      'Ervaring met Firebase/Firestore, Node.js en REST APIs',
      'Passie voor clean code, unit testing en continue levering',
    ],
    niceToHave: [
      'Ervaring met WebGL, Three.js of Canvas 3D rendering',
      'Kennis van Stripe Connect en SEPA betaalstromen',
    ],
    benefits: [
      'Salaris van €4.800 - €6.800 per maand',
      'Keuze uit de nieuwste MacBook Pro M3/M4 Max',
      'Ruim opleidingsbudget voor conferenties en trainingen',
      'Reiskostenvergoeding en uitstekende lunch op kantoor in Amsterdam',
    ],
    tags: ['React', 'TypeScript', 'Tailwind', 'Firebase', 'Framer Motion', 'API'],
    djobbaSync: {
      synced: false,
      status: 'not_synced',
    },
  },
  {
    id: 'vac-com-05',
    title: 'Community & Node Success Manager (Verdienende Vrienden Club)',
    department: 'Community & Nodes',
    location: 'Amsterdam / Deels Remote',
    employmentType: 'Full-time',
    experienceLevel: 'Medior',
    salaryRange: '€3.600 - €4.800 /mnd',
    dbaCompliant: false,
    quantumSubholding: 'Subholding 01: Core Infra & Community',
    status: 'active',
    createdAt: '2026-10-23T12:00:00.000Z',
    description: 'Als Community & Node Success Manager ben jij het vertrouwde aanspreekpunt voor alle leden van de Verdienende Vrienden Club. Je begeleidt leden bij het leasen en configureren van hun hardware nodes, beantwoordt vragen over maandelijkse uitbetalingen en organiseert exclusieve community bijeenkomsten.',
    responsibilities: [
      'Begeleiden van nieuwe leden tijdens de 10-stappen onboarding van hun Grover hardware lease',
      'Vragen beantwoorden over software-installatie, SEPA-uitbetalingen en Spontiva ledenvoordeel',
      'Monitoren van de node uptime en proactief contact opnemen bij offline hardware',
      'Coördineren van maandelijkse updates en community events in samenwerking met het bestuur',
    ],
    requirements: [
      'Sterke communicatieve en empathische vaardigheden in het Nederlands',
      'Ervaring met community management, customer success of tech support',
      'Affiniteit met hardware (Mac mini / laptops) en passief inkomen concepten',
      'Nauwkeurig en gestructureerd in administratie en opvolging',
    ],
    niceToHave: [
      'Ervaring met Discord / Telegram community beheer',
      'Basisbegrip van softwareconfiguraties en netwerkpoorten',
    ],
    benefits: [
      'Salaris van €3.600 - €4.800 per maand met prestatiebonus per geactiveerde node',
      'Eigen Mac mini M4 lease verzorgd door BoostPlug',
      'Veel zelfstandigheid en ruimte voor eigen initiatieven',
      'Kantoor op loopafstand van Amsterdam Centraal',
    ],
    tags: ['VVC', 'Community', 'Hardware Onboarding', 'Customer Success', 'Support'],
    djobbaSync: {
      synced: false,
      status: 'not_synced',
    },
  },
];

const LOCAL_STORAGE_VACANCIES_KEY = 'boostplug_vacancies_data';

export function loadStoredVacancies(): Vacancy[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_VACANCIES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Vacancy[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Kon lokale vacatures niet laden:', err);
  }
  return INITIAL_VACANCIES;
}

export function saveStoredVacancies(vacancies: Vacancy[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_VACANCIES_KEY, JSON.stringify(vacancies));
  } catch (err) {
    console.warn('Kon vacatures niet opslaan in localStorage:', err);
  }
}
