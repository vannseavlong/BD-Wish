import { motion } from 'motion/react';

interface ImprovedCakeProps {
  animated?: boolean;
  candlesLit?: boolean;
  scale?: number;
}

export function ImprovedCake({ animated = false, candlesLit = true, scale = 1 }: ImprovedCakeProps) {
  const candleCount = 5;

  return (
    <div className="relative" style={{ transform: `scale(${scale})` }}>
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-2xl"
      >
        {/* Top frosting/cream */}
        <ellipse
          cx="100"
          cy="85"
          rx="50"
          ry="6"
          fill="white"
          opacity="0.9"
        />

        {/* Top layer - Pink */}
        <rect
          x="50"
          y="85"
          width="100"
          height="25"
          fill="url(#pinkGradient)"
          rx="2"
        />
        <ellipse
          cx="100"
          cy="85"
          rx="50"
          ry="8"
          fill="#FF69B4"
        />

        {/* Dots on pink layer */}
        {[...Array(8)].map((_, i) => (
          <circle
            key={`pink-dot-${i}`}
            cx={60 + i * 10}
            cy="97"
            r="2"
            fill="#FFD700"
          />
        ))}

        {/* Middle frosting */}
        <ellipse
          cx="100"
          cy="110"
          rx="55"
          ry="6"
          fill="white"
          opacity="0.9"
        />

        {/* Middle layer - Purple */}
        <rect
          x="45"
          y="110"
          width="110"
          height="25"
          fill="url(#purpleGradient)"
          rx="2"
        />
        <ellipse
          cx="100"
          cy="110"
          rx="55"
          ry="8"
          fill="#9370DB"
        />

        {/* Dots on purple layer */}
        {[...Array(8)].map((_, i) => (
          <circle
            key={`purple-dot-${i}`}
            cx={55 + i * 11}
            cy="122"
            r="2"
            fill="white"
          />
        ))}

        {/* Bottom frosting */}
        <ellipse
          cx="100"
          cy="135"
          rx="60"
          ry="6"
          fill="white"
          opacity="0.9"
        />

        {/* Bottom layer - Blue */}
        <rect
          x="40"
          y="135"
          width="120"
          height="30"
          fill="url(#blueGradient)"
          rx="2"
        />
        <ellipse
          cx="100"
          cy="135"
          rx="60"
          ry="8"
          fill="#4169E1"
        />

        {/* Dots on blue layer */}
        {[...Array(9)].map((_, i) => (
          <circle
            key={`blue-dot-${i}`}
            cx={50 + i * 11.5}
            cy="150"
            r="2"
            fill="#FFD700"
          />
        ))}

        {/* Bottom ellipse */}
        <ellipse
          cx="100"
          cy="165"
          rx="60"
          ry="8"
          fill="#27408B"
        />

        {/* Gradients */}
        <defs>
          <linearGradient id="pinkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF69B4" />
            <stop offset="100%" stopColor="#FF1493" />
          </linearGradient>
          <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9370DB" />
            <stop offset="100%" stopColor="#7B68EE" />
          </linearGradient>
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4169E1" />
            <stop offset="100%" stopColor="#27408B" />
          </linearGradient>
        </defs>
      </svg>

      {/* Candles */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex gap-3">
        {[...Array(candleCount)].map((_, i) => (
          <div key={i} className="relative">
            {/* Candle stick */}
            <motion.div
              animate={animated ? { rotate: [0, 2, -2, 0] } : {}}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              className="w-2 h-10 bg-gradient-to-b from-yellow-100 to-yellow-300 rounded-sm relative shadow-md"
            >
              {/* Candle stripes */}
              <div className="absolute top-2 left-0 right-0 h-px bg-red-300 opacity-50" />
              <div className="absolute top-5 left-0 right-0 h-px bg-red-300 opacity-50" />
              <div className="absolute top-8 left-0 right-0 h-px bg-red-300 opacity-50" />
            </motion.div>

            {/* Flame */}
            {candlesLit && (
              <motion.div
                className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                animate={{
                  scale: [1, 1.2, 1],
                  y: [0, -2, 0],
                }}
                transition={{
                  duration: 0.5 + Math.random() * 0.3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                {/* Outer glow */}
                <div className="absolute inset-0 blur-md">
                  <div className="w-3 h-5 bg-orange-400 rounded-full opacity-60" />
                </div>
                {/* Flame body */}
                <svg width="12" height="16" viewBox="0 0 12 16" className="relative">
                  <path
                    d="M6 0 C3 4, 1 6, 1 10 C1 13, 3 16, 6 16 C9 16, 11 13, 11 10 C11 6, 9 4, 6 0 Z"
                    fill="url(#flameGradient)"
                  />
                  <defs>
                    <linearGradient id="flameGradient" x1="50%" y1="0%" x2="50%" y2="100%">
                      <stop offset="0%" stopColor="#FFD700" />
                      <stop offset="50%" stopColor="#FF8C00" />
                      <stop offset="100%" stopColor="#FF4500" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Inner white core */}
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-3 bg-yellow-100 rounded-full blur-sm" />
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
