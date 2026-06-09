// infrastructure/api/reservation.api.js
import client from './client';   // ← default import, SIN llaves

export const reservationApi = {

  // GET /api/reservas/historial/{userId}
  getByUserId: async (userId) => {
    const res = await client.get(`/api/reservas/historial/${userId}`);
    return res.data;
  },

  // GET /canchas/{courtId}/slots?date={date}
  getAvailableSlots: async (courtId, date) => {
    const res = await client.get(`/canchas/${courtId}/slots`, {
      params: { date },
    });
    return res.data;
  },

  // POST /api/reservas
  create: async (data) => {
    const res = await client.post('/api/reservas', data);
    return res.data;
  },

  // DELETE /api/reservas/{id}
  cancel: async (reservationId) => {
    const res = await client.delete(`/api/reservas/${reservationId}`);
    return res.data;
  },
};