"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { starCompliments } from "@/data/compliments";

interface StarHuntProps {
  starCount: number;
  bonusUnlocked: boolean;
  onCollect: () => void;
}

// Fixed deterministic positions — no Math.random() during render/SSR
const FIXED_STAR_POSITIONS = [
  { x: 8,  y: 12, size: 14, opacity: 0.35, animDur: 2.8 },
  { x: 82, y: 18, size: 10, opacity: 0.25, animDur: 3.4 },
  { x: 91, y: 55, size: 12, opacity: 0.30, animDur: 2.2 },
  { x: 5,  y: 68, size: 9,  opacity: 0.20, animDur: 3.8 },
  { x: 46, y: 7,  size: 11, opacity: 0.28, animDur: 2.6 },
  { x: 73, y: 82, size: 13, opacity: 0.32, animDur: 3.1 },
  { x: 22, y: 88, size: 10, opacity: 0.22, animDur: 2.4 },
  { x: 60, y: 14, size: 9,  opacity: 0.26, animDur: 3.6 },
  { x: 37, y: 75, size: 12, opacity: 0.30, animDur: 2.9 },
  { x: 88, y: 35, size: 10, opacity: 0.24, animDur: 3.3 },
  { x: 15, y: 45, size: 11, opacity: 0.28, animDur: 2.7 },
  { x: 55, y: 92, size: 9,  opacity: 0.20, animDur: 3.5 },
];

interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
}

export function StarHunt({ starCount, bonusUnlocked, onCollect }: StarHuntProps) {
  const [mounted, setMounted] = useState(false);
  const [collectedIds, setCollectedIds] = useState<Set<number>>(new Set());
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [showBonus, setShowBonus] = useState(false);
  const [bonusWasShown, setBonusWasShown] = useState(false);
  const usedComplimentsRef = useRef<number[]>([]);

  useEffect(() => { setMounted(true); }, []);

  // Escape key to close bonus
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowBonus(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (bonusUnlocked && !bonusWasShown) {
      setShowBonus(true);
      setBonusWasShown(true);
    }
  }, [bonusUnlocked, bonusWasShown]);

  const handleStarClick = useCallback((id: number, x: number, y: number, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (collectedIds.has(id)) return;
    onCollect();
    setCollectedIds(prev => new Set(prev).add(id));

    const used = usedComplimentsRef.current;
    const available = starCompliments.map((_, i) => i).filter(i => !used.includes(i));
    const pool = available.length > 0 ? available : starCompliments.map((_, i) => i);
    // deterministic-ish: use collected count as seed offset
    const idx = pool[(collectedIds.size) % pool.length];
    usedComplimentsRef.current = [...used, idx];

    const textId = Date.now();
    setFloatingTexts(prev => [...prev, { id: textId, text: starCompliments[idx], x, y }]);
    setTimeout(() => setFloatingTexts(prev => prev.filter(t => t.id !== textId)), 3000);
  }, [collectedIds, onCollect]);

  const closeBonus = useCallback(() => setShowBonus(false), []);

  if (!mounted) return null;

  return (
    <>
      {FIXED_STAR_POSITIONS.map((star, i) => {
        if (collectedIds.has(i)) return null;
        return (
          <motion.button
            key={i}
            className="fixed z-10 cursor-pointer focus:outline-none select-none"
            style={{ left: `${star.x}%`, top: `${star.y}%`, fontSize: `${star.size}px`, opacity: star.opacity }}
            onClick={(e) => handleStarClick(i, star.x, star.y, e)}
            onTouchEnd={(e) => { e.preventDefault(); handleStarClick(i, star.x, star.y, e as unknown as React.MouseEvent); }}
            whileHover={{ scale: 2, opacity: 1 }}
            whileTap={{ scale: 1.5 }}
            animate={{ opacity: [star.opacity, star.opacity * 0.3, star.opacity], scale: [1, 0.85, 1] }}
            transition={{ duration: star.animDur, repeat: Infinity, delay: i * 0.2 }}
            aria-label="Collect a star"
          >
            ⭐
          </motion.button>
        );
      })}

      <AnimatePresence>
        {floatingTexts.map(t => (
          <motion.div
            key={t.id}
            className="fixed z-50 pointer-events-none"
            style={{ left: `${Math.min(t.x, 70)}%`, top: `${Math.max(t.y - 5, 5)}%` }}
            initial={{ opacity: 0, y: 0, scale: 0.8 }}
            animate={{ opacity: 1, y: -50, scale: 1 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 2.5 }}
          >
            <div className="bg-white/95 backdrop-blur-sm text-foreground text-sm font-medium px-4 py-2.5 rounded-2xl shadow-soft border border-secondary max-w-[200px]">
              {t.text}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {starCount > 0 && (
        <motion.div
          className="fixed bottom-4 left-4 z-50 bg-white/90 backdrop-blur-sm rounded-2xl px-3 py-2 shadow-soft border border-secondary flex items-center gap-2"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <span className="text-sm">⭐</span>
          <span className="text-xs font-semibold text-foreground">{Math.min(starCount, 5)}/5</span>
        </motion.div>
      )}

      {/* Bonus modal — proper AnimatePresence with working close */}
      <AnimatePresence>
        {showBonus && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeBonus}
          >
            <motion.div
              className="relative bg-background rounded-4xl p-8 max-w-sm w-full shadow-soft-lg text-center border border-secondary"
              initial={{ scale: 0.7, opacity: 0, rotate: -8 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.7, opacity: 0, rotate: 8 }}
              transition={{ type: "spring", damping: 16, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
            >
              {/* X button */}
              <button
                onClick={closeBonus}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary/60 flex items-center justify-center text-foreground/60 hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="Close bonus card"
              >
                ✕
              </button>

              <motion.div
                className="text-6xl mb-4"
                animate={{ rotate: [0, -12, 12, -8, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                🌟
              </motion.div>

              <h3 className="font-display text-2xl font-bold text-foreground mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                Bonus Unlocked! 🌻
              </h3>
              <p className="text-foreground/70 leading-relaxed mb-2 text-base">
                {`"Thank you for coming into my Life. 💞"`}
              </p>
              <p className="text-foreground/40 text-xs mb-6">You found all 5 stars Wow!✦</p>

              <button
                onClick={closeBonus}
                className="w-full bg-primary text-foreground font-semibold py-3 rounded-full text-sm hover:bg-accent hover:text-white transition-all hover:scale-[1.02] active:scale-95 shadow-soft"
              >
                Continue ✨
              </button>
              <p className="text-foreground/30 text-xs mt-3">Press Esc to close</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
