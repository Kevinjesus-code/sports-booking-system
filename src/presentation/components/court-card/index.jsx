import styles from "./court-card.module.css";

const CourtCard = ({ court }) => {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper}>
        {court.icon}
      </div>

      <h3 className={styles.title}>
        {court.name}
      </h3>

      <p className={styles.description}>
        {court.description}
      </p>
    </div>
  );
};

export default CourtCard;