import { auth } from "../config/firebase.js";

export default function getUser() {
  const user = auth?.currentUser?.toJSON();
  if (user) {
    console.log(user);
    console.log("Name:", user.displayName);
    console.log("Pic:", user.photoURL);
  }
  //if there is no user, return null
  return user ? user : "null";
}
