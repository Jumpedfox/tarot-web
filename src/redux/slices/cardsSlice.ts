import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CardData } from "../../services/cards.service.ts";

interface CardsState {
  numberOfCards: number;
  onlyMajorArcana: boolean;
  cards: CardData[];
  meaningIsVisible: boolean;
  selectedCategory: string;
  aiReading: string | null;
}

const initialState: CardsState = {
  numberOfCards: 1,
  onlyMajorArcana: false,
  cards: [],
  meaningIsVisible: false,
  selectedCategory: "General",
  aiReading: null,
};

const cardsSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    setNumberOfCards: (state, action: PayloadAction<number>) => {
      state.numberOfCards = action.payload;
    },
    setOnlyMajorArcana: (state, action: PayloadAction<boolean>) => {
      state.onlyMajorArcana = action.payload;
    },
    setCard: (
      state,
      action: PayloadAction<{ index: number; card: CardData }>,
    ) => {
      state.cards[action.payload.index] = action.payload.card;
    },
    resetCards: (state) => {
      state.cards = [];
    },
    setMeaningVisiblility: (state, action: PayloadAction<boolean>) => {
      state.meaningIsVisible = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setAiReading: (state, action: PayloadAction<string | null>) => {
      state.aiReading = action.payload;
    },
  },
});

export const {
  setNumberOfCards,
  setOnlyMajorArcana,
  setCard,
  resetCards,
  setMeaningVisiblility,
  setSelectedCategory,
  setAiReading,
} = cardsSlice.actions;
export default cardsSlice.reducer;
