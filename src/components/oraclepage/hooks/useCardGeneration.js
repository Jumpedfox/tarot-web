import { useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import {
  delay,
  getRandomNumber,
  getRandomTwist,
  getRandomRotation,
} from "../utils.js";
import { useCardFetching } from "./useCardFetching.js";
import { useBreakpointValue } from "@chakra-ui/react";

const MOBILE_THREE_CARD_TWISTS = { 1: -9, 2: 0, 3: 9 };

export const useCardGeneration = (
  setTwists,
  setRotations,
  setCardsHaveBeenShown,
  setShowCategories,
) => {
  const { numberOfCards, onlyMajorArcana } = useSelector(
    (state) => state.cards,
  );
  const { fetchCardData } = useCardFetching();
  const isMobile = useBreakpointValue(
    { base: true, md: false },
    { fallback: "base" },
  );
  const cancelledRef = useRef(false);

  const cancelGeneration = useCallback(() => {
    cancelledRef.current = true;
  }, []);

  const getCards = useCallback(async () => {
    cancelledRef.current = false;
    const usedNumbers = [];
    const maxCards = onlyMajorArcana ? 22 : 78;
    const useMobileFixedTwists = isMobile && numberOfCards === 3;

    for (let i = 1; i <= numberOfCards; i++) {
      if (cancelledRef.current) {
        return;
      }

      const num = getRandomNumber(usedNumbers, maxCards);
      usedNumbers.push(num);

      await fetchCardData(num, i, cancelledRef);

      if (cancelledRef.current) {
        return;
      }

      setTwists((prev) => ({
        ...prev,
        [i]: useMobileFixedTwists
          ? MOBILE_THREE_CARD_TWISTS[i]
          : getRandomTwist(),
      }));

      setRotations((prev) => ({
        ...prev,
        [i]: getRandomRotation(),
      }));

      if (numberOfCards > 1 && i < numberOfCards) await delay(1500);
    }

    if (cancelledRef.current) return;

    setCardsHaveBeenShown(true);
    setShowCategories(false);
  }, [
    numberOfCards,
    onlyMajorArcana,
    fetchCardData,
    setTwists,
    setRotations,
    setCardsHaveBeenShown,
    setShowCategories,
    isMobile,
  ]);

  return { getCards, cancelGeneration };
};
