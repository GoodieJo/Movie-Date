"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { movies } from "@/data/movies";
import { Movie } from "@/types";

interface MovieScreenProps {
  selectedMovie: Movie | null;
  onSelect: (movie: Movie) => void;
  onNext: () => void;
}

export function MovieScreen({ selectedMovie, onSelect, onNext }: MovieScreenProps) {
  return (
    <motion.div
      className="min-h-screen flex flex-col p-4 pt-8 pb-8"
      style={{ background: "linear-gradient(180deg, #FFF9E6 0%, #FFF3C4 100%)" }}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-2xl mx-auto w-full">
        <motion.div
          className="text-center mb-7"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-accent text-xs font-bold uppercase tracking-widest mb-2">Step 1 of 3</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
            Pick Our Movie 🌻
          </h2>
          <p className="text-foreground/50 text-sm mt-2">What are we watching tonight?</p>
        </motion.div>

        <div className="flex flex-col gap-3 mb-6">
          {movies.map((movie, i) => (
            <MovieCard key={movie.id} movie={movie}
              selected={selectedMovie?.id === movie.id}
              onSelect={() => onSelect(movie)} index={i} />
          ))}
        </div>

        <AnimatePresence>
          {selectedMovie && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <button onClick={onNext}
                className="w-full bg-accent text-white font-bold py-4 rounded-full shadow-soft hover:bg-primary hover:text-dark-accent transition-all hover:scale-[1.02] active:scale-95 text-sm">
                Perfect choice Baby! ✨
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function MovieCard({ movie, selected, onSelect, index }: {
  movie: Movie; selected: boolean; onSelect: () => void; index: number;
}) {
  return (
    <motion.button
      onClick={onSelect}
      className={`w-full text-left rounded-3xl overflow-hidden transition-all ${
        selected ? "ring-2 ring-accent shadow-soft-lg" : "ring-1 ring-secondary shadow-card hover:shadow-card-hover"
      }`}
      style={{ background: selected ? "#FFF3C4" : "white" }}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      aria-pressed={selected}
      aria-label={`Select ${movie.title}`}
    >
      <div className="flex items-center gap-4 p-4">
        <div className="w-14 h-20 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center"
          style={{ background: "#F0E6C8" }}>
          {movie.poster ? (
            <Image src={movie.poster} alt={movie.title} width={56} height={80} className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl">{movie.emoji}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base leading-none">{movie.emoji}</span>
            <h3 className="font-bold text-foreground text-sm leading-tight">{movie.title}</h3>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-1.5">
            <span className="text-xs bg-secondary text-accent font-medium rounded-full px-2 py-0.5">{movie.genre}</span>
            <span className="text-xs text-foreground/40">{movie.runtime}</span>
          </div>
          <p className="text-xs text-foreground/55 leading-relaxed line-clamp-2">{movie.description}</p>
        </div>

        <motion.div
          className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center transition-colors ${selected ? "bg-accent" : "bg-secondary"}`}
          animate={{ scale: selected ? [1, 1.35, 1] : 1 }}
          transition={{ duration: 0.3 }}
        >
          {selected && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-white text-xs font-bold">✓</motion.span>
          )}
        </motion.div>
      </div>
    </motion.button>
  );
}
