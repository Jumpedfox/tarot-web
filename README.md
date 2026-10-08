# Tarot Oracle

A single-page tarot reading app with an animated cosmic background, card animations, ambient music and an optional AI interpretation of the spread.

**Live demo:** https://jumpedfox.github.io/tarot-web/

## Features

- Draw one card or a three-card spread, from the full deck (78 cards) or Major Arcana only
- Pick a question category (General, Love, Health, Work, Finance, Personal)
- Upright and reversed meanings for every card
- AI reading of the whole spread, generated with Llama 3.3 via the Groq API
- Gallery of all cards with a detail view
- Ambient soundtrack with a volume knob, bright and dark themes (settings are persisted)
- Animated canvas background (black hole, star stream and gas clouds), tuned to stay light on the main thread

## Tech stack

- React 18, React Router 6
- Redux Toolkit + redux-persist
- Chakra UI v3, Framer Motion, Sass
- Firebase Realtime Database (card data)
- Groq API (AI readings)
- Howler.js (audio)
- Create React App, deployed to GitHub Pages

## Getting started

Requirements: Node.js 18+ and npm.

```bash
git clone https://github.com/Jumpedfox/tarot-web.git
cd tarot-web
npm install
cp .env.example .env.local   # then fill in the values
npm start
```

The app runs at http://localhost:3000.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `REACT_APP_GROQ_API_KEY` | Key for the Groq API, used by the AI reading |

> **Note:** every `REACT_APP_*` variable is inlined into the public JavaScript bundle at build time. A key set this way is visible to anyone who opens the site. For a real deployment, call Groq through a small server-side proxy (for example a Cloudflare Worker or a Firebase Function) that holds the key.

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
    cosmicbackground/  animated canvas background (engine.js + React wrapper)
    oraclepage/        card drawing flow, categories, AI reading button
    meaning/           card meanings and AI reading view
    gallery/           all cards with a detail modal
    card/              single card with position and flip animations
    options/           settings panel: volume, theme, number of cards
    loader/, mainmenu/, manual/, music/, optionsbutton/
  redux/               store and slices (cards, sound, theme, ui)
  services/            Firebase data access
  shared/              constants, styles, utils
```

## Deployment

The site is served from the `gh-pages` branch:

```bash
npm run deploy
```

The production build is served under `/tarot-web/` (set via `PUBLIC_URL` in the production env), which matches the GitHub Pages path.
