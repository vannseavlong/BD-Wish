import { motion } from 'motion/react';

export function BlowingAvatar() {
  return (
    <div className="relative">
      {/* Character head */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, -2, 0, 2, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative"
      >
        {/* Head */}
        <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full relative shadow-xl">
          {/* Hair */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-20 h-12 md:w-28 md:h-16 bg-gradient-to-b from-amber-800 to-amber-700 rounded-t-full" />
          
          {/* Eyes */}
          <div className="absolute top-8 md:top-10 left-1/2 transform -translate-x-1/2 flex gap-4 md:gap-6">
            <motion.div
              animate={{ scaleY: [1, 0.1, 1] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
              }}
              className="w-2 h-2 md:w-3 md:h-3 bg-gray-800 rounded-full"
            />
            <motion.div
              animate={{ scaleY: [1, 0.1, 1] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
              }}
              className="w-2 h-2 md:w-3 md:h-3 bg-gray-800 rounded-full"
            />
          </div>

          {/* Nose */}
          <div className="absolute top-12 md:top-16 left-1/2 transform -translate-x-1/2 w-2 h-3 bg-amber-400 rounded-full" />

          {/* Mouth blowing (O shape) */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-16 md:top-20 left-1/2 transform -translate-x-1/2 w-4 h-4 md:w-6 md:h-6 bg-pink-400 rounded-full border-2 border-pink-500"
          />

          {/* Rosy cheeks */}
          <div className="absolute top-10 md:top-14 left-2 w-4 h-3 md:w-6 md:h-4 bg-pink-300/60 rounded-full blur-sm" />
          <div className="absolute top-10 md:top-14 right-2 w-4 h-3 md:w-6 md:h-4 bg-pink-300/60 rounded-full blur-sm" />
        </div>
      </motion.div>

      {/* Breath/Wind effect */}
      <motion.div
        className="absolute top-16 md:top-20 -right-4 flex items-center"
        animate={{
          x: [0, 20, 0],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-3 h-3 md:w-4 md:h-4 bg-blue-200/50 rounded-full mx-1"
            animate={{
              scale: [0.5, 1, 0.5],
              x: [0, 30 * (i + 1), 60 * (i + 1)],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeOut',
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
