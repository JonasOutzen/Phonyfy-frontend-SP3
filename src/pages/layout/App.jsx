import Header from "../../components/header/Header.jsx";
import "./App.css";
import { Outlet, useLocation } from "react-router";
import Footer from "../../components/footer/Footer.jsx";
import { useState, useEffect } from "react";
import facade from "../../utils/apiFacade.js";


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [roles, setRoles] = useState([]);
  const location = useLocation();

const refreshAuth = () => {
  const isLoggedIn = facade.loggedIn();
  setLoggedIn(isLoggedIn);

  if (isLoggedIn) {
    const [uname, rolesFromToken] = facade.getUserNameAndRoles();
    setUsername(uname || "");
    setRoles(rolesFromToken || []);
  } else {
    setUsername("");
    setRoles([]);
  }
};


useEffect(() => {
  refreshAuth();
}, [location.pathname]);



 const logout = () => {
    facade.logout();
    refreshAuth();
  };

  const login = async (user, pass) => {
    await facade.login(user, pass);
    refreshAuth();
  };

  return (
    <>
      <Header
        headers={[
          { title: "Home", url: "/" },
          { title: "Songs", url: "/songs" },
          { title: "Artists", url: "/artists" },
          { title: "Global Top 50", url: "/globaltop50" },
          { title: "My Playlists", url: "/myplaylists" },
        ]}
        loggedIn={loggedIn}
        username={username}
        roles={roles}
        onLogout={logout}
      />
      <Outlet context={{ loggedIn, username, roles, login, logout, refreshAuth }} />
      <Footer />
    </>
  );
}

export default App;
