import React from "react";
import { auth } from "../config/firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";

export const Auth = () => {
  const handleSignIn = () => {
    // Use the auth object here
    console.log(auth);
  };

  return (
    <div>
      <input placeholder="Email..." />
      <input placeholder="Password..." />
      <button onClick={handleSignIn}> Sign In</button>
    </div>
  );
};
