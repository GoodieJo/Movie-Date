"use client";

import { motion, AnimatePresence } from "framer-motion";
import { memoryCards } from "@/data/memories";

interface MemoryScreenProps {
  flippedCards: string[];
  onFlip: (id: string) => void;
  onNext: () => void;
}

// Updated warm card colors for golden theme
const CARD_COLORS = ["#FFF3C4","#F0E6C8","#FFF9E6","#FFEAA7","#FFF3C4","#F0E6C8"];

export function MemoryScreen({ flippedCards, onFlip, onNext }: MemoryScreenProps) {
  const allViewed = flippedCards.length >= memoryCards.length;

  return (
    <motion.div
      className="min-h-screen flex flex-col p-4 pt-8 pb-8"
      style={{ background: "linear-gradient(180deg, #FFF9E6 0%, #FFF3C4 100%)" }}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-lg mx-auto w-full">
        <motion.div className="text-center mb-7"
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <p className="text-accent text-xs font-bold uppercase tracking-widest mb-2">Compliment Wall</p>
          <h2 className="text-3xl font-bold text-foreground mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            A Few Things 🌷
          </h2>
          <p className="text-foreground/45 text-sm">
            {flippedCards.length < memoryCards.length
              ? `Tap to flip · ${flippedCards.length}/${memoryCards.length} revealed`
              : "All Compliments unlocked ✨"}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {memoryCards.map((card, i) => (
            <PolaroidCard key={card.id} card={card}
              flipped={flippedCards.includes(card.id)}
              onFlip={() => onFlip(card.id)}
              index={i}
              bgColor={CARD_COLORS[i % CARD_COLORS.length]} />
          ))}
        </div>

        <AnimatePresence>
          {allViewed && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", damping: 14 }}
            >
              <button onClick={onNext}
                className="w-full bg-accent text-white font-bold py-4 rounded-full shadow-soft hover:bg-primary hover:text-dark-accent transition-all hover:scale-[1.02] active:scale-95">
                One More Thing 🌻
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {!allViewed && (
          <p className="text-center text-foreground/30 text-sm">Flip all cards to continue</p>
        )}
      </div>
    </motion.div>
  );
}

function PolaroidCard({ card, flipped, onFlip, index, bgColor }: {
  card: (typeof memoryCards)[0]; flipped: boolean; onFlip: () => void; index: number; bgColor: string;
}) {
  // Static rotation values — no Math.random
  const staticRotations = [-2, 1.5, -1, 2, -1.5, 1];
  const initRot = staticRotations[index % staticRotations.length];

  return (
    <motion.div
      className="aspect-square cursor-pointer select-none"
      style={{ perspective: "1000px" }}
      onClick={onFlip}
      initial={{ opacity: 0, y: 20, rotate: initRot }}
      animate={{ opacity: 1, y: 0, rotate: flipped ? 0 : initRot }}
      transition={{ delay: index * 0.07 }}
      whileHover={{ y: -5, rotate: 0, scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      role="button"
      aria-pressed={flipped}
      aria-label={`Memory card ${index + 1}`}
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, type: "spring", damping: 18 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* FRONT */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-card backface-hidden"
          style={{ backfaceVisibility: "hidden", background: bgColor }}>
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-3">
            <div className="text-3xl">📸</div>
            <div className="text-[10px] text-foreground/40 font-medium">tap to reveal</div>
            <motion.div className="text-sm"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: index * 0.28 }}>
              ✦
            </motion.div>
          </div>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-card backface-hidden"
          style={{ backfaceVisibility: "hidden", background: "white", transform: "rotateY(180deg)" }}>
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4">
            <span className="text-2xl">{card.emoji}</span>
            <p className="text-xs text-foreground/70 text-center leading-relaxed font-medium">{card.back}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
