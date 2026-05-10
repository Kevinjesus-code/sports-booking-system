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

export default client;