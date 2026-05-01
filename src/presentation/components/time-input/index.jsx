import styles from "./time-input.module.css";

const TimeInput = ({ label, value, onChange }) => {
  return (
    <div className={styles["time-input-group"]}>
      {label && <label className={styles["time-label"]}>{label}</label>}

      <div className={styles["time-input-wrapper"]}>
        <input
          type="time"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={styles["time-input"]}
        />
      </div>
    </div>
  );
};

export default TimeInput;