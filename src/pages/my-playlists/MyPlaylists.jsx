import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useOutletContext } from "react-router";
import styles from "./MyPlaylists.module.css";
import facade from "../../utils/apiFacade.js";

export default function MyPlaylists() {
  const navigate = useNavigate();
  const { loggedIn } = useOutletContext();

  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [img, setImg] = useState("");
  const [error, setError] = useState("");

  const load = () => {
  setLoading(true);
  setError("");

  facade
    .getMyPlaylists()
    .then((data) => {
      console.log("GET /playlists/me response:", data);

      const list =
        Array.isArray(data) ? data :
        Array.isArray(data?.playlists) ? data.playlists :
        Array.isArray(data?.data) ? data.data :
        [];

        console.log("playlist list after normalize:", list);

      setPlaylists(list);
    })
    .catch((e) => {
      if (e?.status === 401 || e?.status === 403) {
        navigate("/login");
        return;
      }
      setError(e?.body?.message || "Could not load playlists");
    })
    .finally(() => setLoading(false));
};


  useEffect(() => {
  if (!loggedIn) {
    navigate("/login");
    return;
  }
  load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [loggedIn]);


  const onCreate = async (e) => {
    e.preventDefault();
    setError("");

    const trimmed = name.trim();
    if (!trimmed) {
      setError("Playlist name is required");
      return;
    }

    try {
      await facade.createPlaylist({
        name: trimmed,
        description: description.trim(),
        img: img.trim(),
      });

      // reset + refresh
      setName("");
      setDescription("");
      setImg("");
      load();
    } catch (e) {
      if (e?.status === 401 || e?.status === 403) {
        navigate("/login");
        return;
      }
      setError(e?.body?.message || "Could not create playlist");
    }
  };

  const onOpenPlaylist = (playlistId) => {
    // næste step: details page
    navigate(`/playlist/${playlistId}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>My Playlists</h1>
        <p className={styles.subtitle}>Only you can see and manage these.</p>
      </div>

      {/* Create form */}
      <form className={styles.form} onSubmit={onCreate}>
        <div className={styles.formRow}>
          <div className={styles.field}>
            <label className={styles.label}>Name</label>
            <input
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Gym bangers"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Cover img (optional)</label>
            <input
              className={styles.input}
              value={img}
              onChange={(e) => setImg(e.target.value)}
              placeholder='e.g. "/images/albums/defaultalbumcover.jpg"'
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Description (optional)</label>
          <input
            className={styles.input}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description..."
          />
        </div>

        <div className={styles.actions}>
          <button className={styles.button} type="submit">
            Create playlist
          </button>
          {error && <span className={styles.error}>{error}</span>}
        </div>
      </form>

      <div className={styles.listHeader}>
        <h2 className={styles.h2}>Your playlists</h2>
        <span className={styles.count}>{playlists.length}</span>
      </div>

      {loading ? (
        <p className={styles.loading}>Loading...</p>
      ) : (
        <div className={styles.grid}>
          {playlists.map((p) => {
            const id = p.playlistId ?? p.id;
            return (
              <div
                key={id}
                className={styles.card}
                onClick={() => onOpenPlaylist(id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") onOpenPlaylist(id);
                }}
              >
                <div className={styles.cardImgWrap}>
                  <img
                    className={styles.cardImg}
                    src={p.img || "/images/albums/defaultalbumcover.jpg"}
                    alt={p.name}
                  />
                </div>
                <div className={styles.cardText}>
                  <div className={styles.cardTitle}>{p.name}</div>
                  <div className={styles.cardDesc}>
                    {p.description || "Playlist"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
