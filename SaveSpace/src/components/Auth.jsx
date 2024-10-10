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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { FcGoogle } from "react-icons/fc";

export default function Auth() {
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
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isNameValid || !isEmailValid || !isPasswordValid) {
      return;
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
      window.location.href = "/";
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
      window.location.href = "/";
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
      window.location.href = "/";
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary">SaveSpace</h1>
          <p className="text-muted-foreground mt-2">
            Secure your digital world
          </p>
        </div>
        <Tabs defaultValue="Sign In" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="Sign Up">Sign Up</TabsTrigger>
            <TabsTrigger value="Sign In">Sign In</TabsTrigger>
          </TabsList>
          <TabsContent value="Sign Up">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-center">
                  Create an Account
                </CardTitle>
                <CardDescription className="text-center">
                  Join SaveSpace today
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                    <p className="text-destructive text-sm mt-1">{nameError}</p>
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
                    <p className="text-destructive text-sm mt-1">
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
                    <p className="text-destructive text-sm mt-1">
                      {passwordError}
                    </p>
                  )}
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-5 w-5" />
                    <AlertTitle>{error}</AlertTitle>
                  </Alert>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-3">
                <Button className="w-full" onClick={handleSignUp}>
                  Sign Up
                </Button>
                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleSignIn}
                >
                  <FcGoogle className="mr-2 h-4 w-4" /> Google
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="Sign In">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-center">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-center">
                  Sign in to your SaveSpace account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                    <p className="text-destructive text-sm mt-1">
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
                    <p className="text-destructive text-sm mt-1">
                      {passwordError}
                    </p>
                  )}
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-5 w-5" />
                    <AlertTitle>{error}</AlertTitle>
                  </Alert>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-3">
                <Button className="w-full" onClick={handleSignIn}>
                  Sign In
                </Button>
                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleSignIn}
                >
                  <FcGoogle className="mr-2 h-4 w-4" /> Google
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
