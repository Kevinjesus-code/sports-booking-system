import client from './client';

export const getConfiguracionRequest = async () => client.get('/api/v1/configuracion');

export const updateConfiguracionRequest = async (config) => client.put('/api/v1/configuracion', config);
