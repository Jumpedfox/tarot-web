import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ThemeState {
  themeName: string;
}

const initialState: ThemeState = { themeName: "bright" };

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setThemeName: (state, action: PayloadAction<string>) => {
      state.themeName = action.payload;
    },
  },
});

export const { setThemeName } = themeSlice.actions;
export default themeSlice.reducer;
