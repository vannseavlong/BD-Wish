import { useState } from "react";
import { motion } from "motion/react";
import { ImprovedCake } from "./ImprovedCake";
import { Heart, Sparkle } from "lucide-react";

interface LandingSceneProps {
  userName: string;
  birthDate: string;
  onStartSurprise: (wish: string) => void;
}

export function LandingScene({
  userName,
  birthDate,
  onStartSurprise,
}: LandingSceneProps) {
  const [wish, setWish] = useState("");

  const handleStart = () => {
    if (wish.trim()) {
      onStartSurprise(wish);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen px-4 py-8 sm:py-12"
    >
      {/* Floating background sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-300 opacity-40"
            initial={{
              x:
                Math.random() *
                (typeof window !== "undefined" ? window.innerWidth : 1000),
              y:
                Math.random() *
                (typeof window !== "undefined" ? window.innerHeight : 1000),
              scale: 0,
            }}
            animate={{
              y: [
                null,
                Math.random() *
                  (typeof window !== "undefined" ? window.innerHeight : 1000),
              ],
              scale: [0, 1, 0],
              rotate: 360,
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <Sparkle size={16} />
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-center mb-6 sm:mb-8"
      >
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 mb-2">
          Happy birthday to you
        </h1>
        <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300">
          {userName || "Someone Special"}
          {birthDate && `, ${birthDate}`}
        </p>
      </motion.div>

      {/* Animated Cake */}
      <motion.div
        initial={{ scale: 0, rotateY: -180 }}
        animate={{ scale: 1, rotateY: 0 }}
        transition={{
          delay: 0.6,
          duration: 1,
          type: "spring",
          stiffness: 100,
        }}
        className="mb-8 sm:mb-12"
      >
        <ImprovedCake animated={true} candlesLit={true} />
      </motion.div>

      {/* Wish Input - iOS Glass Style */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-1 shadow-2xl">
          <div className="bg-white/5 rounded-[22px] p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center mt-1">
                <Heart size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white/80 text-sm font-medium mb-2">
                  Your Birthday Wish
                </p>
                <textarea
                  value={wish}
                  onChange={(e) => setWish(e.target.value)}
                  placeholder="Write a heartfelt birthday wish... 💝"
                  className="w-full bg-transparent text-white placeholder-white/40 resize-none focus:outline-none text-base sm:text-lg leading-relaxed"
                  rows={4}
                  maxLength={200}
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-white/40 text-xs sm:text-sm">
                {wish.length}/200 characters
              </div>
              <motion.button
                onClick={handleStart}
                disabled={!wish.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full text-white text-base sm:text-xl font-bold shadow-lg shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl hover:shadow-purple-500/70 transition-all"
              >
                Wish
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hint text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-6 sm:mt-8 text-white/60 text-xs sm:text-sm text-center px-4"
      >
        ✨ Something magical is about to happen ✨
      </motion.p>
    </motion.div>
  );
}
