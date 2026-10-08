// Tarot reading proxy (Cloudflare Worker in /worker). It holds the Groq key,
// so the site itself never ships one.
export const READING_API_URL =
  process.env.REACT_APP_READING_API_URL || "https://groqkey.sosobaka.workers.dev";

export const MAX_QUESTION_LENGTH = 300;
