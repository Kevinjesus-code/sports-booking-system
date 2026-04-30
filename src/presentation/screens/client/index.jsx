import { DSANavbarClient } from "../../components";
// import  Dashboard  from "./dashboard/dashboard";
import Courts from "./courts/courts";
import Schedules from "./schedules/schedules";
import ConfirmReserve from "./confirm-reserve/confirm-reserve";
import Resumen from "./resumen/resumen";
import styles from "./client.module.css";
import { useState } from "react";

const Client = () => {
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  
  const [isReserved, setIsReserved] = useState(false);
  const [customerData, setCustomerData] = useState(null);

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

  const handleConfirmReservation = (data) => {
    setCustomerData(data);
    setIsReserved(true);
  };

  const handleNewReservation = () => {
    setIsReserved(false);
    setSelectedCourt(null);
    setSelectedSchedule(null);
    setSelectedDate(null);
    setCustomerData(null);
  };

  const handleViewReservations = () => {
    alert("Redirigiendo a Mis Reservas...");
    handleNewReservation(); // optionally reset or navigate to dashboard
  };

  return (
    <>
      <DSANavbarClient />
      <div className={styles.container}>
        
        {/* <Dashboard /> */}
        {isReserved ? (
          <Resumen
            court={selectedCourt}
            schedule={selectedSchedule}
            date={selectedDate}
            customerData={customerData}
            onNewReservation={handleNewReservation}
            onViewReservations={handleViewReservations}
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
    </>
  );
};

export default Client;
