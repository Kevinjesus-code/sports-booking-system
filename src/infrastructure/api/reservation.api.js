// src/infrastructure/api/reservation.api.js
import client from "./client";

export const reservationApi = {

  getMine: async (params = {}) => {
    const res = await client.get("/api/reservas/mias", { params });
    return res.data;
  },

  getByUserId: async (userId) => {
    const res = await client.get(`/api/reservas/historial/${userId}`);
    return res.data;
  },

  getAll: async (filters = {}) => {
    const params = { ...filters };
    Object.keys(params).forEach((k) => {
      if (params[k] === "" || params[k] === undefined) delete params[k];
    });
    const res = await client.get("/api/reservas", { params });
    return res.data;
  },

  getCourtAvailability: async (courtId, fecha) => {
    const res = await client.get(`/api/canchas/${courtId}/disponibilidad`, { params: { fecha } });
    return res.data;
  },

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

  // ✅ NUEVO: borrar historial de reservas finalizadas/canceladas
  clearHistory: async () => {
    const res = await client.delete("/api/reservas/historial/limpiar");
    return res.data;
  },

  // ✅ NUEVO: obtener comprobante de una reserva
  getComprobante: async (reservaId) => {
    const res = await client.get(`/api/reservas/${reservaId}/comprobante`);
    return res.data;
  },

};