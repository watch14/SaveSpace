import React from "react";
import { useState } from "react";
import { auth, googleProvider } from "../config/firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { Input } from "./ui/input.jsx";
import { Button } from "./ui/button.jsx";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle } from "@/components/ui/alert";

import { FcGoogle } from "react-icons/fc";
import { FaGoogle } from "react-icons/fa";

export const Auth = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  console.log(auth?.currentUser?.email);

  const signIn = async () => {
    try {
      setError("");

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // Update the user's profile with the display name
      await updateProfile(user, { displayName: name });
      console.log("user:", user);
    } catch (error) {
      const errorMessage = error.code.split("/")[1].split("-").join(" ");

      setError(errorMessage);
      console.log("error:", errorMessage);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setError("");

      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      console.log("user:", user);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col gap-3 pt-4 pb-4 border-red-800">
      <h2 className="text-2xl text-gray-300">Sign In</h2>

      <Input
        type="text"
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />

      <Input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-left">{error}</AlertTitle>
        </Alert>
      )}

      <Button onClick={signIn}>Sign In</Button>

      <div className="flex flex-row w-full gap-2">
        <Button
          className=" w-full"
          variant="outline"
          onClick={signInWithGoogle}
        >
          <FcGoogle />
        </Button>
        <Button
          className=" w-full"
          variant="outline"
          onClick={signInWithGoogle}
        >
          <FaGoogle />
        </Button>
      </div>
    </div>
  );
};
