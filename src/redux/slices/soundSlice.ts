import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SoundState {
  volume: number;
  muted: boolean;
}

const initialState: SoundState = { volume: 0.2, muted: false };

const soundSlice = createSlice({
  name: "sound",
  initialState,
  reducers: {
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    setMuted: (state, action: PayloadAction<boolean>) => {
      state.muted = action.payload;
    },
  },
});

export const { setVolume, setMuted } = soundSlice.actions;
export default soundSlice.reducer;
