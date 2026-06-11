# 🎬 Movie Night Invitation

An adorable interactive movie date invitation website built with Next.js, Framer Motion, and lots of love.

## Features

- 🎟️ Animated movie ticket reveal
- 🎬 Movie selection from a curated list  
- 🧠 Compatibility quiz
- 💌 Flippable memory/compliment cards
- 📅 Date planner with beautiful calendar
- 🎭 Cinematic final reveal with curtain animation
- 🎉 Celebration screen with confetti
- ⭐ Secret star hunt with compliments
- 📸 Downloadable custom movie poster
- 📅 .ics calendar file generation

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Customization

### Personalize with URL Parameters

Add recipient and sender names via query params:

```
http://localhost:3000?recipient=Emma&sender=John
```

### Change Colors

Edit `tailwind.config.ts` to modify the color palette:

```ts
colors: {
  background: "#FFF7F7",
  primary: "#FF7AA2",
  secondary: "#FFD6E0",
  accent: "#B388FF",
  foreground: "#2D2D2D",
}
```

### Add Movies

Edit `data/movies.ts`:

```ts
{
  id: "my-movie",
  title: "My Favorite Film",
  genre: "Drama",
  runtime: "120 min",
  year: 2023,
  description: "...",
  poster: "https://image.tmdb.org/t/p/w500/YOUR_POSTER.jpg",
  emoji: "🎬",
}
```

Get poster URLs from [TMDB](https://www.themoviedb.org/).

### Add Memory Cards

Edit `data/memories.ts`:

```ts
{
  id: "7",
  front: "📸",
  back: "Your custom message here.",
  emoji: "💫",
  color: "#FFD6E0",
}
```

### Add Compliments

Edit `data/compliments.ts` to add star compliments.

## Sharing

Share your invitation as:

```
https://your-domain.com?recipient=Emma&sender=John
```

## Build & Deploy

```bash
npm run build
npm start
```

Deploy to Vercel:

```bash
npx vercel
```

## Tech Stack

- **Next.js 15** — App Router
- **TypeScript** — Type safety
- **Tailwind CSS** — Styling
- **Framer Motion** — Animations
- **react-day-picker** — Calendar
- **html-to-image** — Poster download
- **date-fns** — Date formatting

## License

Made with ❤️ for movie nights.
