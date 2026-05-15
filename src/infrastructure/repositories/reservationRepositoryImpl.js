// infrastructure/repositories/reservationRepositoryImpl.js
import { reservationApi } from "../api/reservation.api";

const toArray = (raw) => {
  if (Array.isArray(raw)) return raw;
  return raw?.data ?? raw?.reservas ?? raw?.content ?? raw?.items ?? [];
};

/** Normaliza hora desde JSON (string ISO, array Jackson, u objeto hour/minute). */
function parseTimeSlot(v) {
  if (v == null || v === "") return "";
  if (typeof v === "string") return v.length >= 5 ? v.slice(0, 5) : v;
  if (Array.isArray(v) && v.length >= 2) {
    const h = Number(v[0]);
    const m = Number(v[1]);
    if (Number.isNaN(h) || Number.isNaN(m)) return "";
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }
  if (typeof v === "object" && v !== null && "hour" in v) {
    const h = Number(v.hour);
    const m = Number(v.minute ?? 0);
    if (Number.isNaN(h)) return "";
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }
  return String(v).slice(0, 5);
}

const PAYMENT_TO_BACKEND = {
  yape: "Yape",
  plin: "Plin",
  efectivo: "Efectivo",
  tarjeta: "Tarjeta",
  transferencia: "Transferencia",
};

class ReservationRepositoryImpl {
  async getMine(params = {}) {
    const raw = await reservationApi.getMine(params);
    return toArray(raw).map(this._toModel);
  }

  async getByUserId(userId) {
    const raw = await reservationApi.getByUserId(userId);
    return toArray(raw).map(this._toModel);
  }

  /** @param {object|string} [filtersOrFecha] filtros o solo string fecha (compat) */
  async getAll(filtersOrFecha) {
    const filters =
      typeof filtersOrFecha === "string"
        ? { fecha: filtersOrFecha || undefined }
        : filtersOrFecha ?? {};
    const raw = await reservationApi.getAll(filters);
    return toArray(raw).map(this._toModel);
  }

  async getCourtAvailability(courtId, date) {
    const data = await reservationApi.getCourtAvailability(courtId, date);
    const horarios = data?.horarios ?? data?.schedules ?? data?.slots ?? [];
    return (horarios ?? []).map((s) => ({
      id: s.horarioId ?? s.id ?? `${parseTimeSlot(s.horaInicio ?? s.startTime)}-${parseTimeSlot(s.horaFin ?? s.endTime)}`,
      horarioId: s.horarioId ?? s.id,
      courtId,
      startTime: parseTimeSlot(s.horaInicio ?? s.startTime),
      endTime: parseTimeSlot(s.horaFin ?? s.endTime),
      disponible: Boolean(s.disponible ?? s.available),
      available: Boolean(s.disponible ?? s.available),
      estado: s.disponible ? "disponible" : "ocupado",
    }));
  }

  async create(data) {
    const metodoRaw = data.metodoPago ?? data.paymentMethod ?? data.metodo_pago;
    const key = typeof metodoRaw === "string" ? metodoRaw.toLowerCase() : "";
    const metodoPago = PAYMENT_TO_BACKEND[key] ?? metodoRaw ?? "Efectivo";

    const payload = {
      canchaId: data.canchaId,
      clienteId: data.clienteId ?? null,
      fecha: data.fecha,
      horaInicio: data.horaInicio,
      horaFin: data.horaFin,
      metodoPago: metodoPago ?? "Efectivo",
    };
    const raw = await reservationApi.create(payload);
    return this._toModel(raw);
  }

  async update(id, data) {
    const raw = await reservationApi.update(id, data);
    return this._toModel(raw);
  }

  async updateEstado(id, estado) {
    const raw = await reservationApi.updateEstado(id, estado);
    return this._toModel(raw);
  }

  async cancel(reservationId) {
    await reservationApi.cancel(reservationId);
  }

  _toModel(r) {
    const cancha = r.cancha ?? r.court ?? {};
    const cliente = r.cliente ?? r.client ?? r.usuario ?? r.user ?? {};
    const horario = r.horario ?? r.schedule ?? r.slot ?? {};
    const estado = r.estado?.nombre ?? r.estado?.name ?? r.estado ?? r.status ?? "pendiente";
    const fecha =
      r.fecha ?? r.date ?? r.fechaReserva ?? r.reservationDate ?? horario.fecha ?? horario.date;
    const startTime =
      r.horaInicio ??
      r.hora_inicio ??
      r.startTime ??
      r.start_time ??
      r.inicio ??
      horario.horaInicio ??
      horario.hora_inicio ??
      horario.startTime ??
      horario.start_time ??
      horario.inicio;
    const endTime =
      r.horaFin ??
      r.hora_fin ??
      r.endTime ??
      r.end_time ??
      r.fin ??
      horario.horaFin ??
      horario.hora_fin ??
      horario.endTime ??
      horario.end_time ??
      horario.fin;
    const courtId =
      r.canchaId ??
      r.cancha_id ??
      r.courtId ??
      r.court_id ??
      cancha.id ??
      horario.canchaId ??
      horario.cancha_id ??
      horario.courtId;
    const courtName =
      r.nombreCancha ??
      r.canchaNombre ??
      r.cancha_name ??
      r.courtName ??
      cancha.nombre ??
      cancha.name ??
      "";
    const courtType =
      r.tipoCancha ?? r.tipo_cancha ?? r.courtType ?? cancha.tipo ?? cancha.type ?? "";

    return {
      id: r.id,
      codigo: r.codigo ?? `RSV-${String(r.id).padStart(6, "0")}`,
      courtId,
      canchaId: courtId,
      courtName,
      courtType,
      cancha: courtType && courtName ? `${courtType} - ${courtName}` : courtName,
      date: fecha,
      fecha,
      startTime,
      endTime,
      hora: startTime && endTime ? `${startTime} - ${endTime}` : "",
      status: estado,
      estado,
      metodoPago: r.metodoPago ?? r.metodo_pago ?? "",
      puedeCancelar: Boolean(r.puedeCancelar),
      totalPrice: r.total ?? r.precio ?? r.montoTotal ?? r.monto_total ?? 0,
      precio: r.total ?? r.precio ?? r.montoTotal ?? r.monto_total ?? 0,
      clienteId: r.clienteId ?? r.cliente_id ?? cliente.id,
      cliente: r.clienteNombre ?? r.cliente_nombre ?? cliente.nombre ?? cliente.name ?? "",
      clienteDni: r.clienteDni ?? r.cliente_dni ?? cliente.dni ?? "",
      dni: r.clienteDni ?? r.cliente_dni ?? cliente.dni ?? "",
      clienteTelefono: r.clienteTelefono ?? r.cliente_telefono ?? cliente.telefono ?? cliente.phone ?? "",
      telefono: r.clienteTelefono ?? r.cliente_telefono ?? cliente.telefono ?? cliente.phone ?? "",
    };
  }
}

export const reservationRepository = new ReservationRepositoryImpl();
