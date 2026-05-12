import styles from "./top-bar.module.css";
import { useState, useRef, useEffect } from "react";
import NotificationsDropdown from "../notifications-dropdown";
// import { useNavigate } from "react-router-dom";

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.25"
    strokeLinecap="round" stroke="rgba(255,255,255,0.92)" width="20" height="20">
    <line x1="3" y1="6"  x2="21" y2="6"/>
    <line x1="3" y1="12" x2="16" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.92)"
    strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
);

const TopBar = ({
  initials      = "KM",
  userName      = "Kevin More Sandoval",
  userRole      = "Administrador",
  onMenuClick,
  unreadCount   = 3,
  notifications = [
    { id: 1, text: "Nueva reserva registrada",  sub: "Cancha 3 · Hoy 10:00",      unread: true  },
    { id: 2, text: "Pago confirmado",            sub: "S/ 80.00 de Luis Torres",   unread: true  },
    { id: 3, text: "Cancha disponible mañana",   sub: "Cancha 1 · 08:00–10:00",   unread: true  },
    { id: 4, text: "Reserva cancelada",          sub: "Cancha 2 · Hoy 15:00",      unread: false },
  ],
}) => {
  const [activeMenu,    setActiveMenu]    = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const notifRef   = useRef(null);
  const profileRef = useRef(null);
  // const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      const insideNotif   = notifRef.current   && notifRef.current.contains(e.target);
      const insideProfile = profileRef.current && profileRef.current.contains(e.target);
      if (!insideNotif && !insideProfile) setActiveMenu(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (menu) =>
    setActiveMenu((prev) => (prev === menu ? null : menu));

  return (
    <div className={styles["topbar"]}>

      {/* Hamburger */}
      <button className={styles["topbar-menu-btn"]} onClick={onMenuClick} aria-label="Menú">
        <MenuIcon />
      </button>

      {/* Search */}
      <div className={`${styles["search-container"]} ${searchFocused ? styles["search-container--focused"] : ""}`}>
        <span className={styles["search-icon"]}><SearchIcon /></span>
        <input
          type="text"
          placeholder="Buscar reservas, clientes..."
          className={styles["search-input"]}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </div>

      {/* Right */}
      <div className={styles["topbar-right"]}>

        {/* Notificaciones */}
        <div className={styles["menu-wrapper"]} ref={notifRef}>
          <button
            className={`${styles["icon-btn"]} ${activeMenu === "notif" ? styles["icon-btn--active"] : ""}`}
            onClick={() => toggleMenu("notif")}
            aria-label="Notificaciones"
          >
            <BellIcon />
            {unreadCount > 0 && (
              <span className={styles["notif-badge"]}>{unreadCount > 9 ? "9+" : unreadCount}</span>
            )}
          </button>

          {activeMenu === "notif" && (
            <NotificationsDropdown
              notifications={notifications}
              onItemClick={(item) => {
                console.log("Click en:", item);
                // navigate("/reservas");
                setActiveMenu(null);
              }}
            />
          )}
        </div>

        <span className={styles["topbar-divider"]} />

        {/* Perfil */}
        <div className={styles["menu-wrapper"]} ref={profileRef}>
          <button
            className={`${styles["topbar-profile-btn"]} ${activeMenu === "profile" ? styles["topbar-profile-btn--active"] : ""}`}
            onClick={() => toggleMenu("profile")}
            aria-label="Perfil de usuario"
          >
            <span className={styles["avatar"]}>{initials}</span>
            <span className={styles["topbar-user-info"]}>
              <span className={styles["topbar-user-name"]}>{userName}</span>
              <span className={styles["topbar-user-role"]}>{userRole}</span>
            </span>
            <svg
              className={`${styles["topbar-chevron"]} ${activeMenu === "profile" ? styles["topbar-chevron--open"] : ""}`}
              viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              width="12" height="12">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {activeMenu === "profile" && (
            <div className={styles["profile-dropdown"]}>
              <div className={styles["profile-dropdown-header"]}>
                <div className={styles["profile-dropdown-avatar"]}>{initials}</div>
                <div>
                  <p className={styles["profile-dropdown-name"]}>{userName}</p>
                  <p className={styles["profile-dropdown-role"]}>{userRole}</p>
                </div>
              </div>

              <div className={styles["profile-dropdown-body"]}>
                <button className={styles["profile-item"]} onClick={() => {
                  // navigate("/perfil");
                  setActiveMenu(null);
                }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
                    strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  Mi perfil
                </button>

                <button className={styles["profile-item"]} onClick={() => {
                  // navigate("/configuracion");
                  setActiveMenu(null);
                }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
                    strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                  Configuración
                </button>
              </div>

              <div className={styles["profile-dropdown-footer"]}>
                <button className={`${styles["profile-item"]} ${styles["profile-item--danger"]}`} onClick={() => {
                  console.log("Cerrar sesión");
                  setActiveMenu(null);
                }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
                    strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default TopBar;