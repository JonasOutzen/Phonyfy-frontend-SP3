import { NavLink } from "react-router";
import styles from "./Header.module.css";

const Header = ({ headers }) => {
  return (
    <div className={styles.header}>
      <nav>
        {headers.map((header, index) => (
          <NavLink
            key={index}
            to={header.url}
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            {header.title}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Header;
