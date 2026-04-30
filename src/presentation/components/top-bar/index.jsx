import "./top-bar.css";

const TopBar = ({ 
  initials = "KM",
  onMenuClick,
  onOpenProfile,   // ← nuevo
  onOpenNotifs,    // ← nuevo
  unreadCount = 0, // ← nuevo
}) => {
  return (
    <div className="topbar">
      <button className="topbar-menu-btn" onClick={onMenuClick} aria-label="Abrir menú">
        <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6"  x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      {/* Search */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar reservas, clientes..."
          className="search-input"
        />
      </div>

      {/* Right */}
      <div className="topbar-right">

        {/* Notificaciones */}
        <button className="icon-btn" onClick={onOpenNotifs} aria-label="Notificaciones">
          <svg viewBox="0 0 24 24">
            <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          {unreadCount > 0 && (
            <span className="notif-badge">{unreadCount}</span>
          )}
        </button>

        {/* Avatar */}
        <button className="avatar" onClick={onOpenProfile} aria-label="Ver perfil">
          {initials}
        </button>

      </div>
    </div>
  );
};

export default TopBar;