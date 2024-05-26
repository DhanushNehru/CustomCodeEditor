import React from "react";
import CircularLoading from "./CircularLoading";
import { useGetStars } from "../../hooks/useGetStars";
import { FaStar, FaGithub } from "react-icons/fa";

const Stars = () => {
  const { fetchState, repositoryStarts, getStars } = useGetStars();

  if (fetchState.isLoading) return <CircularLoading />;

  if (fetchState.isError)
    return (
      <>
        <p style={styles.error}>{fetchState.errorMessage}</p>{" "}
        <button style={styles.retry} onClick={getStars}>
          Retry
        </button>
      </>
    );

  return (
    <div style={styles.starsCon}>
      <div style={styles.stars}>
        <FaGithub fontSize={32} />
        <div style={styles.starsCount}>
          <span>Star on GitHub</span>
          <span style={{ color: "gold" }}>
            {repositoryStarts} {repositoryStarts > 1 ? "stars" : "star"}{" "}
            <FaStar style={styles.star} color='gold' />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Stars;

const styles = {
  starsCon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    fontWeight: "bold",
    height: "4.2rem",
  },
  stars: {
    border: "1px solid gray",
    padding: ".25rem 1rem",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    gap: ".5rem",
  },
  starsCount: {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    justifyContent: "center",
  },
  star: {
    transform: "translateY(.15rem)",
  },
  error: {
    color: "red",
  },
  retry: {
    border: "none",
    padding: ".5rem 1rem",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
