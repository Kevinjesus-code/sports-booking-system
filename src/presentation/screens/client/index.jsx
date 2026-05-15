import { DSANavbarClient } from "../../components";
import Courts from "./courts/courts";
import Schedules from "./schedules/schedules";
import ConfirmReserve from "./confirm-reserve/confirm-reserve";
import Resumen from "./resumen/resumen";
import Profile from "./profile/profile";
import ReservationsModal from "../../components/reservations-modal";
import styles from "./client.module.css";
import { useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useMyReservations } from "../../hooks/useReservations";

// const CLIENT_DATA = {
//   nombre: "Juan Pérez",
//   email: "juan.perez@email.com",
//   telefono: "912 123 123",
//   initials: "JP",
//   documento: "DNI",
//   numeroDocumento: "12345678",
//   metodoPago: "Yape",
//   direccion: "Lima, Perú",
// };

const generateReservationCode = (id) => `RSV-${String(id).slice(-6).padStart(6, "0")}`;

const getStorageKey = (userId) => `client-reservations:${userId ?? "guest"}`;

const readStoredReservations = (userId) => {
  try {
    return JSON.parse(localStorage.getItem(getStorageKey(userId)) || "[]");
  } catch {
    return [];
  }
};

const saveStoredReservations = (userId, reservations) => {
  localStorage.setItem(getStorageKey(userId), JSON.stringify(reservations));
};

const getReservationKey = (reservation) =>
  String(
    reservation.codigo ??
    reservation.id ??
    `${reservation.courtId ?? reservation.canchaId}-${reservation.fecha ?? reservation.date}-${reservation.startTime ?? reservation.horaInicio}`
  );

const mergeReservations = (apiReservations = [], savedReservations = []) => {
  const merged = new Map();
  apiReservations.forEach((reservation) => merged.set(getReservationKey(reservation), reservation));
  savedReservations.forEach((reservation) => merged.set(getReservationKey(reservation), reservation));
  return Array.from(merged.values());
};

const Client = ({ onLogout }) => {
  const { logout } = useAuth();
  const userStr = localStorage.getItem("user");
  const authUser = userStr ? JSON.parse(userStr) : {};
  const nombreUsuario = authUser.nombre || authUser.name || "Usuario";
  const iniciales = nombreUsuario.substring(0, 2).toUpperCase();
  const { reservations: apiReservations, refetch } = useMyReservations();

  const [selectedCourt,     setSelectedCourt]     = useState(null);
  const [selectedSchedule,  setSelectedSchedule]  = useState(null);
  const [selectedDate,      setSelectedDate]      = useState(null);
  const [isReserved,        setIsReserved]        = useState(false);
  const [customerData,      setCustomerData]      = useState(null);
  const [reservations,      setReservations]      = useState(() => readStoredReservations(authUser.id));
  const [showModal,         setShowModal]         = useState(false);
  const [isViewingProfile,  setIsViewingProfile]  = useState(false);

  const visibleReservations = useMemo(
    () => mergeReservations(apiReservations || [], reservations),
    [apiReservations, reservations]
  );

  const handleHome = () => {
    setSelectedCourt(null);
    setSelectedSchedule(null);
    setSelectedDate(null);
    setIsReserved(false);
    setCustomerData(null);
    setIsViewingProfile(false);
  };

  const handleOpenProfile  = () => setIsViewingProfile(true);
  const handleBackToClient = () => setIsViewingProfile(false);

  const handleSelectSchedule  = (schedule, date) => { setSelectedSchedule(schedule); setSelectedDate(date); };
  const handleBackToSchedules = () => setSelectedSchedule(null);
  const handleBackToCourts    = () => { setSelectedCourt(null); setSelectedSchedule(null); setSelectedDate(null); };

  const handleConfirmReservation = (reservationFromApi) => {
    const reservationId = reservationFromApi?.id || Date.now();
    const codigo = reservationFromApi?.codigo || reservationFromApi?.code || generateReservationCode(reservationId);
    const courtName = selectedCourt?.titulo || selectedCourt?.nombre || selectedCourt?.name || "Cancha";
    const scheduleTime =
      selectedSchedule?.time ||
      `${selectedSchedule?.startTime ?? ""} - ${selectedSchedule?.endTime ?? ""}`;
    const totalAmount =
      reservationFromApi?.totalAmount ??
      reservationFromApi?.montoTotal ??
      reservationFromApi?.totalPrice ??
      reservationFromApi?.precio ??
      selectedSchedule?.price ??
      0;
    const fullReservation = {
      ...reservationFromApi,
      id:          reservationId,
      codigo,
      courtId:     selectedCourt?.id,
      canchaId:    selectedCourt?.id,
      courtName,
      cancha:      reservationFromApi?.cancha || courtName,
      court:       reservationFromApi?.court || selectedCourt,
      courtIcon:   selectedCourt?.icono ?? "⚽",
      schedule:    reservationFromApi?.schedule || { ...selectedSchedule, time: scheduleTime },
      startTime:   selectedSchedule?.startTime,
      endTime:     selectedSchedule?.endTime,
      horaInicio:  selectedSchedule?.startTime,
      horaFin:     selectedSchedule?.endTime,
      hora:        scheduleTime,
      date:        selectedDate,
      fecha:       selectedDate,
      estado:      reservationFromApi?.estado ?? reservationFromApi?.status ?? "pendiente",
      status:      reservationFromApi?.status ?? reservationFromApi?.estado ?? "pendiente",
      totalAmount,
      totalPrice:  totalAmount,
      precio:      totalAmount,
      price:       totalAmount,
    };
    setCustomerData(fullReservation);
    setIsReserved(true);
    refetch();
    setReservations(prev => {
      const next = mergeReservations(prev, [fullReservation]);
      saveStoredReservations(authUser.id, next);
      return next;
    });
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
      ) : (
        <>
          <DSANavbarClient
            initials={iniciales}
            userName={nombreUsuario}
            userRole="Cliente"
            onHome={handleHome}
            onOpenReservations={() => setShowModal(true)}
            reservationCount={visibleReservations.length}
            onOpenProfile={handleOpenProfile}
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
              <Courts onSelectCourt={setSelectedCourt} />
            )}
          </div>

          {showModal && (
            <ReservationsModal
              reservations={visibleReservations}
              onClose={() => setShowModal(false)}
            />
          )}
        </>
      )}
    </>
  );
};

export default Client;
