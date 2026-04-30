import "./recepcionist.css";
import { DSANavbarVertical, DSATopBar } from "../../components";
import { useState } from "react";
import Dashboard from "./dashboard/dashboard";
import Customers from "./customers/customers";
import Reservations from "./reservations/reservations";
import Configuration from "./configuration/configuration";

// Datos de ejemplo — luego los reemplazas con tu contexto/API
const USER = {
  name: "Kevin More",
  role: "Recepcionista",
  initials: "KM",
  email: "kevin@kancha.com",
};

const INITIAL_NOTIFS = [
  { id: 1, text: "Nueva reserva: Juan Pérez - 14:00", unread: true },
  { id: 2, text: "Reserva cancelada: María González", unread: true },
  { id: 3, text: "Cliente nuevo registrado: Luis Torres", unread: false },
];

const Recepcionist = () => {
  const NAV_ITEMS = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      id: "reservas",
      label: "Reservas",
      icon: (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      id: "clientes",
      label: "Clientes",
      icon: (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="9" cy="8" r="3" />
          <path d="M3 20c0-4 2.7-6 6-6s6 2 6 6" />
          <path d="M16 6c1.7 0 3 1.3 3 3s-1.3 3-3 3" />
          <path d="M21 20c0-3-1.5-5-5-5" />
        </svg>
      ),
    },
    {
      id: "configuracion",
      label: "Configuración",
      icon: (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
  ];

  const [seccionActiva, setSeccionActiva]   = useState("dashboard");
  const [sidebarOpen, setSidebarOpen]       = useState(false);

  // ── Perfil ──────────────────────────────────────────────
  const [showProfile, setShowProfile]       = useState(false);

  // ── Notificaciones ───────────────────────────────────────
  const [showNotifs, setShowNotifs]         = useState(false);
  const [notifs, setNotifs]                 = useState(INITIAL_NOTIFS);
  const unreadCount                         = notifs.filter(n => n.unread).length;

  const markAllRead = () =>
    setNotifs(prev => prev.map(n => ({ ...n, unread: false })));

  const closeAll = () => {
    setShowProfile(false);
    setShowNotifs(false);
  };

  const toggleProfile = () => {
    setShowNotifs(false);          // cierra notifs si estaba abierto
    setShowProfile(prev => !prev);
  };

  const toggleNotifs = () => {
    setShowProfile(false);         // cierra perfil si estaba abierto
    setShowNotifs(prev => !prev);
  };

  const renderContenido = () => {
    switch (seccionActiva) {
      case "dashboard":    return <Dashboard />;
      case "clientes":     return <Customers />;
      case "reservas":     return <Reservations />;
      case "configuracion":return <Configuration />;
      default:             return <h1>Selecciona algo</h1>;
    }
  };

  return (
    <div className="containerRecepcionist">
      {/* Overlay para sidebar móvil */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "is-open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      <DSANavbarVertical
        contenido={NAV_ITEMS}
        onChange={(id) => {
          setSeccionActiva(id);
          setSidebarOpen(false);
        }}
        isOpen={sidebarOpen}
      />

      <main className="containerContent" onClick={closeAll}>
        <DSATopBar
          onMenuClick={() => setSidebarOpen(true)}
          // ── nuevas props ──
          initials={USER.initials}
          unreadCount={unreadCount}
          onOpenProfile={(e) => { e.stopPropagation(); toggleProfile(); }}
          onOpenNotifs={(e)  => { e.stopPropagation(); toggleNotifs(); }}
        />

        {/* ── Panel de notificaciones ── */}
        {showNotifs && (
          <div className="panel notifPanel" onClick={e => e.stopPropagation()}>
            <div className="panelHeader">
              <span>Notificaciones</span>
              {unreadCount > 0 && (
                <button className="markRead" onClick={markAllRead}>
                  Marcar todas como leídas
                </button>
              )}
            </div>
            <ul className="notifList">
              {notifs.map(n => (
                <li key={n.id} className={`notifItem ${n.unread ? "unread" : ""}`}>
                  {n.unread && <span className="dot" />}
                  {n.text}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Panel de perfil ── */}
        {showProfile && (
          <div className="panel profilePanel" onClick={e => e.stopPropagation()}>
            <div className="profileAvatar">{USER.initials}</div>
            <h3 className="profileName">{USER.name}</h3>
            <p className="profileRole">{USER.role}</p>
            <p className="profileEmail">{USER.email}</p>
            <hr className="profileDivider" />
            <button className="logoutBtn" onClick={() => alert("Cerrar sesión")}>
              Cerrar sesión
            </button>
          </div>
        )}

        <div>{renderContenido()}</div>
      </main>
    </div>
  );
};

export default Recepcionist;