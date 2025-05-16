import apiClient from './apiClient';

const API_URL = '/api/auth';

// Función para iniciar sesión
export const loginUser = async (emailOrUsername, contrasena) => {
  try {
    const response = await apiClient.post(`${API_URL}/login`, {
      emailOrUsername,
      contrasena,
    });
    return response.data;
  } catch (error) {
    console.error('Error en la API de login:', error);
    throw error.response?.data?.message || 'Error al iniciar sesión';
  }
};

// Función para registrar un nuevo usuario
export const registerUser = async (formData) => {
  try {
    const response = await apiClient.post(`${API_URL}/register`, formData);
    return response.data;
  } catch (error) {
    // Maneja errores
    console.error('Error en la API de registro:', error);
    throw error.response?.data?.message || 'Error al registrar usuario'; // Lanza el mensaje de error
  }
};
