import client from './client';

export const loginRequest = (email, password) =>
  client.post('/auth/login', { email, password });

export const registerRequest = (datos) =>
  client.post('/auth/register', datos);

export const logoutRequest = () =>
  client.post('/auth/logout');

export const forgotPasswordRequest = (email) =>
  client.post('/auth/recuperar-password', { email });

export const resetPasswordRequest = (token, newPassword) =>
  client.post('/auth/reset-password', { token, nuevaPassword: newPassword });