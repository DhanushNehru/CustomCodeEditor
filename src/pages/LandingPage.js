import React from "react";
import { Link } from "react-router-dom";
import Stars from "../components/js/Stars";
import styles from "./LandingPage.css";

function LandingPage() {
  return (
    <div className="landing-page" style={styles.container}>
      <h1 style={styles.heading}>Welcome</h1>
      <Stars />
      <Link to="/editor" style={styles.link}>
        <button style={styles.button}>Click Here to Proceed</button>
      </Link>
    </div>
  );
}

export default LandingPage;
