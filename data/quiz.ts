export interface QuizQuestion {
  id: string;
  question: string;
  emoji: string;
  options: { label: string; emoji: string }[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "weather",
    question: "Perfect weather for a movie date?",
    emoji: "🌧️",
    options: [
      { label: "Rainy Evening", emoji: "🌧️" },
      { label: "Cool Sunset", emoji: "🌤️" },
      { label: "Cozy Winter Night", emoji: "❄️" },
      { label: "Clear Starry Night", emoji: "🌙" },
    ],
  },
  {
    id: "superpower",
    question: "Pick your movie-date superpower.",
    emoji: "🎭",
    options: [
      { label: "Pause Time", emoji: "⏳" },
      { label: "Unlimited Snacks", emoji: "🍕" },
      { label: "Unlimited Movie Tickets", emoji: "🎟️" },
      { label: "Instant Teleportation", emoji: "🚀" },
    ],
  },
  {
    id: "genre",
    question: "Which movie cliché do you secretly like?",
    emoji: "🎬",
    options: [
      { label: "Accidental hand touch", emoji: "😳" },
      { label: "Walking in the rain", emoji: "🌧️" },
      { label: "Sharing snacks", emoji: "🍿" },
      { label: "Long eye contact", emoji: "👀" },
    ],
  },
];
