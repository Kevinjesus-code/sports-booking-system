import styles from "./recepcionist.module.css";
import { DSANavbarVertical, DSATopBar } from "../../components";
import { useState } from "react";
import Dashboard from "./dashboard/dashboard";
import Customers from "./customers/customers";
import Reservations from "./reservations/reservations";
import Configuration from "./configuration/configuration";

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
  const [seccionActiva, setSeccionActiva] = useState("dashboard");
  const renderContenido = () => {
    switch (seccionActiva) {
      case "dashboard":
        return <Dashboard />;

      case "clientes":
        return <Customers />;

      case "reservas":
        return <Reservations />;

      case "configuracion":
        return <Configuration />;

      default:
        return <h1>Selecciona algo</h1>;
    }
  };

  return (
    <>
         <div className={styles.containerRecepcionist}>
          <DSANavbarVertical contenido={NAV_ITEMS} onChange={setSeccionActiva} />
        <main className={styles.containerContent}>
          <DSATopBar />
          <div>
            {renderContenido()}
          </div>
        </main>
      </div>
    </>
  );
};
export default Recepcionist;
