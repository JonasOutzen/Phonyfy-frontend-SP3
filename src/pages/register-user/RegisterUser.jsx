import { useState } from "react";
import { useNavigate, useOutletContext} from "react-router";
import styles from "./RegisterUser.module.css";
import facade from "../../utils/apiFacade";

export default function RegisterUser() {
  const navigate = useNavigate();
  const { refreshAuth } = useOutletContext();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await facade.register(formData.username, formData.password);
      refreshAuth();
      navigate("/");
    } catch (err) {
      // err.body is the parsed JSON from backend now
      const msg =
        err?.body?.message ||
        err?.body?.msg ||
        err?.body?.warning ||
        `Register failed (HTTP ${err?.status ?? "?"})`;

      setError(String(msg));
    }
  };

  return (
    <form className={styles.RegisterUserForm} onSubmit={onSubmit}>
      <h1>Register User</h1>

      <label>
        Username
        <input
          type="text"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />
      </label>

      <label>
        Password
        <input
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
      </label>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <button className={styles.RegisterUserButton} type="submit">
        Register
      </button>
    </form>
  );
}
