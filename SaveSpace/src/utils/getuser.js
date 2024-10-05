import { auth } from "../config/firebase.js";
import { onAuthStateChanged } from "firebase/auth";

export default function getUser() {
  const user = auth?.currentUser?.toJSON();

  if (user) {
    console.log(user);
    console.log("Name:", user.displayName);
    console.log("Pic:", user.photoURL);
  }

  return user || null;
}

export const isUserLoggedIn = () => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is logged in
        resolve(true);
      } else {
        // No user is logged in
        resolve(false);
      }
    });
  });
};
