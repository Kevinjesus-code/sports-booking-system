import styles from "./switch.module.css";

const Switch = ({
  checked = false,
  onChange,
  disabled = false,
}) => {
  return (
    <label className={`${styles["switch"]} ${disabled ? styles["disabled"] : ""}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
      />
      <span className={styles["slider"]}></span>
    </label>
  );
};

export default Switch;