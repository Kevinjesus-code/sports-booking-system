import { loginRequest, registerRequest } from '../api/auth.api';
import { User } from '../../domain/user/User';

export const userRepositoryImpl = {

  async login(email, password) {
    const { data } = await loginRequest(email, password);

    // El backend ya devuelve rol, nombre, apellido, email — no hay que parsear el JWT
    const user = new User({
      nombre:   data.nombre,
      apellido: data.apellido,
      email:    data.email,
      rol:      data.rol,   // "ADMIN" | "CLIENTE" | "RECEPCIONISTA"
    });

    return { token: data.token, user };
  },

  async register(datos) {
    const { data } = await registerRequest(datos);

    // Register también devuelve AuthResponse con token
    const user = new User({
      nombre:   data.nombre,
      apellido: data.apellido,
      email:    data.email,
      rol:      data.rol,
    });

    return { token: data.token, user };
  },
};