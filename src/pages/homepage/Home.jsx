import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import styles from "./Home.module.css";
import ArtistCard from "../../components/imagecard/ArtistCard.jsx";

function Home() {
  const [randomArtists, setRandomArtists] = useState([]);
  const [topLists, setTopLists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetching artists and playlists data
    Promise.all([
      fetch("http://localhost:3000/artists").then((res) => res.json()),
      fetch("http://localhost:3000/playlists").then((res) => res.json()),
    ])
      .then(([artistsData, playlistsData]) => {
        // Getting random artists (6 is the number we change for how many we want to show)
        const shuffled = [...artistsData].sort(() => 0.5 - Math.random());
        setRandomArtists(shuffled.slice(0, 6));

        // Set playlists for top lists section (currently shows all playlists TODO: change later)
        const playlists = Array.isArray(playlistsData)
          ? playlistsData
          : playlistsData.playlists ?? [];
        setTopLists(playlists);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const handlePlaylistClick = (playlistId) => {
    // Navigate to the appropriate playlist page based on playlistId (TODO: we should rethink the strategy here, maybe make topPlaylists)
    if (playlistId === 1) {
      navigate("/globaltop50");
    }
    // Example for more playlists:
    // else if (playlistId === 2) {
    //   navigate("/xxx-top-playlist");
    // }
  };

  return (
    <div className={styles.homeContainer}>
      <div className={styles.hero}>
        <h1 className={styles.heading}>Welcome to Phonyfy!</h1>
        <p className={styles.tagline}>The phoniest music experience</p>
      </div>

      {/* Random Artists Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Discover some of the phoniest artists</h2>
        <div className={styles.artistGrid}>
          {randomArtists.map((artist) => (
            <ArtistCard
              key={artist.id}
              artistId={artist.id}
              imageUrl={
                artist.img || artist.imageUrl || "/images/artists/default-artist.svg"
              }
              name={artist.name}
              genre={artist.genre}
              listeners={artist.listeners}
            />
          ))}
        </div>
      </section>

      {/* Top Lists Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>How about some of the phoniest playlists?</h2>
        <div className={styles.playlistGrid}>
          {topLists.map((playlist) => (
            <div
              key={playlist.playlistId}
              className={styles.playlistCard}
              onClick={() => handlePlaylistClick(playlist.playlistId)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handlePlaylistClick(playlist.playlistId);
                }
              }}
            >
              <img
                src={playlist.img || "/images/albums/default-playlist.svg"}
                alt={playlist.name}
                className={styles.playlistImage}
              />
              <div className={styles.playlistInfo}>
                <h3 className={styles.playlistName}>{playlist.name}</h3>
                <p className={styles.playlistDescription}>
                  {playlist.songIds?.length || 0} songs
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
