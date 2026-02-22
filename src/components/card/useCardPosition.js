import { useSelector } from "react-redux";
import { CARD_POSITIONS, Z_INDEX } from "./constants.js";

export const useCardPosition = (cardNumber, isActive, isPrevious) => {
  const numberOfCards = useSelector((state) => state.cards.numberOfCards);

  const basePosition = CARD_POSITIONS[numberOfCards]?.[cardNumber] || {
    left: "0%",
    x: "-50%",
  };

  const positionStyle = {
    left: basePosition.left,
    x: basePosition.x,
  };

  const zIndex = isActive
    ? Z_INDEX.ACTIVE
    : isPrevious
      ? Z_INDEX.PREVIOUS
      : Z_INDEX.DEFAULT;

  return { positionStyle, zIndex };
};
