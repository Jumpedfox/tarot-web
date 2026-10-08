# Tarot Oracle

A single-page tarot reading app with an animated cosmic background, card animations, ambient music and an optional AI interpretation of the spread.

**Live demo:** https://jumpedfox.github.io/tarot-web/

## Features

- Draw one card or a three-card spread, from the full deck (78 cards) or Major Arcana only
- Pick a question category (General, Love, Health, Work, Finance, Personal)
- Upright and reversed meanings for every card
- AI reading of the whole spread via the Groq API, optionally answering your own question to the cards
- Gallery of all cards with a detail view
- Ambient soundtrack with a volume knob, bright and dark themes (settings are persisted)
- Animated canvas scene: a star stream falling into the black hole that opens the menu, tuned to stay light on the main thread

## Tech stack

- React 18, React Router 6
- Redux Toolkit + redux-persist
- Chakra UI v3, Framer Motion, Sass
- Firebase Realtime Database (card data)
- Groq API behind a Cloudflare Worker (AI readings)
- Howler.js (audio)
- Create React App, deployed to GitHub Pages

## Getting started

Requirements: Node.js 18+ and npm.

```bash
git clone https://github.com/Jumpedfox/tarot-web.git
cd tarot-web
npm install
npm start
```

The app runs at http://localhost:3000.

### AI readings

The site never holds the Groq key. Readings go through the Cloudflare Worker in [`worker/`](worker/README.md), which keeps the key as a secret, builds the prompt and only accepts requests from the site.

By default the app calls `https://groqkey.sosobaka.workers.dev`. To use another worker, set `REACT_APP_READING_API_URL` in `.env.local` (see `.env.example`).

## Scripts

| Command | What it does |
| --- | --- |
| `npm start` | Development server with hot reload |
| `npm test` | Tests in watch mode |
| `npm run build` | Production build into `build/` |
| `npm run deploy` | Builds and publishes `build/` to the `gh-pages` branch |

## Project structure

```
src/
  components/
    cosmos/            canvas scenes: star stream background, black hole menu button
    oraclepage/        card drawing flow, categories, AI reading button
    meaning/           card meanings, question dialog and AI reading view
    gallery/           all cards with a detail modal
    card/              single card with position and flip animations
    options/           settings panel: volume, theme, number of cards
    loader/, mainmenu/, manual/, music/, optionsbutton/
  redux/               store and slices (cards, sound, theme, ui)
  services/            Firebase data access
  shared/              constants, styles, utils
worker/                Cloudflare Worker for AI readings
```

## Deployment

The site is served from the `gh-pages` branch:

```bash
npm run deploy
```

The production build is served under `/tarot-web/` (set via `PUBLIC_URL` in the production env), which matches the GitHub Pages path.
