// infrastructure/api/reservation.api.js
import client from "./client";

/**
 * API REST de reservas alineada con backend-kancha (/api).
 */
export const reservationApi = {
  /** GET /api/reservas/mias — solo del usuario autenticado */
  getMine: async (params = {}) => {
    const res = await client.get("/api/reservas/mias", { params });
    return res.data;
  },

  /** GET /api/reservas/historial/{userId} — recepción/admin */
  getByUserId: async (userId) => {
    const res = await client.get(`/api/reservas/historial/${userId}`);
    return res.data;
  },

  /**
   * GET /api/reservas — recepción/admin.
   * @param {object} [filters] fecha, canchaId, estado, clienteId, clienteDni
   */
  getAll: async (filters = {}) => {
    const params = { ...filters };
    Object.keys(params).forEach((k) => {
      if (params[k] === "" || params[k] === undefined) delete params[k];
    });
    const res = await client.get("/api/reservas", { params });
    return res.data;
  },

  /** GET /api/canchas/{id}/disponibilidad?fecha= — slots con disponible/ocupado (servidor) */
  getCourtAvailability: async (courtId, fecha) => {
    const res = await client.get(`/api/canchas/${courtId}/disponibilidad`, {
      params: { fecha },
    });
    return res.data;
  },

  /** GET /api/canchas/disponibilidad?fecha= — todas las canchas */
  getAllCourtsAvailability: async (fecha) => {
    const res = await client.get("/api/canchas/disponibilidad", { params: { fecha } });
    return res.data;
  },

  create: async (data) => {
    const res = await client.post("/api/reservas", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await client.put(`/api/reservas/${id}`, data);
    return res.data;
  },

  updateEstado: async (id, estado) => {
    const res = await client.patch(`/api/reservas/${id}/estado`, { estado });
    return res.data;
  },

  cancel: async (reservationId) => {
    await client.delete(`/api/reservas/${reservationId}`);
  },
};
