/**
 * Caso de uso: Login
 * @param {import('../../domain/user/userRepository').UserRepository} userRepo
 */
export const loginUseCase = (userRepo) => async (email, password) => {
  const { token, user } = await userRepo.login(email, password);

  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));

  return user;
};