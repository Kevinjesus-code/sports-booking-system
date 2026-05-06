import { DSANavbarClient } from "../../components";
import Courts from "./courts/courts";
import Schedules from "./schedules/schedules";
import ConfirmReserve from "./confirm-reserve/confirm-reserve";
import Resumen from "./resumen/resumen";
import ReservationsModal from "../../components/reservations-modal";
import ProfileModal from "../../components/profile-modal"; // ← NUEVO
import styles from "./client.module.css";
import { useState } from "react";

// Datos del cliente (más adelante vendrían de una API/auth)
const CLIENT_DATA = {
  nombre: "Juan Pérez",
  email: "juan.perez@email.com",
  telefono: "912 123 123",
  initials: "JP",
  documento: "DNI",
  numeroDocumento: "12345678",
  metodoPago: "Yape",
  direccion: "Lima, Perú",
};

const Client = () => {
  const [selectedCourt, setSelectedCourt]       = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedDate, setSelectedDate]         = useState(null);
  const [isReserved, setIsReserved]             = useState(false);
  const [customerData, setCustomerData]         = useState(null);
  const [reservations, setReservations]         = useState([]);
  const [showModal, setShowModal]               = useState(false);
  const [showProfile, setShowProfile]           = useState(false); // ← NUEVO

  // ── Vuelve al estado inicial ──────────────────────
  const handleHome = () => {
    setSelectedCourt(null);
    setSelectedSchedule(null);
    setSelectedDate(null);
    setIsReserved(false);
    setCustomerData(null);
  };

  const handleSelectSchedule = (schedule, date) => {
    setSelectedSchedule(schedule);
    setSelectedDate(date);
  };

  const handleBackToSchedules = () => setSelectedSchedule(null);

  const handleBackToCourts = () => {
    setSelectedCourt(null);
    setSelectedSchedule(null);
    setSelectedDate(null);
  };

  const handleConfirmReservation = (data) => {
    setCustomerData(data);
    setIsReserved(true);
    setReservations(prev => [...prev, {
      id: Date.now(),
      court: selectedCourt,
      schedule: selectedSchedule,
      date: selectedDate,
      customer: data,
    }]);
  };

  const handleNewReservation = () => {
    setIsReserved(false);
    setSelectedCourt(null);
    setSelectedSchedule(null);
    setSelectedDate(null);
    setCustomerData(null);
  };

  return (
    <>
      <DSANavbarClient
        initials={CLIENT_DATA.initials}
        onHome={handleHome} // ← NUEVO
        onOpenReservations={() => setShowModal(true)}
        reservationCount={reservations.length}
        onOpenProfile={() => setShowProfile(true)} // ← NUEVO
      />
      
      <div className={styles.container}>
        {isReserved ? (
          <Resumen
            court={selectedCourt}
            schedule={selectedSchedule}
            date={selectedDate}
            customerData={customerData}
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
          <Courts onSelectCourt={setSelectedCourt} />
        )}
      </div>

      {showModal && (
        <ReservationsModal
          reservations={reservations}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* ── NUEVO ── */}
      {showProfile && (
        <ProfileModal
          client={CLIENT_DATA}
          reservationCount={reservations.length}
          onClose={() => setShowProfile(false)}
        />
      )}
    </>
  );
};

export default Client;