import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./pages/layout/App.jsx";
import Home from "./pages/homepage/Home.jsx";
import GlobalTop50 from "./pages/global-top-50/GlobalTop50.jsx";
import Songs from "./pages/songs/Songs.jsx";
import Artists from "./pages/artists/Artists.jsx";
import ArtistDetails from "./pages/artistdetails/ArtistDetails.jsx";
import Login from "./pages/login/Login.jsx";
import RegisterUser from "./pages/register-user/RegisterUser.jsx";
import "./index.css";
import MyPlaylists from "./pages/my-playlists/MyPlaylists.jsx";
import PlaylistDetails from "./pages/playlist-details/PlaylistDetails.jsx";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="songs" element={<Songs />} />
        <Route path="artists" element={<Artists />} />
        <Route path="artist/:artistId" element={<ArtistDetails />} />
        <Route path="globaltop50" element={<GlobalTop50 />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<RegisterUser />} />
        <Route path="myplaylists" element={<MyPlaylists />} />
        <Route path="playlist/:playlistId" element={<PlaylistDetails />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
