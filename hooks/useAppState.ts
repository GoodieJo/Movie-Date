"use client";

import { useState, useEffect, useCallback } from "react";
import { AppState, Screen, Movie, QuizAnswer } from "@/types";
import { getQueryParams } from "@/lib/utils";

const DEFAULT_STATE: AppState = {
  currentScreen: "welcome",
  recipient: "You",
  sender: "Someone Special",
  selectedMovie: null,
  quizAnswers: [],
  flippedCards: [],
  datePlan: {
    movie: null,
    date: null,
    time: "7:00 PM",
    location: "PVR Cinema",
    customLocation: "",
  },
  starCount: 0,
  bonusUnlocked: false,
  finalAnswer: null,
  ticketRevealed: false,
};

export function useAppState() {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const { recipient, sender } = getQueryParams();
    const saved = localStorage.getItem("movieNightState");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Restore date objects
        if (parsed.datePlan?.date) {
          parsed.datePlan.date = new Date(parsed.datePlan.date);
        }
        setState({ ...parsed, recipient, sender });
      } catch {
        setState({ ...DEFAULT_STATE, recipient, sender });
      }
    } else {
      setState({ ...DEFAULT_STATE, recipient, sender });
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("movieNightState", JSON.stringify(state));
    }
  }, [state, mounted]);

  const goTo = useCallback((screen: Screen) => {
    setState((s) => ({ ...s, currentScreen: screen }));
  }, []);

  const setMovie = useCallback((movie: Movie) => {
    setState((s) => ({
      ...s,
      selectedMovie: movie,
      datePlan: { ...s.datePlan, movie },
    }));
  }, []);

  const addQuizAnswer = useCallback((answer: QuizAnswer) => {
    setState((s) => ({ ...s, quizAnswers: [...s.quizAnswers, answer] }));
  }, []);

  const flipCard = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      flippedCards: s.flippedCards.includes(id)
        ? s.flippedCards
        : [...s.flippedCards, id],
    }));
  }, []);

  const updateDatePlan = useCallback((updates: Partial<AppState["datePlan"]>) => {
    setState((s) => ({
      ...s,
      datePlan: { ...s.datePlan, ...updates },
    }));
  }, []);

  const collectStar = useCallback(() => {
    setState((s) => {
      const newCount = s.starCount + 1;
      return {
        ...s,
        starCount: newCount,
        bonusUnlocked: newCount >= 5,
      };
    });
  }, []);

  const setFinalAnswer = useCallback((answer: "yes" | "maybe" | "no") => {
    setState((s) => ({ ...s, finalAnswer: answer }));
  }, []);

  const revealTicket = useCallback(() => {
    setState((s) => ({ ...s, ticketRevealed: true }));
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem("movieNightState");
    const { recipient, sender } = getQueryParams();
    setState({ ...DEFAULT_STATE, recipient, sender });
  }, []);

  return {
    state,
    mounted,
    goTo,
    setMovie,
    addQuizAnswer,
    flipCard,
    updateDatePlan,
    collectStar,
    setFinalAnswer,
    revealTicket,
    reset,
  };
}
