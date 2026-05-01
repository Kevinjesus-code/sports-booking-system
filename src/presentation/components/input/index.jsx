import styles from "./input.module.css";

const Input = ({ label, value, onChange, placeholder, type = "text", icon }) => {
  return (
    <div className={styles["input-group"]}>
      {label && <label className={styles["input-label"]}>{label}</label>}
      <div className={styles["input-wrapper"]}>
        {icon && <span className={styles["input-icon"]}>{icon}</span>}
        <input
          className={`${styles["input"]} ${icon ? styles["has-icon"] : ""}`}
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default Input;