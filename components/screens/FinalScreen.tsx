"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";
import { format } from "date-fns";
import { toPng } from "html-to-image";
import { AppState } from "@/types";
import { generateICS, downloadICS } from "@/lib/utils";

interface FinalScreenProps {
  state: AppState;
  onAnswer: (answer: "yes" | "maybe" | "no") => void;
  onReset: () => void;
}

export function FinalScreen({ state, onAnswer, onReset }: FinalScreenProps) {
  const { finalAnswer } = state;
  if (finalAnswer === "yes")   return <YesResponse   state={state} onReset={onReset} />;
  if (finalAnswer === "maybe") return <MaybeResponse onAsk={() => onAnswer("yes")} />;
  if (finalAnswer === "no")    return <NoResponse    onAnswer={onAnswer} />;
  return <TheReveal onAnswer={onAnswer} recipient={state.recipient} sender={state.sender} />;
}

/* ─────────────────────────────────── REVEAL ─────────────────────────────── */
function TheReveal({ onAnswer, recipient, sender }: {
  onAnswer: (a: "yes" | "maybe" | "no") => void;
  recipient: string;
  sender: string;
}) {
  const [phase, setPhase] = useState<"curtains" | "spotlight" | "open" | "screen" | "type" | "buttons">("curtains");
  const [lines, setLines] = useState<string[]>([]);
  const script = useMemo(() => [
    "There's one role left to cast.",
    "My date for the Movie",
    `Would you like that role Baby, ${recipient}?`,
  ], [recipient]);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("spotlight"), 400);
    const t2 = setTimeout(() => setPhase("open"), 1200);
    const t3 = setTimeout(() => setPhase("screen"), 2600);
    const t4 = setTimeout(() => setPhase("type"), 3200);
    return () => [t1,t2,t3,t4].forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (phase !== "type") return;
    let i = 0;
    const run = () => {
      if (i < script.length) {
        const line = script[i++];
        setLines(prev => [...prev, line]);
        setTimeout(run, i < script.length ? 1800 : 900);
      } else {
        setTimeout(() => setPhase("buttons"), 400);
      }
    };
    const t = setTimeout(run, 300);
    return () => clearTimeout(t);
  }, [phase, script]);

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 50% 50%, #1C1008 0%, #0d0618 100%)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      {/* SPOTLIGHT */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-64 pointer-events-none"
        style={{ height: "100vh", background: "conic-gradient(from 0deg at 50% -10%, rgba(246,196,83,0.15) 0deg, transparent 30deg, transparent 330deg, rgba(246,196,83,0.15) 360deg)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "curtains" ? 0 : 1 }}
        transition={{ duration: 1.2 }}
      />

      {/* CURTAINS */}
      <div className="absolute inset-0 flex pointer-events-none z-20 overflow-hidden">
        {/* Left curtain */}
        <motion.div className="w-1/2 h-full relative overflow-hidden flex-shrink-0"
          animate={{ x: phase === "open" || phase === "screen" || phase === "type" || phase === "buttons" ? "-100%" : "0%" }}
          transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1], delay: 0 }}>
          <div className="w-full h-full" style={{
            background: "linear-gradient(to right, #4A0A10 0%, #7A1020 40%, #9A1530 70%, #6A0D18 100%)"
          }}>
            {/* Curtain folds */}
            {[15,35,55,75].map(p => (
              <div key={p} className="absolute top-0 bottom-0 w-px opacity-20"
                style={{ left: `${p}%`, background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.4), transparent)" }} />
            ))}
            <div className="absolute top-0 left-0 right-0 h-8"
              style={{ background: "linear-gradient(to bottom, #2A0508, transparent)" }} />
          </div>
        </motion.div>
        {/* Right curtain */}
        <motion.div className="w-1/2 h-full relative overflow-hidden flex-shrink-0"
          animate={{ x: phase === "open" || phase === "screen" || phase === "type" || phase === "buttons" ? "100%" : "0%" }}
          transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1], delay: 0 }}>
          <div className="w-full h-full" style={{
            background: "linear-gradient(to left, #4A0A10 0%, #7A1020 40%, #9A1530 70%, #6A0D18 100%)"
          }}>
            {[15,35,55,75].map(p => (
              <div key={p} className="absolute top-0 bottom-0 w-px opacity-20"
                style={{ left: `${p}%`, background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.4), transparent)" }} />
            ))}
            <div className="absolute top-0 left-0 right-0 h-8"
              style={{ background: "linear-gradient(to bottom, #2A0508, transparent)" }} />
          </div>
        </motion.div>
      </div>

      {/* MOVIE SCREEN GLOW */}
      <motion.div
        className="absolute inset-x-6 inset-y-16 rounded-2xl pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "screen" || phase === "type" || phase === "buttons" ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 0 80px rgba(246,196,83,0.1), inset 0 0 40px rgba(246,196,83,0.03)"
        }}
      />

      {/* CONTENT */}
      <div className="relative z-10 text-center px-6 max-w-sm mx-auto w-full">
        <div className="min-h-[140px] flex flex-col gap-4 mb-8 justify-center">
          {lines.map((line, i) => (
            <motion.p key={i}
              className={`leading-relaxed ${
                i === 1 ? "text-white text-2xl md:text-3xl font-bold" :
                i === 2 ? "text-white/85 text-base font-medium" : "text-white/55 text-sm"
              }`}
              style={i === 1 ? { fontFamily: "'Playfair Display', serif" } : {}}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}>
              {line}
            </motion.p>
          ))}
        </div>

        <AnimatePresence>
          {phase === "buttons" && (
            <motion.div className="flex flex-col gap-3"
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}>

              <motion.button onClick={() => onAnswer("yes")}
                className="w-full bg-primary text-dark-accent font-bold py-4 rounded-full shadow-golden text-base hover:bg-accent hover:text-white transition-all"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                YES ❤️
              </motion.button>

              <button onClick={() => onAnswer("maybe")}
                className="w-full bg-white/8 text-white/75 font-medium py-3.5 rounded-full border border-white/15 text-sm hover:bg-white/15 transition-all">
                MAYBE 🤔
              </button>

              <button onClick={() => onAnswer("no")}
                className="w-full text-white/30 font-medium py-2.5 rounded-full text-sm hover:text-white/50 transition-all">
                NO 😅
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {phase === "buttons" && (
          <p className="text-white/15 text-xs mt-5">— with love, from {sender} 🌷</p>
        )}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────── YES ─────────────────────────────────── */
function YesResponse({ state, onReset }: { state: AppState; onReset: () => void }) {
  const { datePlan, selectedMovie, recipient, sender } = state;
  const posterRef = useRef<HTMLDivElement>(null);

  const locationDisplay = datePlan.location === "Custom Location"
    ? datePlan.customLocation || "Somewhere Special"
    : datePlan.location;

  const handleCalendar = () => {
    if (!datePlan.date) return;
    const ics = generateICS(
      `🎬 ${selectedMovie?.title || "Movie Night"}`,
      datePlan.date, datePlan.time, locationDisplay,
      `Movie night with ${sender} 🌻`
    );
    downloadICS(ics, "movie-night.ics");
  };

  const handlePoster = async () => {
    if (!posterRef.current) return;
    try {
      const url = await toPng(posterRef.current, {
        pixelRatio: 2,
        skipFonts: true,
        // Drop any node that would trigger a cross-origin CSS read
        filter: (node: HTMLElement) => {
          if (node.tagName === "LINK") return false;
          if (node.tagName === "STYLE") {
            try {
              const sheet = Array.from(document.styleSheets).find(
                (s) => s.ownerNode === node
              );
              if (sheet) void sheet.cssRules; // throws if cross-origin
            } catch {
              return false;
            }
          }
          return true;
        },
      });
      const a = document.createElement("a");
      a.download = "movie-night-poster.png";
      a.href = url;
      a.click();
    } catch (e) {
      console.error("Poster export failed:", e);
    }
  };

  return (
    <motion.div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #FFF9E6 0%, #FFF3C4 100%)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

      <Confetti />

      <div className="w-full max-w-sm z-10 relative">
        <motion.div className="text-center mb-6"
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 12, delay: 0.3 }}>
          <motion.div className="text-6xl mb-3"
            animate={{ rotate: [0,-15,15,-10,0], scale:[1,1.2,1] }}
            transition={{ duration: 0.8, delay: 0.5 }}>🎉</motion.div>
          <h2 className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
            Best Movie Ever
          </h2>
          <p className="text-xl text-accent font-bold mt-1">Unlocked 🌻✨</p>
        </motion.div>

        {/* Details card */}
        <motion.div className="bg-white rounded-4xl p-6 shadow-soft-lg mb-4 border border-secondary"
          initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}>
          <p className="text-[10px] text-foreground/35 uppercase tracking-widest text-center mb-4 font-semibold">It&apos;s a date 🌷</p>
          <div className="space-y-3">
            {[
              { icon:"🎬", label:"Movie",    value: selectedMovie?.title || "Your Pick" },
              { icon:"📅", label:"Date",     value: datePlan.date ? format(datePlan.date,"EEEE, MMMM d") : "—" },
              { icon:"🕐", label:"Time",     value: datePlan.time || "—" },
              { icon:"📍", label:"Location", value: locationDisplay },
            ].map(f => (
              <div key={f.label} className="flex items-center gap-3">
                <span className="text-xl w-8 flex-shrink-0">{f.icon}</span>
                <div>
                  <p className="text-[9px] text-foreground/35 uppercase tracking-wider">{f.label}</p>
                  <p className="text-sm font-bold text-foreground">{f.value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Downloadable Poster — all inline styles, no Tailwind, no external fonts */}
        <motion.div className="mb-5" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.7 }}>
          <div
            ref={posterRef}
            style={{
              background: "linear-gradient(135deg, #D4A017 0%, #F6C453 50%, #D4A017 100%)",
              padding: "28px 24px",
              borderRadius: "2rem",
              overflow: "hidden",
              textAlign: "center",
              color: "#1F1F1F",
              fontFamily: "Georgia, 'Times New Roman', serif",
            }}
          >
            <p style={{ fontSize:"9px", letterSpacing:"0.3em", textTransform:"uppercase", opacity:0.6, marginBottom:"4px", fontFamily:"Arial, sans-serif" }}>
              Cinema Royale presents
            </p>
            <h3 style={{ fontSize:"26px", fontWeight:"bold", marginBottom:"4px", letterSpacing:"0.05em" }}>
              MOVIE NIGHT
            </h3>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", margin:"12px 0", color:"rgba(31,31,31,0.4)", fontSize:"11px", fontFamily:"Arial, sans-serif" }}>
              <div style={{ flex:1, borderTop:"1px solid rgba(31,31,31,0.15)" }} />
              <span>starring</span>
              <div style={{ flex:1, borderTop:"1px solid rgba(31,31,31,0.15)" }} />
            </div>
            <p style={{ fontSize:"18px", fontWeight:"bold", marginBottom:"2px" }}>{recipient}</p>
            <p style={{ fontSize:"11px", opacity:0.4, margin:"4px 0", fontFamily:"Arial, sans-serif" }}>and</p>
            <p style={{ fontSize:"18px", fontWeight:"bold" }}>{sender}</p>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", margin:"12px 0", color:"rgba(31,31,31,0.4)", fontSize:"11px", fontFamily:"Arial, sans-serif" }}>
              <div style={{ flex:1, borderTop:"1px solid rgba(31,31,31,0.15)" }} />
              <span style={{ fontSize:"20px" }}>🎬</span>
              <div style={{ flex:1, borderTop:"1px solid rgba(31,31,31,0.15)" }} />
            </div>
            <p style={{ fontSize:"13px", fontWeight:"bold", opacity:0.85 }}>{selectedMovie?.title || "A Night to Remember"}</p>
            <p style={{ fontSize:"10px", opacity:0.4, marginTop:"4px", fontFamily:"Arial, sans-serif" }}>Coming Soon 🌻</p>
          </div>
        </motion.div>

        <motion.div className="flex flex-col gap-3"
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.9 }}>
          {datePlan.date && (
            <button onClick={handleCalendar}
              className="w-full bg-accent text-white font-bold py-4 rounded-full shadow-soft hover:bg-primary hover:text-dark-accent transition-all hover:scale-[1.02] active:scale-95">
              📅 Add to Calendar
            </button>
          )}
          <button onClick={handlePoster}
            className="w-full bg-secondary text-foreground font-semibold py-3 rounded-full shadow-card hover:shadow-card-hover transition-all text-sm hover:scale-[1.01]">
            🎬 Download Poster
          </button>
          <button onClick={onReset}
            className="w-full text-foreground/30 text-xs py-2 hover:text-foreground/50 transition-colors">
            Start over
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────── MAYBE ──────────────────────────────── */
function MaybeResponse({ onAsk }: { onAsk: () => void }) {
  return (
    <motion.div className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ background:"linear-gradient(180deg,#FFF9E6 0%,#FFF3C4 100%)" }}
      initial={{ opacity:0 }} animate={{ opacity:1 }}>
      <motion.div className="text-center max-w-sm"
        initial={{ y:30, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.2 }}>
        <motion.div className="text-7xl mb-5"
          animate={{ y:[-6,6,-6] }} transition={{ duration:2, repeat:Infinity }}>🍿</motion.div>
        <h2 className="text-3xl font-bold text-foreground mb-3" style={{ fontFamily:"'Playfair Display',serif" }}>
          No Rush 🌻
        </h2>
        <p className="text-foreground/55 leading-relaxed mb-8">
          I&apos;ll save your seat while you think.<br/>The popcorn will be warm when you&apos;re ready.
        </p>
        <button onClick={onAsk}
          className="bg-accent text-white font-bold px-10 py-4 rounded-full shadow-soft hover:bg-primary hover:text-dark-accent transition-all hover:scale-[1.03]">
          Actually… YES ❤️
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────── NO ─────────────────────────────────── */
// Pre-computed safe positions (% from center), no Math.random in render
const NO_JUMPS = [
  { x:  38, y: -22 },  // attempt 1 — moderate right
  { x: -44, y:  18 },  // attempt 2 — far left
];

