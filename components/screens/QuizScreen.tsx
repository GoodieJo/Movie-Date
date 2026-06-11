"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { quizQuestions } from "@/data/quiz";
import { QuizAnswer } from "@/types";

interface QuizScreenProps {
  answers: QuizAnswer[];
  onAnswer: (answer: QuizAnswer) => void;
  onNext: () => void;
}

export function QuizScreen({ answers, onAnswer, onNext }: QuizScreenProps) {
  const [currentQ, setCurrentQ] = useState(answers.length >= quizQuestions.length ? quizQuestions.length - 1 : answers.length);
  const [showResult, setShowResult] = useState(answers.length >= quizQuestions.length);
  const [selected, setSelected] = useState<string | null>(null);

  const handleAnswer = (option: string) => {
    if (selected) return;
    setSelected(option);
    setTimeout(() => {
      onAnswer({ question: quizQuestions[currentQ].question, answer: option });
      if (currentQ + 1 >= quizQuestions.length) {
        setTimeout(() => setShowResult(true), 300);
      } else {
        setCurrentQ(q => q + 1);
        setSelected(null);
      }
    }, 380);
  };

  const q = quizQuestions[currentQ];

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ background: "linear-gradient(180deg, #FFF9E6 0%, #FFF3C4 100%)" }}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.4 }}
    >
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div key={`q-${currentQ}`} className="w-full max-w-sm"
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>

            {/* Progress dots */}
            <div className="flex gap-2 justify-center mb-8">
              {quizQuestions.map((_, i) => (
                <motion.div key={i} className="h-2 rounded-full" style={{ width: 36 }}
                  animate={{ background: i < currentQ ? "#D4A017" : i === currentQ ? "#F6C453" : "#F0E6C8" }}
                  transition={{ duration: 0.3 }} />
              ))}
            </div>

            <p className="text-center text-accent text-xs font-bold uppercase tracking-widest mb-2">
              Question {currentQ + 1} of {quizQuestions.length}
            </p>
            <div className="text-center text-5xl mb-3">{q.emoji}</div>
            <h3 className="text-foreground font-bold text-xl text-center mb-7">{q.question}</h3>

            <div className="grid grid-cols-2 gap-3">
              {q.options.map((opt, i) => (
                <motion.button key={opt.label} onClick={() => handleAnswer(opt.label)}
                  className={`p-4 rounded-3xl text-left transition-all border-2 ${
                    selected === opt.label
                      ? "border-accent bg-primary/20 scale-[0.98]"
                      : "border-secondary bg-white hover:border-primary hover:shadow-card"
                  }`}
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={!!selected}
                >
                  <span className="text-2xl block mb-1.5">{opt.emoji}</span>
                  <span className="text-xs font-semibold text-foreground leading-tight block">{opt.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <ResultCard key="result" onNext={onNext} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ResultCard({ onNext }: { onNext: () => void }) {
  return (
    <motion.div className="w-full max-w-sm text-center"
      initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", damping: 15 }}>

      <div className="bg-white rounded-4xl p-8 shadow-soft-lg border border-secondary mb-5">
        <motion.div className="text-5xl mb-4"
          animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.7, delay: 0.3 }}>
          🌻
        </motion.div>
        <p className="text-accent text-[10px] uppercase tracking-widest mb-1">Results are in</p>
        <h2 className="text-2xl font-bold text-foreground mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
          Movie Date Compatibility
        </h2>

        {/* Animated gauge */}
        <div className="my-6 relative w-28 h-28 mx-auto">
          <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#F0E6C8" strokeWidth="8" />
            <motion.circle cx="50" cy="50" r="40" fill="none" stroke="#D4A017" strokeWidth="8"
              strokeLinecap="round" strokeDasharray="251.2"
              initial={{ strokeDashoffset: 251.2 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ delay: 0.5, duration: 1.6, ease: "easeOut" }} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span className="text-2xl font-bold text-accent"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
              100%
            </motion.span>
          </div>
        </div>

        <motion.p className="text-foreground/60 text-sm leading-relaxed"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
          No surprise here.<br />We make a pretty great movie team 🌷
        </motion.p>
      </div>

      <button onClick={onNext}
        className="w-full bg-accent text-white font-bold py-4 rounded-full shadow-soft hover:bg-primary hover:text-dark-accent transition-all hover:scale-[1.02] active:scale-95">
        Continue ✨
      </button>
    </motion.div>
  );
}
