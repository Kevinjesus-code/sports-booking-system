// RUTA: src/application/perfil/perfilUseCases.js

import {
  getPerfilRequest,
  updatePerfilRequest,
  changeEmailRequest,
  changePasswordRequest,
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
  // El backend devuelve nuevo token porque el email es el subject del JWT
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