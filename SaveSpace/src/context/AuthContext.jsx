import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase"; // Make sure this path points to your Firebase config

// Create AuthContext
const AuthContext = createContext();

// Create a custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// Create AuthProvider to wrap around components that need auth state
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // Holds the authenticated user
  const [loading, setLoading] = useState(true); // Loading state for when auth status is loading

  useEffect(() => {
    // Set up a Firebase listener for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Update currentUser when Firebase notifies of login/logout
      setLoading(false); // Stop loading once the user state is determined
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  // The value object to pass down to all components that consume this context
  const value = {
    currentUser,
  };

  // While loading the auth state, you may want to return a loading component
  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Only render children when not loading */}
    </AuthContext.Provider>
  );
};
