// infrastructure/api/court.api.js
import client from './client';

export const courtApi = {

  // GET /canchas
  getAll: async () => {
    const res = await client.get('/canchas');
    return res.data;
  },

  // GET /canchas/disponibles
  getAvailable: async () => {
    const res = await client.get('/canchas/disponibles');
    return res.data;
  },

  // GET /canchas/{id}
  getById: async (id) => {
    const res = await client.get(`/canchas/${id}`);
    return res.data;
  },

  // POST /canchas
  create: async (data) => {
    const res = await client.post('/canchas', data);
    return res.data;
  },

  // PUT /canchas/{id}
  update: async (id, data) => {
    const res = await client.put(`/canchas/${id}`, data);
    return res.data;
  },

  // DELETE /canchas/{id}
  delete: async (id) => {
    const res = await client.delete(`/canchas/${id}`);
    return res.data;
  },

  // POST /canchas/{id}/imagen
  uploadImage: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await client.post(`/canchas/${id}/imagen`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  },
};
