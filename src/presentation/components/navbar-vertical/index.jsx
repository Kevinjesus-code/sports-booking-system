import { useState } from "react";
import styles from "./navbar-vertical.module.css";

const NavbarVertical = ({ contenido = [], onChange}) => {
  const [activeItem, setActiveItem] = useState("dashboard");

  const handleClick = (item) => {
    setActiveItem(item.id);
    onChange?.(item.id);
  };

  return (
    <div className={styles.container}>
      {/* Header / Logo */}
      <div className={styles.header}>
        <div className={styles.logo}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-calendar4"
            viewBox="0 0 16 16"
          >
            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M2 2a1 1 0 0 0-1 1v1h14V3a1 1 0 0 0-1-1zm13 3H1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z" />
          </svg>
        </div>
        <span className={styles["brand-name"]}>Kancha</span>
      </div>

      {/* Navigation */}
      <ul className={styles["nav-menu"]}>
        {contenido.map((item) => (
          <li
            key={item.id}
            className={`${styles["nav-item"]} ${activeItem === item.id ? styles.active : ""}`}
            onClick={() => handleClick(item)}
          >
            <span className={styles["nav-icon"]}>{item.icon}</span>
            <span className={styles["nav-label"]}>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NavbarVertical;
