import { ref, get } from "firebase/database";
import { database } from "../firebase/firebase.js";

export interface CardData {
  name: string;
  image: string;
  meaning_up: Record<string, string>;
  meaning_rev: Record<string, string>;
}

export const cardsService = {
  getCard: async (cardNumber: number): Promise<CardData | null> => {
    try {
      const snapshot = await get(ref(database, `/cards/${cardNumber}`));
      if (snapshot.exists()) {
        return snapshot.val() as CardData;
      }
      return null;
    } catch (error) {
      console.error("Firebase Error:", error);
      return null;
    }
  },

  getAllCards: async (maxCards: number): Promise<CardData[]> => {
    const promises = Array.from({ length: maxCards }, (_, i) =>
      cardsService
        .getCard(i)
        .then((card) => (card ? { id: i, ...card } : null)),
    );
    const results = await Promise.all(promises);
    return results.filter(Boolean) as CardData[];
  },
};
