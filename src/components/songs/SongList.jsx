import React from "react";
import styles from "./SongList.module.css";

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function Songs({ songs }) {
  return (
    <div>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Album Name</th>
            <th>Duration</th>
            <th>Artist</th>
            <th>Featuring Artists</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {songs.map((song) => (
            <tr key={song.id}>
              <td>{song.id}</td>
              <td>{song.songname}</td>
              <td>{song.albumname}</td>
              <td>{formatDuration(song.duration)}</td>
              <td>{song.artist}</td>
              <td>{song.featuringArtists.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
