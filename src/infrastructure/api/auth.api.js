import client from './client';

export const loginRequest = (email, password) =>
  client.post('/auth/login', { email, password });

export const registerRequest = (datos) =>
  client.post('/auth/register', datos);