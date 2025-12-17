import styles from "./GlobalTop50.module.css";
import { useEffect, useState } from "react";
import SongList from "../../components/songs/SongList.jsx";
import {
  getTotalSeconds,
  formatHoursMinutes,
} from "../../utils/playlistUtils.js";

export default function GlobalTop50() {
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  /* The date today */
  const today = new Date().toLocaleDateString("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

  /* Filtering the top 50 playlist */
  const top50 = playlists.find((p) => p.playlistId === 1);
  const songById = new Map(songs.map((s) => [s.id, s]));
  const top50songs = (top50?.songIds ?? [])
    .map((id) => songById.get(id))
    .filter(Boolean);

  const totalSeconds = getTotalSeconds(top50songs);
  const durationText = formatHoursMinutes(totalSeconds);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:3000/songs").then((res) => res.json()),
      fetch("http://localhost:3000/artists").then((res) => res.json()),
      fetch("http://localhost:3000/playlists").then((res) => res.json()),
    ])
      .then(([songsData, artistsData, playlistsData]) => {
        setSongs(songsData ?? []);
        setArtists(artistsData ?? []);
        setPlaylists(
          Array.isArray(playlistsData)
            ? playlistsData
            : playlistsData.playlists ?? []
        );
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  return (
    <div>
      <div className={styles.titlecard}>
        {top50?.img && (
          <img src={top50.img} alt={top50.name} className={styles.cover} />
        )}

        <div className={styles.titlecardText}>
          <p className={styles.smallText}>
            Public playlist 
          </p>
          <h1 className={styles.title}>Top 50 – Global</h1>
          <p>
            Your daily update with the most viral tracks right now – Global. 
          </p>
          <p>
            Phonyfy ·{" "}{top50songs.length} songs · {durationText} · {today}
          </p>
        </div>
      </div>
      <SongList songs={top50songs} artists={artists} />
    </div>
  );
}
