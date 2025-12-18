import React from "react";
import { useNavigate, useOutletContext } from "react-router";
import styles from "./Login.module.css";

const LoginForm = () => {
  const navigate = useNavigate();
  const outletContext = useOutletContext?.() || {};
  const { login, loggedIn, logout } = outletContext;

  const [credentials, setCredentials] = React.useState({
    username: "",
    password: "",
  });
  const [error, setError] = React.useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleLogin = async () => {
  if (!login) return;
  setError("");

  try {
    await login(credentials.username, credentials.password);
    navigate("/");
  } catch (err) {
    const msg = err?.body?.message || "Invalid username or password";
    setError(msg);
  }
};


  return (
    <div className={styles.loginContainer}>
      {loggedIn ? (
        <div className={styles.loggedInBox}>
          <p>You are logged in.</p>
          <button className={styles.button} onClick={logout}>Logout</button>
        </div>
      ) : (
        <>
          <input
            name="username"
            type="text"
            placeholder="Username"
            className={styles.input}
            onChange={handleChange}
            value={credentials.username}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className={styles.input}
            onChange={handleChange}
            value={credentials.password}
          />
          {error && <div className={styles.error}>{error}</div>}
          <button onClick={handleLogin} className={styles.button}>
            Login
          </button>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => navigate("/register")}
          >
            Register user
          </button>
        </>
      )}
    </div>
  );
};

export default LoginForm;

