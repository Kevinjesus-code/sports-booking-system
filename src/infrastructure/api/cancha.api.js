// src/infrastructure/api/cancha.api.js
import client from './client';

/** GET /canchas — todas las canchas (admin/recepcionista) */
export const listarCanchasRequest = () => client.get("/canchas");

/** GET /canchas/disponibles — solo disponibles */
export const listarCanchasDisponiblesRequest = () =>
  client.get("/canchas/disponibles");

/** GET /canchas/:id */
export const obtenerCanchaRequest = (id) => client.get(`/canchas/${id}`);

/** POST /canchas */
export const crearCanchaRequest = (data) => client.post("/canchas", data);

/** PUT /canchas/:id */
export const actualizarCanchaRequest = (id, data) =>
  client.put(`/canchas/${id}`, data);

/** DELETE /canchas/:id */
export const eliminarCanchaRequest = (id) => client.delete(`/canchas/${id}`);

/** POST /canchas/:id/imagen (multipart/form-data) */
export const subirImagenCanchaRequest = (id, archivo) => {
  const form = new FormData();
  form.append("file", archivo);
  return client.post(`/canchas/${id}/imagen`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// ─── Helpers ───────────────────────────────────────────────────────────────

export const stateToLabel = (cancha) => {
  if (cancha.state) {
    const map = {
      disponible:    "Disponible",
      ocupada:       "Ocupada",
      mantenimiento: "Mantenimiento",
    };
    return map[cancha.state.toLowerCase()] ?? cancha.state;
  }
  return cancha.disponible ? "Disponible" : "Ocupada";
};

export const labelToState = (label) => {
  const map = {
    Disponible:    { state: "disponible",    disponible: true  },
    Ocupada:       { state: "ocupada",       disponible: false },
    Mantenimiento: { state: "mantenimiento", disponible: false },
  };
  return map[label] ?? { state: "disponible", disponible: true };
};