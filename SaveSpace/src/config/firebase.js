// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtfQWv7bUHG6504DybBOqcO-U7MjT3vVo",
  authDomain: "savespace-e1d93.firebaseapp.com",
  projectId: "savespace-e1d93",
  storageBucket: "savespace-e1d93.appspot.com",
  messagingSenderId: "886093158316",
  appId: "1:886093158316:web:797792c5a633e66da08c09",
  measurementId: "G-58WWRYXQBQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
