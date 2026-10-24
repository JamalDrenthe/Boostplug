import { useEffect, useRef } from 'react';

interface LuxuryScene3DProps {
  className?: string;
  intensity?: number;
}

export function LuxuryScene3D({ className = '', intensity = 1 }: LuxuryScene3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Mouse tracking with smooth spring damping
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let baseAngle = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / width - 0.5;
      const y = (e.clientY - rect.top) / height - 0.5;
      targetRotY = x * 1.2;
      targetRotX = -y * 1.2;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Generate gold & diamond particle cloud
    const numParticles = 65;
    const particles = Array.from({ length: numParticles }, () => {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const rad = 140 + Math.random() * 90;
      return {
        x: rad * Math.sin(phi) * Math.cos(theta),
        y: rad * Math.sin(phi) * Math.sin(theta),
        z: rad * Math.cos(phi),
        size: 1 + Math.random() * 2.2,
        twinkleSpeed: 0.02 + Math.random() * 0.04,
        twinklePhase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.4 ? 'gold' : 'diamond',
      };
    });

    // 3D Point projection helper
    const project = (x: number, y: number, z: number, rx: number, ry: number) => {
      // Rotate Y
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;

      // Rotate X
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      // Perspective projection
      const cameraZ = 450;
      const scale = cameraZ / (cameraZ + z2);
      const projX = width / 2 + x1 * scale;
      const projY = height / 2 + y2 * scale;

      return { x: projX, y: projY, z: z2, scale };
    };

    let time = 0;

    const render = () => {
      time += 0.012;
      baseAngle += 0.006;

      // Smooth interpolation for mouse tilt
      currentRotX += (targetRotX - currentRotX) * 0.06;
      currentRotY += (targetRotY - currentRotY) * 0.06;

      const finalRotX = currentRotX + Math.sin(time * 0.4) * 0.15;
      const finalRotY = currentRotY + baseAngle;

      ctx.clearRect(0, 0, width, height);

      // Central luxury glow
      const radialGlow = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        220
      );
      radialGlow.addColorStop(0, `rgba(229, 197, 131, ${0.14 * intensity})`);
      radialGlow.addColorStop(0.5, `rgba(16, 185, 129, ${0.05 * intensity})`);
      radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      // 1. Draw Ring Geometry (3 interlocking luxury gyroscopic rings)
      const ringConfigs = [
        { radius: 155, tiltOffset: 0, segments: 48, stroke: 'rgba(232, 207, 150, 0.75)', width: 1.8 },
        { radius: 125, tiltOffset: Math.PI / 3, segments: 40, stroke: 'rgba(245, 230, 202, 0.65)', width: 1.4 },
        { radius: 95, tiltOffset: -Math.PI / 3, segments: 32, stroke: 'rgba(52, 211, 153, 0.6)', width: 1.2 },
      ];

      ringConfigs.forEach((ring) => {
        const points: { x: number; y: number; z: number; scale: number }[] = [];

        for (let i = 0; i <= ring.segments; i++) {
          const angle = (i / ring.segments) * Math.PI * 2;
          // Apply individual ring orbital tilt
          const x0 = Math.cos(angle) * ring.radius;
          const y0 = Math.sin(angle) * ring.radius * Math.cos(ring.tiltOffset);
          const z0 = Math.sin(angle) * ring.radius * Math.sin(ring.tiltOffset);

          const proj = project(x0, y0, z0, finalRotX, finalRotY);
          points.push(proj);
        }

        // Draw ring lines
        ctx.beginPath();
        for (let i = 0; i < points.length; i++) {
          const pt = points[i];
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.closePath();

        // Shimmer gradient stroke
        ctx.strokeStyle = ring.stroke;
        ctx.lineWidth = ring.width;
        ctx.shadowColor = 'rgba(232, 207, 150, 0.4)';
        ctx.shadowBlur = 12;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw diamond-like vertices on the outer ring
        if (ring.radius === 155) {
          for (let i = 0; i < points.length; i += 4) {
            const pt = points[i];
            const alpha = Math.max(0.2, (pt.z + 180) / 360);
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 2.2 * pt.scale, 0, Math.PI * 2);
            ctx.fill();

            // Diamond sparkle cross
            if (i % 8 === 0 && alpha > 0.6) {
              ctx.strokeStyle = `rgba(245, 230, 202, ${alpha * 0.8})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(pt.x - 6 * pt.scale, pt.y);
              ctx.lineTo(pt.x + 6 * pt.scale, pt.y);
              ctx.moveTo(pt.x, pt.y - 6 * pt.scale);
              ctx.lineTo(pt.x, pt.y + 6 * pt.scale);
              ctx.stroke();
            }
          }
        }
      });

      // 2. Draw Central Core Jewel
      const coreProj = project(0, 0, 0, finalRotX, finalRotY);
      const corePulse = 1 + Math.sin(time * 2) * 0.12;
      const coreRadius = 14 * coreProj.scale * corePulse;

      const jewelGrad = ctx.createRadialGradient(
        coreProj.x - 3,
        coreProj.y - 3,
        2,
        coreProj.x,
        coreProj.y,
        coreRadius * 1.5
      );
      jewelGrad.addColorStop(0, '#FFFFFF');
      jewelGrad.addColorStop(0.3, '#F5E6CA');
      jewelGrad.addColorStop(0.7, '#DFB86C');
      jewelGrad.addColorStop(1, 'rgba(16, 185, 129, 0.3)');

      ctx.fillStyle = jewelGrad;
      ctx.shadowColor = 'rgba(229, 197, 131, 0.8)';
      ctx.shadowBlur = 24;
      ctx.beginPath();
      ctx.arc(coreProj.x, coreProj.y, coreRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // 3. Draw Sparkling Particles
      particles.forEach((p) => {
        const proj = project(p.x, p.y, p.z, finalRotX, finalRotY);
        const twinkle = Math.sin(time * 3 + p.twinklePhase) * 0.5 + 0.5;
        const depthAlpha = Math.max(0.15, (proj.z + 250) / 500);
        const finalAlpha = depthAlpha * (0.4 + twinkle * 0.6);

        if (p.color === 'gold') {
          ctx.fillStyle = `rgba(232, 207, 150, ${finalAlpha})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${finalAlpha * 0.9})`;
        }

        ctx.beginPath();
        ctx.arc(proj.x, proj.y, p.size * proj.scale, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity]);

  return (
    <div className={`relative flex items-center justify-center pointer-events-none select-none ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full max-w-[650px] max-h-[650px]" />
    </div>
  );
}
