import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setAiQuestion,
  setAiReading,
} from "../../../redux/slices/cardsSlice.ts";
import { READING_API_URL } from "../../../shared/constants/api.js";

const FALLBACK_READING = "The stars are silent. Try another time.";

// Asks the reading proxy to interpret the drawn cards, optionally answering
// the querent's own question. Resolves to true when a reading arrived.
export const useAiReading = () => {
  const dispatch = useDispatch();
  const reading = useSelector((state) => state.cards.aiReading);
  const question = useSelector((state) => state.cards.aiQuestion);
  const [isLoading, setIsLoading] = useState(false);

  const getReading = async ({ cards, category, question: askedQuestion = "" }) => {
    setIsLoading(true);
    dispatch(setAiQuestion(askedQuestion.trim() || null));

    const drawnCards = cards
      .filter(({ card }) => card)
      .map(({ card, rotation }) => ({
        name: card.name,
        reversed: rotation > 0,
      }));

    try {
      if (!READING_API_URL) {
        throw new Error("REACT_APP_READING_API_URL is not set");
      }

      const response = await fetch(READING_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cards: drawnCards,
          category,
          question: askedQuestion.trim() || undefined,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.reading) {
        throw new Error(data?.error || `Reading API responded with ${response.status}`);
      }

      dispatch(setAiReading(data.reading));
      return true;
    } catch (err) {
      console.error("AI reading failed:", err);
      dispatch(setAiReading(FALLBACK_READING));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { reading, question, isLoading, getReading };
};
