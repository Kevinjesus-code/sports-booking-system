// infrastructure/api/reservation.api.js
// Todas las llamadas HTTP relacionadas con reservas

import client from './client';

export const reservationApi = {

  /**
   * GET /reservations?userId=:userId
   * Retorna lista de reservas del usuario
   */
  getByUserId: async (userId) => {
    const response = await client.get(
      `/reservations?userId=${userId}`
    );

    return response.data;
  },

  /**
   * GET /canchas/:courtId/slots?date=:date
   * Retorna horarios disponibles
   */
  getAvailableSlots: async (courtId, date) => {
    const response = await client.get(
      `/canchas/${courtId}/slots?date=${date}`
    );

    return response.data;
  },

  /**
   * POST /reservations
   */
  create: async (data) => {
    const response = await client.post(
      '/reservations',
      data
    );

    return response.data;
  },

  /**
   * PATCH /reservations/:id/cancel
   */
  cancel: async (reservationId) => {
    const response = await client.patch(
      `/reservations/${reservationId}/cancel`
    );

    return response.data;
  },
};