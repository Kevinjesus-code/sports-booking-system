// src/infrastructure/api/user.api.js
import client from './client';

// ─── Perfil del usuario autenticado ───────────────────────────────────────
export const getPerfilRequest = () =>
  client.get('/perfil');

export const updatePerfilRequest = (datos) =>
  client.put('/perfil', datos);

export const changeEmailRequest = (datos) =>
  client.put('/perfil/email', datos);

export const changePasswordRequest = (datos) =>
  client.put('/perfil/password', datos);

// ─── Preferencias de notificaciones ───────────────────────────────────────
export const getNotificacionesRequest = () =>
  client.get('/perfil/notificaciones');

export const updateNotificacionesRequest = (datos) =>
  client.put('/perfil/notificaciones', datos);

// ─── Admin: gestión de usuarios ───────────────────────────────────────────

/** GET /admin/usuarios */
export const listarUsuariosRequest = () =>
  client.get('/admin/usuarios');

/**
 * POST /admin/usuarios
 * body: { nombre, apellido, email, password, telefono, dni, rol }
 */
export const crearUsuarioRequest = (datos) =>
  client.post('/admin/usuarios', datos);

/** GET /admin/usuarios/:id */
export const obtenerUsuarioRequest = (id) =>
  client.get(`/admin/usuarios/${id}`);

/**
 * PUT /admin/usuarios/:id
 * body: { nombre, email, telefono, rol, activo }
 */
export const actualizarUsuarioRequest = (id, datos) =>
  client.put(`/admin/usuarios/${id}`, datos);

/** DELETE /admin/usuarios/:id */
export const eliminarUsuarioRequest = (id) =>
  client.delete(`/admin/usuarios/${id}`);

/** PATCH /admin/usuarios/:id/activar */
export const activarUsuarioRequest = (id) =>
  client.patch(`/admin/usuarios/${id}/activar`);

/** PATCH /admin/usuarios/:id/desactivar */
export const desactivarUsuarioRequest = (id) =>
  client.patch(`/admin/usuarios/${id}/desactivar`);