// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "imo-house.firebaseapp.com",
  projectId: "imo-house",
  storageBucket: "imo-house.appspot.com",
  messagingSenderId: "34806006682",
  appId: "1:34806006682:web:6dda9da87a9622a885b023"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);