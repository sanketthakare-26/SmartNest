import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyClpl8FdJyAeLyPMPIhxLolItBuRg5O53Q",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "smartnest-99aec.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "smartnest-99aec",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "smartnest-99aec.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "636972263947",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:636972263947:web:7bb4e8cd491cd2e4eab50e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
