import styles from "./search-bar.module.css";

const SearchBar = ({ value, onChange, placeholder = "Buscar...", resultsCount = null }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.box}>
        <span className={styles.icon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" width="16" height="16">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          type="text"
          className={styles.input}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
        {value && (
          <button
            className={styles.clear}
            onClick={() => onChange?.("")}
            aria-label="Limpiar búsqueda"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" width="14" height="14">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
      {value && resultsCount !== null && (
        <span className={styles.count}>
          {resultsCount === 0 ? "Sin resultados" : `${resultsCount} resultado${resultsCount !== 1 ? "s" : ""}`}
        </span>
      )}
    </div>
  );
};

export default SearchBar;
