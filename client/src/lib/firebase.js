import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "mock-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mock-auth-domain.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mock-project-id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mock-storage-bucket.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:000000000000:web:0000000000000000000000"
};

let app;
let auth;
let isMockFirebase = false;

// Check if actual env variables are provided
const hasRealConfig = import.meta.env.VITE_FIREBASE_API_KEY && 
                       import.meta.env.VITE_FIREBASE_API_KEY !== "mock-api-key";

if (hasRealConfig) {
  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    auth = getAuth(app);
  } catch (error) {
    console.error("Firebase initialization failed, falling back to mock auth:", error);
    isMockFirebase = true;
  }
} else {
  console.warn("Using mock Firebase auth because VITE_FIREBASE_API_KEY is not configured.");
  isMockFirebase = true;
}

export { auth, isMockFirebase };
