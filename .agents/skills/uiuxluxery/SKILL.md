---
name: uiuxluxery
description: >-
  Craft high-end luxury UI/UX, atelier aesthetics, editorial typography, Framer Motion
  animations, interactive 3D cards, and anti-AI-slop design systems inspired by haute-couture,
  fine jewelry webshops, and exclusive digital ateliers. Use whenever the user asks for a luxury,
  high-end, couture, jewelry-grade, or professional UI/UX visual upgrade.
---

# Luxury UI/UX Playbook: Atelier & High-Couture Design System

This playbook defines the exact architectural, design, styling, and motion standards required to transform applications into **high-end digital ateliers**. It is inspired by fine jewelry webshops, luxury watchmakers, and high-fashion digital experiences, moving away from generic SaaS templates and harsh "AI slop".

---

## 1. Core Design Philosophy: The Digital Atelier

A luxury interface is characterized by **restraint, precision, depth, and tactile polish**:
- **Generous Whitespace & Asymmetry:** Let components breathe. Density is for data tables, but luxury is for spacious breathing room and intentional focal points.
- **Micro-Borders & Specular Highlights:** Avoid heavy, solid 1px gray borders. Use translucent white/gold borders (`border-white/[0.08]` to `border-[#E5C583]/20`) that catch the light like polished metals.
- **Materiality & Glassmorphism:** Deep layers with `backdrop-blur-xl`, subtle radial gradient cards, and frosted overlays rather than flat solid blocks.
- **Physical Weight & Inertia:** Animations feel physically weighted with spring dynamics rather than abrupt linear easing.

---

## 2. Color Palette & Material Tokens

### Backgrounds & Shadows (Noir Obsidian Base)
- **Primary Canvas:** `#09090D` to `#0D0D12` (rich obsidian noir with warm undertones; never flat `#000000`).
- **Surface Elevation 1 (Cards, Panels):** `bg-neutral-900/60 backdrop-blur-xl border border-white/[0.07]`.
- **Surface Elevation 2 (Elevated Sheets, Modals):** `bg-[#13131A]/90 backdrop-blur-2xl border border-white/[0.12]`.
- **Atmospheric Glows:** Warm amber/gold and subtle rose ambient radial drops in backgrounds:
  `bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(229,197,131,0.08),rgba(255,255,255,0))]`.

### Accent Metas (Fine Jewelry Metallics)
- **Champagne Gold:** Primary `#E5C583`, Muted `#C29F54`, Highlights `#F7E5B5`.
- **Deep Bronze:** `#8C6D3B`.
- **Rose Quartz (Soft Feminine Accent):** `#F7E1DE` / `rgba(247, 225, 222, 0.15)`.
- **Platinum / Ice Silver:** Text and delicate lines `#F8FAFC`, `#E2E8F0`.

### Tailored Tailwind Gradient Tokens
```tsx
// Gold luxury text gradient
className="bg-gradient-to-r from-[#F7E5B5] via-[#E5C583] to-[#C29F54] bg-clip-text text-transparent"

// Subtle gold border sheen
className="border border-[#E5C583]/20 hover:border-[#E5C583]/45 transition-colors duration-300"

// Ambient gold glow shadow
className="shadow-[0_12px_40px_-10px_rgba(229,197,131,0.22)]"
```

---

## 3. High-End Motion System (Framer Motion)

### Physics-Based Spring Constants
Always prefer springs with high damping and moderate stiffness for a weighted, bespoke tactile response:
```tsx
export const luxurySpring = {
  type: "spring",
  stiffness: 240,
  damping: 24,
  mass: 0.6,
};
```

### Staggered Reveal Orchestration
```tsx
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: luxurySpring,
  },
};
```

### Micro-Interactions on Interactive Elements
- **Hover:** Micro-elevation (`y: -2`, `scale: 1.015`).
- **Tap:** Gentle press feedback (`scale: 0.985`).
- **Badges & Pills:** Subtle pulse glow on active indicator lights.

---

## 4. Interactive 3D Depth: The `TiltCard` Pattern