function NoResponse({ onAnswer }: { onAnswer: (a: "yes"|"maybe"|"no") => void }) {
  const [noCount, setNoCount] = useState(0);
  const [btnVisible, setBtnVisible] = useState(true);
  const [disappeared, setDisappeared] = useState(false);
  const [phase3Msg, setPhase3Msg] = useState(0); // 0 = "Oh no...", 1 = "Looks like...", 2 = "Maybe universe..."
  const btnX = useMotionValue(0);
  const btnY = useMotionValue(0);

  const MESSAGES = [
    { emoji:"🥺", text:"Wait, are you sure?" },
    { emoji:"😭", text:"That seems a little harsh." },
  ];

  const handleNoClick = () => {
    if (noCount === 0) {
      // Jump to pos 1
      animate(btnX, NO_JUMPS[0].x * 3, { type:"spring", stiffness:600, damping:18 });
      animate(btnY, NO_JUMPS[0].y * 3, { type:"spring", stiffness:600, damping:18 });
      setNoCount(1);
    } else if (noCount === 1) {
      // Jump much farther
      animate(btnX, NO_JUMPS[1].x * 4, { type:"spring", stiffness:500, damping:14 });
      animate(btnY, NO_JUMPS[1].y * 4, { type:"spring", stiffness:500, damping:14 });
      setNoCount(2);
    } else if (noCount === 2) {
      // Disappear with sparkle then show message sequence
      setBtnVisible(false);
      setTimeout(() => setDisappeared(true), 400);
      setTimeout(() => setPhase3Msg(1), 1000);
      setTimeout(() => setPhase3Msg(2), 2100);
      setNoCount(3);
    }
  };

  const currentMsg = MESSAGES[Math.min(noCount - 1, MESSAGES.length - 1)];

  return (
    <motion.div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{ background:"linear-gradient(180deg,#FFF9E6 0%,#FFF3C4 100%)" }}
      initial={{ opacity:0 }} animate={{ opacity:1 }}>

      <div className="text-center max-w-xs w-full z-10 relative">
        <motion.div className="text-5xl mb-4"
          animate={{ rotate: noCount > 0 ? [0,-20,20,0] : 0 }}
          transition={{ duration:0.4 }}
          key={noCount}>
          {disappeared ? "🌻" : noCount === 0 ? "😅" : currentMsg.emoji}
        </motion.div>

        {/* Phase 3: button gone, message sequence */}
        <AnimatePresence mode="wait">
          {disappeared ? (
            <motion.div key="phase3"
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              className="flex flex-col items-center gap-3 mb-8">
              <motion.p className="font-bold text-xl text-foreground"
                style={{ fontFamily:"'Playfair Display',serif" }}>
                Oh no...
              </motion.p>
              {phase3Msg >= 1 && (
                <motion.p className="text-foreground/60 text-sm"
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}>
                  Looks like the No button is broken.
                </motion.p>
              )}
              {phase3Msg >= 2 && (
                <motion.p className="text-foreground/50 text-sm"
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}>
                  Maybe the universe prefers Yes or Maybe ✨
                </motion.p>
              )}
              {phase3Msg >= 2 && (
                <motion.p className="text-accent text-xs font-medium mt-1"
                  initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }}>
                  I already saved the best seat for you anyway 🍿
                </motion.p>
              )}
            </motion.div>
          ) : noCount > 0 ? (
            <motion.p key={`msg-${noCount}`} className="font-bold text-xl text-foreground mb-6"
              style={{ fontFamily:"'Playfair Display',serif" }}
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
              {currentMsg.text}
            </motion.p>
          ) : (
            <motion.p key="initial" className="font-bold text-xl text-foreground mb-6"
              style={{ fontFamily:"'Playfair Display',serif" }}
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
              Oh no, you pressed No 😅
            </motion.p>
          )}
        </AnimatePresence>

        {/* YES + MAYBE always visible */}
        <div className="flex flex-col gap-3 mb-4">
          <button onClick={() => onAnswer("yes")}
            className="w-full bg-accent text-white font-bold py-4 rounded-full shadow-soft hover:bg-primary hover:text-dark-accent transition-all hover:scale-[1.03] active:scale-95">
            YES ❤️
          </button>
          <button onClick={() => onAnswer("maybe")}
            className="w-full bg-secondary text-foreground/70 font-medium py-3 rounded-full text-sm hover:bg-secondary/80 transition-all">
            MAYBE 🤔
          </button>
        </div>

        {/* Jumping NO button — disappears on 3rd click */}
        <AnimatePresence>
          {btnVisible && (
            <motion.button
              style={{ x: btnX, y: btnY, display:"block", width:"100%" }}
              onClick={handleNoClick}
              onTouchStart={handleNoClick}
              className="bg-white text-foreground/40 font-medium py-2.5 rounded-full text-sm border-2 border-secondary hover:border-foreground/20 transition-colors"
              exit={{ scale:0, opacity:0, rotate:15 }}
              transition={{ type:"spring", stiffness:300 }}>
              No 😅 {noCount === 0 ? "" : noCount === 1 ? "(still here...)" : "(last chance?)"}
            </motion.button>
          )}
        </AnimatePresence>

        {/* Sparkles when button disappears */}
        <AnimatePresence>
          {noCount === 3 && !disappeared && (
            <motion.div className="flex justify-center gap-3 mt-2"
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
              {["✨","💫","⭐","✨"].map((s,i) => (
                <motion.span key={i} className="text-xl"
                  animate={{ y:[-10,-30], opacity:[1,0], scale:[1,1.5] }}
                  transition={{ delay:i*0.1, duration:0.6 }}>
                  {s}
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────── CONFETTI ───────────────────────────── */
// All values pre-computed — no Math.random during render
const CONFETTI_PIECES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: (i * 2.5) % 100,
  color: ["#F6C453","#D4A017","#FFF3C4","#FFD700","#7DAA68","#F0E6C8"][i % 6],
  delay: (i * 0.13) % 2.5,
  duration: 3 + (i % 4) * 0.7,
  size: 6 + (i % 5) * 2,
  shape: i % 3 === 0 ? "heart" : i % 3 === 1 ? "circle" : "rect",
  driftX: ((i % 7) - 3) * 22,
  rot: (i % 5) * 144,
}));

function Confetti() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {CONFETTI_PIECES.map(p => (
        <motion.div key={p.id} className="absolute"
          style={{
            left: `${p.x}%`, top: "-20px",
            width: p.shape === "heart" ? "auto" : p.size,
            height: p.shape === "heart" ? "auto" : p.size,
            background: p.shape === "heart" ? "transparent" : p.color,
            borderRadius: p.shape === "circle" ? "50%" : p.shape === "rect" ? "2px" : 0,
            fontSize: p.shape === "heart" ? p.size + 4 + "px" : undefined,
          }}
          animate={{ y:["-5vh","110vh"], x:[0, p.driftX], rotate:[0, p.rot], opacity:[1,1,0.2] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease:"linear" }}>
          {p.shape === "heart" ? "💛" : null}
        </motion.div>
      ))}
    </div>
  );
}
