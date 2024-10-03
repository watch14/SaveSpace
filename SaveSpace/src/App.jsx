import { useState } from "react";
import { Auth } from "./components/Auth.jsx";

import "./App.css";
import ThemeToggle from "./components/ui/ThemeToggle.jsx";

function App() {
  return (
    <>
      <ThemeToggle />

      <h1 className="mt-4 mb-4 text-4xl font-bold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        SaveSpace
      </h1>

      <Auth />
    </>
  );
}

export default App;
