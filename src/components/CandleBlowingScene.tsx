import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ImprovedCake } from './ImprovedCake';
import { Confetti } from './Confetti';
import { FloatingBalloons } from './FloatingBalloons';
import { BlowingAvatar } from './BlowingAvatar';

interface CandleBlowingSceneProps {
  userName: string;
  onCandlesBlownOut: () => void;
}

export function CandleBlowingScene({ userName, onCandlesBlownOut }: CandleBlowingSceneProps) {
  const [candlesLit, setCandlesLit] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);

  useEffect(() => {
    // Show avatar after 2 seconds
    const avatarTimer = setTimeout(() => {
      setShowAvatar(true);
    }, 2000);

    // Avatar blows out candles after 4 seconds total
    const blowTimer = setTimeout(() => {
      setCandlesLit(false);
      setShowConfetti(true);
      onCandlesBlownOut();
    }, 5000);

    return () => {
      clearTimeout(avatarTimer);
      clearTimeout(blowTimer);
    };
  }, [onCandlesBlownOut]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen px-4 py-8"
    >
      {/* Confetti */}
      {showConfetti && <Confetti />}

      {/* Floating Balloons */}
      {!candlesLit && <FloatingBalloons />}

      {/* Personalized greeting */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8 z-10"
      >
        <motion.h2 
          className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 px-4"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Happy Birthday, <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300">{userName}</span>! 🎉
        </motion.h2>
        {candlesLit ? (
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl text-white/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Make a wish...
          </motion.p>
        ) : (
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl text-white/80"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            Your wish is granted! ✨
          </motion.p>
        )}
      </motion.div>

      {/* Avatar blowing */}
      {showAvatar && candlesLit && (
        <motion.div
          initial={{ x: -200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="absolute left-4 sm:left-8 md:left-24 top-1/2 transform -translate-y-1/2 z-20"
        >
          <BlowingAvatar />
        </motion.div>
      )}

      {/* Cake with zoom animation */}
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: candlesLit ? 1.2 : 1.1 }}
        transition={{ duration: 0.8, type: 'spring' }}
      >
        <ImprovedCake animated={true} candlesLit={candlesLit} scale={1.2} />
      </motion.div>

      {/* Wind particles when blowing */}
      {showAvatar && candlesLit && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/40 rounded-full"
              style={{
                left: '20%',
                top: `${45 + Math.random() * 10}%`,
              }}
              initial={{ x: 0, opacity: 0 }}
              animate={{
                x: [0, 300 + Math.random() * 200],
                y: (Math.random() - 0.5) * 100,
                opacity: [0, 0.6, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                delay: 2 + i * 0.1,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}