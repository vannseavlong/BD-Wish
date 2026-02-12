import { useEffect, useRef } from 'react';

interface FireworkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
}

interface Firework {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  exploded: boolean;
  particles: FireworkParticle[];
  color: string;
}

export function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
      '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#FF85B3',
      '#FFD93D', '#6BCF7F', '#E74C3C', '#3498DB', '#9B59B6'
    ];

    let fireworks: Firework[] = [];
    let animationId: number;

    // Create a new firework
    const createFirework = () => {
      const x = Math.random() * canvas.width;
      const targetY = Math.random() * (canvas.height * 0.4) + canvas.height * 0.1;
      
      return {
        x,
        y: canvas.height,
        targetY,
        vy: -8 - Math.random() * 4,
        exploded: false,
        particles: [],
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    // Create explosion particles
    const explode = (firework: Firework) => {
      const particleCount = 50 + Math.floor(Math.random() * 50);
      
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const speed = 2 + Math.random() * 4;
        
        firework.particles.push({
          x: firework.x,
          y: firework.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: firework.color,
          size: 2 + Math.random() * 3,
        });
      }
    };

    // Animation loop
    const animate = () => {
      // Fade effect for trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add new fireworks randomly
      if (Math.random() < 0.05 && fireworks.length < 5) {
        fireworks.push(createFirework());
      }

      // Update and draw fireworks
      fireworks = fireworks.filter((firework) => {
        if (!firework.exploded) {
          // Rising phase
          firework.y += firework.vy;
          firework.vy += 0.15; // Gravity

          // Draw rising firework
          ctx.beginPath();
          ctx.arc(firework.x, firework.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = firework.color;
          ctx.fill();

          // Draw trail
          ctx.beginPath();
          ctx.moveTo(firework.x, firework.y);
          ctx.lineTo(firework.x, firework.y + 10);
          ctx.strokeStyle = firework.color;
          ctx.lineWidth = 2;
          ctx.stroke();

          // Check if should explode
          if (firework.y <= firework.targetY || firework.vy > 0) {
            firework.exploded = true;
            explode(firework);
          }

          return true;
        } else {
          // Explosion phase
          let hasActiveParticles = false;

          firework.particles.forEach((particle) => {
            if (particle.alpha > 0) {
              hasActiveParticles = true;

              // Update particle
              particle.x += particle.vx;
              particle.y += particle.vy;
              particle.vy += 0.08; // Gravity
              particle.alpha -= 0.015;

              // Draw particle
              ctx.save();
              ctx.globalAlpha = particle.alpha;
              ctx.beginPath();
              ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
              ctx.fillStyle = particle.color;
              ctx.fill();

              // Glow effect
              ctx.shadowBlur = 10;
              ctx.shadowColor = particle.color;
              ctx.fill();
              ctx.restore();
            }
          });

          return hasActiveParticles;
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
    />
  );
}
