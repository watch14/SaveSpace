import { useState } from "react";
import { Auth } from "./components/Auth.jsx";
import { Aside } from "./components/Aside.jsx";

import "./App.css";

function App() {
  return (
    <>
      <Aside />
      <div className="flex flex-col gap-3 justify-center">
        <h1 className="">SaveSpace</h1>
        <Auth />
      </div>
    </>
  );
}

export default App;
