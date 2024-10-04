import { Outlet } from "react-router-dom";
import { Aside } from "./components/Aside.jsx";

import "./App.css";
import { ThemeProvider } from "@/components/ui/theme-provider.tsx";

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Aside />
        <div className="ml-[56px]">
          <Outlet />
        </div>
      </ThemeProvider>
    </>
  );
}

export default App;
