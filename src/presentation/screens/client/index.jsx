import { DSANavbarClient } from "../../components";
import Courts from "./courts/courts";
import Schedules from "./schedules/schedules";
import ConfirmReserve from "./confirm-reserve/confirm-reserve";
import Resumen from "./resumen/resumen";
import Profile from "./profile/profile";
import Configuration from "../admin/configuration/configuration";
import ReservationsModal from "../../components/reservations-modal";
import styles from "./client.module.css";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

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

const Client = ({ onLogout }) => {
  const { logout } = useAuth();

  const [selectedCourt,       setSelectedCourt]       = useState(null);
  const [selectedSchedule,    setSelectedSchedule]    = useState(null);
  const [selectedDate,        setSelectedDate]        = useState(null);
  const [isReserved,          setIsReserved]          = useState(false);
  const [customerData,        setCustomerData]        = useState(null);
  const [reservations,        setReservations]        = useState([]);
  const [showModal,           setShowModal]           = useState(false);
  const [isViewingProfile,    setIsViewingProfile]    = useState(false);
  const [isViewingSettings,   setIsViewingSettings]   = useState(false);

  const handleHome = () => {
    setSelectedCourt(null);
    setSelectedSchedule(null);
    setSelectedDate(null);
    setIsReserved(false);
    setCustomerData(null);
    setIsViewingProfile(false);
    setIsViewingSettings(false);
  };

  const handleOpenProfile  = () => { setIsViewingProfile(true);  setIsViewingSettings(false); };
  const handleOpenSettings = () => { setIsViewingSettings(true); setIsViewingProfile(false);  };
  const handleBackToClient = () => { setIsViewingProfile(false); setIsViewingSettings(false); };

  const handleSelectSchedule  = (schedule, date) => { setSelectedSchedule(schedule); setSelectedDate(date); };
  const handleBackToSchedules = () => setSelectedSchedule(null);
  const handleBackToCourts    = () => { setSelectedCourt(null); setSelectedSchedule(null); setSelectedDate(null); };

  // ✅ FIX: enriquece la respuesta del API con los datos locales que Resumen necesita
  const handleConfirmReservation = (reservationFromApi) => {
    const fullReservation = {
      ...reservationFromApi,
      courtName:   selectedCourt?.titulo || selectedCourt?.nombre || selectedCourt?.name,
      courtIcon:   selectedCourt?.icono ?? "⚽",
      startTime:   selectedSchedule?.startTime,
      endTime:     selectedSchedule?.endTime,
      date:        selectedDate,
      totalAmount: reservationFromApi?.totalAmount
                   ?? reservationFromApi?.montoTotal
                   ?? selectedSchedule?.price
                   ?? 0,
    };
    setCustomerData(fullReservation);
    setIsReserved(true);
    setReservations(prev => [...prev, {
      id:       reservationFromApi?.id || Date.now(),
      court:    selectedCourt,
      schedule: selectedSchedule,
      date:     selectedDate,
    }]);
  };

  const handleNewReservation = () => {
    setIsReserved(false);
    setSelectedCourt(null);
    setSelectedSchedule(null);
    setSelectedDate(null);
    setCustomerData(null);
  };

  const handleLogout = async () => {
    await logout();
    onLogout();
  };

  return (
    <>
      {isViewingProfile ? (
        <Profile onBack={handleBackToClient} />
      ) : isViewingSettings ? (
        <Configuration onBack={handleBackToClient} />
      ) : (
        <>
          <DSANavbarClient
            initials={CLIENT_DATA.initials}
            userName={CLIENT_DATA.nombre}
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
              // ✅ FIX: prop correcta es "reservation", no court/schedule/customerData
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
              <Courts onSelectCourt={setSelectedCourt} />
            )}
          </div>

          {showModal && (
            <ReservationsModal
              reservations={reservations}
              onClose={() => setShowModal(false)}
            />
          )}
        </>
      )}
    </>
  );
};

export default Client;