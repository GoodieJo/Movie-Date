"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { Movie, AppState } from "@/types";

interface TicketScreenProps {
  recipient: string;
  sender: string;
  selectedMovie: Movie | null;
  datePlan: AppState["datePlan"];
  ticketRevealed: boolean;
  onReveal: () => void;
  onNext: () => void;
}

function TicketField({ label, value, revealed, index }: {
  label: string; value: string; revealed: boolean; index: number;
}) {
  return (
    <motion.div
      className="flex flex-col gap-1"
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
    >
      <span className="text-[9px] uppercase tracking-widest text-white/50 font-semibold">{label}</span>
      <motion.span
        key={revealed ? "v" : "h"}
        className="text-white font-bold text-sm leading-tight"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {revealed ? value : <span className="text-white/30 tracking-widest">• • •</span>}
      </motion.span>
    </motion.div>
  );
}

// Static barcode widths — no Math.random
const BARCODE = [3,1,2,1,3,1,1,2,3,1,2,1,1,3,2,1,3,1,2,1,1,2,3,1,2,3,1,1,2,1];

export function TicketScreen({ recipient, sender, selectedMovie, datePlan, ticketRevealed, onReveal, onNext }: TicketScreenProps) {
  const movieTitle = selectedMovie?.title || "A Special Movie";
  const dateStr = datePlan.date ? format(datePlan.date, "EEE, MMM d yyyy") : "Coming Soon";
  const timeStr = datePlan.time || "7:00 PM";
  const locationStr = datePlan.location === "Custom Location"
    ? datePlan.customLocation || "Somewhere Special"
    : datePlan.location || "Cinema Royale";

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ background: "linear-gradient(160deg, #1a1008 0%, #2d1f05 40%, #1a0a2e 100%)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(246,196,83,0.12) 0%, transparent 70%)" }} />

      <motion.p
        className="text-white/40 text-xs tracking-widest uppercase mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        🌻 Your ticket has arrived
      </motion.p>

      {/* THE TICKET */}
      <motion.div
        className="relative w-full max-w-[340px]"
        initial={{ scale: 0.75, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 18, stiffness: 200, delay: 0.3 }}
      >
        {/* Glow */}
        <div className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{ boxShadow: "0 0 60px rgba(246,196,83,0.25), 0 20px 60px rgba(0,0,0,0.5)" }} />

        {/* Main ticket body */}
        <div className="rounded-3xl overflow-hidden relative" style={{ background: "#1C1008" }}>

          {/* TOP — golden header */}
          <div className="relative px-6 pt-6 pb-5"
            style={{ background: "linear-gradient(135deg, #D4A017 0%, #F6C453 50%, #D4A017 100%)" }}>
            {/* Sunburst texture lines */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
              style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.3) 4px, rgba(255,255,255,0.3) 5px)" }} />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-dark-accent/70 text-[9px] font-bold uppercase tracking-[0.25em] mb-0.5">Cinema Royale</p>
                <h2 className="text-dark-accent text-2xl font-bold leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Movie Night
                </h2>
                <p className="text-dark-accent/60 text-xs mt-0.5 font-medium">Reserved Admission ✦</p>
              </div>
              <div className="text-3xl mt-1">🎬</div>
            </div>
          </div>

          {/* TEAR LINE */}
          <div className="relative flex items-center" style={{ height: "1px" }}>
            <div className="absolute -left-3 w-6 h-6 rounded-full" style={{ background: "#0d0618" }} />
            <div className="flex-1 border-t border-dashed border-white/10 mx-6" />
            <div className="absolute -right-3 w-6 h-6 rounded-full" style={{ background: "#0d0618" }} />
          </div>

          {/* MIDDLE — fields */}
          <div className="px-6 py-5 grid grid-cols-2 gap-x-4 gap-y-4">
            <TicketField label="Reserved For" value={recipient} revealed={true} index={0} />
            <TicketField label="Presented By" value={sender} revealed={true} index={1} />
            <TicketField label="Feature Film" value={movieTitle} revealed={ticketRevealed} index={2} />
            <TicketField label="Showtime" value={timeStr} revealed={ticketRevealed} index={3} />
            <TicketField label="Date" value={dateStr} revealed={ticketRevealed} index={4} />
            <TicketField label="Venue" value={locationStr} revealed={ticketRevealed} index={5} />
          </div>

          {/* SEAT BADGE */}
          <div className="px-6 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[9px] uppercase tracking-widest text-white/30 font-semibold">Seat</span>
                <span className="text-white font-bold text-sm">Best in House 🌷</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] uppercase tracking-widest text-white/30 font-semibold">Class</span>
                <span className="text-primary font-bold text-sm">Gold ✦</span>
              </div>
            </div>
          </div>

          {/* TEAR LINE 2 */}
          <div className="relative flex items-center" style={{ height: "1px" }}>
            <div className="absolute -left-3 w-6 h-6 rounded-full" style={{ background: "#0d0618" }} />
            <div className="flex-1 border-t border-dashed border-white/10 mx-6" />
            <div className="absolute -right-3 w-6 h-6 rounded-full" style={{ background: "#0d0618" }} />
          </div>

          {/* BARCODE STUB */}
          <div className="px-6 py-5">
            <div className="flex gap-[2px] justify-center mb-2">
              {BARCODE.map((w, i) => (
                <div key={i} className="opacity-30" style={{ width: w * 1.5, height: 32, background: i % 4 === 0 ? "#F6C453" : "white", borderRadius: 1 }} />
              ))}
            </div>
            <p className="text-center text-white/20 text-[8px] tracking-[0.3em] uppercase">MV-2026 · Gold Tier · Admit Two</p>
          </div>
        </div>

        {/* Corner dots */}
        {["-top-1 -left-1", "-top-1 -right-1", "-bottom-1 -left-1", "-bottom-1 -right-1"].map((pos, i) => (
          <motion.div key={i} className={`absolute ${pos} w-3 h-3 rounded-full bg-primary`}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }} />
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        className="mt-8 w-full max-w-[340px] flex flex-col gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        {!ticketRevealed ? (
          <button onClick={onReveal}
            className="w-full bg-primary text-dark-accent font-bold py-4 rounded-full shadow-soft hover:bg-accent hover:text-white transition-all hover:scale-[1.03] active:scale-95 text-sm">
            ✨ Reveal Details
          </button>
        ) : (
          <button onClick={onNext}
            className="w-full bg-primary text-dark-accent font-bold py-4 rounded-full shadow-soft hover:bg-accent hover:text-white transition-all hover:scale-[1.03] active:scale-95 text-sm">
            Choose Our Movie 🎬
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}
