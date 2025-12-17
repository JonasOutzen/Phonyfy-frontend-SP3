import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./pages/layout/App.jsx";
import Home from "./pages/homepage/Home.jsx";
import GlobalTop50 from "./pages/global-top-50/GlobalTop50.jsx";
import Songs from "./pages/songs/Songs.jsx";
import Artists from "./pages/artists/Artists.jsx";
import ArtistDetails from "./pages/artistdetails/ArtistDetails.jsx";
import "./index.css";


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
      </Route>
    </Routes>
  </BrowserRouter>
);