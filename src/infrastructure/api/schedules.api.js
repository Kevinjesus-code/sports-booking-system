// src/infrastructure/api/schedules.api.js
import client from './client';

/**
 * GET /admin/horarios/disponibilidad?fecha=YYYY-MM-DD
 * Devuelve lista de DisponibilidadResponse — una por cada cancha activa.
 * Cada item tiene: canchaId, nombreCancha, tipoCancha, fecha, horarios[]
 * Cada horario tiene: horarioId, horaInicio, horaFin, disponible
 */
export const getGridHorariosRequest = (fecha) =>
  client.get('/admin/horarios/disponibilidad', { params: { fecha } });

/**
 * PATCH /admin/horarios/:id/bloquear
 * activo = false → slot deja de ofrecerse a clientes
 */
export const bloquearHorarioRequest = (id) =>
  client.patch(`/admin/horarios/${id}/bloquear`);

/**
 * PATCH /admin/horarios/:id/desbloquear
 * activo = true → slot vuelve a estar disponible
 */
export const desbloquearHorarioRequest = (id) =>
  client.patch(`/admin/horarios/${id}/desbloquear`);

/**
 * POST /admin/horarios
 * Crea un nuevo slot para una cancha.
 * body: { canchaId, horaInicio: "08:00", horaFin: "09:00" }
 */
export const crearHorarioRequest = (data) =>
  client.post('/admin/horarios', data);

/**
 * DELETE /admin/horarios/:id
 */
export const eliminarHorarioRequest = (id) =>
  client.delete(`/admin/horarios/${id}`);

// ─── Helpers ───────────────────────────────────────────────────────────────

/**
 * Dada la respuesta del backend, construye la estructura que necesita el grid:
 * {
 *   canchas: [{ id, nombre, tipo }],
 *   horas:   ["08:00 - 09:00", ...],
 *   celdas:  { "08:00 - 09:00": [{ horarioId, status }, ...] }
 * }
 * status: "Disponible" | "Ocupado" | "Bloqueado"
 *
 * horarioId puede ser negativo (slot sintético sin fila en BD) — en ese caso
 * bloquear/desbloquear no aplica y el botón debe estar deshabilitado.
 */
export const buildGrid = (disponibilidades) => {
  if (!disponibilidades?.length) return { canchas: [], horas: [], celdas: {} };

  const canchas = disponibilidades.map((d) => ({
    id:    d.canchaId,
    nombre: d.nombreCancha,
    tipo:   d.tipoCancha,
  }));

  // Recolectar todas las horas únicas ordenadas
  const horasSet = new Set();
  disponibilidades.forEach((d) =>
    d.horarios?.forEach((h) =>
      horasSet.add(`${h.horaInicio.slice(0, 5)} - ${h.horaFin.slice(0, 5)}`)
    )
  );
  const horas = [...horasSet].sort();

  // Construir tabla: celdas[hora][indexCancha]
  const celdas = {};
  horas.forEach((hora) => {
    celdas[hora] = disponibilidades.map((d) => {
      const [inicio, fin] = hora.split(" - ");
      const slot = d.horarios?.find(
        (h) => h.horaInicio.slice(0, 5) === inicio && h.horaFin.slice(0, 5) === fin
      );
      if (!slot) return { horarioId: null, status: "—" };

      let status;
      if (!slot.disponible) {
        // Puede ser Ocupado (reserva real) o Bloqueado (activo=false en BD)
        // horarioId negativo = slot sintético sin fila en BD = siempre Disponible/Ocupado
        status = slot.horarioId > 0 ? "Bloqueado" : "Ocupado";
        // Si hay una reserva real encima de un horario bloqueado también es Ocupado
        // El backend ya marca disponible=false para ambos casos;
        // distinguimos: horarioId positivo con disponible=false puede ser reservado o bloqueado.
        // Para simplificar: si el slot fue marcado disponible=false asumimos "Bloqueado"
        // a menos que sea un slot sintético (id negativo) donde siempre es "Ocupado".
      } else {
        status = "Disponible";
      }

      return { horarioId: slot.horarioId, status };
    });
  });

  return { canchas, horas, celdas };
};