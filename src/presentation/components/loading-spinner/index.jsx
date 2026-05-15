import styles from "./loading-spinner.module.css";

/**
 * DSALoadingSpinner — spinner de carga reutilizable.
 *
 * Props:
 *  - text  {string}  Texto opcional debajo del spinner
 *  - size  {"sm"|"md"|"lg"}
 */
const LoadingSpinner = ({ text, size = "md" }) => {
  return (
    <div className={styles.container}>
      <div className={`${styles.spinner} ${styles[`spinner-${size}`]}`}>
        <div className={styles.ring} />
      </div>
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
