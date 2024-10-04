import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isUserLoggedIn } from "./getuser.js";

const ProtectedRoute = ({ element, isRestricted }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // State to store login status
  const [loading, setLoading] = useState(true); // Loading state while checking

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const loggedIn = await isUserLoggedIn(); // Wait for the auth check
        setIsLoggedIn(loggedIn);
      } catch (error) {
        console.error("Error checking user authentication", error);
        setIsLoggedIn(false); // Fallback if error occurs
      } finally {
        setLoading(false); // Stop loading after check
      }
    };

    checkAuthStatus();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Display loading state while checking
  }

  // If route is restricted and user is logged in, redirect to home
  if (isRestricted && isLoggedIn) {
    return <Navigate to="/" />;
  }

  // If route is not restricted but user is not logged in, redirect to auth
  if (!isRestricted && !isLoggedIn) {
    return <Navigate to="/auth" />;
  }

  // If conditions are met, return the intended element
  return element;
};

export default ProtectedRoute;
