// infrastructure/repositories/courtRepositoryImpl.js
import { courtApi } from '../api/court.api';

class CourtRepositoryImpl {

  async getAll() {
    const raw = await courtApi.getAll();
    return (raw ?? []).map(this._toModel);
  }

  async getAvailable() {
    const raw = await courtApi.getAvailable();
    return (raw ?? []).map(this._toModel);
  }

  async getById(id) {
    const raw = await courtApi.getById(id);
    return this._toModel(raw);
  }

  async create(data) {
    const payload = this._toPayload(data);
    const raw = await courtApi.create(payload);
    return this._toModel(raw);
  }

  async update(id, data) {
    const payload = this._toPayload(data);
    const raw = await courtApi.update(id, payload);
    return this._toModel(raw);
  }

  async updateStatus(id, disponible) {
    const raw = await courtApi.updateStatus(id, disponible);
    return this._toModel(raw);
  }

  async delete(id) {
    return courtApi.delete(id);
  }

  async uploadImage(id, file) {
    const raw = await courtApi.uploadImage(id, file);
    return this._toModel(raw);
  }

  // Backend → Frontend model
  _toModel(c) {
    return {
      id:            c.id,
      nombre:        c.nombre,
      name:          c.nombre,
      descripcion:   c.descripcion ?? '',
      type:          c.tipo ?? '',
      surface:       c.tipo ?? '',
      precioPorHora: c.precioPorHora ?? 0,
      price:         c.precioPorHora ?? 0,
      disponible:    c.disponible ?? true,
      state:         c.state ?? (c.disponible ? 'Disponible' : 'Mantenimiento'),
      image:         c.imagenUrl ?? '',
      location:      c.location ?? '',
      address:       c.location ?? '',
      capacidad:     c.capacidad ?? 0,
      capacity:      c.capacidad ?? 0,
      lighting:      c.lighting ?? '',
      covered:       c.covered ?? '',
      size:          c.size ?? '',
      bathrooms:     c.bathrooms ?? '',
      rules:         c.rules ?? [],
    };
  }

  // Frontend → Backend payload
  _toPayload(data) {
    return {
      nombre:       data.nombre,
      descripcion:  data.descripcion ?? '',
      tipo:         data.type ?? data.tipo ?? '',
      precioPorHora: data.precioPorHora ?? 0,
      disponible:   data.state === 'Disponible' || data.disponible === true,
      imagenUrl:    data.image ?? data.imagenUrl ?? '',
      location:     data.location ?? '',
      capacidad:    data.capacidad ?? 0,
      lighting:     data.lighting ?? '',
      covered:      data.covered ?? '',
      size:         data.size ?? '',
      bathrooms:    data.bathrooms ?? '',
      rules:        data.rules ?? [],
      state:        data.state ?? (data.disponible ? 'Disponible' : 'Mantenimiento')
    };
  }
}

export const courtRepository = new CourtRepositoryImpl();
