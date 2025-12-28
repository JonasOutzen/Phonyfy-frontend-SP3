import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import styles from "./ArtistDetails.module.css";
import SongList from "../../components/songs/SongList.jsx";
import { getTotalSeconds, formatHoursMinutes } from "../../utils/playlistUtils.js";

export default function ArtistDetails() {
  const { artistId } = useParams();
  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!artistId) return;

    // Fetch all data at once like we do in Global Top 50
    Promise.all([
      fetch("http://localhost:3000/artists").then((res) => res.json()),
      fetch("http://localhost:3000/songs").then((res) => res.json()),
    ])
      .then(([artistsData, songsData]) => {
        // Finding the specific artist
        const found = artistsData.find((a) => String(a.id) === String(artistId));
        if (found) {
          setArtist(found);
          setArtists(artistsData);
          setSongs(songsData ?? []);
        } else {
          setError("Artist not found");
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Failed to load artist");
      });
  }, [artistId]);

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

  // Filter songs to only include this artist's top songs
  const songById = new Map(songs.map((s) => [Number(s.id), s]));
  const topSongs = (artist.topSongs ?? [])
    .map((id) => songById.get(Number(id)))
    .filter(Boolean);

  const totalSeconds = getTotalSeconds(topSongs);
  const durationText = formatHoursMinutes(totalSeconds);

  return (
    <div>
      <div className={styles.titlecard}>
        {artist.img && (
          <img
            src={artist.img}
            alt={artist.name}
            className={styles.cover}
          />
        )}

        <div className={styles.titlecardText}>
          <p className={styles.smallText}>Artist</p>
          <h1 className={styles.title}>{artist.name}</h1>
          <p>{artist.description}</p>
          <p>
            {artist.listeners?.toLocaleString()} monthly listeners · {topSongs.length} songs · {durationText}
          </p>
        </div>
      </div>

      <SongList songs={topSongs} artists={artists} />
    </div>
  );
}
