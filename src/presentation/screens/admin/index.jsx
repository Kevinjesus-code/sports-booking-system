import styles from "./admin.module.css";
import { DSANavbarVertical, DSATopBar } from "../../components";
import { useState } from "react";
import Dashboard from "./dashboard/dashboard";
// import Courts from "./courts/courts";
import Reports from "./reports/reports";
import Schedules from "./schedules/schedules";
import Users from "./users/users";
import Configuration from "./configuration/configuration";
import { useAuth } from "../../hooks/useAuth";

const Admin = ({ onLogout }) => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    if (onLogout) onLogout();
  };
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
      id: "canchas",
      label: "Canchas",
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
      id: "horarios",
      label: "Horarios",
      icon: (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      ),
    },
    {
      id: "usuarios",
      label: "Usuarios",
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
      id: "reportes",
      label: "Reportes",
      icon: (
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="4" y1="20" x2="20" y2="20" />
          <line x1="8" y1="16" x2="8" y2="12" />
          <line x1="12" y1="16" x2="12" y2="8" />
          <line x1="16" y1="16" x2="16" y2="6" />
        </svg>
      ),
    },
    {
      id: "configuracion",
      label: "Configuración",
      icon: (
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
  ];

  const [seccionActiva, setSeccionActiva] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContenido = () => {
    switch (seccionActiva) {
      case "dashboard":
        return <Dashboard />;
      case "canchas":
        return <Courts />;
      case "horarios":
        return <Schedules />;
      case "usuarios":
        return <Users />;
      case "reportes":
        return <Reports />;
      case "configuracion":
        return <Configuration onBack={() => setSeccionActiva("dashboard")} />;
      default:
        return <h1>Selecciona algo</h1>;
    }
  };

  return (
    <>
      <div className={styles["containerRecepcionist"]}>
        {/* Overlay mobile */}
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

        <main className={styles["containerContent"]}>
          <DSATopBar
            initials="AD"
            userName="Admin Principal"
            userRole="Administrador"
            onMenuClick={() => setSidebarOpen(true)}
            unreadCount={3}
            onLogout={handleLogout}
          />
          <div>{renderContenido()}</div>
        </main>
      </div>
    </>
  );
};

export default Admin;