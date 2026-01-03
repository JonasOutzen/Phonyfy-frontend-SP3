import React from "react";
import { useNavigate } from "react-router";
import styles from "./PlaylistCard.module.css";

export default function PlaylistCard({ playlistId, imageUrl, name, description, songCount }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/playlist/${playlistId}`);
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
      aria-label={`Open playlist ${name}`}
    >
      <img className={styles.img} src={imageUrl} alt={name} />
      <div className={styles.cardText}>
        <h3 className={styles.cardName}>{name}</h3>
        <p className={styles.cardDescription}>{description || "Playlist"}</p>
        <p className={styles.cardMeta}>{songCount} songs</p>
      </div>
    </div>
  );
}
