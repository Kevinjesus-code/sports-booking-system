// infrastructure/api/reservation.api.js
// Todas las llamadas HTTP relacionadas con reservas

import client from './client';

export const reservationApi = {

  /**
   * GET /api/reservas/historial/{userId}
   * Retorna lista de reservas del usuario autenticado
   */
  getByUserId: async (userId) => {
    const response = await client.get(`/api/reservas/historial/${userId}`);
    return response.data;
  },

  /**
   * GET /canchas/{courtId}/slots?date={date}
   * Retorna horarios disponibles de una cancha (público)
   */
  getAvailableSlots: async (courtId, date) => {
    const response = await client.get(
      `/canchas/${courtId}/slots?date=${date}`
    );
    return response.data;
  },

  /**
   * POST /api/reservas
   * Crea una nueva reserva para el usuario autenticado
   */
  create: async (data) => {
    const response = await client.post('/api/reservas', data);
    return response.data;
  },

  /**
   * DELETE /api/reservas/{id}
   * Cancela una reserva existente del usuario autenticado
   */
  cancel: async (reservationId) => {
    const response = await client.delete(`/api/reservas/${reservationId}`);
    return response.data;
  },
};