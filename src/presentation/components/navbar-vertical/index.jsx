import { useState } from "react";
import "./navbar-vertical.css";
import logo from "../../../assets/Logo.png";

const NavbarVertical = ({ contenido = [], onChange, isOpen }) => {
  const [activeItem, setActiveItem] = useState("dashboard");

  const handleClick = (item) => {
    setActiveItem(item.id);
    onChange?.(item.id);
  };

  return (
    <div className={`navbar-container ${isOpen ? "is-open" : ""}`}>
      {/* Header / Logo */}
      <div className="header">
        <img src={logo} alt="Logo Kancha" className="brand-logo" />
        <span className="brand-name">Kancha</span>
      </div>

      {/* Navigation */}
      <ul className="nav-menu">
        {contenido.map((item) => (
          <li
            key={item.id}
            className={`nav-item ${activeItem === item.id ? "active" : ""}`}
            onClick={() => handleClick(item)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NavbarVertical;