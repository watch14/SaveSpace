// Import the functions you need from the SDKs you need
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAv6l4uMkkbu-XIWna_cqWxns0kZvmPrAY",
  authDomain: "learing-firebase-1379e.firebaseapp.com",
  projectId: "learing-firebase-1379e",
  storageBucket: "learing-firebase-1379e.appspot.com",
  messagingSenderId: "800462376034",
  appId: "1:800462376034:web:b04de8419b8f7af5e0153b",
  measurementId: "G-WH3YEQRD1M",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
