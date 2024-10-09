import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, Layers3, ListChecks, User, Settings } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/ThemeToggle";
import { Create } from "@/components/Create";
import { auth } from "@/config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { isUserLoggedIn } from "@/utils/getuser";
import { SignOut } from "@/utils/SignOut";

const NavItem = ({ href, icon: Icon, label }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Link
        to={href}
        className="flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Icon className="h-5 w-5" />
        <span className="sr-only">{label}</span>
      </Link>
    </TooltipTrigger>
    <TooltipContent side="right">{label}</TooltipContent>
  </Tooltip>
);

export function Aside() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    const checkUserStatus = async () => {
      const loggedIn = await isUserLoggedIn();
      setIsLoggedIn(loggedIn);
    };

    checkUserStatus();
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <TooltipProvider>
      <aside className="fixed inset-y-0 left-0 z-10 flex w-16 flex-col justify-between border-r bg-background p-2">
        <nav className="flex flex-col items-center space-y-4">
          <Create />
          <NavItem href="/" icon={Home} label="Dashboard" />
          <NavItem href="/category" icon={Layers3} label="Categories" />
          <NavItem href="/todo" icon={ListChecks} label="Tasks" />
        </nav>

        <nav className="flex flex-col items-center space-y-4">
          <ModeToggle />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-md"
              >
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fill p-4" side="right">
              {isLoggedIn ? (
                <div className="flex flex-row items-center justify-center gap-3 ">
                  <div className="flex flex-col gap-2 px-4 items-center  justify-center">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user?.photoURL} />
                      <AvatarFallback>
                        {/* <User /> */}
                        {user?.displayName?.[0] || <User />}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium">{user?.displayName}</p>
                  </div>
                  <div className="flex flex-col gap-2 px-4">
                    <Link to="/profile" className="w-full">
                      <Button variant="outline" className="w-full">
                        Profile
                      </Button>
                    </Link>
                    <SignOut />
                  </div>
                </div>
              ) : (
                <Link to="/auth" className="w-full">
                  <Button className="w-full">Sign In</Button>
                </Link>
              )}
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-fill rounded-md"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-4 pr-8 pl-8 " side="right">
              <div className="flex flex-col space-y-4 justify-center items-center">
                <h3 className="text-sm font-medium">Settings</h3>
                <ModeToggle />
                {/* Add more settings options here */}
              </div>
            </PopoverContent>
          </Popover>
        </nav>
      </aside>
    </TooltipProvider>
  );
}
