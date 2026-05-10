// src/hooks/useReservations.js
import { useState, useEffect } from "react";
import { reservationApi } from "../infrastructure/api/reservation.api";

/* ── Slots disponibles (schedules.jsx) ─────────────────────── */
export function useAvailableSlots(courtId, date) {
  const [slots,   setSlots]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!courtId || !date) return;
    setLoading(true);
    setError(null);
    reservationApi
      .getAvailableSlots(courtId, date)
      .then(setSlots)
      .catch(() => setError("Error al cargar horarios"))
      .finally(() => setLoading(false));
  }, [courtId, date]);

  return { slots, loading, error };
}

/* ── Crear reserva (confirm-reserve.jsx) ───────────────────── */
export function useCreateReservation() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const create = async (data) => {
    setLoading(true);
    setError(null);
    try {
      return await reservationApi.create(data);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Error al crear la reserva";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}

/* ── Historial del usuario ─────────────────────────────────── */
export function useUserReservations(userId) {
  const [reservations, setReservations] = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState(null);

  const fetchReservations = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await reservationApi.getByUserId(userId);
      setReservations(data);
    } catch {
      setError("Error al cargar reservas");
    } finally {
      setLoading(false);
    }
  };

  return { reservations, loading, error, fetchReservations };
}

/* ── Cancelar reserva ──────────────────────────────────────── */
export function useCancelReservation() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const cancel = async (reservationId) => {
    setLoading(true);
    setError(null);
    try {
      await reservationApi.cancel(reservationId);
    } catch {
      setError("Error al cancelar la reserva");
      throw new Error("Error al cancelar");
    } finally {
      setLoading(false);
    }
  };

  return { cancel, loading, error };
}