import Header from "../../components/header/Header.jsx";
import "./App.css";
import { Outlet } from "react-router";
import Footer from "../../components/footer/Footer.jsx";

function App() {
  return (
    <>
      <Header
        headers={[
          { title: "Home", url: "/" },
          { title: "Songs", url: "/songs" },
          { title: "Artists", url: "/artists" },
          { title: "Global Top 50", url: "/globaltop50" },
        ]}
      />
      <Footer />
      <Outlet />
    </>
  );
}

export default App;
