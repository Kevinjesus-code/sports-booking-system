import styles from "./dashboard.module.css";
import Courts from "../courts/courts";

const Dashboard = ({ userName, onSelectCourt }) => {
  return (
    <main className={styles.wrapper}>
      <section>
        <h1 className={styles.welcomeTitle}>
          Hola, {userName} 👋
        </h1>
      </section>
      <Courts onSelectCourt={onSelectCourt} />
    </main>
  );
};

export default Dashboard;