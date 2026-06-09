import { useState } from "react";

import { useAuth } from "../../hooks/useAuth";

import { DSANavbarClient } from "../../components";
import ReservationsModal from "../../components/reservations-modal";

import Courts from "./courts/courts";
import Schedules from "./schedules/schedules";
import ConfirmReserve from "./confirm-reserve/confirm-reserve";
import Resumen from "./resumen/resumen";
import Profile from "./profile/profile";
import Configuration from "./configuration/configuration";
import Dashboard from "./dashboard/dashboard";

import styles from "./client.module.css";

const Client = ({ onLogout }) => {
  const { user, logout } = useAuth();

  // =========================
  // USER DATA
  // =========================
  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem("user")); }
    catch { return null; }
  })();

  const activeUser = user ?? storedUser;

  const nombre   = activeUser?.nombre   || activeUser?.nombres   || "";
  const apellido = activeUser?.apellido || activeUser?.apellidos || "";

  const initials = ((nombre[0] ?? "U") + (apellido[0] ?? "")).toUpperCase();
  const fullName = `${nombre} ${apellido}`.trim();

  // =========================
  // STATES
  // =========================
  const [selectedCourt,    setSelectedCourt]    = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedDate,     setSelectedDate]     = useState(null);

  const [isReserved,   setIsReserved]   = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [showModal,    setShowModal]    = useState(false);

  const [isViewingProfile,  setIsViewingProfile]  = useState(false);
  const [isViewingSettings, setIsViewingSettings] = useState(false);

  // =========================
  // NAVIGATION HANDLERS
  // =========================
  const handleHome = () => {
    setSelectedCourt(null);
    setSelectedSchedule(null);
    setSelectedDate(null);
    setIsReserved(false);
    setCustomerData(null);
    setIsViewingProfile(false);
    setIsViewingSettings(false);
  };

  const handleOpenProfile = () => {
    setIsViewingProfile(true);
    setIsViewingSettings(false);
  };

  const handleOpenSettings = () => {
    setIsViewingSettings(true);
    setIsViewingProfile(false);
  };

  const handleBackToClient = () => {
    setIsViewingProfile(false);
    setIsViewingSettings(false);
  };

  // =========================
  // RESERVATION FLOW
  // =========================
  const handleSelectSchedule = (schedule, date) => {
    setSelectedSchedule(schedule);
    setSelectedDate(date);
  };

  const handleBackToSchedules = () => {
    setSelectedSchedule(null);
  };

  const handleBackToCourts = () => {
    setSelectedCourt(null);
    setSelectedSchedule(null);
    setSelectedDate(null);
  };

  const handleConfirmReservation = (reservationFromApi) => {
    const fullReservation = {
      ...reservationFromApi,
      courtName:
        selectedCourt?.titulo ||
        selectedCourt?.nombre ||
        selectedCourt?.name,
      courtIcon:   selectedCourt?.icono ?? "⚽",
      startTime:   selectedSchedule?.startTime,
      endTime:     selectedSchedule?.endTime,
      date:        selectedDate,
      totalAmount:
        reservationFromApi?.totalAmount ??
        reservationFromApi?.montoTotal  ??
        selectedSchedule?.price         ??
        0,
    };

    setCustomerData(fullReservation);
    setIsReserved(true);

    setReservations((prev) => [
      ...prev,
      {
        id:            reservationFromApi?.id || Date.now(),
        estado:        reservationFromApi?.estado        ?? "pendiente",
        fecha:         selectedDate,
        horaInicio:    selectedSchedule?.startTime,
        horaFin:       selectedSchedule?.endTime,
        court:         selectedCourt,
        schedule:      selectedSchedule,
        date:          selectedDate,
        precio:
          reservationFromApi?.totalAmount ??
          reservationFromApi?.montoTotal  ??
          selectedSchedule?.price,
        clienteNombre: reservationFromApi?.clienteNombre,
        puedeCancelar: reservationFromApi?.puedeCancelar ?? true,
      },
    ]);
  };

  const handleNewReservation = () => {
    setIsReserved(false);
    setSelectedCourt(null);
    setSelectedSchedule(null);
    setSelectedDate(null);
    setCustomerData(null);
  };

  // =========================
  // AUTH
  // =========================
  const handleLogout = async () => {
    await logout();
    onLogout();
  };

  // =========================
  // RENDER
  // =========================
  return (
    <>
      {isViewingProfile ? (
        <Profile onBack={handleBackToClient} />
      ) : isViewingSettings ? (
        <Configuration onBack={handleBackToClient} />
      ) : (
        <>
          <DSANavbarClient
            initials={initials}
            userName={fullName || "Usuario"}
            userRole="Cliente"
            onHome={handleHome}
            onOpenReservations={() => setShowModal(true)}
            reservationCount={reservations.length}
            onOpenProfile={handleOpenProfile}
            onOpenSettings={handleOpenSettings}
            onLogout={handleLogout}
          />

          <div className={styles.container}>
            {isReserved ? (
              <Resumen
                reservation={customerData}
                onNewReservation={handleNewReservation}
                onViewReservations={() => setShowModal(true)}
              />
            ) : selectedSchedule ? (
              <ConfirmReserve
                court={selectedCourt}
                schedule={selectedSchedule}
                date={selectedDate}
                onBack={handleBackToSchedules}
                onConfirm={handleConfirmReservation}
              />
            ) : selectedCourt ? (
              <Schedules
                court={selectedCourt}
                onBack={handleBackToCourts}
                onSelectSchedule={handleSelectSchedule}
              />
            ) : (
              <Dashboard
                userName={fullName || "Usuario"}
                onSelectCourt={setSelectedCourt}
              />
            )}
          </div>

          {showModal && (
            <ReservationsModal
              reservations={reservations}
              onClose={() => setShowModal(false)}
              onCancelled={(id) =>
                setReservations((prev) => prev.filter((r) => r.id !== id))
              }
            />
          )}
        </>
      )}
    </>
  );
};

export default Client;