"use client";

import { AnimatePresence } from "framer-motion";
import { useAppState } from "@/hooks/useAppState";
import { StarHunt } from "@/components/StarHunt";
import { WelcomeScreen } from "@/components/screens/WelcomeScreen";
import { TicketScreen } from "@/components/screens/TicketScreen";
import { MovieScreen } from "@/components/screens/MovieScreen";
import { QuizScreen } from "@/components/screens/QuizScreen";
import { MemoryScreen } from "@/components/screens/MemoryScreen";
import { PlannerScreen } from "@/components/screens/PlannerScreen";
import { FinalScreen } from "@/components/screens/FinalScreen";

export default function Home() {
  const app = useAppState();

  if (!app.mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-4xl animate-bounce-gentle">🎬</div>
      </div>
    );
  }

  const { state } = app;

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <StarHunt
        starCount={state.starCount}
        bonusUnlocked={state.bonusUnlocked}
        onCollect={app.collectStar}
      />

      <AnimatePresence mode="wait">
        {state.currentScreen === "welcome" && (
          <WelcomeScreen key="welcome" recipient={state.recipient} onNext={() => app.goTo("ticket")} />
        )}
        {state.currentScreen === "ticket" && (
          <TicketScreen
            key="ticket"
            recipient={state.recipient}
            sender={state.sender}
            selectedMovie={state.selectedMovie}
            datePlan={state.datePlan}
            ticketRevealed={state.ticketRevealed}
            onReveal={app.revealTicket}
            onNext={() => app.goTo("movie")}
          />
        )}
        {state.currentScreen === "movie" && (
          <MovieScreen key="movie" selectedMovie={state.selectedMovie} onSelect={app.setMovie} onNext={() => app.goTo("quiz")} />
        )}
        {state.currentScreen === "quiz" && (
          <QuizScreen key="quiz" answers={state.quizAnswers} onAnswer={app.addQuizAnswer} onNext={() => app.goTo("memory")} />
        )}
        {state.currentScreen === "memory" && (
          <MemoryScreen key="memory" flippedCards={state.flippedCards} onFlip={app.flipCard} onNext={() => app.goTo("planner")} />
        )}
        {state.currentScreen === "planner" && (
          <PlannerScreen key="planner" datePlan={state.datePlan} selectedMovie={state.selectedMovie} onUpdate={app.updateDatePlan} onNext={() => app.goTo("final")} />
        )}
        {state.currentScreen === "final" && (
          <FinalScreen key="final" state={state} onAnswer={app.setFinalAnswer} onReset={app.reset} />
        )}
      </AnimatePresence>
    </main>
  );
}
