export const registerUseCase = (userRepo) => async (datos) => {
  const { token, user } = await userRepo.register(datos);

  // Guarda el token igual que en login
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));

  return user;
};