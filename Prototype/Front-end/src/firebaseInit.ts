import { initializeApp } from 'firebase/app'
import { getFirestore, collection } from 'firebase/firestore'
import FIREBASE_CONFIG from "@/firebaseConfig";

export const firebaseApp = initializeApp(FIREBASE_CONFIG);