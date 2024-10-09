import React, { useEffect } from "react";
import { Avatar, Button, CircularProgress, styled } from "@mui/material";
import GoogleSignIn from "../components/GoogleSignIn";
import { useAuth } from "../context/AuthContext";


const Header = () => {
  const { currentUser, setCurrentUser, logOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  const WelcomeText = styled("span")(({ theme }) => ({
    color: theme.palette.text.primary,
    fontWeight: "bold",
  }));

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <h2 style={{ marginRight: "1rem" }}>Custom Code Editor</h2>
      {currentUser ? (
        <>
          <WelcomeText>Welcome, {currentUser.displayName}</WelcomeText>
          <Avatar
            src={currentUser.photoURL}
            alt={currentUser.displayName}
            sx={{
              width: 32,
              height: 32,
              marginLeft: "0.5rem",
              marginRight: "0.5rem",
            }}
          />
          <div className="signout-container">
            <button onClick={handleSignOut} className="signout-button">
              <span>Logout</span>
            </button>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default Header;
