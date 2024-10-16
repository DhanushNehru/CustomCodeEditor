import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
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
    <Button
      variant="outlined"
      onClick={handleSignIn}
      sx={[
        (theme) => ({
          marginLeft: "5px",
          bgcolor: theme.palette.text.primary,
          color: theme.palette.background.default,
          border: "1px solid #E2E8F0",
          fontSize: "0.8em",
          cursor: "pointer",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }),
      ]}
    >
      <img
        className="github-logo"
        style={{ height: "25px", width: "25px", paddingRight: "6px" }}
        src="https://www.svgrepo.com/show/452211/github.svg"
        loading="lazy"
        alt="github logo"
      />
      <span>Login with Github</span>
    </Button>
  );
};

export default GithubSignIn;
