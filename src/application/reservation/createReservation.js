// application/reservation/createReservation.js
// Caso de uso de escritura — incluye validaciones de negocio

/**
 * Caso de uso: crear una reserva
 * @param {ReservationRepository} repository
 * @returns {Function} (data) => Promise<Reservation>
 */
export const createReservation = (repository) => async ({ courtId, userId, date, startTime, endTime, slotId }) => {
  // ── Validaciones de negocio ───────────────────────────────
  if (!courtId)   throw new Error('Debes seleccionar una cancha');
  if (!userId)    throw new Error('Usuario no autenticado');
  if (!date)      throw new Error('Debes seleccionar una fecha');
  if (!startTime) throw new Error('Debes seleccionar un horario');

  const today = new Date().toISOString().split('T')[0];
  if (date < today) throw new Error('No puedes reservar en una fecha pasada');

  // Verifica que el slot sigue disponible antes de crear
  const slots = await repository.getAvailableSlots(courtId, date);
  const slot = slots.find(s => s.startTime === startTime);

  if (!slot)           throw new Error('El horario seleccionado no existe');
  if (!slot.available) throw new Error('El horario ya no está disponible. Por favor elige otro.');

  // ── Creación ──────────────────────────────────────────────
  return repository.create({ courtId, userId, date, startTime, endTime: slot.endTime });
};