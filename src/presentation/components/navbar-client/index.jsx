// src/presentation/components/navbar-client/index.jsx
import { useEffect, useRef, useState } from "react";
import styles from "./navbar.module.css";
import { useMyReservations } from "../../hooks/useReservations";
import ReservationsModal from "../reservations-modal";

// ── Iconos ────────────────────────────────────────────────────────────────────
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

// ── Componente principal ──────────────────────────────────────────────────────
const Navbar = ({
  onHome,
  onOpenProfile,
  onOpenSettings,
  onLogout,
  userName,
  userRole,
  initials,
}) => {
  const [isProfileOpen,         setIsProfileOpen]         = useState(false);
  const [showReservationsModal, setShowReservationsModal] = useState(false);
  const profileRef = useRef(null);

  const displayName     = userName  || "Usuario";
  const displayRole     = userRole  || "Cliente";
  const displayInitials = initials  || "U";

  // ✅ Historial real + cancelar + limpiar historial
  const {
    reservations,
    refetch: refetchReservations,
    cancelAndRefresh,
    clearHistoryAndRefresh,
  } = useMyReservations(null, null);

  // ✅ Badge: solo reservas activas (confirmada o pendiente)
  const activeCount = reservations.filter((r) =>
    ["confirmada", "pendiente"].includes(
      String(r.estado ?? r.status ?? "").toLowerCase()
    )
  ).length;

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Abrir modal → recarga datos frescos del servidor antes de mostrar
  const handleOpenReservations = () => {
    refetchReservations();
    setShowReservationsModal(true);
  };

  // ✅ Tras cancelar → recarga automática desde backend
  const handleCancelled = async (reservaId) => {
    await cancelAndRefresh(reservaId);
  };

  // ✅ Limpiar historial → recarga automática desde backend
  const handleClearHistory = async () => {
    await clearHistoryAndRefresh();
  };

  const handleProfileAction = (callback) => {
    callback?.();
    setIsProfileOpen(false);
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.left} onClick={onHome}>
          <img src="/assets/img/Logo.JPG" alt="Logo Kancha" className={styles.logo} />
          <span className={styles.brand}>Kancha</span>
        </div>

        <div className={styles.right}>
          {/* ── Botón campana / reservas ── */}
          <button className={styles.iconBtn} onClick={handleOpenReservations}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            {activeCount > 0 && (
              <span className={styles.badge}>{activeCount}</span>
            )}
          </button>

          {/* ── Perfil dropdown ── */}
          <div className={styles.profileWrapper} ref={profileRef}>
            <button
              className={`${styles.profileButton} ${isProfileOpen ? styles.profileButtonActive : ""}`}
              onClick={() => setIsProfileOpen((prev) => !prev)}
            >
              <span className={styles.avatar}>{displayInitials}</span>
              <span className={styles.profileText}>
                <span className={styles.profileName}>{displayName}</span>
                <span className={styles.profileRole}>{displayRole}</span>
              </span>
            </button>

            {isProfileOpen && (
              <div className={styles.profileDropdown}>
                <div className={styles.dropdownHeader}>
                  <div className={styles.dropdownAvatar}>{displayInitials}</div>
                  <div>
                    <p className={styles.dropdownName}>{displayName}</p>
                    <p className={styles.dropdownRole}>{displayRole}</p>
                  </div>
                </div>
                <div className={styles.dropdownBody}>
                  <button
                    className={styles.dropdownItem}
                    onClick={() => handleProfileAction(onOpenProfile)}
                  >
                    <UserIcon /> Mi perfil
                  </button>
                  <button
                    className={styles.dropdownItem}
                    onClick={() => handleProfileAction(onOpenSettings)}
                  >
                    <SettingsIcon /> Configuración
                  </button>
                </div>
                <div className={styles.dropdownFooter}>
                  <button
                    className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                    onClick={() => handleProfileAction(onLogout)}
                  >
                    <LogoutIcon /> Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ✅ Modal con cancelar + limpiar historial */}
      {showReservationsModal && (
        <ReservationsModal
          reservations={reservations}
          onClose={() => setShowReservationsModal(false)}
          onCancelled={handleCancelled}
          onClearHistory={handleClearHistory}
        />
      )}
    </>
  );
};

export default Navbar;