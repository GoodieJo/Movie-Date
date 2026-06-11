export type Screen =
  | "welcome"
  | "ticket"
  | "movie"
  | "quiz"
  | "memory"
  | "planner"
  | "final";

export interface Movie {
  id: string;
  title: string;
  genre: string;
  runtime: string;
  description: string;
  poster: string;
  emoji: string;
  year: number;
}

export interface QuizAnswer {
  question: string;
  answer: string;
}

export interface MemoryCard {
  id: string;
  front: string;
  back: string;
  emoji: string;
  color: string;
}

export interface DatePlan {
  movie: Movie | null;
  date: Date | null;
  time: string;
  location: string;
  customLocation: string;
}

export interface AppState {
  currentScreen: Screen;
  recipient: string;
  sender: string;
  selectedMovie: Movie | null;
  quizAnswers: QuizAnswer[];
  flippedCards: string[];
  datePlan: DatePlan;
  starCount: number;
  bonusUnlocked: boolean;
  finalAnswer: "yes" | "maybe" | "no" | null;
  ticketRevealed: boolean;
}
