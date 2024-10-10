import { useAuth } from "../context/AuthContext";
import { auth, db } from "../config/firebase";
import { updateProfile } from "firebase/auth";
import { getAnalytics, setUserProperties } from "firebase/analytics";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Mail, Calendar, Edit, Loader2 } from "lucide-react";
import Loading from "./ui/loader";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [editedUser, setEditedUser] = useState({
    displayName: currentUser?.displayName || "",
    photoURL: currentUser?.photoURL || "",
    bio: currentUser?.bio || "",
    favoriteFood: currentUser?.favoriteFood || "",
  });

  useEffect(() => {
    if (currentUser) {
      const analytics = getAnalytics();
      setUserProperties(analytics, {
        favorite_food: currentUser.favoriteFood || "Not set",
      });
      setLoading(false);
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    if (!currentUser) return;

    setIsUpdating(true);
    try {
      // Update displayName and photoURL in Firebase Auth
      await updateProfile(currentUser, {
        displayName: editedUser.displayName,
        photoURL: editedUser.photoURL,
      });

      // Update bio and favoriteFood in Firestore
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(
        userRef,
        {
          bio: editedUser.bio,
          favoriteFood: editedUser.favoriteFood,
        },
        { merge: true }
      );

      // Update analytics
      const analytics = getAnalytics();
      setUserProperties(analytics, { favorite_food: editedUser.favoriteFood });

      // Refresh the currentUser object
      await currentUser.reload();

      alert("Profile updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!currentUser) {
    return <Loading />;
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex flex-col items-center space-y-4">
        <Avatar className="w-32 h-32">
          <AvatarImage
            src={currentUser.photoURL || ""}
            alt={currentUser.displayName || ""}
          />
          <AvatarFallback>
            {currentUser.displayName?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h1 className="text-3xl font-bold">{currentUser.displayName}</h1>
          <p className="text-muted-foreground">Software Developer</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Mail className="text-muted-foreground" size={18} />
          <span>{currentUser.email}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="text-muted-foreground" size={18} />
          <span>Joined January 2023</span>
        </div>
        <div className="pt-4">
          <h2 className="text-xl font-semibold mb-2">Bio</h2>
          <p className="text-muted-foreground">
            {currentUser.bio || editedUser.bio}
          </p>
        </div>
        <div className="pt-4">
          <h2 className="text-xl font-semibold mb-2">Favorite Food</h2>
          <p className="text-muted-foreground">
            {currentUser.favoriteFood || editedUser.favoriteFood || "Not set"}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Message</Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Update your profile information below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="displayName" className="text-right">
                  Name
                </Label>
                <Input
                  id="displayName"
                  name="displayName"
                  value={editedUser.displayName}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="photoURL" className="text-right">
                  Photo URL
                </Label>
                <Input
                  id="photoURL"
                  name="photoURL"
                  value={editedUser.photoURL}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bio" className="text-right">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={editedUser.bio}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="favoriteFood" className="text-right">
                  Favorite Food
                </Label>
                <Input
                  id="favoriteFood"
                  name="favoriteFood"
                  value={editedUser.favoriteFood}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleUpdateProfile} disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
