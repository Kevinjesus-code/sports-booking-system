import styles from "./start-card.module.css";

const DSAStatCard = ({ title, value, icon, iconBg = "#fee2e2", iconColor = "#22c55e" }) => {
  return (
    <div className={styles["stat-card"]}>
      <div className={styles["stat-info"]}>
        <span className={styles["stat-title"]}>{title}</span>
        <h2 className={styles["stat-value"]}>{value}</h2>
      </div>
      <div className={styles["stat-icon"]} style={{ backgroundColor: iconBg }}>
        <svg viewBox="0 0 24 24" style={{ stroke: iconColor }}>
          {icon}
        </svg>
      </div>
    </div>
  );
};

export default DSAStatCard;