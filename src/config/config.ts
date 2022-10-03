// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAuHs_O4yYNEtMBKykaIlYJ_jlw8EmVIcI",
  authDomain: "calvin-project-f40c8.firebaseapp.com",
  projectId: "calvin-project-f40c8",
  storageBucket: "calvin-project-f40c8.appspot.com",
  messagingSenderId: "553163939988",
  appId: "1:553163939988:web:74d4ed007e7b167b1c9481",
  measurementId: "G-V3SY3XEJKN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
