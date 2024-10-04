import { Navigate } from "react-router-dom";
import { isUserLoggedIn } from "./getuser.js";

const ProtectedRoute = ({ element, isRestricted }) => {
  const isLoggedIn = isUserLoggedIn();

  if (isRestricted && isLoggedIn) {
    // If the route is restricted to logged-out users and the user is logged in
    return <Navigate to="/" />; // Redirect to home or another appropriate route
  }

  if (!isRestricted && !isLoggedIn) {
    // If the route requires authentication but the user is not logged in
    return <Navigate to="/login" />;
  }

  return element; // User is authorized to access the route
};

export default ProtectedRoute;
