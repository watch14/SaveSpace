import React, { useEffect } from "react";
import { Button } from "./button";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = React.useState(() => {
    // Check the local storage for a saved theme preference
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  // Effect to set the dark class based on theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark"); // Save preference
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light"); // Save preference
    }
  }, [isDark]);

  return (
    <Button variant="secondary" onClick={() => setIsDark((prev) => !prev)}>
      {isDark ? <Sun /> : <Moon />}
    </Button>
  );
};

export default ThemeToggle;
