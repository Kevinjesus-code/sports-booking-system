// src/infrastructure/api/dashboard.api.js
import client from './client';

/**
 * GET /admin/dashboard
 * Devuelve: { totalUsuarios, totalCanchas, canchasDisponibles }
 */
export const getDashboardResumenRequest = () =>
  client.get('/admin/dashboard');

/**
 * GET /api/reservas?fecha=YYYY-MM-DD
 * Devuelve lista de reservas del día para la tabla
 * Solo ADMIN / RECEPCIONISTA
 */
export const getReservasPorFechaRequest = (fecha) =>
  client.get('/api/reservas', { params: { fecha } });
