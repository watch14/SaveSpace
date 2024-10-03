import React from "react";
import { useState } from "react";
import { auth } from "../config/firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Input } from "./ui/input.jsx";
import { Button } from "./ui/button.jsx";
import { FormField, FormItem } from "./ui/form.jsx";

export const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const signIn = () => {
    console.log(auth);
    console.log("email:", email, "pass:", password);
  };

  return (
    <div>
      <FormItem />
      <FormField />

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
      <Button onClick={signIn}>Sign In</Button>
    </div>
  );
};
