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
      <h1 className="scroll-m-20 border-b pb-2 text-5xl font-semibold tracking-tight first:mt-0">
        SaveSpace
      </h1>
      <Auth />
    </>
  );
}

export default App;
