// infrastructure/repositories/reservationRepositoryImpl.js
// Implementación concreta del contrato del dominio

import { ReservationRepository } from '../../domain/reservation/reservationRepository';
import { Reservation, TimeSlot } from '../../domain/reservation/Reservation';
import { reservationApi } from "../../infrastructure/api/reservation.api";
export class ReservationRepositoryImpl extends ReservationRepository {

  async getByUserId(userId) {
    const raw = await reservationApi.getByUserId(userId);
    // Convierte cada objeto plano del backend en una entidad del dominio
    return raw.map(r => new Reservation(r));
  }

  async getAvailableSlots(courtId, date) {
    const raw = await reservationApi.getAvailableSlots(courtId, date);
    return raw.map(s => new TimeSlot(s));
  }

  async create({ courtId, userId, date, startTime, endTime }) {
    const raw = await reservationApi.create({ courtId, userId, date, startTime, endTime });
    return new Reservation(raw);
  }

  async cancel(reservationId) {
    const raw = await reservationApi.cancel(reservationId);
    return new Reservation(raw);
  }
}

// Instancia singleton para toda la app
// (se inyecta en los casos de uso y hooks)
export const reservationRepository = new ReservationRepositoryImpl();