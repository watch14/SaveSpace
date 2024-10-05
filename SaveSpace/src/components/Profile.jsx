// src/components/Profile.jsx

import React from "react";
import { useAuth } from "../context/AuthContext"; // Import the useAuth hook

const Profile = () => {
  const { currentUser } = useAuth(); // Get the current authenticated user from context

  if (!currentUser) {
    return <div>Loading...</div>; // Handle the loading state if user is not available
  }

  return (
    <div>
      <h1>Welcome, {currentUser.displayName}</h1>
      <img src={currentUser.photoURL} alt="Profile" />
      <p>Email: {currentUser.email}</p>
    </div>
  );
};

export default Profile;
