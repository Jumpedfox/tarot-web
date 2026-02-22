import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import cardsReducer from "./slices/cardsSlice.ts";
import soundReducer from "./slices/soundSlice.ts";
import themeReducer from "./slices/themeSlice.ts";
import uiReducer from "./slices/uiSlice.ts";

const rootReducer = combineReducers({
  cards: cardsReducer,
  sound: soundReducer,
  theme: themeReducer,
  ui: uiReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["sound", "theme"],
};

const preloadedState = {
  cards: {
    numberOfCards: parseInt(localStorage.getItem("numberOfCards") || "1"),
    onlyMajorArcana: false,
    cards: [],
    meaningIsVisible: false,
    selectedCategory: "General",
    aiReading: null,
  },
} as any;

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export default store;
