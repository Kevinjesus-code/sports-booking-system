import styles from "./select.module.css";

/**
 * DSASelect — select estilizado reutilizable.
 *
 * Props:
 *  - label       {string}
 *  - value       {string}
 *  - onChange     {function(value)}
 *  - options     {Array<{value, label}>}
 *  - placeholder {string}
 *  - error       {string}   Mensaje de error
 *  - disabled    {boolean}
 */
const Select = ({ label, value, onChange, options = [], placeholder, error, disabled = false }) => {
  return (
    <div className={styles["select-group"]}>
      {label && <label className={styles["select-label"]}>{label}</label>}
      <div className={styles["select-wrapper"]}>
        <select
          className={`${styles["select"]} ${error ? styles["select-error"] : ""}`}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className={styles["select-arrow"]}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>
      {error && <span className={styles["select-error-msg"]}>{error}</span>}
    </div>
  );
};

export default Select;