A signature element of the luxury aesthetic is the mouse-reactive 3D card with a moving specular sheen.

```tsx
import React, { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'gold' | 'emerald' | 'cyan' | 'none';
  maxTilt?: number;
  scale?: number;
}

export function TiltCard({
  children,
  className = '',
  glowColor = 'gold',
  maxTilt = 7,
  scale = 1.015,
  ...props
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 24, stiffness: 220, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-maxTilt, maxTilt]);
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const glareX = useTransform(smoothMouseX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(smoothMouseY, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [mouseX, mouseY]);

  const glowStyles = {
    gold: 'hover:shadow-[0_12px_40px_-10px_rgba(229,197,131,0.20)] hover:border-[#E5C583]/35',
    emerald: 'hover:shadow-[0_12px_40px_-10px_rgba(16,185,129,0.20)] hover:border-emerald-500/35',
    cyan: 'hover:shadow-[0_12px_40px_-10px_rgba(56,189,248,0.20)] hover:border-sky-500/35',
    none: '',
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      animate={{ scale: isHovered ? scale : 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`relative overflow-hidden transition-colors duration-300 ${glowStyles[glowColor]} ${className}`}
      {...(props as any)}
    >
      {/* Specular sheen reflection overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(circle 350px at ${glareX} ${glareY}, rgba(255, 255, 255, 0.12), transparent 70%)`,
        }}
      />
      {children}
    </motion.div>
  );
}
```

---

## 5. Editorial Typography & Layout Hierarchy

- **Eyebrow Badges & Sub-Headings:**
  Uppercase, wide letter spacing (`tracking-[0.2em]`), small font (`text-[10px]` or `text-xs`), wrapped in a capsule pill with a delicate border:
  ```tsx
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono tracking-[0.2em] uppercase text-[#E5C583] bg-[#E5C583]/10 border border-[#E5C583]/20">
    <Sparkles className="w-3 h-3 text-[#E5C583]" />
    Private Atelier • Collection 2026
  </span>
  ```
- **Editorial Headings:**
  Clean, high-fashion proportions. Pair crisp sans-serif headings with delicate italics or gold gradient highlights.
- **Numeric & Metric Accents:**
  Tabular numerals (`tabular-nums font-mono`) with muted currency/unit symbols for precision financial/inventory figures.

---

## 6. Anti-AI Slop Guidelines

To prevent interfaces from looking like cheap AI generated templates:

| DO NOT USE (AI Slop) | USE INSTEAD (Luxury Atelier) |
| :--- | :--- |
| Garish neon purple/cyan glowing gradients | Warm champagne gold, obsidian noir, soft rose quartz |
| Generic cliché buzzwords ("Unleash AI power", "Revolutionize your flow") | Concrete, authoritative vocabulary ("Sovereign Mining", "Private Atelier", "72-Hour Factoring") |
| Giant 3D cartoon floating blobs | Subtle specular highlights, glass reflections, micro-borders |
| Flat solid gray cards | Frosted glassmorphism (`backdrop-blur-xl bg-neutral-900/60`) |
| Unweighted bouncy rubber-band animations | Weighted physical springs (`damping: 24, stiffness: 220`) |
| Inconsistent icon styles | Unified Lucide icons inside subtle frosted squircle containers |

---

## 7. Pre-Flight Checklist for Luxury UI Upgrades

Before shipping any visual upgrade:
1. [ ] **Color Harmony:** Are background blacks rich and warm (`#09090D`) rather than pitch zero (`#000000`)?
2. [ ] **Glow & Sheen:** Do cards feature subtle specular light glares instead of harsh box-shadows?
3. [ ] **Motion Polish:** Are hover and click states physically weighted with Framer Motion springs?
4. [ ] **Typography:** Are badges tracked (`tracking-[0.2em]`) and subtitles gracefully muted?
5. [ ] **Glassmorphism:** Are dialogs and headers using `backdrop-blur-xl` with thin translucent borders?
6. [ ] **Responsive Refinement:** Do mobile drawers and tilt cards adapt smoothly without horizontal overflow?
