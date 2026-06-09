import styles from "./dashboard.module.css";
import Courts from "../courts/courts";

const Dashboard = ({ userName, onSelectCourt }) => {
  return (
    <main className={styles.wrapper}>
      <section>
        <h1 className={styles.welcomeTitle}>
          Hola, {userName} 👋
        </h1>
        <p className={styles.welcomeSub}>Reserva tu cancha fácilmente</p>
      </section>

      <div className={styles.searchBox}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Buscar por tipo de cancha..."
        />
      </div>

      <Courts onSelectCourt={onSelectCourt} />
    </main>
  );
};

export default Dashboard;