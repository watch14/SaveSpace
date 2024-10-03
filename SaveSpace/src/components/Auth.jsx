import React, { useState } from "react";
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
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateName = (name) => {
    if (name.length === 0) {
      setNameError("Name is required");
      return false;
    } else {
      setNameError("");
      return true;
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const handleSignIn = async () => {
    setError("");

    // Perform validation before attempting sign in
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isNameValid || !isEmailValid || !isPasswordValid) {
      return; // Exit if any validation fails
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });
      console.log("user:", user);
    } catch (error) {
      const errorMessage = error.code.split("/")[1].split("-").join(" ");
      setError(errorMessage);
      console.log("error:", errorMessage);
    }
  };

  const handleGoogleSignIn = async () => {
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
    <div className="flex flex-col gap-3 pt-4 pb-4  ">
      <h2 className="text-2xl text-gray-300">Sign In</h2>

      <Input
        type="text"
        placeholder="Name"
        onChange={(e) => {
          setName(e.target.value);
          validateName(e.target.value);
        }}
        value={name}
      />
      <div>
        {" "}
        {nameError && (
          <p className="text-red-500 text-sm mt-1 text-left">{nameError}</p>
        )}
      </div>

      <Input
        type="email"
        placeholder="Email"
        onChange={(e) => {
          setEmail(e.target.value);
          validateEmail(e.target.value);
        }}
        value={email}
      />
      {emailError && (
        <p className="text-red-500 text-sm mt-1 text-left">{emailError}</p>
      )}

      <Input
        type="password"
        placeholder="Password"
        onChange={(e) => {
          setPassword(e.target.value);
          validatePassword(e.target.value);
        }}
        value={password}
      />
      {passwordError && (
        <p className="text-red-500 text-sm mt-1 text-left">{passwordError}</p>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-left">{error}</AlertTitle>
        </Alert>
      )}

      <Button onClick={handleSignIn}>Sign In</Button>

      <Button className="w-full" variant="link" onClick={handleGoogleSignIn}>
        <FcGoogle />
      </Button>
    </div>
  );
};
