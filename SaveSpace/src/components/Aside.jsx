import React from "react";
import { useState, useEffect } from "react";

import {
  Home,
  Search,
  Settings,
  Upload,
  ListChecks,
  User,
  Plus,
  Sun,
  Moon,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../components/ui/tooltip";

import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import getUser, { isUserLoggedIn } from "@/utils/getuser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SignOut } from "@/utils/SignOut";
import { Button } from "./ui/button";
import Loading from "./ui/loader";

export function Aside() {
  const [userName, setUserName] = React.useState(null);
  const [userPic, setUserPic] = React.useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserName = () => {
      // Add auth state change listener
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in
          const name = user.displayName;
          const pic = user.photoURL;
          setUserName(name);
          setUserPic(pic);
        } else {
          // User is not signed in or state hasn't resolved
          console.log("You need to login");
          setUserName(null);
          setUserPic(null);
        }
        setLoading(false);
      });

      // Cleanup the subscription on component unmount
      return () => unsubscribe();
    };

    fetchUserName();
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkUserStatus = async () => {
      const loggedIn = await isUserLoggedIn();
      if (!loggedIn) {
      } else {
        console.log("User is logged in");
      }
      setIsLoggedIn(loggedIn);
    };

    checkUserStatus();
  }, []);

  const [isDark, setIsDark] = React.useState(() => {
    // Check the local storage for a saved theme preference
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  // Effect to set the dark class based on theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  if (loading) {
    return <Loading />;
  }

  return (
    <TooltipProvider>
      <aside className="fixed inset-y-0 left-0 z-10  w-14 flex-col border-r bg-background sm:flex pt-1 pb-1 flex justify-end">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <a
            href="#"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Plus className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Acme Inc</span>
          </a>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href="/"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Home className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </a>
            </TooltipTrigger>

            <TooltipContent side="right">Dashboard</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <ListChecks className="h-5 w-5" />
                <span className="sr-only">Todo List</span>
              </a>
            </TooltipTrigger>
            <TooltipContent side="right">Todo List</TooltipContent>
          </Tooltip>
        </nav>

        <a onClick={getUser}>user</a>

        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                onClick={() => setIsDark((prev) => !prev)}
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}

                <span className="sr-only">Theme</span>
              </a>
            </TooltipTrigger>
            <TooltipContent side="right">Theme</TooltipContent>
          </Tooltip>

          <Popover>
            <PopoverTrigger className="p-0 bg-inherit border-0 hover:border-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  >
                    <User className="h-5 w-5" />
                    <span className="sr-only">User</span>
                  </a>
                </TooltipTrigger>

                <TooltipContent side="right">Settings</TooltipContent>
              </Tooltip>
            </PopoverTrigger>
            <PopoverContent className="ml-8 bg-primary-foreground border-2 absolute -top-16">
              {isLoggedIn && (
                <div className="flex flex-row items-center justify-center gap-3">
                  {userPic && (
                    <Avatar>
                      <AvatarImage src={userPic} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  )}
                  <p>{userName}</p>
                  <SignOut />
                </div>
              )}

              {!isLoggedIn && (
                <div className="flex flex-row items-center justify-center gap-3">
                  <a href="/auth">
                    <Button>Sign In</Button>
                  </a>
                </div>
              )}
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger className="p-0 bg-inherit border-0 hover:border-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  >
                    <Settings className="h-5 w-5" />
                    <span className="sr-only">Settings</span>
                  </a>
                </TooltipTrigger>

                <TooltipContent side="right">Settings</TooltipContent>
              </Tooltip>
            </PopoverTrigger>
            <PopoverContent className="ml-8 bg-primary-foreground border-2 absolute -top-16">
              <Button onClick={() => setIsDark((prev) => !prev)} href="#">
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}

                <span className="sr-only">Theme</span>
              </Button>
            </PopoverContent>
          </Popover>
        </nav>
      </aside>
    </TooltipProvider>
  );
}
