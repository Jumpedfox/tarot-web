import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialState {
  cards: {
    numberOfCards: number;
    onlyMajorArcana: boolean;
    card1: any;
    card2: any;
    card3: any;
    meaningIsVisible: boolean;
  };
  options: {
    optionsAreVisible: boolean;
  };
  theme: {
    themeNumber: number;
  };
  sound: {
    volume: number;
    muted: boolean;
  };
  manual: {
    manualIsVisible: boolean;
  };
  loader: {
    loaderIsVisible: boolean;
  };
}

const initialState: InitialState = {
  cards: {
    numberOfCards: 0,
    onlyMajorArcana: false,
    card1: null,
    card2: null,
    card3: null,
    meaningIsVisible: false,
  },
  options: {
    optionsAreVisible: false,
  },
  theme: {
    themeNumber: 1,
  },
  sound: {
    volume: 0.2,
    muted: false,
  },
  manual: {
    manualIsVisible: false,
  },
  loader: {
    loaderIsVisible: true,
  },
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setNumberOfCards: (state, action: PayloadAction<number>) => {
      state.cards.numberOfCards = action.payload;
    },
    setOnlyMajorArcana: (state, action: PayloadAction<boolean>) => {
      state.cards.onlyMajorArcana = action.payload;
    },
    setCard1: (state, action: PayloadAction<any>) => {
      state.cards.card1 = action.payload;
    },
    setCard2: (state, action: PayloadAction<any>) => {
      state.cards.card2 = action.payload;
    },
    setCard3: (state, action: PayloadAction<any>) => {
      state.cards.card3 = action.payload;
    },
    setMeaningVisiblility: (state, action: PayloadAction<boolean>) => {
      state.cards.meaningIsVisible = action.payload;
    },
    setOptionsVisibility: (state, action: PayloadAction<boolean>) => {
      state.options.optionsAreVisible = action.payload;
    },
    setThemeNumber: (state, action: PayloadAction<number>) => {
      state.theme.themeNumber = action.payload;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.sound.volume = action.payload;
    },
    setMuted: (state, action: PayloadAction<boolean>) => {
      state.sound.muted = action.payload;
    },
    setManualIsVisible: (state, action: PayloadAction<boolean>) => {
      state.manual.manualIsVisible = action.payload;
    },
    setLoaderIsVisible: (state, action: PayloadAction<boolean>) => {
      state.loader.loaderIsVisible = action.payload;
    },
  },
});

export const {
  setNumberOfCards,
  setOnlyMajorArcana,
  setCard1,
  setCard2,
  setCard3,
  setMeaningVisiblility,
  setOptionsVisibility,
  setThemeNumber,
  setVolume,
  setMuted,
  setManualIsVisible,
  setLoaderIsVisible,
} = appSlice.actions;

export default appSlice.reducer;
