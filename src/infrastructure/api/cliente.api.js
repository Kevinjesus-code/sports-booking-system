// infrastructure/api/cliente.api.js
import client from './client';

export const clienteApi = {

  // GET /api/clientes
  getAll: async () => {
    const res = await client.get('/api/clientes');
    return res.data;
  },

  // GET /api/clientes/buscar?dni=
  searchByDni: async (dni) => {
    const res = await client.get('/api/clientes/buscar', { params: { dni } });
    return res.data;
  },

  // POST /api/clientes
  create: async (data) => {
    const res = await client.post('/api/clientes', data);
    return res.data;
  },
};
