import { motion } from 'motion/react';
import { Heart, Star, Sparkles } from 'lucide-react';

export function FloatingParticles() {
  const particles = [
    { Icon: Heart, color: 'text-pink-400', count: 12 },
    { Icon: Star, color: 'text-yellow-400', count: 10 },
    { Icon: Sparkles, color: 'text-purple-400', count: 8 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-30">
      {particles.map(({ Icon, color, count }) =>
        [...Array(count)].map((_, i) => {
          const startX = Math.random() * window.innerWidth;
          const startY = window.innerHeight + 50;
          const endY = -100;
          const drift = (Math.random() - 0.5) * 300;
          const duration = 8 + Math.random() * 6;
          const delay = Math.random() * 3;
          const size = 16 + Math.random() * 16;

          return (
            <motion.div
              key={`${Icon.name}-${i}`}
              className={`absolute ${color}`}
              style={{ left: startX, top: startY }}
              initial={{ y: 0, x: 0, opacity: 0, rotate: 0, scale: 0 }}
              animate={{
                y: endY - startY,
                x: [0, drift / 2, drift],
                opacity: [0, 1, 1, 0],
                rotate: 360,
                scale: [0, 1, 1, 0.5],
              }}
              transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Icon size={size} fill="currentColor" />
            </motion.div>
          );
        })
      )}

      {/* Additional sparkle particles */}
      {[...Array(15)].map((_, i) => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;

        return (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute"
            style={{ left: x, top: y }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeInOut',
            }}
          >
            <div className="w-2 h-2 bg-white rounded-full shadow-lg shadow-white/50" />
          </motion.div>
        );
      })}
    </div>
  );
}
