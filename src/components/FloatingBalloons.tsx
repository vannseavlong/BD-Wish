import { motion } from 'motion/react';

export function FloatingBalloons() {
  const balloonColors = [
    'from-red-400 to-red-600',
    'from-blue-400 to-blue-600',
    'from-yellow-400 to-yellow-600',
    'from-green-400 to-green-600',
    'from-purple-400 to-purple-600',
    'from-pink-400 to-pink-600',
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-40">
      {balloonColors.map((color, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 100,
            rotate: Math.random() * 20 - 10,
          }}
          animate={{
            y: -200,
            x: Math.random() * window.innerWidth,
            rotate: [null, Math.random() * 40 - 20],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            delay: i * 0.3,
            ease: 'easeOut',
          }}
          className="absolute"
        >
          {/* Balloon */}
          <div className={`relative w-16 h-20 bg-gradient-to-br ${color} rounded-full shadow-lg`}>
            {/* Shine */}
            <div className="absolute top-2 left-3 w-4 h-6 bg-white/40 rounded-full blur-sm" />
            {/* Knot */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-3 bg-gradient-to-b from-current to-transparent" />
          </div>
          {/* String */}
          <svg
            className="absolute top-20 left-1/2 transform -translate-x-1/2"
            width="2"
            height="60"
          >
            <line
              x1="1"
              y1="0"
              x2="1"
              y2="60"
              stroke="currentColor"
              strokeWidth="1"
              className="text-white/60"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
