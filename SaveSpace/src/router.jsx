import { createBrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import ScrollToTop from "./utils/ScrollToTop.jsx";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";

import { Auth } from "./components/Auth.jsx";
import Dashboard from "./components/Dashboard.jsx";
import NotFound from "./components/NotFound.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <ScrollToTop />
        <App />
      </>
    ),
    children: [
      {
        path: "/auth",
        element: <ProtectedRoute element={<Auth />} isRestricted={false} />,
      },
      {
        path: "/",
        element: <ProtectedRoute element={<Dashboard />} isRestricted={true} />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
