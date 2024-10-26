import { onAuthStateChanged, signOut, fetchSignInMethodsForEmail, signInWithPopup } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { GithubAuthProvider, GoogleAuthProvider, auth } from "../components/firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const githubSignIn = async () => {
    const provider = new GithubAuthProvider();

    try {
      // Attempt to sign in with GitHub
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      // Check if the error is for an existing account
      if (error.code === "auth/account-exists-with-different-credential") {
        const email = error.customData.email;
        const signInMethods = await fetchSignInMethodsForEmail(auth, email);
        if (signInMethods.includes("google.com")) {
          // If the existing account is Google, sign in with Google instead
          alert("You already have an account with this email using Google. Signing you in with Google now.");
          const googleProvider = new GoogleAuthProvider();
          const googleResult = await signInWithPopup(auth, googleProvider);
          return googleResult.user;
        } else {
          alert("An account already exists with this email. Please sign in using one of the other method");
        }
      }
      throw error;
    }
  };

  function logOut() {
    signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ currentUser, googleSignIn, githubSignIn, logOut }}>{children}</AuthContext.Provider>;
}