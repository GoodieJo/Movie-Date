"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { Movie, AppState } from "@/types";
import Image from "next/image";

interface PlannerScreenProps {
  datePlan: AppState["datePlan"];
  selectedMovie: Movie | null;
  onUpdate: (updates: Partial<AppState["datePlan"]>) => void;
  onNext: () => void;
}

const LOCATIONS = [  "🌙 Under The Stars",
  "☕ A Cozy Cafe First",
  "🚗 Wherever The Adventure Takes Us",
  "🫶 Right Next To Me",
  "❤️ The Seat I Saved For You",
  "✨ Somewhere We'll Remember",
  "🤭 Your Choice",
  "Custom Location"];
const TIMES = ["4:00 PM","5:00 PM","6:00 PM","7:00 PM","8:00 PM","9:00 PM"];

export function PlannerScreen({ datePlan, selectedMovie, onUpdate, onNext }: PlannerScreenProps) {
  const [showCustom, setShowCustom] = useState(datePlan.location === "Custom Location");

  const handleLocation = (loc: string) => {
    onUpdate({ location: loc });
    setShowCustom(loc === "Custom Location");
  };

  const canContinue = !!datePlan.date && !!datePlan.time && !!datePlan.location;

  const locationDisplay = datePlan.location === "Custom Location"
    ? datePlan.customLocation || "—"
    : datePlan.location || "—";

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
        <motion.div className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <p className="text-accent text-xs font-bold uppercase tracking-widest mb-2">Plan Our Date</p>
          <h2 className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
            Pick the Details 🌻
          </h2>
        </motion.div>

        {/* Movie banner */}
        {selectedMovie && (
          <motion.div className="flex items-center gap-3 bg-white rounded-3xl p-3 shadow-card mb-5 border border-secondary"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="w-12 h-16 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center" style={{ background: "#F0E6C8" }}>
              {selectedMovie.poster
                ? <Image src={selectedMovie.poster} alt={selectedMovie.title} width={48} height={64} className="w-full h-full object-cover" />
                : <span className="text-2xl">{selectedMovie.emoji}</span>}
            </div>
            <div>
              <p className="text-[9px] text-foreground/35 uppercase tracking-wider">Selected movie</p>
              <p className="font-bold text-foreground text-sm">{selectedMovie.title}</p>
              <p className="text-xs text-foreground/45">{selectedMovie.genre}</p>
            </div>
          </motion.div>
        )}

        {/* CALENDAR */}
        <motion.div className="bg-white rounded-4xl shadow-card p-5 mb-4 border border-secondary"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <p className="text-[10px] text-foreground/40 uppercase tracking-widest mb-4 text-center font-semibold">
            📅 Choose your date! Me ofc right?
          </p>
          <div className="flex justify-center w-full">
            <DayPicker
              mode="single"
              selected={datePlan.date || undefined}
              onSelect={(d) => onUpdate({ date: d || null })}
              disabled={{ before: new Date() }}
              showOutsideDays={false}
              className="w-full"
              components={{
                DayButton: ({ day, modifiers, ...props }) => {
                  const isSel = modifiers.selected;
                  const isToday = modifiers.today;
                  const isDisabled = modifiers.disabled;
                  return (
                    <motion.button
                      {...(props as object)}
                      className={[
                        "w-10 h-10 rounded-full text-sm font-semibold transition-all flex items-center justify-center relative mx-auto",
                        isSel ? "text-dark-accent shadow-golden" : "",
                        isToday && !isSel ? "border-2 border-accent text-accent" : "",
                        !isSel && !isToday ? "text-foreground/65 hover:bg-secondary" : "",
                        isDisabled ? "opacity-25 cursor-not-allowed" : "cursor-pointer",
                      ].filter(Boolean).join(" ")}
                      style={isSel ? { background: "linear-gradient(135deg, #F6C453, #D4A017)" } : {}}
                      animate={isSel ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                      transition={{ duration: 0.3 }}
                      whileHover={!isDisabled ? { scale: isSel ? 1.05 : 1.1, y: -1 } : {}}
                      whileTap={!isDisabled ? { scale: 0.95 } : {}}
                    >
                      {isSel ? "♥" : day.date.getDate()}
                    </motion.button>
                  );
                },
              }}
            />
          </div>
        </motion.div>

        {/* LOCATION */}
        <motion.div className="bg-white rounded-3xl shadow-card p-4 mb-4 border border-secondary"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <p className="text-[10px] text-foreground/40 uppercase tracking-widest mb-3 font-semibold">📍 Location</p>
          <div className="grid grid-cols-2 gap-2">
            {LOCATIONS.map(loc => (
              <button key={loc} onClick={() => handleLocation(loc)}
                className={`py-2.5 px-3 rounded-2xl text-sm font-semibold transition-all text-left min-h-[44px] ${
                  datePlan.location === loc
                    ? "bg-accent text-white shadow-soft"
                    : "bg-secondary/40 text-foreground/70 hover:bg-secondary"
                }`}>
                {loc}
              </button>
            ))}
          </div>
          <AnimatePresence>
            {showCustom && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <input type="text" placeholder="Enter cinema or location..."
                  value={datePlan.customLocation}
                  onChange={e => onUpdate({ customLocation: e.target.value })}
                  className="mt-3 w-full px-4 py-3 rounded-2xl border-2 border-secondary text-sm focus:outline-none focus:border-accent bg-background transition-colors"
                  autoFocus />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* TIME */}
        <motion.div className="bg-white rounded-3xl shadow-card p-4 mb-4 border border-secondary"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <p className="text-[10px] text-foreground/40 uppercase tracking-widest mb-3 font-semibold">🕐 Showtime</p>
          <div className="grid grid-cols-3 gap-2">
            {TIMES.map(time => (
              <button key={time} onClick={() => onUpdate({ time })}
                className={`py-2.5 rounded-2xl text-sm font-semibold transition-all min-h-[44px] ${
                  datePlan.time === time
                    ? "bg-accent text-white shadow-soft"
                    : "bg-secondary/40 text-foreground/70 hover:bg-secondary"
                }`}>
                {time}
              </button>
            ))}
          </div>
        </motion.div>

        {/* LIVE SUMMARY TICKET */}
        <motion.div className="bg-white rounded-3xl shadow-card p-5 mb-6 border-2 border-secondary overflow-hidden relative"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          {/* Golden header strip */}
          <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl"
            style={{ background: "linear-gradient(90deg, #F6C453, #D4A017, #F6C453)" }} />
          <p className="text-[10px] text-foreground/40 uppercase tracking-widest mb-4 text-center font-semibold pt-1">
            ✨ Date Summary
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { emoji: "🎬", label: "Movie", value: selectedMovie?.title || "—" },
              { emoji: "📅", label: "Date", value: datePlan.date ? format(datePlan.date, "MMM d, yyyy") : "—" },
              { emoji: "🕐", label: "Time", value: datePlan.time || "—" },
              { emoji: "📍", label: "Where", value: locationDisplay },
            ].map(f => (
              <div key={f.label} className="flex items-start gap-2">
                <span className="text-base leading-none pt-0.5">{f.emoji}</span>
                <div className="min-w-0">
                  <p className="text-[9px] text-foreground/35 uppercase tracking-wider">{f.label}</p>
                  <p className="text-xs font-bold text-foreground truncate">{f.value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.button onClick={onNext} disabled={!canContinue}
          className={`w-full font-bold py-4 rounded-full transition-all text-sm ${
            canContinue
              ? "bg-accent text-white shadow-soft hover:bg-primary hover:text-dark-accent hover:scale-[1.02] active:scale-95"
              : "bg-secondary/50 text-foreground/25 cursor-not-allowed"
          }`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          {canContinue ? "The Moment of Truth →" : "Pick a date first 📅"}
        </motion.button>
      </div>
    </motion.div>
  );
}
