import styles from "./court-card.module.css";

const CourtCard = ({ court, onClick }) => {
  return (
    <div className={styles.card} onClick={onClick}>
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