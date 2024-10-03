import { useState } from "react";
import { Auth } from "./components/Auth.jsx";

import "./App.css";

function App() {
  return (
    <>
      <h1 className="text-amber-600">SaveSpace</h1>
      <Auth />
    </>
  );
}

export default App;
