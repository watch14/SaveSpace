import React, { useState } from "react";
import { auth, googleProvider } from "../config/firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

  const handleSignUp = async () => {
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
      window.location.href = "/"; //redirect to dashboard
    } catch (error) {
      const errorMessage = error.code.split("/")[1].split("-").join(" ");
      setError(errorMessage);
      console.log("error:", errorMessage);
    }
  };

  const handleSignIn = async () => {
    try {
      setError("");
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      console.log("user:", user);
      window.location.href = "/"; //redirect to dashboard
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      console.log("user:", user);
      window.location.href = "/"; //redirect to dashboard
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container min-w-full min-h-full px-4 my-auto">
      <Tabs defaultValue="Sign In" className="mt-auto ">
        <TabsList className="grid w-full grid-cols-2 h-fit ">
          <TabsTrigger value="Sign Up">Sign Up</TabsTrigger>
          <TabsTrigger value="Sign In">Sign In</TabsTrigger>
        </TabsList>
        <TabsContent value="Sign Up">
          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>Create an accont.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 w-full ">
                <div>
                  <Input
                    type="text"
                    placeholder="Name"
                    onChange={(e) => {
                      setName(e.target.value);
                      validateName(e.target.value);
                    }}
                    value={name}
                  />
                  {nameError && (
                    <p className="text-red-500 text-sm mt-1 text-left">
                      {nameError}
                    </p>
                  )}
                </div>

                <div>
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
                    <p className="text-red-500 text-sm mt-1 text-left">
                      {emailError}
                    </p>
                  )}
                </div>

                <div>
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
                    <p className="text-red-500 text-sm mt-1 text-left">
                      {passwordError}
                    </p>
                  )}
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-5 w-5" />
                    <AlertTitle className="text-left text-red-600">
                      {error}
                    </AlertTitle>
                  </Alert>
                )}
              </div>
            </CardContent>
            <CardFooter className="grid w-full grid-cols-2 gap-3">
              <Button className="w-full" onClick={handleSignUp}>
                Sign Up
              </Button>

              <Button
                className="w-full"
                variant="outline"
                onClick={handleGoogleSignIn}
              >
                <FcGoogle />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="Sign In">
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Sign in with an existing account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 w-full ">
                <div>
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
                    <p className="text-red-500 text-sm mt-1 text-left">
                      {emailError}
                    </p>
                  )}
                </div>

                <div>
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
                    <p className="text-red-500 text-sm mt-1 text-left">
                      {passwordError}
                    </p>
                  )}
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-5 w-5" />
                    <AlertTitle className="text-left text-red-600">
                      {error}
                    </AlertTitle>
                  </Alert>
                )}
              </div>
            </CardContent>
            <CardFooter className="grid w-full grid-cols-2 gap-3">
              <Button className="w-full" onClick={handleSignIn}>
                Sign In
              </Button>

              <Button
                className="w-full"
                variant="outline"
                onClick={handleGoogleSignIn}
              >
                <FcGoogle />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
