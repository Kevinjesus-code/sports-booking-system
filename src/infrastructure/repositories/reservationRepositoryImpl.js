// infrastructure/repositories/reservationRepositoryImpl.js
import { reservationApi } from '../api/reservation.api';

class ReservationRepositoryImpl {

  async getByUserId(userId) {
    const raw = await reservationApi.getByUserId(userId);
    return (raw ?? []).map((r) => ({
      id:         r.id,
      courtId:    r.canchaId    ?? r.courtId,
      courtName:  r.nombreCancha ?? r.courtName ?? '',
      userId:     r.usuarioId   ?? r.userId,
      date:       r.fecha       ?? r.date,
      startTime:  r.horaInicio  ?? r.startTime,
      endTime:    r.horaFin     ?? r.endTime,
      status:     r.estado      ?? r.status ?? 'confirmed',
      totalPrice: r.precio      ?? r.totalPrice ?? 0,
    }));
  }

  async getAvailableSlots(courtId, date) {
    const raw = await reservationApi.getAvailableSlots(courtId, date);

    // Backend devuelve: { id, startTime, endTime, activo }
    // Frontend espera:  { id, courtId, startTime, endTime, available, price }
    return (raw ?? []).map((s) => ({
      id:        s.id,
      courtId:   courtId,
      startTime: s.startTime ?? s.horaInicio,
      endTime:   s.endTime   ?? s.horaFin,
      available: s.available ?? s.activo ?? true,
      price:     s.price     ?? s.precio  ?? 0,
    }));
  }

  async create(data) {
    const raw = await reservationApi.create(data);
    return {
      id:         raw.id,
      courtId:    raw.canchaId    ?? raw.courtId    ?? data.courtId,
      courtName:  raw.nombreCancha ?? raw.courtName ?? '',
      userId:     raw.usuarioId   ?? raw.userId     ?? data.userId,
      date:       raw.fecha       ?? raw.date       ?? data.date,
      startTime:  raw.horaInicio  ?? raw.startTime  ?? data.startTime,
      endTime:    raw.horaFin     ?? raw.endTime    ?? data.endTime,
      status:     raw.estado      ?? raw.status     ?? 'confirmed',
      totalPrice: raw.precio      ?? raw.totalPrice ?? 0,
    };
  }

  async cancel(reservationId) {
    return reservationApi.cancel(reservationId);
  }
}

// Singleton — todos los hooks comparten esta instancia
export const reservationRepository = new ReservationRepositoryImpl();