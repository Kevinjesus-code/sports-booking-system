/**
 * Contrato que debe cumplir cualquier implementación
 * del repositorio de usuario.
 *
 * @typedef {Object} UserRepository
 * @property {(email: string, password: string) => Promise<{token: string, user: User}>} login
 * @property {(datos: object) => Promise<User>} register
 * @property {() => Promise<User>} getPerfil
 * @property {(datos: object) => Promise<User>} updatePerfil
 */
export const userRepository = null; // implementado en infrastructure/repositories/