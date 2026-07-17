import styles from "./empty-state.module.css";

/**
 * DSAEmptyState — estado vacío reutilizable.
 *
 * Props:
 *  - icon       {ReactNode}  Icono SVG
 *  - title      {string}
 *  - subtitle   {string}
 *  - action     {ReactNode}  Botón de acción opcional
 */
const EmptyState = ({ icon, title, subtitle, action }) => {
  return (
    <div className={styles.container}>
      {icon && <div className={styles.icon}>{icon}</div>}
      {title && <p className={styles.title}>{title}</p>}
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
};

export default EmptyState;
