import React, { useEffect, useState } from "react";
import "../components/css/GoogleSignIn.css";
import { useAuth } from "../context/AuthContext.js";

const GoogleSignIn = () => {
  const { currentUser, googleSignIn } = useAuth();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuthentication();
  }, [currentUser]);

  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  return loading ? null : (
    <button onClick={handleSignIn} className="sign-in-button">
      <img
        className="google-logo"
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        loading="lazy"
        alt="google logo"
      />
      <span>Login with Google</span>
    </button>

  );
};

export default GoogleSignIn;
