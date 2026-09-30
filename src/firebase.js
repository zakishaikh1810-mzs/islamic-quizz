import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCAMHqLONSBbnX0glziEbpjXUOePfUtSPw",
  authDomain: "quiz-app-155a5.firebaseapp.com",
  projectId: "quiz-app-155a5",
  storageBucket: "quiz-app-155a5.firebasestorage.app",
  messagingSenderId: "164448045567",
  appId: "1:164448045567:web:e5ee2b89e89352f8b7bfca",
  measurementId: "G-FQN70S9YG2"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);