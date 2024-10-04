import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Aside } from "./components/Aside.jsx";

import "./App.css";

function App() {
  return (
    <>
      <Aside />

      <Outlet />
    </>
  );
}

export default App;
