import axios from "./axios";

// ─── Listar ────────────────────────────────────────────────────────────────

/** GET /canchas — todas las canchas (admin/recepcionista) */
export const listarCanchasRequest = () => axios.get("/canchas");

/** GET /canchas/disponibles — solo disponibles (acceso público) */
export const listarCanchasDisponiblesRequest = () =>
  axios.get("/canchas/disponibles");

/** GET /canchas/:id */
export const obtenerCanchaRequest = (id) => axios.get(`/canchas/${id}`);

// ─── CRUD ──────────────────────────────────────────────────────────────────

/**
 * POST /canchas
 * body: { nombre, tipo, disponible, state, descripcion?,
 *         precioPorHora?, capacidad?, location?, lighting?,
 *         covered?, size?, bathrooms?, rules?, imagenUrl? }
 */
export const crearCanchaRequest = (data) => axios.post("/canchas", data);

/**
 * PUT /canchas/:id
 * Mismo body que crearCanchaRequest
 */
export const actualizarCanchaRequest = (id, data) =>
  axios.put(`/canchas/${id}`, data);

/** DELETE /canchas/:id */
export const eliminarCanchaRequest = (id) => axios.delete(`/canchas/${id}`);

// ─── Imagen ────────────────────────────────────────────────────────────────

/**
 * POST /canchas/:id/imagen  (multipart/form-data)
 * archivo: File
 */
export const subirImagenCanchaRequest = (id, archivo) => {
  const form = new FormData();
  form.append("file", archivo);
  return axios.post(`/canchas/${id}/imagen`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// ─── Helpers ───────────────────────────────────────────────────────────────

/**
 * Convierte el campo `state` del backend al label visible en la UI.
 * Backend guarda: "disponible" | "ocupada" | "mantenimiento"  (lowercase)
 * o puede venir como boolean `disponible: true/false` si state es null.
 */
export const stateToLabel = (cancha) => {
  if (cancha.state) {
    const map = {
      disponible:   "Disponible",
      ocupada:      "Ocupada",
      mantenimiento:"Mantenimiento",
    };
    return map[cancha.state.toLowerCase()] ?? cancha.state;
  }
  // fallback al boolean si state no está poblado
  return cancha.disponible ? "Disponible" : "Ocupada";
};

/**
 * Convierte el label de UI al payload que espera el backend.
 * Usado al crear o editar una cancha.
 */
export const labelToState = (label) => {
  const map = {
    Disponible:     { state: "disponible",    disponible: true  },
    Ocupada:        { state: "ocupada",       disponible: false },
    Mantenimiento:  { state: "mantenimiento", disponible: false },
  };
  return map[label] ?? { state: "disponible", disponible: true };
};