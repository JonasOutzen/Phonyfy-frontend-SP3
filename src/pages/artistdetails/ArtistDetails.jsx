import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import styles from "./ArtistDetails.module.css";

export default function ArtistDetails() {
  const { artistId } = useParams();
  const navigate = useNavigate();
  const [artist, setArtist] = useState(null);
  const [error, setError] = useState(null);
  const [songNames, setSongNames] = useState([]);

  useEffect(() => {
    if (!artistId) return;

    fetch("http://localhost:3000/artists")
      .then((r) => r.json())
      .then((list) => {
        const found = list.find((d) => String(d.id) === String(artistId));
        if (found) setArtist(found);
        else setError("Artist not found");
      })
      .catch((err) => setError(String(err)));
  }, [artistId]);

  // When artist is loaded, fetch songs and map topSongs ids -> names
  useEffect(() => {
    if (!artist) return;
    const ids = artist.topSongs || [];
    if (ids.length === 0) {
      setSongNames([]);
      return;
    }

    // Fetch all songs and filter by topSongs ids
    fetch("http://localhost:3000/songs")
      .then((r) => {
        if (!r.ok) throw new Error("Failed fetching songs");
        return r.json();
      })
      .then((songs) => {
        const names = ids.map((id) => {
          const s = songs.find((song) => Number(song.id) === Number(id));
          return s
            ? s.songname || s.name || s.title || String(s.id)
            : String(id);
        });
        setSongNames(names);
      })
      .catch(() => {
        setError("Couldn't fetch songs");
      });
  }, [artist]);

  if (error)
    return (
      <div className={styles.container}>
        <p>{error}</p>
      </div>
    );
  if (!artist)
    return (
      <div className={styles.container}>
        <p>Loading...</p>
      </div>
    );

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate(-1)}>
        ← Back
      </button>
      <div className={styles.detailCard}>
        <h1>{artist.name}</h1>
        <p>
          <strong>ID:</strong> {artist.artistId ?? artist.id}
        </p>
        <p>
          <strong>Artist name:</strong> {artist.name}
        </p>
        <p>
          <strong>Age:</strong> {artist.age}
        </p>
        <p>
          <strong>Listeners:</strong> {artist.listeners}
        </p>
        <p>
          <strong>Biography:</strong> {artist.description}
        </p>
        <p>
          <strong>Top Songs:</strong>{" "}
          {songNames.length ? songNames.join(", ") : "None"}
        </p>
      </div>
    </div>
  );
}
