import styles from "./top-bar.module.css";
import { useState, useRef, useEffect } from "react";
import NotificationsDropdown from "../notifications-dropdown";

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
  onMenuClick,
  onOpenProfile,
  onOpenSettings,
  onLogout,
  unreadCount = 3,
  notifications = [],
  userName,    // ← USA EL PROP
  userRole,    // ← USA EL PROP
  initials,
}) => {


  const [activeMenu, setActiveMenu] = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

 // REEMPLAZA CON:
  const displayName     = userName  || "Administrador";
  const displayRole     = userRole  || "Admin";
  const displayInitials = initials  || "A";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target) && 
          profileRef.current && !profileRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const runProfileAction = (event, callback) => {
    event.stopPropagation();
    callback?.();
    setActiveMenu(null);
  };

  return (
    <div className={styles["topbar"]}>
      <button className={styles["topbar-menu-btn"]} onClick={onMenuClick}>
        <MenuIcon />
      </button>

      <div className={`${styles["search-container"]} ${searchFocused ? styles["search-container--focused"] : ""}`}>
        <span className={styles["search-icon"]}><SearchIcon /></span>
        <input
          type="text"
          placeholder="Buscar..."
          className={styles["search-input"]}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </div>

      <div className={styles["topbar-right"]}>
        <div className={styles["menu-wrapper"]} ref={notifRef}>
          <button className={styles["icon-btn"]} onClick={() => setActiveMenu(activeMenu === "notif" ? null : "notif")}>
            <BellIcon />
            {unreadCount > 0 && <span className={styles["notif-badge"]}>{unreadCount}</span>}
          </button>
          {activeMenu === "notif" && <NotificationsDropdown notifications={notifications} />}
        </div>

        <span className={styles["topbar-divider"]} />

        <div className={styles["menu-wrapper"]} ref={profileRef}>
          <button 
            className={`${styles["topbar-profile-btn"]} ${activeMenu === "profile" ? styles["topbar-profile-btn--active"] : ""}`}
            onClick={() => setActiveMenu(activeMenu === "profile" ? null : "profile")}
          >
            <span className={styles["avatar"]}>{displayInitials}</span>
            <span className={styles["topbar-user-info"]}>
              <span className={styles["topbar-user-name"]}>{displayName}</span>
              <span className={styles["topbar-user-role"]}>{displayRole}</span>
            </span>
          </button>

          {activeMenu === "profile" && (
            <div className={styles["profile-dropdown"]}>
              <div className={styles["profile-dropdown-header"]}>
                <div className={styles["profile-dropdown-avatar"]}>{displayInitials}</div>
                <div>
                  <p className={styles["profile-dropdown-name"]}>{displayName}</p>
                  <p className={styles["profile-dropdown-role"]}>{displayRole}</p>
                </div>
              </div>
              <div className={styles["profile-dropdown-body"]}>
                <button className={styles["profile-item"]} onClick={(e) => runProfileAction(e, onOpenProfile)}>Mi perfil</button>
                <button className={styles["profile-item"]} onClick={(e) => runProfileAction(e, onOpenSettings)}>Configuración</button>
              </div>
              <div className={styles["profile-dropdown-footer"]}>
                <button className={`${styles["profile-item"]} ${styles["profile-item--danger"]}`} onClick={(e) => runProfileAction(e, onLogout)}>
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