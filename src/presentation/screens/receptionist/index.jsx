import styles from "./recepcionist.module.css";
import { DSANavbarVertical, DSATopBar } from "../../components";
import { useState } from "react";
import Dashboard from "./dashboard/dashboard";
import Customers from "./customers/customers";
import Reservations from "./reservations/reservations";
import Configuration from "./configuration/configuration";

// Datos de ejemplo — luego los reemplazas con tu contexto/API
const USER = {
  name: "Kevin More Sandoval",
  role: "Recepcionista",
  initials: "KM",
  email: "kevin@kancha.com",
  phone: "+51 987 654 321",
};

const INITIAL_NOTIFS = [
  { id:1, title:"Nueva reserva confirmada", desc:"Juan Pérez · Fútbol 5 · 14:00 – 15:00", time:"Hace 5 minutos",  unread:true,  iconClass:"ni-green", icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { id:2, title:"Reserva cancelada",       desc:"María González · Fútbol 7 · 15:00 – 16:00", time:"Hace 23 minutos", unread:true, iconClass:"ni-red",   icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> },
  { id:3, title:"Nuevo cliente registrado", desc:"Luis Torres se registró en el sistema", time:"Hace 1 hora", unread:false, iconClass:"ni-blue",  icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { id:4, title:"Pago recibido",            desc:"S/ 80.00 · Cancha Fútbol 5 · Carlos Ramos", time:"Hace 2 horas", unread:false, iconClass:"ni-green", icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg> },
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
  const [userData, setUserData]             = useState(USER);
  const [profileForm, setProfileForm]       = useState(USER);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const markAllRead = () =>
    setNotifs(prev => prev.map(n => ({ ...n, unread: false })));

  const closeAll = () => {
    setShowProfile(false);
    setShowNotifs(false);
  };

  const toggleNotifs = () => {
    setShowProfile(false);         // cierra perfil si estaba abierto
    setShowNotifs(prev => !prev);
  };

  const openProfile = () => {
    setProfileForm(userData);
    setIsEditingProfile(false);
    setShowNotifs(false);
    setShowProfile(true);
  };

  const openSettings = () => {
    setShowProfile(false);
    setShowNotifs(false);
    setSeccionActiva("configuracion");
  };

  const updateProfileForm = (field, value) => {
    setProfileForm(prev => ({ ...prev, [field]: value }));
  };

  const saveProfile = () => {
    setUserData(profileForm);
    setIsEditingProfile(false);
  };

  const cancelProfileEdit = () => {
    setProfileForm(userData);
    setIsEditingProfile(false);
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
    <div className={styles["containerRecepcionist"]}>
      {/* Overlay para sidebar móvil */}
      <div
        className={`${styles["sidebar-overlay"]} ${sidebarOpen ? styles["is-open"] : ""}`}
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

      <main className={styles["containerContent"]} onClick={closeAll}>
        <DSATopBar
          onMenuClick={() => setSidebarOpen(true)}
          initials={userData.initials}
          userName={userData.name}      
          userRole={userData.role}      
          unreadCount={unreadCount}
          onOpenProfile={openProfile}
          onOpenSettings={openSettings}
          onLogout={() => alert("Cerrando sesion...")}
          onOpenNotifs={(e)  => { e.stopPropagation(); toggleNotifs(); }}
        />

        {/* ── Panel Notificaciones ── */}
          {showNotifs && (
            <div className={`${styles["panel"]} ${styles["notifPanel"]}`} onClick={e => e.stopPropagation()}>
              <div className={styles["panelHeader"]}>
                <div>
                  <span className={styles["panelTitle"]}>
                    Notificaciones
                    {unreadCount > 0 && <span className={styles["notifBadge"]}>{unreadCount} nuevas</span>}
                  </span>
                  <div className={styles["panelSub"]}>Actividad reciente</div>
                </div>
                <button className={styles["panelClose"]} onClick={() => setShowNotifs(false)}>✕</button>
              </div>

              <div className={styles["notifToolbar"]}>
                <div className={styles["notifTabs"]}>
                  <button className={`${styles["notifTab"]} ${styles["active"]}`}>Todas</button>
                  <button className={styles["notifTab"]}>Sin leer</button>
                </div>
                {unreadCount > 0 && (
                  <button className={styles["markReadBtn"]} onClick={markAllRead}>Marcar todas leídas</button>
                )}
              </div>

              <ul className={styles["notifList"]}>
                {notifs.map(n => (
                  <li key={n.id} className={`${styles["notifItem"]} ${n.unread ? styles["unread"] : ""}`}>
                    <span className={`${styles["notifDot"]} ${n.unread ? "" : styles["read"]}`} />
                    <div className={`${styles["notifIcon"]} ${n.iconClass}`}>
                      {n.icon}
                    </div>
                    <div className={styles["notifBody"]}>
                      <div className={styles["notifItemTitle"]}>{n.title}</div>
                      <div className={styles["notifItemDesc"]}>{n.desc}</div>
                      <div className={styles["notifTime"]}>{n.time}</div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className={styles["notifFooter"]}>
                <button className={styles["viewAllBtn"]}>Ver todas las notificaciones</button>
              </div>
            </div>
          )}

          {/* ── Panel Perfil ── */}
          {showProfile && (
            <div className={`${styles["panel"]} ${styles["profilePanel"]}`} onClick={e => e.stopPropagation()}>
              <div className={styles["panelHeader"]}>
                <div>
                  <div className={styles["panelTitle"]}>Mi perfil</div>
                  <div className={styles["panelSub"]}>Recepcionista · Kancha</div>
                </div>
                <button className={styles["panelClose"]} onClick={() => setShowProfile(false)}>✕</button>
              </div>

              <div className={styles["profileHero"]}>
                <div className={styles["profileAvatarWrap"]}>
                  <div className={styles["profileAvatar"]}>{userData.initials}</div>
                  <div className={styles["profileStatusDot"]} />
                </div>
                <div style={{textAlign:"center"}}>
                  <div className={styles["profileName"]}>{userData.name}</div>
                  <div className={styles["profileEmail"]}>{userData.email}</div>
                  <div className={styles["profileBadge"]}>En línea</div>
                </div>
              </div>

              {isEditingProfile && (
                <div className={styles["profileEditForm"]}>
                  <label>
                    Nombre completo
                    <input
                      value={profileForm.name}
                      onChange={(e) => updateProfileForm("name", e.target.value)}
                    />
                  </label>
                  <label>
                    Correo
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => updateProfileForm("email", e.target.value)}
                    />
                  </label>
                  <label>
                    Telefono
                    <input
                      value={profileForm.phone}
                      onChange={(e) => updateProfileForm("phone", e.target.value)}
                    />
                  </label>
                  <div className={styles["profileEditActions"]}>
                    <button className={styles["profileSaveBtn"]} onClick={saveProfile}>Guardar</button>
                    <button className={styles["profileCancelBtn"]} onClick={cancelProfileEdit}>Cancelar</button>
                  </div>
                </div>
              )}

              <div className={styles["profileInfoList"]}>
                <div className={styles["profileInfoRow"]}>
                  <div className={styles["profileInfoIcon"]}>
                    <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <div>
                    <div className={styles["profileInfoLabel"]}>Nombre completo</div>
                    <div className={styles["profileInfoValue"]}>{userData.name}</div>
                  </div>
                </div>
                <div className={styles["profileInfoRow"]}>
                  <div className={styles["profileInfoIcon"]}>
                    <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.39 18 19.5 19.5 0 0 1 8 14.61 19.79 19.79 0 0 1 4.12 6.18 2 2 0 0 1 6.1 4h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L10.09 11a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 24 18z"/></svg>
                  </div>
                  <div>
                    <div className={styles["profileInfoLabel"]}>Teléfono</div>
                    <div className={styles["profileInfoValue"]}>{userData.phone}</div>
                  </div>
                </div>
                <div className={styles["profileInfoRow"]}>
                  <div className={styles["profileInfoIcon"]}>
                    <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <div>
                    <div className={styles["profileInfoLabel"]}>Rol</div>
                    <div className={styles["profileInfoValue"]}>{userData.role}</div>
                  </div>
                </div>
              </div>

              <div className={styles["profileActions"]}>
                <button className={styles["profileBtn"]} onClick={() => setIsEditingProfile(true)}>
                  <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Editar perfil
                </button>
                <button className={styles["profileBtn"]} onClick={openSettings}>
                  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                  Configuración
                </button>
                <button className={`${styles["profileBtn"]} ${styles["logout"]}`} onClick={() => alert("Cerrando sesión...")}>
                  <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        <div>{renderContenido()}</div>
      </main>
    </div>
  );
};

export default Recepcionist;
