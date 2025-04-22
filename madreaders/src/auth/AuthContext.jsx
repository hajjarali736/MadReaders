import React, { createContext, useState, useEffect } from "react";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import userPool from "./UserPool"; // Ensure that userPool is correctly set up

// Create a context for authentication
export const AuthContext = createContext();

// AuthProvider component to manage authentication state
export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);

  // Function to set the current user
  const setCurrentUser = () => {
    const currentUser = userPool.getCurrentUser();
    if (currentUser) {
      currentUser.getSession((err, session) => {
        if (err) {
          console.error("Error getting session: ", err);
          setAuthUser(null);
        } else {
          // If session is valid, set the user
          console.log("Session is valid: ", session);
          setAuthUser(currentUser);
        }
      });
    } else {
      setAuthUser(null);
    }
  };

  // Check the current user on component mount
  useEffect(() => {
    setCurrentUser();
  }, []); // Only run on initial render

  // Sign-in function
  const signIn = (email, password) => {
    const userData = {
      Username: email,
      Pool: userPool,
    };

    const authenticationData = {
      Username: email,
      Password: password,
    };

    const authenticationDetails = new AuthenticationDetails(authenticationData);
    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        console.log("Sign-in successful", result);
        setCurrentUser(); // Update the state with the current user after successful sign-in
      },
      onFailure: (err) => {
        console.error("Sign-in failed", err);
      },
    });
  };

  // Sign-out function
  const signOut = () => {
    const currentUser = userPool.getCurrentUser();
    if (currentUser) {
      currentUser.signOut();
      setAuthUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ authUser, signIn, signOut, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
