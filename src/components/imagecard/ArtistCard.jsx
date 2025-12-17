import React from "react";
import { useNavigate } from "react-router";
import styles from "./ArtistCard.module.css";

const Card = ({ imageUrl, name, artistId, listeners, genre }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/artist/${artistId}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={styles.card}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`Open artist ${name} details`}
    >
      <img src={imageUrl} alt={name} />
      <div className={styles.cardText}>
        <h3 className={styles.cardName}>{name}</h3>
        <p className={styles.cardDescription}>{genre || "Genre"}</p>
        <p className={styles.cardDescription}>Monthly Listeners: {listeners?.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default Card;
