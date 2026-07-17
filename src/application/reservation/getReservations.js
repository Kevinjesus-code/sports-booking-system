// application/reservation/getReservations.js

import { reservationRepository } from '../../infrastructure/repositories/reservationRepositoryImpl';

/**
 * Obtener reservas de un usuario
 */
export const getReservationsByUser = async (userId) => {
  return await reservationRepository.getByUserId(userId);
};

/**
 * Obtener horarios disponibles
 */
export const getAvailableSlots = async (courtId, date) => {
  return await reservationRepository.getAvailableSlots(courtId, date);
};

/**
 * Crear reserva
 */
export const createReservation = async ({
  courtId,
  userId,
  date,
  startTime,
  endTime,
}) => {

  const availableSlots =
    await reservationRepository.getAvailableSlots(courtId, date);

  const slotExists = availableSlots.some(
    (slot) =>
      slot.startTime === startTime &&
      slot.endTime === endTime
  );

  if (!slotExists) {
    throw new Error('El horario ya no está disponible');
  }

  return await reservationRepository.create({
    courtId,
    userId,
    date,
    startTime,
    endTime,
  });
};

/**
 * Cancelar reserva
 */
export const cancelReservation = async (reservationId) => {
  return await reservationRepository.cancel(reservationId);
};