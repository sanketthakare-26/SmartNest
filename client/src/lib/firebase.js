import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyClpl8FdJyAeLyPMPIhxLolItBuRg5O53Q",
  authDomain: "smartnest-99aec.firebaseapp.com",
  projectId: "smartnest-99aec",
  storageBucket: "smartnest-99aec.firebasestorage.app",
  messagingSenderId: "636972263947",
  appId: "1:636972263947:web:1b99bdc649a49fd9eab50e",
  measurementId: "G-6JM7NNNXLS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export { signInWithPopup };
