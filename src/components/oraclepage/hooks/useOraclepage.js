import { useState, useCallback, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setAiReading,
  setMeaningVisiblility,
  setSelectedCategory,
  resetCards as resetCardsAction,
} from "../../../redux/slices/cardsSlice.ts";
import { useThrottledAction } from "./useThrottledAction.js";
import { useCardGeneration } from "./useCardGeneration.js";
import { useGroqReading } from "../../meaning/hooks/useGroqReading.js";
import { getButtonConfig } from "../utils.js";

export const useOraclepage = () => {
  const dispatch = useDispatch();

  const { numberOfCards, cards, meaningIsVisible } = useSelector(
    (state) => state.cards,
  );
  const selectedCategory = useSelector((state) => state.cards.selectedCategory);
  const [card1, card2, card3] = cards;

  const [twists, setTwists] = useState({ 1: 0, 2: 0, 3: 0 });
  const [rotations, setRotations] = useState({ 1: 0, 2: 0, 3: 0 });
  const [activeCard, setActiveCard] = useState(3);
  const [previousCard, setPreviousCard] = useState(null);
  const [cardsHaveBeenShown, setCardsHaveBeenShown] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showAiView, setShowAiView] = useState(false);
  useEffect(() => {
    console.log("showCategories changed:", showCategories);
  }, [showCategories]);
  const isMountedRef = useRef(true);
  const throttledAction = useThrottledAction(2000);

  const { getCards, cancelGeneration } = useCardGeneration(
    setTwists,
    setRotations,
    setCardsHaveBeenShown,
    setShowCategories,
  );

  const { reading, isLoading: isLoadingReading, getReading } = useGroqReading();

  const resetCards = useCallback(() => {
    dispatch(resetCardsAction());
    dispatch(setMeaningVisiblility(false));
    dispatch(setSelectedCategory("General"));
    dispatch(setAiReading(null));

    setShowAiView(false);
    setTwists({ 1: 0, 2: 0, 3: 0 });
    setRotations({ 1: 0, 2: 0, 3: 0 });
    setActiveCard(3);
    setCardsHaveBeenShown(false);
    setShowCategories(false);
  }, [dispatch]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      cancelGeneration();
      resetCards();
    };
  }, [resetCards, cancelGeneration]);

  const handleGetReading = () => {
    getReading({
      cards: [
        { card: card1, rotation: rotations[1] },
        { card: card2, rotation: rotations[2] },
        { card: card3, rotation: rotations[3] },
      ],
      category: selectedCategory,
    });
  };

  const handleCardClick = (num) => {
    if (num !== activeCard) {
      setPreviousCard(activeCard);
      setActiveCard(num);
    }
  };

  const handleCategoryClick = (category) => {
    if (!isMountedRef.current) return;
    dispatch(setSelectedCategory(category));
    throttledAction(getCards);
  };

  const handleToggleMeaning = () => {
    dispatch(setMeaningVisiblility(!meaningIsVisible));
  };

  const buttonConfig = getButtonConfig(
    card1,
    meaningIsVisible,
    numberOfCards,
    card3,
    () => throttledAction(() => setShowCategories(true)),
    () => throttledAction(handleToggleMeaning),
  );

  return {
    numberOfCards,
    cards,
    card1,
    card2,
    card3,
    meaningIsVisible,
    selectedCategory,
    twists,
    rotations,
    activeCard,
    previousCard,
    cardsHaveBeenShown,
    showCategories,
    setShowCategories,
    showAiView,
    setShowAiView,
    reading,
    isLoadingReading,
    buttonConfig,
    resetCards,
    handleGetReading,
    handleCardClick,
    handleCategoryClick,
  };
};
