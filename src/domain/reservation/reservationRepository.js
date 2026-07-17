// infrastructure/repositories/reservationRepositoryImpl.js

import { ReservationRepository } from '../../domain/reservation/reservationRepository';
import { Reservation, TimeSlot } from '../../domain/reservation/Reservation';
import { reservationApi }        from '../api/reservation.api';

// ── Mappers backend → entidad del dominio ────────────────────────────────────
const toReservation = (raw) =>
  new Reservation({
    id:          raw.id,
    canchaId:    raw.cancha_id    ?? raw.canchaId,
    canchaName:  raw.cancha_name  ?? raw.canchaName  ?? raw.courtName,
    courtIcon:   raw.court_icon   ?? raw.courtIcon,
    clienteId:   raw.cliente_id   ?? raw.clienteId   ?? raw.userId,
    fecha:       raw.fecha        ?? raw.date,
    horaInicio:  raw.hora_inicio  ?? raw.horaInicio  ?? raw.startTime,
    horaFin:     raw.hora_fin     ?? raw.horaFin     ?? raw.endTime,
    horaLlegada: raw.hora_llegada ?? raw.horaLlegada ?? raw.arrivalTime ?? null,
    estado:      raw.estado       ?? raw.status,
    montoTotal:  raw.monto_total  ?? raw.montoTotal  ?? raw.totalAmount ?? 0,
    montoPagado: raw.monto_pagado ?? raw.montoPagado ?? raw.paidAmount  ?? 0,
    createdAt:   raw.created_at   ?? raw.createdAt   ?? null,
  });

const toTimeSlot = (raw) =>
  new TimeSlot({
    id:         raw.id,
    canchaId:   raw.cancha_id   ?? raw.canchaId  ?? raw.courtId,
    horaInicio: raw.hora_inicio ?? raw.horaInicio ?? raw.startTime,
    horaFin:    raw.hora_fin    ?? raw.horaFin    ?? raw.endTime,
    available:  raw.available   ?? raw.disponible ?? true,
    price:      raw.price       ?? raw.precio     ?? 0,
  });

export class ReservationRepositoryImpl extends ReservationRepository {

  async getByUserId(userId) {
    const raw = await reservationApi.getByUserId(userId);
    return raw.map(toReservation);
  }

  async getAvailableSlots(courtId, date) {
    const raw = await reservationApi.getAvailableSlots(courtId, date);
    return raw.map(toTimeSlot);
  }

  // POST /api/reservas → ReservaRequest.java: { canchaId, horarioId, fecha }
  // El userId lo extrae el backend del JWT — no va en el body
  async create({ canchaId, horarioId, fecha }) {
    const raw = await reservationApi.create({ canchaId, horarioId, fecha });
    return toReservation(raw);
  }

  async cancel(reservationId) {
    const raw = await reservationApi.cancel(reservationId);
    return toReservation(raw);
  }
}

export const reservationRepository = new ReservationRepositoryImpl();