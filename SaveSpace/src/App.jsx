import { useState } from "react";
import { Auth } from "./components/Auth.jsx";
import { SignOut } from "./utils/SignOut.jsx";
import { Aside } from "./components/Aside.jsx";

import "./App.css";

function App() {
  return (
    <>
      <Aside />
      <div className="flex flex-row gap-3 justify-center">
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
