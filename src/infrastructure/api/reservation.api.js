// infrastructure/api/reservation.api.js
// Todas las llamadas HTTP relacionadas con reservas

import client from './client';

export const reservationApi = {
  /**
   * GET /api/reservations?userId=:userId
   * Retorna lista de reservas del usuario
   */
  getByUserId: (userId) =>
    client.get(`/reservations?userId=${userId}`),

  /**
   * GET /api/courts/:courtId/slots?date=:date
   * Retorna los horarios disponibles de una cancha en una fecha
   */
  getAvailableSlots: (courtId, date) =>
    client.get(`/canchas/${courtId}/slots?date=${date}`),

  /**
   * POST /api/reservations
   * Body: { courtId, userId, date, startTime, endTime }
   * Crea la reserva y retorna el objeto creado con id y precio
   */
  create: (data) =>
    client.post('/reservations', data),

  /**
   * PATCH /api/reservations/:id/cancel
   * Cancela la reserva
   */
  cancel: (reservationId) =>
    client.patch(`/reservations/${reservationId}/cancel`),
};