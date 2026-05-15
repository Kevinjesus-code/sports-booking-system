import { useMemo, useState } from "react";
import { ProfileHeader, ProfileDisplay, ProfileForm } from "./components";
import { useProfileData } from "./hooks/useProfileData";
import { DSAButton } from "../../../components";
import { useMyReservations, useCancelReservation } from "../../../hooks/useReservations";
import styles from "./profile.module.css";
import client from "../../../../infrastructure/api/client";

const getReservationKey = (reservation) =>
  String(
    reservation.codigo ??
      reservation.id ??
      `${reservation.courtId ?? reservation.canchaId}-${reservation.fecha ?? reservation.date}-${reservation.startTime ?? reservation.horaInicio}`
  );

const formatDate = (value) => {
  if (!value) return "Sin fecha";
  return new Date(`${String(value).slice(0, 10)}T00:00:00`).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getReservationTime = (reservation) =>
  reservation.hora ??
  `${reservation.startTime ?? reservation.horaInicio ?? "--:--"} - ${reservation.endTime ?? reservation.horaFin ?? "--:--"}`;

const getReservationAmount = (reservation) =>
  reservation.totalPrice ??
  reservation.totalAmount ??
  reservation.precio ??
  reservation.price ??
  0;

const etiquetaEstado = (estado) => {
  const e = String(estado ?? "pendiente").toLowerCase();
  const map = {
    pendiente: "Pendiente",
    confirmada: "Confirmada",
    en_curso: "En curso",
    finalizada: "Finalizada",
    cancelada: "Cancelada",
    no_asistio: "No asistió",
  };
  return map[e] ?? e;
};

const Profile = ({ onBack }) => {
  const {
    profileData,
    editableData,
    handleEditableDataChange,
    handleSaveChanges,
    resetEditableData,
    errors,
    loading,
    fetchError,
  } = useProfileData();

  const {
    reservations: reservationHistory,
    loading: reservationsLoading,
    error: reservationsError,
    refetch: refetchReservations,
  } = useMyReservations();
  const { cancel: cancelReservation, loading: cancelLoading } = useCancelReservation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("account");

  const sortedReservations = useMemo(() => {
    return [...(reservationHistory ?? [])].sort((a, b) => {
      const dateA = `${a.fecha ?? a.date ?? ""} ${a.startTime ?? a.horaInicio ?? ""}`;
      const dateB = `${b.fecha ?? b.date ?? ""} ${b.startTime ?? b.horaInicio ?? ""}`;
      return dateB.localeCompare(dateA);
    });
  }, [reservationHistory]);

  if (loading) return <div style={{ padding: "2rem" }}>Cargando perfil...</div>;
  if (fetchError) return <div style={{ padding: "2rem", color: "red" }}>{fetchError}</div>;

  const navItems = [
    { id: "account", label: "Mi cuenta", icon: "user" },
    { id: "reservations", label: "Mis reservas", icon: "calendar" },
    { id: "payments", label: "Pagos", icon: "card" },
  ];

  const renderIcon = (icon) => {
    const paths = {
      user: (
        <>
          <path d="M20 21a8 8 0 0 0-16 0" />
          <circle cx="12" cy="7" r="4" />
        </>
      ),
      calendar: (
        <>
          <path d="M8 2v4" />
          <path d="M16 2v4" />
          <rect width="18" height="18" x="3" y="4" rx="2" />
          <path d="M3 10h18" />
        </>
      ),
      card: (
        <>
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <path d="M2 10h20" />
        </>
      ),
    };
    return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[icon]}</svg>;
  };

  const handleSave = async () => {
    const ok = await handleSaveChanges();
    if (ok) setActiveSection("account");
  };

  const handleCancel = () => {
    resetEditableData();
    setActiveSection("account");
  };

  const openSection = (section) => {
    resetEditableData();
    setActiveSection(section);
    setIsMobileMenuOpen(false);
  };

  const handleCambiarEmail = async (emailActual, emailNuevo, password) => {
    try {
      const { data } = await client.put("/perfil/email", {
        emailActual,
        emailNuevo,
        password,
      });

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      return true;
    } catch (error) {
      const mensaje = error.response?.data?.error || "Error al cambiar el correo";
      alert(mensaje);
      return false;
    }
  };

  const handleCambiarPassword = async (passwordActual, passwordNuevo, passwordConfirm) => {
    try {
      await client.put("/perfil/password", {
        passwordActual,
        passwordNuevo,
        passwordConfirm,
      });

      return true;
    } catch (error) {
      const mensaje = error.response?.data?.error || "Error al cambiar la contraseña";
      alert(mensaje);
      return false;
    }
  };

  const handleCancelarReserva = async (reservation) => {
    if (!reservation?.id) return;
    if (!reservation.puedeCancelar) {
      alert("Esta reserva ya no puede cancelarse (mínimo 2 horas antes del inicio).");
      return;
    }
    if (!window.confirm("¿Seguro que deseas cancelar esta reserva?")) return;
    try {
      await cancelReservation(reservation.id);
      await refetchReservations();
    } catch (err) {
      alert(err.response?.data?.error ?? err.message ?? "No se pudo cancelar la reserva");
    }
  };

  return (
    <div className={styles["profile-screen"]}>
      <div className={styles["profile-container"]}>
        <div className={styles["back-button-wrapper"]}>
          {onBack && (
            <DSAButton variant="outline" color="primary" onClick={onBack}>
              Volver
            </DSAButton>
          )}
        </div>

        <div className={styles["profile-layout"]}>
          <button
            type="button"
            className={styles["menu-toggle"]}
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="profile-sidebar"
          >
            <span className={styles["hamburger-icon"]} aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </span>
            <span>Menu lateral</span>
          </button>

          {isMobileMenuOpen && (
            <button
              type="button"
              className={styles["sidebar-overlay"]}
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Cerrar menu lateral"
            />
          )}

          <aside
            id="profile-sidebar"
            className={`${styles["profile-sidebar"]} ${
              isMobileMenuOpen ? styles["profile-sidebar-open"] : ""
            }`}
          >
            <ProfileHeader
              userName={
                profileData?.nombre
                  ? `${profileData.nombre} ${profileData.apellido}`
                  : "Usuario"
              }
              isEditing={activeSection !== "account"}
              onEditToggle={() => openSection("profile")}
            />

            <nav
              id="profile-menu"
              className={styles["profile-menu"]}
              aria-label="Opciones de perfil"
            >
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles["menu-item"]} ${
                    activeSection === item.id ? styles["menu-item-active"] : ""
                  }`}
                  onClick={() => openSection(item.id)}
                >
                  <span className={styles["menu-icon"]}>{renderIcon(item.icon)}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          <main className={styles["profile-content"]}>
            <div className={styles["content-heading"]}>
              <p>Perfil de usuario</p>
              <h1>
                {activeSection === "payments"
                  ? "Pagos"
                  : activeSection === "reservations"
                    ? "Mis reservas"
                    : "Mi cuenta"}
              </h1>
            </div>

            {activeSection === "account" ? (
              <ProfileDisplay
                data={profileData}
                onChangeEmail={() => openSection("email")}
                onChangePassword={() => openSection("password")}
              />
            ) : activeSection === "payments" ? (
              <div className={styles["payments-panel"]}>
                <h2>Metodos de pago</h2>
                <p>Configura como quieres pagar tus reservas.</p>
                <div className={styles["payment-grid"]}>
                  <label>
                    Metodo principal
                    <select defaultValue="Yape">
                      <option>Yape</option>
                      <option>Plin</option>
                      <option>Tarjeta</option>
                      <option>Efectivo</option>
                      <option>Transferencia</option>
                    </select>
                  </label>
                  <label>
                    Tarjeta guardada
                    <input placeholder="**** **** **** 1234" />
                  </label>
                </div>
                <button type="button" className={styles["primary-action"]}>
                  Guardar metodo de pago
                </button>
              </div>
            ) : activeSection === "reservations" ? (
              <div className={styles["reservations-panel"]}>
                <h2>Mis reservas</h2>
                <p>Historial según tu cuenta autenticada (servidor).</p>

                {reservationsLoading && (
                  <div className={styles["history-message"]}>Cargando reservas...</div>
                )}

                {reservationsError && (
                  <div className={styles["history-error"]}>{reservationsError}</div>
                )}

                {!reservationsLoading && sortedReservations.length === 0 && (
                  <div className={styles["history-empty"]}>
                    Aun no tienes reservas registradas.
                  </div>
                )}

                {!reservationsLoading && sortedReservations.length > 0 && (
                  <div className={styles["reservation-list"]}>
                    {sortedReservations.map((reservation) => {
                      const amount = getReservationAmount(reservation);
                      const status = String(reservation.estado ?? reservation.status ?? "pendiente").toLowerCase();

                      return (
                        <article
                          key={getReservationKey(reservation)}
                          className={styles["reservation-card"]}
                        >
                          <div className={styles["reservation-main"]}>
                            <h3>
                              {reservation.cancha ??
                                reservation.courtName ??
                                reservation.court?.nombre ??
                                "Cancha"}
                            </h3>
                            <span
                              className={`${styles["reservation-status"]} ${styles[`status-${status}`] ?? ""}`}
                            >
                              {etiquetaEstado(status)}
                            </span>
                          </div>
                          <div className={styles["reservation-meta"]}>
                            <span>{formatDate(reservation.fecha ?? reservation.date)}</span>
                            <span>{getReservationTime(reservation)}</span>
                            <span>{amount > 0 ? `S/ ${Number(amount).toFixed(2)}` : "Sin monto"}</span>
                          </div>
                          <div className={styles["reservation-extra"]}>
                            <span>
                              <strong>Código:</strong> {reservation.codigo ?? "—"}
                            </span>
                            <span>
                              <strong>Pago:</strong> {reservation.metodoPago || "—"}
                            </span>
                          </div>
                          {status !== "cancelada" && status !== "finalizada" && (
                            <div className={styles["reservation-actions"]}>
                              <button
                                type="button"
                                className={
                                  reservation.puedeCancelar
                                    ? styles["cancel-btn"]
                                    : styles["cancel-btn-disabled"]
                                }
                                disabled={!reservation.puedeCancelar || cancelLoading}
                                onClick={() => handleCancelarReserva(reservation)}
                              >
                                {reservation.puedeCancelar
                                  ? "Cancelar reserva"
                                  : "Cancelación no disponible (< 2 h)"}
                              </button>
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <ProfileForm
                mode={activeSection}
                editableData={editableData}
                onEditableDataChange={handleEditableDataChange}
                onSaveChanges={handleSave}
                onCancel={handleCancel}
                errors={errors}
                onCambiarEmail={handleCambiarEmail}
                onCambiarPassword={handleCambiarPassword}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
