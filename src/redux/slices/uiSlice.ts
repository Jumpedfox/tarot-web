import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  optionsAreVisible: boolean;
  manualIsVisible: boolean;
  loaderIsVisible: boolean;
}

const initialState: UiState = {
  optionsAreVisible: false,
  manualIsVisible: false,
  loaderIsVisible: true,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setOptionsVisibility: (state, action: PayloadAction<boolean>) => {
      state.optionsAreVisible = action.payload;
    },
    setManualIsVisible: (state, action: PayloadAction<boolean>) => {
      state.manualIsVisible = action.payload;
    },
    setLoaderIsVisible: (state, action: PayloadAction<boolean>) => {
      state.loaderIsVisible = action.payload;
    },
  },
});

export const { setOptionsVisibility, setManualIsVisible, setLoaderIsVisible } =
  uiSlice.actions;
export default uiSlice.reducer;
