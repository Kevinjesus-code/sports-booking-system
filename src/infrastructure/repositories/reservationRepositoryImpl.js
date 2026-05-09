// infrastructure/repositories/reservationRepositoryImpl.js

import { ReservationRepository } from '../../domain/reservation/reservationRepository';
import { Reservation, TimeSlot } from '../../domain/reservation/Reservation';
import { reservationApi } from '../api/reservation.api';

export class ReservationRepositoryImpl extends ReservationRepository {

  async getByUserId(userId) {
    const raw = await reservationApi.getByUserId(userId);
    return raw.map(r => new Reservation({
      id:         r.id,
      courtId:    r.canchaId   ?? r.courtId,
      courtName:  r.nombreCancha ?? r.courtName ?? '',
      userId:     r.usuarioId  ?? r.userId,
      date:       r.fecha      ?? r.date,
      startTime:  r.horaInicio ?? r.startTime,
      endTime:    r.horaFin    ?? r.endTime,
      status:     r.estado     ?? r.status ?? 'confirmed',
      totalPrice: r.precio     ?? r.totalPrice ?? 0,
    }));
  }

  async getAvailableSlots(courtId, date) {
    const raw = await reservationApi.getAvailableSlots(courtId, date);

    // El backend retorna: { id, startTime, endTime, activo }
    // TimeSlot espera:    { id, courtId, startTime, endTime, available, price }
    return raw.map(s => new TimeSlot({
      id:        s.id,
      courtId:   courtId,
      startTime: s.startTime ?? s.horaInicio,
      endTime:   s.endTime   ?? s.horaFin,
      available: s.available ?? s.activo ?? true,  // ← mapea activo → available
      price:     s.price     ?? s.precio  ?? 0,    // ← default 0 si no viene
    }));
  }

  async create(data) {
    const raw = await reservationApi.create(data);
    return new Reservation({
      id:         raw.id,
      courtId:    raw.canchaId   ?? raw.courtId   ?? data.courtId,
      courtName:  raw.nombreCancha ?? raw.courtName ?? '',
      userId:     raw.usuarioId  ?? raw.userId    ?? data.userId,
      date:       raw.fecha      ?? raw.date      ?? data.date,
      startTime:  raw.horaInicio ?? raw.startTime ?? data.startTime,
      endTime:    raw.horaFin    ?? raw.endTime   ?? data.endTime,
      status:     raw.estado     ?? raw.status    ?? 'confirmed',
      totalPrice: raw.precio     ?? raw.totalPrice ?? 0,
    });
  }

  async cancel(reservationId) {
    const raw = await reservationApi.cancel(reservationId);
    return raw;
  }
}

// Singleton exportado — todos los hooks usan esta instancia
export const reservationRepository = new ReservationRepositoryImpl();