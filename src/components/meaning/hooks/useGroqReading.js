import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAiReading } from "../../../redux/slices/cardsSlice.ts";

import { GROQ_API_URL } from "../../../shared/constants/api.js";
const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;

export const useGroqReading = () => {
  const dispatch = useDispatch();
  const reading = useSelector((state) => state.cards.aiReading);
  const [isLoading, setIsLoading] = useState(false);

  const getReading = async ({ cards, category }) => {
    setIsLoading(true);

    const cardDescriptions = cards
      .filter(({ card }) => card)
      .map(
        ({ card, rotation }, i) =>
          `Card ${i + 1}: ${card.name}${rotation > 0 ? " (reversed)" : ""}`,
      )
      .join("\n");

    const prompt = `You are a wise tarot reader who interprets cards strictly according to Rider-Waite tarot tradition. The querent asks about: ${category}.

The cards drawn are:
${cardDescriptions}

Do not describe each card separately. Instead, read all the cards together in the same order as a unified story. Interpret the overall energy, situation, and dynamics between the cards in the context of "${category}". End with a concrete piece of advice or guidance. Be mystical but grounded. 4-6 sentences.`;

    try {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8,
          max_tokens: 300,
        }),
      });

      const data = await response.json();
      dispatch(setAiReading(data.choices[0].message.content));
    } catch (err) {
      dispatch(setAiReading("The stars are silent. Try another time."));
    } finally {
      setIsLoading(false);
    }
  };

  return { reading, isLoading, getReading };
};
