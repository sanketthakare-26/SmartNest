// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyClpl8FdJyAeLyPMPIhxLolItBuRg5O53Q",
  authDomain: "smartnest-99aec.firebaseapp.com",
  projectId: "smartnest-99aec",
  storageBucket: "smartnest-99aec.firebasestorage.app",
  messagingSenderId: "636972263947",
  appId: "1:636972263947:web:7bb4e8cd491cd2e4eab50e",
  measurementId: "G-ME0H8LLB73"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);