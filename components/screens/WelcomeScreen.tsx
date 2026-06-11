"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface WelcomeScreenProps {
  recipient: string;
  onNext: () => void;
}

// All static — no Math.random() during render
const DECO_STARS = [
  { x: "10%", y: "15%", size: "text-xl", dur: 2 },
  { x: "85%", y: "20%", size: "text-sm", dur: 3 },
  { x: "15%", y: "70%", size: "text-xs", dur: 4 },
  { x: "90%", y: "65%", size: "text-lg", dur: 2.5 },
  { x: "50%", y: "10%", size: "text-sm", dur: 3.5 },
  { x: "30%", y: "85%", size: "text-xl", dur: 2.8 },
  { x: "70%", y: "80%", size: "text-xs", dur: 3.2 },
  { x: "5%",  y: "45%", size: "text-sm", dur: 2.4 },
  { x: "95%", y: "40%", size: "text-xs", dur: 3.8 },
  { x: "60%", y: "5%",  size: "text-lg", dur: 2.6 },
];

export function WelcomeScreen({ recipient, onNext }: WelcomeScreenProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 50% 60%, #2d1b4e 0%, #1a0a2e 50%, #0d0618 100%)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6 }}
    >
      {/* Moon */}
      <motion.div
        className="absolute top-10 right-10 text-5xl md:text-6xl opacity-80 pointer-events-none"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        🌙
      </motion.div>

      {/* Sunflower accent top-left */}
      <motion.div
        className="absolute top-8 left-8 text-3xl opacity-40 pointer-events-none"
        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        🌻
      </motion.div>

      {/* Tulip accent bottom-right */}
      <motion.div
        className="absolute bottom-16 right-10 text-3xl opacity-35 pointer-events-none"
        animate={{ y: [-4, 4, -4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        🌷
      </motion.div>

      {/* Static decorative stars — SSR-safe */}
      {DECO_STARS.map((star, i) => (
        <motion.div
          key={i}
          className={`absolute ${star.size} pointer-events-none text-yellow-200`}
          style={{ left: star.x, top: star.y }}
          animate={{ opacity: [0.15, 0.9, 0.15], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: star.dur, repeat: Infinity, delay: i * 0.25 }}
        >
          ✦
        </motion.div>
      ))}

      {/* Floating ticket */}
      <motion.div
        className="absolute top-24 left-6 text-4xl opacity-60 pointer-events-none"
        animate={{ y: [-8, 8, -8], rotate: [-5, 5, -5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        🎟️
      </motion.div>

      <motion.div
        className="absolute bottom-24 right-8 text-3xl opacity-50 pointer-events-none"
        animate={{ y: [8, -8, 8], rotate: [5, -5, 5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        🍿
      </motion.div>

      {/* Main content */}
      <motion.div
        className="text-center px-6 max-w-md mx-auto z-10"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <motion.div
          className="text-7xl mb-6"
          animate={{ y: [-6, 6, -6] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          🎬
        </motion.div>

        <motion.p
          className="text-white/50 text-xs tracking-widest uppercase mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          A special delivery for
        </motion.p>

        <motion.h1
          className="text-white text-4xl md:text-5xl font-bold mb-3"
          style={{ fontFamily: "'Playfair Display', serif" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          {recipient}
        </motion.h1>

        <motion.p
          className="text-white/70 text-lg mb-10 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          I found something with your name on it...
        </motion.p>

        {mounted && (
          <motion.button
            onClick={onNext}
            className="relative bg-primary text-dark-accent font-bold px-10 py-4 rounded-full text-base shadow-soft-lg overflow-hidden hover:bg-accent hover:text-white transition-colors"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.6, type: "spring", damping: 15 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
          >
            🎟️ Open Ticket
          </motion.button>
        )}

        <motion.p
          className="text-white/25 text-xs mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
        >
          psst — try clicking the stars Mwahhhh! 🌟
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
