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

  const playOnSpotify = (artistName, songName) => {
    const query = `${artistName} ${songName}`;
    window.open(`https://open.spotify.com/search/${encodeURIComponent(query)}`, '_blank');
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
            <th>Play</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {songs.map((song, index) => (
            <tr key={song.id}>
              <td>{index + 1}</td>
              <td 
                className={styles.songTitle}
                onClick={() => playOnSpotify(artistNameFromId(song.artist), song.songname)}
              >
                {song.songname}
              </td>
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
              <td>
                <button 
                  className={styles.playButton}
                  onClick={() => playOnSpotify(artistNameFromId(song.artist), song.songname)}
                  title="Play on Spotify"
                >
                  ▶
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
