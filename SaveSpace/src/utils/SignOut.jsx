import { auth } from "../config/firebase.js";
import { signOut } from "firebase/auth";

import { Button } from "@/components/ui/button";

export const SignOut = () => {
  const signOutUser = async () => {
    try {
      await signOut(auth);

      window.location.reload(); //refresh

      console.log("User signed out");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button variant="destructive" onClick={signOutUser}>
      Sign Out
    </Button>
  );
};
