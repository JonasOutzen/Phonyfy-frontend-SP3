import React from "react";
import styles from "./Songs.module.css";
import { useState, useEffect } from "react";
import SongList from "../../components/songs/SongList.jsx";

export default function Songs() {
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);

  useEffect(() => {
  Promise.all([
    fetch("http://localhost:3000/songs").then((res) => res.json()),
    fetch("http://localhost:3000/artists").then((res) => res.json()),
  ])
    .then(([songsData, artistsData]) => {
      setSongs(songsData);
      setArtists(artistsData ?? []);
    })
    .catch((err) => console.error("Error fetching data:", err));
}, []);

  return (
    <div>
      <h1 className={styles.title}>Songs Page</h1>
      <SongList songs={songs} artists={artists} />
    </div>
  );
}
