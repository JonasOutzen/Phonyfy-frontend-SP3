import React, { useState, useEffect } from "react";
import styles from "./Artists.module.css";
import ArtistCard from "../../components/imagecard/ArtistCard.jsx";

export default function Artists() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/artists")
      .then((res) => res.json())
      .then((data) => setArtists(data))
      .catch((err) => console.error("Error fetching artists:", err));
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Artists</h1>

      <div className={styles.grid}>
        {artists.map((d) => (
          <ArtistCard
            key={d.id}
            artistId={d.id}
            imageUrl={
              d.img || d.imageUrl || "/images/artists/default-artist.svg"
            }
            name={d.name}
            genre={d.genre}
            listeners={d.listeners}
            description={d.license ? `License: ${d.license}` : "Artist"}
          />
        ))}
      </div>
    </div>
  );
}
