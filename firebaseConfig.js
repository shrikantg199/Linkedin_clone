import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCWPChzaoOm-6LYsqbIXgvWFFpArGTNbgQ",
  authDomain: "expo-4ceb6.firebaseapp.com",
  projectId: "expo-4ceb6",
  storageBucket: "expo-4ceb6.appspot.com",
  messagingSenderId: "1050362336521",
  appId: "1:1050362336521:web:bbd0b2eceb12aa4a242fd8",
  measurementId: "G-5XSX08MEVP",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
