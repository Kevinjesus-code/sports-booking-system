import { useEffect, useState } from "react";
import styles from "./navbar-vertical.module.css";
// import logo from "../../../assets/Logo.png";

const NavbarVertical = ({ contenido = [], onChange, isOpen }) => {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleClick = (item) => {
    setActiveItem(item.id);
    onChange?.(item.id);
  };

  return (
    <div className={`${styles["navbar-container"]} ${isOpen ? styles["is-open"] : ""}`}>
      {/* Header / Logo */}
      <div className={styles["header"]}>
        {/* <img src={logo} alt="Logo Kancha" className={styles["brand-logo"]} /> */}
        <span className={styles["brand-name"]}>Kancha</span>
      </div>

      {/* Navigation */}
      <ul className={styles["nav-menu"]}>
        {contenido.map((item) => (
          <li
            key={item.id}
            className={`${styles["nav-item"]} ${activeItem === item.id ? styles["active"] : ""}`}
            onClick={() => handleClick(item)}
          >
            <span className={styles["nav-icon"]}>{item.icon}</span>
            <span className={styles["nav-label"]}>{item.label}</span>
          </li>
        ))}
      </ul>

      <div className={styles["clock-card"]} aria-label="Hora actual">
        <span className={styles["clock-icon"]}>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
        </span>
        <div>
          <span className={styles["clock-label"]}>Hora actual</span>
          <span className={styles["clock-time"]}>{formattedTime}</span>
        </div>
      </div>
    </div>
  );
};

export default NavbarVertical;
