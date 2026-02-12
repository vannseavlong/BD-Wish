import { motion } from 'motion/react';

interface CakeProps {
  animated?: boolean;
  candlesLit?: boolean;
  scale?: number;
}

export function Cake({ animated = false, candlesLit = false, scale = 1 }: CakeProps) {
  return (
    <div className="relative" style={{ transform: `scale(${scale})` }}>
      {/* Plate */}
      <div className="w-64 h-4 bg-gradient-to-b from-gray-200 to-gray-300 rounded-full shadow-xl mb-2" />

      {/* Cake layers */}
      <motion.div
        animate={animated ? { y: [0, -5, 0] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        {/* Bottom layer */}
        <div className="relative w-56 h-24 mx-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-pink-600 rounded-t-lg shadow-lg" />
          {/* Frosting waves */}
          <div className="absolute -bottom-2 left-0 right-0 h-4 bg-gradient-to-b from-pink-200 to-pink-300 rounded-b-full" />
          {/* Decorative dots */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 w-3 h-3 bg-yellow-300 rounded-full"
              style={{ left: `${10 + i * 12}%` }}
            />
          ))}
        </div>

        {/* Middle layer */}
        <div className="relative w-48 h-20 mx-auto -mt-2">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg shadow-lg" />
          <div className="absolute -bottom-2 left-0 right-0 h-4 bg-gradient-to-b from-purple-200 to-purple-300 rounded-b-full" />
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 w-3 h-3 bg-pink-300 rounded-full"
              style={{ left: `${12 + i * 14}%` }}
            />
          ))}
        </div>

        {/* Top layer */}
        <div className="relative w-40 h-16 mx-auto -mt-2">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-lg" />
          <div className="absolute -bottom-1 left-0 right-0 h-3 bg-gradient-to-b from-blue-200 to-blue-300 rounded-b-full" />
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 w-2 h-2 bg-yellow-300 rounded-full"
              style={{ left: `${15 + i * 15}%` }}
            />
          ))}
        </div>

        {/* Candles */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              {/* Flame */}
              {candlesLit && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{
                    scale: [1, 1.2, 1],
                    y: [0, -2, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                  className="relative w-4 h-6 mb-1"
                >
                  {/* Outer glow */}
                  <div className="absolute inset-0 bg-orange-400 rounded-full blur-sm opacity-70" />
                  {/* Inner flame */}
                  <div className="absolute inset-1 bg-gradient-to-t from-yellow-400 to-orange-500 rounded-full" />
                  {/* Bright center */}
                  <div className="absolute inset-2 bg-yellow-200 rounded-full" />
                </motion.div>
              )}
              {/* Candle stick */}
              <div className="w-2 h-10 bg-gradient-to-b from-red-400 to-red-600 rounded-sm shadow-md">
                <div className="w-full h-1 bg-red-300 rounded-t-sm" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Shadow */}
      <div className="w-72 h-6 mx-auto mt-2 bg-black/20 rounded-full blur-xl" />
    </div>
  );
}
