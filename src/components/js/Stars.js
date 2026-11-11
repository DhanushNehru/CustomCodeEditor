import React from "react";
import { Link } from "react-router-dom";
import { FaStar, FaGithub } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import CircularLoading from "./CircularLoading";
import { useGetStars } from "../../hooks/useGetStars";

const Stars = () => {
  const { fetchState, repositoryStarts, getStars } = useGetStars();
  const { t } = useTranslation();

  if (fetchState.isLoading) return <CircularLoading />;

  if (fetchState.isError)
    return (
      <>
        <p style={styles.error}>{t("stars.loadFailed")}</p>{" "}
        <button style={styles.retry} onClick={getStars}>
          {t("stars.retry")}
        </button>
      </>
    );

  return (
    <Link to="https://github.com/DhanushNehru/CustomCodeEditor" target="_blank" rel="noopener noreferrer" style={styles.githubLink}>
      <div style={styles.starsCon}>
        <div style={styles.stars}>
          <FaGithub fontSize={24} aria-hidden="true" />
          <div style={styles.starsCount}>
            <span>{t("stars.label")}</span>
            <span style={{ color: "gold" }}>
              {t("stars.count", { count: repositoryStarts })}{" "}
              <FaStar style={styles.star} color='gold' aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>
    </Link>
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
    minHeight: "2.5rem",
    fontSize: "0.75rem",
  },
  stars: {
    padding: ".25rem 0",
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
  githubLink: {
    textDecoration: "none",
    color: "inherit"
  }
};
