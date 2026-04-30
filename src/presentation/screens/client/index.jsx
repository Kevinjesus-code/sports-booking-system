import { DSANavbarClient } from "../../components";
import Courts from "./courts/courts";
import Schedules from "./schedules/schedules";
import ConfirmReserve from "./confirm-reserve/confirm-reserve";
import Resumen from "./resumen/resumen";
import ReservationsModal from "../../components/reservations-modal"; // ← NUEVO
import styles from "./client.module.css";
import { useState } from "react";

const Client = () => {
  const [selectedCourt, setSelectedCourt]     = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedDate, setSelectedDate]       = useState(null);
  const [isReserved, setIsReserved]           = useState(false);
  const [customerData, setCustomerData]       = useState(null);

  // ── NUEVO ──────────────────────────────────────────
  const [reservations, setReservations]       = useState([]);
  const [showModal, setShowModal]             = useState(false);
  // ───────────────────────────────────────────────────

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

    // ── NUEVO: guardar reserva en el array ──
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
        onOpenReservations={() => setShowModal(true)}  // ← NUEVO
        reservationCount={reservations.length}         // ← NUEVO (badge en 🔔)
      />

      <div className={styles.container}>
        {isReserved ? (
          <Resumen
            court={selectedCourt}
            schedule={selectedSchedule}
            date={selectedDate}
            customerData={customerData}
            onNewReservation={handleNewReservation}
            onViewReservations={() => setShowModal(true)} // ← NUEVO
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

      {/* ── NUEVO: modal global ── */}
      {showModal && (
        <ReservationsModal
          reservations={reservations}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default Client;