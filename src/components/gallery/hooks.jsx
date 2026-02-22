import { useCallback, useState } from "react";

export const useCardNavigation = (cards) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [direction, setDirection] = useState(0);

  const handleCardClick = (card, index) => {
    setDirection(0);
    setSelectedCard(card);
    setSelectedIndex(index);
  };

  const handleClose = () => {
    setSelectedCard(null);
    setSelectedIndex(null);
    setDirection(0);
  };

  const handleNext = useCallback(() => {
    setDirection(1);

    setSelectedIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % cards.length;
      setSelectedCard(cards[nextIndex]);
      return nextIndex;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards.length, cards]);

  const handlePrevious = useCallback(() => {
    setDirection(-1);

    setSelectedIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? cards.length - 1 : prevIndex - 1;
      setSelectedCard(cards[newIndex]);
      return newIndex;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards.length, cards]);

  return {
    selectedCard,
    selectedIndex,
    direction,
    handleCardClick,
    handleClose,
    handleNext,
    handlePrevious,
  };
};
