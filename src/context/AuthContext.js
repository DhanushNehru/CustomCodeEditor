// src/context/AuthContext.js
import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { GithubAuthProvider, GoogleAuthProvider, auth, signInWithPopup } from "../components/firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  const googleSignIn = ()=>{
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  }
  
  const githubSignIn = ()=>{
    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider);
  }

  function logOut() {
    signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(user);
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, [currentUser]);


 
  return <AuthContext.Provider value={{ currentUser, googleSignIn, githubSignIn, logOut }}>{children}</AuthContext.Provider>;
}