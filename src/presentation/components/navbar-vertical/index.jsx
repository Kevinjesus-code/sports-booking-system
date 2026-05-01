import { useState } from "react";
import styles from "./navbar-vertical.module.css";
// import logo from "../../../assets/Logo.png";

const NavbarVertical = ({ contenido = [], onChange, isOpen }) => {
  const [activeItem, setActiveItem] = useState("dashboard");

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
    </div>
  );
};

export default NavbarVertical;