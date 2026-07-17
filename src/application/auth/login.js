/**
 * Caso de uso: Login
 * @param {import('../../domain/user/userRepository').UserRepository} userRepo
 *
 * @param {string}  email
 * @param {string}  password
 * @param {boolean} [remember=false]
 *   - true  → localStorage   (persiste al cerrar el tab)
 *   - false → sessionStorage  (se borra al cerrar el tab)
 */
export const loginUseCase = (userRepo) => async (email, password, remember = false) => {
  const { token, user } = await userRepo.login(email, password);

  const storage = remember ? localStorage : sessionStorage;
  const other   = remember ? sessionStorage : localStorage;

  // Limpia el storage contrario para evitar tokens duplicados
  other.removeItem('token');
  other.removeItem('user');

  storage.setItem('token', token);
  storage.setItem('user', JSON.stringify(user));

  return user;
};