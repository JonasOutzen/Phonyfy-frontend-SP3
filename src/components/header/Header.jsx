import { NavLink } from "react-router";
import styles from "./Header.module.css";

const Header = ({ headers, loggedIn, username, onLogout, roles = [] }) => {
const isAdmin = roles.includes("ADMIN")

const profileImg = isAdmin
    ? "/images/profile/standard-admin.png"
    : "/images/profile/standard-user.png";

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
      <div className={styles.actions}>
        {loggedIn ? (
          <>
            <span className={styles.username}>{username}</span>
            <img
              src={profileImg}
              alt={isAdmin ? "Admin" : "User"}
              className={styles.userIcon}
            />
            <button className={styles.authButton} onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `${styles.authLink} ${isActive ? styles.active : ""}`.trim()
            }
          >
            Login
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Header;
