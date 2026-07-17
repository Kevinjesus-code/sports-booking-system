// RUTA: src/application/perfil/perfilUseCases.js

import {
  getPerfilRequest,
  updatePerfilRequest,
  changeEmailRequest,
  changePasswordRequest,
  getNotificacionesRequest,
  updateNotificacionesRequest,
} from '../../infrastructure/api/user.api';

export const getPerfil = async () => {
  const { data } = await getPerfilRequest();
  return data;
};

export const updatePerfil = async (datos) => {
  const { nombre, apellido, dni, telefono } = datos;
  const { data } = await updatePerfilRequest({ nombre, apellido, dni, telefono });
  return data;
};

export const cambiarEmail = async (datos) => {
  const { data } = await changeEmailRequest(datos);
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify({
    nombre:   data.nombre,
    apellido: data.apellido,
    email:    data.email,
    rol:      data.rol,
  }));
  return data;
};

export const cambiarPassword = async (datos) => {
  await changePasswordRequest(datos);
};

// ─── Preferencias de notificaciones ───────────────────────────────────────

export const getPreferenciasNotificaciones = async () => {
  const { data } = await getNotificacionesRequest();
  return data;
};

export const updatePreferenciasNotificaciones = async (settings) => {
  const { data } = await updateNotificacionesRequest(settings);
  return data;
};