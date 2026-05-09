// domain/reservation/reservationRepository.js
// Contrato (interfaz) — el dominio define QUÉ necesita, no CÓMO se obtiene

export class ReservationRepository {
  /** Retorna las reservas del usuario autenticado */
  async getByUserId(userId) {
    throw new Error('ReservationRepository.getByUserId() no implementado');
  }

  /** Retorna los slots disponibles de una cancha para una fecha */
  async getAvailableSlots(courtId, date) {
    throw new Error('ReservationRepository.getAvailableSlots() no implementado');
  }

  /** Crea una nueva reserva y retorna la entidad creada */
  async create({ courtId, userId, date, startTime, endTime }) {
    throw new Error('ReservationRepository.create() no implementado');
  }

  /** Cancela una reserva por ID */
  async cancel(reservationId) {
    throw new Error('ReservationRepository.cancel() no implementado');
  }
}