import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT_DIR = process.cwd();
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const SVG_SOURCE = path.join(PUBLIC_DIR, 'favicon.svg');

async function generateAssets() {
  console.log('🎨 LogoAnywhere: Generating complete brand asset pack from', SVG_SOURCE);
  const svgBuffer = fs.readFileSync(SVG_SOURCE);

  // 1. Favicon 32x32 PNG
  console.log('  → Generating favicon-32x32.png...');
  await sharp(svgBuffer, { density: 300 })
    .resize(32, 32)
    .png()
    .toFile(path.join(PUBLIC_DIR, 'favicon-32x32.png'));

  // 2. Favicon 16x16 PNG & 48x48 PNG for multi-size ICO
  console.log('  → Generating favicon.ico (16, 32, 48)...');
  const png16 = await sharp(svgBuffer, { density: 300 }).resize(16, 16).png().toBuffer();
  const png32 = await sharp(svgBuffer, { density: 300 }).resize(32, 32).png().toBuffer();
  const png48 = await sharp(svgBuffer, { density: 300 }).resize(48, 48).png().toBuffer();

  // Create an ICO file combining 16x16, 32x32, 48x48
  // Simple ICO header and directory
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // Reserved
  icoHeader.writeUInt16LE(1, 2); // ICO format
  icoHeader.writeUInt16LE(3, 4); // 3 images

  const images = [
    { width: 16, height: 16, buffer: png16 },
    { width: 32, height: 32, buffer: png32 },
    { width: 48, height: 48, buffer: png48 },
  ];

  let offset = 6 + (16 * images.length);
  const entries = [];
  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width, 0);
    entry.writeUInt8(img.height, 1);
    entry.writeUInt8(0, 2); // Colors (0 = >=256)
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // Image size
    entry.writeUInt32LE(offset, 12); // Image offset
    entries.push(entry);
    offset += img.buffer.length;
  }

  const icoBuffer = Buffer.concat([icoHeader, ...entries, ...images.map(img => img.buffer)]);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.ico'), icoBuffer);
  console.log('  ✓ favicon.ico created');

  // 3. Apple Touch Icon (180x180 with solid luxury dark background #090B0F, 140x140 logo)
  console.log('  → Generating apple-touch-icon.png (180x180)...');
  const appleLogo = await sharp(svgBuffer, { density: 300 })
    .resize(140, 140, { fit: 'contain' })
    .toBuffer();

  await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: { r: 9, g: 11, b: 15, alpha: 1 },
    },
  })
    .composite([{ input: appleLogo, gravity: 'center' }])
    .png()
    .toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'));
  console.log('  ✓ apple-touch-icon.png created');

  // 4. Android Chrome / PWA 192x192 & 512x512
  console.log('  → Generating android-chrome-192x192.png...');
  const pwa192Logo = await sharp(svgBuffer, { density: 300 })
    .resize(150, 150, { fit: 'contain' })
    .toBuffer();

  await sharp({
    create: {
      width: 192,
      height: 192,
      channels: 4,
      background: { r: 9, g: 11, b: 15, alpha: 0 },
    },
  })
    .composite([{ input: pwa192Logo, gravity: 'center' }])
    .png()
    .toFile(path.join(PUBLIC_DIR, 'android-chrome-192x192.png'));
  console.log('  ✓ android-chrome-192x192.png created');

  console.log('  → Generating android-chrome-512x512.png...');
  const pwa512Logo = await sharp(svgBuffer, { density: 300 })
    .resize(400, 400, { fit: 'contain' })
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 9, g: 11, b: 15, alpha: 1 },
    },
  })
    .composite([{ input: pwa512Logo, gravity: 'center' }])
    .png()
    .toFile(path.join(PUBLIC_DIR, 'android-chrome-512x512.png'));
  console.log('  ✓ android-chrome-512x512.png created');

  // 5. Social Avatar (1000x1000, 20% safe zone padding)
  console.log('  → Generating social-avatar.png (1000x1000)...');
  const avatarLogo = await sharp(svgBuffer, { density: 300 })
    .resize(680, 680, { fit: 'contain' })
    .toBuffer();

  await sharp({
    create: {
      width: 1000,
      height: 1000,
      channels: 4,
      background: { r: 9, g: 11, b: 15, alpha: 1 },
    },
  })
    .composite([{ input: avatarLogo, gravity: 'center' }])
    .png()
    .toFile(path.join(PUBLIC_DIR, 'social-avatar.png'));
  console.log('  ✓ social-avatar.png created');

  // 6. Open Graph Preview (1200x630, high-end atelier banner)
  console.log('  → Generating og-image.png (1200x630)...');
  const ogSvg = `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0B0D13"/>
        <stop offset="50%" stop-color="#07080B"/>
        <stop offset="100%" stop-color="#040507"/>
      </linearGradient>
      <linearGradient id="goldText" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#F5E6CA"/>
        <stop offset="50%" stop-color="#E5C583"/>
        <stop offset="100%" stop-color="#DFB86C"/>
      </linearGradient>
      <radialGradient id="centerGlow" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stop-color="#E5C583" stop-opacity="0.14"/>
        <stop offset="50%" stop-color="#10B981" stop-opacity="0.04"/>
        <stop offset="100%" stop-color="#07080B" stop-opacity="0"/>
      </radialGradient>
    </defs>

    <!-- Background -->
    <rect width="1200" height="630" fill="url(#bg)"/>
    <circle cx="600" cy="250" r="450" fill="url(#centerGlow)"/>

    <!-- Subtle Grid Overlay -->
    <g opacity="0.03" stroke="#FFFFFF" stroke-width="1">
      <line x1="0" y1="105" x2="1200" y2="105"/>
      <line x1="0" y1="210" x2="1200" y2="210"/>
      <line x1="0" y1="315" x2="1200" y2="315"/>
      <line x1="0" y1="420" x2="1200" y2="420"/>
      <line x1="0" y1="525" x2="1200" y2="525"/>
      <line x1="200" y1="0" x2="200" y2="630"/>
      <line x1="400" y1="0" x2="400" y2="630"/>
      <line x1="600" y1="0" x2="600" y2="630"/>
      <line x1="800" y1="0" x2="800" y2="630"/>
      <line x1="1000" y1="0" x2="1000" y2="630"/>
    </g>

    <!-- Outer Gold Border -->
    <rect x="24" y="24" width="1152" height="582" rx="28" fill="none" stroke="#E5C583" stroke-width="1" stroke-opacity="0.25"/>

    <!-- Eyebrow Pill -->
    <g transform="translate(600, 80)">
      <rect x="-180" y="0" width="360" height="34" rx="17" fill="rgba(229,197,131,0.08)" stroke="#E5C583" stroke-width="1" stroke-opacity="0.35"/>
      <circle cx="-150" cy="17" r="4" fill="#E5C583"/>
      <text x="0" y="22" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700" letter-spacing="3" fill="#E5C583" text-anchor="middle">
        DIGITAL ATELIER • QUANTUM INITIUM
      </text>
    </g>

    <!-- Main Title Lockup -->
    <g transform="translate(600, 370)">
      <text x="-65" y="0" font-family="system-ui, -apple-system, sans-serif" font-size="78" font-weight="800" letter-spacing="-2" fill="#FFFFFF" text-anchor="end">
        BOOST
      </text>
      <text x="-40" y="0" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="86" font-weight="400" fill="url(#goldText)" text-anchor="start">
        Plug
      </text>
    </g>

    <!-- Tagline -->
    <text x="600" y="435" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="300" fill="#CCCCCC" letter-spacing="0.5" text-anchor="middle">
      Bespoke Bereik, Organische Distributie &amp; Geverifieerde Reputatie
    </text>

    <!-- Footer Trust Ribbon -->
    <g transform="translate(600, 520)">
      <text x="0" y="0" font-family="monospace, monospace" font-size="13" font-weight="500" fill="#999999" letter-spacing="2" text-anchor="middle">
        99.4% RETENTIE • KPN/ZIGGO RESIDENTIËLE NODES • 72H XABI WORLD RAILS
      </text>
    </g>
  </svg>
  `;

  const ogLogo = await sharp(svgBuffer, { density: 300 })
    .resize(170, 170, { fit: 'contain' })
    .toBuffer();

  const ogBgBuffer = Buffer.from(ogSvg);
  await sharp(ogBgBuffer)
    .composite([{ input: ogLogo, left: 515, top: 140 }])
    .png({ quality: 95 })
    .toFile(path.join(PUBLIC_DIR, 'og-image.png'));
  console.log('  ✓ og-image.png created');

  // 7. Site Webmanifest
  console.log('  → Generating site.webmanifest...');
  const manifest = {
    name: 'BoostPlug — Streaming & Reviews Growth Platform',
    short_name: 'BoostPlug',
    description: 'Bespoke streaming- en reviewdistributie via residentiële netwerk nodes. Een onderneming van Quantum Initium Holding.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#090B0F',
    theme_color: '#090B0F',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  };

  fs.writeFileSync(
    path.join(PUBLIC_DIR, 'site.webmanifest'),
    JSON.stringify(manifest, null, 2)
  );
  console.log('  ✓ site.webmanifest created');

  console.log('\n✨ All Brand Assets successfully compiled into /public!');
}

generateAssets().catch((err) => {
  console.error('❌ Error generating assets:', err);
  process.exit(1);
});
