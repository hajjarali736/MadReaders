import UserPool from "../auth/UserPool.js";
import {
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
export const register = (
  username,
  password,
  birthdate,
  gender,
  given_name,
  family_name,
  email
) => {
  const attributeList = [
    new CognitoUserAttribute({ Name: "email", Value: email }),
    new CognitoUserAttribute({ Name: "birthdate", Value: birthdate }),
    new CognitoUserAttribute({ Name: "gender", Value: gender }),
    new CognitoUserAttribute({ Name: "given_name", Value: given_name }),
    new CognitoUserAttribute({ Name: "family_name", Value: family_name }),
  ];

  UserPool.signUp(username, password, attributeList, null, (err, data) => {
    if (err) {
      console.log("❌ Registration error:", err.message || err);
      throw new Error(err.message || "Registration failed");
    }
    console.log("✅ Registration success:", data);
    return data;
  });
};

export const login = (username, password) => {
  const userData = {
    Username: username, // username (or email depending on your Cognito setup)
    Pool: UserPool, // The Cognito User Pool instance
  };

  const authenticationData = {
    Username: username,
    Password: password,
  };

  const authenticationDetails = new AuthenticationDetails(authenticationData);

  const cognitoUser = new CognitoUser(userData);

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: (result) => {
      console.log("Sign-in successful!", result);
      // You can access user tokens here: result.getIdToken().getJwtToken()
    },
    onFailure: (err) => {
      console.error("Sign-in failed!", err);
    },
  });
};

export const logoutUser = () => {
  const currentUser = UserPool.getCurrentUser(); // Get the current user from the user pool

  if (currentUser) {
    currentUser.signOut(); // Sign out the current user
    console.log("User has been logged out successfully.");
  } else {
    console.log("No user is currently signed in.");
  }
};

export const getCurrentUser = () => {
  const currentUser = UserPool.getCurrentUser(); // Get the current user from the user pool

  if (currentUser) {
    console.log("Current user:", currentUser);
    // You can use currentUser.getUsername() to get the username (email if email is username)
    return currentUser;
  } else {
    console.log("No user is currently signed in.");
    return null;
  }
};

// register(
//   "testuser21223",
//   "Aa1#12345678",
//   "1990-01-01",
//   "male",
//   "Test",
//   "User",
//   "tes2t@gmail.com"
// );

// // Adding another test registration
// register(
//   "testuser21224",
//   "Aa1#12345678",
//   "1995-05-15",
//   "female",
//   "Jane",
//   "Doe",
//   "jane.doe@example.com"
// );

// logoutUser();
// await login("testuser123", "Aa1#12345678");
// await new Promise((resolve) => setTimeout(resolve, 3000));
// console.log(getCurrentUser());
getCurrentUser();
