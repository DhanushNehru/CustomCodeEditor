import React, { useEffect, useState } from "react";
import "../components/css/GithubSignIn.css";
import { useAuth } from "../context/AuthContext.js";

const GithubSignIn = () => {
  const { currentUser, githubSignIn } = useAuth();
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
      await githubSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  return loading ? null : (
    <button onClick={handleSignIn} className="github-sign-in-button">
      <img
        className="github-logo"
        src="https://www.svgrepo.com/show/452211/github.svg"
        loading="lazy"
        alt="github logo"
      />
      <span>Login with Github</span>
    </button>
  );
};

export default GithubSignIn;