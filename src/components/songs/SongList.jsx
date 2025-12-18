import React from "react";
import styles from "./SongList.module.css";
import { Link } from "react-router";
import { formatDuration } from "../../utils/playlistUtils.js";


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
          {songs.map((song, index) => (
            <tr key={song.id}>
              <td>{index + 1}</td>
              <td>{song.songname}</td>
              <td>{song.albumname}</td>
              <td>
                <Link className={styles.artistLink} to={`/artist/${song.artist}`}>
                  {artistNameFromId(song.artist)}
                </Link>
              </td>

              <td>
                <Link className={styles.artistLink} to={`/artist/${song.featuringArtists}`}>
                  {(song.featuringArtists ?? []).map(artistNameFromId).join(", ")}
                </Link>
              </td>
              <td>{formatDuration(song.duration)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
