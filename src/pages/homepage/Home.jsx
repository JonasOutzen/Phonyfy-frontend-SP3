import styles from "./Home.module.css";

function Home() {
  return (
    <div>
      <h1 className={styles.title}>Welcome to phoniest fy!</h1>

      <div className={styles.container}>
        <div className={styles.rightContent}>
        </div>
      </div>
      
      <h2 className={styles.subtitle}>About us</h2>
      <p className={styles.paragraph}>
        spotify for dummies
      </p>
    </div>
  );
}

export default Home;
