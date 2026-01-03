import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams, Link } from "react-router";
import styles from "./PlaylistDetails.module.css";
import facade from "../../utils/apiFacade.js";
import { formatDuration } from "../../utils/playlistUtils.js";
import tableStyles from "../../components/songs/SongList.module.css";

export default function PlaylistDetails() {
  // Hooks
  const navigate = useNavigate();
  const { loggedIn } = useOutletContext();
  const { playlistId } = useParams();

  const [playlist, setPlaylist] = useState(null);
  const [songsPayload, setSongsPayload] = useState(null); // { songs, artists }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [songIdInput, setSongIdInput] = useState("");
  const [busy, setBusy] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const idNum = Number(playlistId);

  const playOnSpotify = (artistName, songName) => {
    const query = `${artistName} ${songName}`;
    window.open(
      `https://open.spotify.com/search/${encodeURIComponent(query)}`,
      "_blank"
    );
  };

  // Load data
  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const playlistData = await facade.getPlaylistById(idNum);
      setPlaylist(playlistData);

      // songs/artists er nice-to-have
      try {
        const songsData = await facade.getSongsAndArtists();
        setSongsPayload(songsData);
      } catch (e2) {
        console.log("getSongsAndArtists failed:", e2);
        setSongsPayload({ songs: [], artists: [] }); // fallback
      }
    } catch (e) {
      console.log("getPlaylistById failed:", e);
      if (e?.status === 401 || e?.status === 403) {
        navigate("/login");
        return;
      }
      setError(e?.body?.message || "Could not load playlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loggedIn) {
      navigate("/login");
      return;
    }
    if (!Number.isFinite(idNum)) {
      setError("Invalid playlist id");
      setLoading(false);
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn, idNum]);

  // Early returns (OK)
  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!playlist || !songsPayload)
    return <p className={styles.error}>Playlist not found</p>;

  // Data prep (NO hooks)
  const songIds = Array.isArray(playlist.songIds) ? playlist.songIds : [];
  const allSongs = Array.isArray(songsPayload.songs) ? songsPayload.songs : [];
  const artists = Array.isArray(songsPayload.artists)
    ? songsPayload.artists
    : [];

  const songById = new Map(allSongs.map((s) => [Number(s.id), s]));
  const artistById = new Map(artists.map((a) => [Number(a.id), a.name]));

  const artistNameFromId = (artistId) =>
    artistById.get(Number(artistId)) ?? "Unknown Artist";

  // Actions
  const onAddSong = async (e) => {
    e.preventDefault();
    setError("");

    const songId = Number(songIdInput);
    if (!Number.isFinite(songId) || songId <= 0) {
      setError("Song ID must be a positive number");
      return;
    }

    setBusy(true);
    try {
      await facade.addSongToPlaylist(idNum, songId);
      setSongIdInput("");
      await load();
    } catch (e) {
      setError(e?.body?.message || "Could not add song");
    } finally {
      setBusy(false);
    }
  };

  const onDeletePlaylist = async () => {
    if (!playlist) return;

    const ok = window.confirm(
      `Delete playlist "${playlist.name}"?\nThis cannot be undone.`
    );
    if (!ok) return;

    setDeleting(true);
    setError("");

    try {
      await facade.deletePlaylist(idNum);
      navigate("/myplaylists"); // tilbage til listen
    } catch (e) {
      if (e?.status === 401 || e?.status === 403) {
        navigate("/login");
        return;
      }
      setError(e?.body?.message || "Could not delete playlist");
    } finally {
      setDeleting(false);
    }
  };

  const onRemoveSong = async (songId) => {
    setBusy(true);
    try {
      await facade.removeSongFromPlaylist(idNum, songId);
      await load();
    } catch (e) {
      setError(e?.body?.message || "Could not remove song");
    } finally {
      setBusy(false);
    }
  };

  // Render
  return (
    <div className={styles.container}>
      <button
        className={styles.backBtn}
        onClick={() => navigate("/myplaylists")}
      >
        ← Back to My Playlists
      </button>

      <div className={styles.hero}>
        <img
          className={styles.cover}
          src={playlist.img || "/images/albums/defaultalbumcover.jpg"}
          alt={playlist.name}
        />
        <div className={styles.heroText}>
          <h1>{playlist.name}</h1>
          <p>{playlist.description || "Playlist"}</p>
          <span>{songIds.length} songs</span>
        </div>
      </div>

      {/* Add song */}
      <form className={styles.addForm} onSubmit={onAddSong}>
        <input
          className={styles.input}
          value={songIdInput}
          onChange={(e) => setSongIdInput(e.target.value)}
          placeholder="Add song by ID (e.g. 42)"
        />
        <button disabled={busy}>{busy ? "Working..." : "Add song"}</button>
        {error && <span className={styles.inlineError}>{error}</span>}
      </form>

      {/* Song list */}
      {songIds.length === 0 ? (
        <p className={styles.empty}>No songs in this playlist yet.</p>
      ) : (
        <table className={tableStyles.table}>
          <thead className={tableStyles.thead}>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Album</th>
              <th>Artist</th>
              <th>Featuring</th>
              <th>Duration</th>
              <th>Play</th>
              <th></th>
            </tr>
          </thead>
          <tbody className={tableStyles.tbody}>
            {songIds.map((sid, index) => {
              const song = songById.get(Number(sid));
              if (!song) {
                return (
                  <tr key={sid}>
                    <td>{index + 1}</td>
                    <td colSpan={5}>Missing song #{sid}</td>
                    <td>
                      <button
                        className={styles.removeBtn}
                        onClick={() => onRemoveSong(sid)}
                        type="button"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={song.id}>
                  <td>{index + 1}</td>
                  <td>{song.songname}</td>
                  <td>{song.albumname}</td>
                  <td>
                    <Link to={`/artist/${song.artist}`}>
                      {artistNameFromId(song.artist)}
                    </Link>
                  </td>
                  <td>
                    {(song.featuringArtists ?? [])
                      .map(artistNameFromId)
                      .join(", ") || "-"}
                  </td>
                  <td>{formatDuration(song.duration)}</td>
                  <td>
                    <button
                      className={tableStyles.playButton}
                      onClick={() =>
                        playOnSpotify(
                          artistNameFromId(song.artist),
                          song.songname
                        )
                      }
                      title="Play on Spotify"
                      type="button"
                    >
                      ▶
                    </button>
                  </td>

                  <td>
                    <button
                      className={styles.removeBtn}
                      onClick={() => onRemoveSong(song.id)}
                      disabled={busy}
                      type="button"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <div className={styles.dangerRow}>
        <button
          className={styles.deleteBtn}
          onClick={onDeletePlaylist}
          disabled={deleting}
          type="button"
        >
          {deleting ? "Deleting..." : "Delete playlist"}
        </button>
      </div>
    </div>
  );
}
