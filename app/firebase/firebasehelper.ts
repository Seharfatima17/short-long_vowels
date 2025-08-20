// app/firebase/firebasehelper.ts
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const saveScore = async (
  type: "long" | "short",
  vowel: string,
  score: number,
  total: number,
  selectedWords: Record<number, string> = {}
) => {
  try {
    console.log(`Attempting to save score:`, { type, vowel, score, total, selectedWords });
    
    const collectionName = type === "short" ? `short_sound_${vowel}` : `long_sound_${vowel}`;
    console.log(`Using collection: ${collectionName}`);
    
    // Convert selectedWords object to an array of {index, word} objects
    const selectedWordsArray = Object.entries(selectedWords).map(([index, word]) => ({
      index: parseInt(index),
      word
    }));
    
    const docRef = await addDoc(collection(db, collectionName), {
      vowel,
      score,
      total,
      selectedWords: selectedWordsArray,
      createdAt: serverTimestamp(),
    });
    
    console.log(`✅ Score saved with ID: ${docRef.id}`);
    return true;
  } catch (error) {
    console.error(`❌ Error saving score:`, error);
    throw error;
  }
};