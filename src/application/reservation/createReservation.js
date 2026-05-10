// application/reservation/createReservation.js

/**
 * Caso de uso: crear una reserva
 * El backend recibe { canchaId, horarioId, fecha } y valida disponibilidad.
 * El frontend solo valida campos requeridos y fecha no pasada.
 *
 * @param {ReservationRepository} repository
 * @returns {Function} (data) => Promise<Reservation>
 */
export const createReservation = (repository) =>
  async ({ canchaId, horarioId, fecha, userId }) => {

    // ── Validaciones de negocio ──────────────────────────────
    if (!canchaId)  throw new Error('Debes seleccionar una cancha');
    if (!horarioId) throw new Error('Debes seleccionar un horario');
    if (!fecha)     throw new Error('Debes seleccionar una fecha');

    const today = new Date().toISOString().split('T')[0];
    if (fecha < today) throw new Error('No puedes reservar en una fecha pasada');

    // ── Creación ─────────────────────────────────────────────
    // El repositorio mapea estos campos al body que espera el backend Java
    return repository.create({ canchaId, horarioId, fecha, userId });
  };