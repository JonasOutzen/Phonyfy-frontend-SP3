import React from "react";
import styles from "./SongList.module.css";

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function Songs({ songs, artists = [] }) {
  const artistNameFromId = (artistId) => {
    const id = Number(artistId);
    return (
      artists.find((artist) => Number(artist.id) === id)?.name ??
      "Unknown Artist"
    );
  };

  return (
    <div>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Album Name</th>
            <th>Artist</th>
            <th>Featuring Artists</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {songs.map((song) => (
            <tr key={song.id}>
              <td>{song.id}</td>
              <td>{song.songname}</td>
              <td>{song.albumname}</td>
              <td>{artistNameFromId(song.artist)}</td>
              <td>{(song.featuringArtists ?? []).map(artistNameFromId).join(", ")}</td>
              <td>{formatDuration(song.duration)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
