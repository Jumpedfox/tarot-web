import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { setCard } from "../../../redux/slices/cardsSlice.ts";
import { cardsService } from "../../../services/cards.service.ts";
import { preloadImage } from "../../../shared/utils/preloadImage.ts";

export const useCardFetching = () => {
  const dispatch = useDispatch();

  const fetchCardData = useCallback(
    async (cardNumber, cardSlot, cancelledRef) => {
      try {
        const data = await cardsService.getCard(cardNumber);
        if (cancelledRef.current) return;
        if (data) {
          if (data.image) await preloadImage(data.image);
          if (cancelledRef.current) return;
          dispatch(setCard({ index: cardSlot - 1, card: data }));
        }
      } catch (error) {
        console.error(`Failed to fetch card ${cardNumber}:`, error);
      }
    },
    [dispatch],
  );

  return { fetchCardData };
};
