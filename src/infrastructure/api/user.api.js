
import client from './client';

export const getPerfilRequest = () =>
  client.get('/perfil');

export const updatePerfilRequest = (datos) =>
  client.put('/perfil', datos);

export const changeEmailRequest = (datos) =>
  client.put('/perfil/email', datos);

export const changePasswordRequest = (datos) =>
  client.put('/perfil/password', datos);