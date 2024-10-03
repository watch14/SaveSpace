import { useState } from "react";
import { Auth } from "./components/Auth.jsx";
import { SignOut } from "./utils/SignOut.jsx";

import "./App.css";
import ThemeToggle from "./components/ui/ThemeToggle.jsx";

function App() {
  return (
    <>
      <div className="flex flex-row gap-3 justify-center">
        <ThemeToggle />
        <SignOut />
      </div>
      <h1 className="mt-4 mb-4 text-4xl font-bold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        SaveSpace
      </h1>
      <Auth />
    </>
  );
}

export default App;
