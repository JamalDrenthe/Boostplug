import React, { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'gold' | 'emerald' | 'cyan' | 'purple' | 'none';
  maxTilt?: number;
  scale?: number;
}

export function TiltCard({
  children,
  className = '',
  glowColor = 'gold',
  maxTilt = 8,
  scale = 1.02,
  ...props
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Raw mouse coordinates normalized from -0.5 to 0.5
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for high-end organic motion
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // 3D rotations based on mouse position
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-maxTilt, maxTilt]);
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [maxTilt, -maxTilt]);

  // Glare position in percentages (0% to 100%)
  const glareX = useTransform(smoothMouseX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(smoothMouseY, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const glowStyles = {
    gold: 'hover:shadow-[0_12px_40px_-10px_rgba(229,197,131,0.22)] hover:border-[#E5C583]/35',
    emerald: 'hover:shadow-[0_12px_40px_-10px_rgba(16,185,129,0.22)] hover:border-emerald-500/35',
    cyan: 'hover:shadow-[0_12px_40px_-10px_rgba(56,189,248,0.22)] hover:border-sky-500/35',
    purple: 'hover:shadow-[0_12px_40px_-10px_rgba(168,85,247,0.22)] hover:border-purple-500/35',
    none: '',
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      animate={{
        scale: isHovered ? scale : 1,
      }}
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
