import React from "react";
import styles from "./Songs.module.css";
import { useState, useEffect } from "react";
import SongList from "../../components/songs/SongList.jsx";

export default function Songs() {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/songs")
      .then((res) => res.json())
      .then((data) => setSongs(data))
      .catch((err) => console.error("Error fetching songs:", err));
  }, []);

  return (
    <div>
      <h1 className={styles.title}>Songs Page</h1>
      <SongList songs={songs} />
    </div>
  );
}
