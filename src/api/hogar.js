import apiClient from "./apiClient";

// Usar una URL relativa para aprovechar el proxy configurado en vite.config.js
const API_URL = '/api/home';

// Guardar configuración del hogar (crear o actualizar)
export const saveHomeConfig = async (data, homeId = null) => {
  try {
    if (homeId) {
      // Actualizar configuración existente
      const res = await apiClient.patch(`${API_URL}/${homeId}/config`, data);
      return res.data;
    } else {
      // Crear nuevo hogar
      const res = await apiClient.post(API_URL, data);
      return res.data;
    }
  } catch (error) {
    console.error("Error en saveHomeConfig:", error.response?.data || error.message);
    throw error;
  }
};

// Obtener configuración del hogar por usuario
export const getHomesByUser = async (userId) => {
  try {
    const res = await apiClient.get(`${API_URL}?userId=${userId}`);
    return res.data;
  } catch (error) {
    console.error("Error en getHomesByUser:", error.response?.data || error.message);
    throw error;
  }
};

// Obtener un hogar por ID
export const getHomeById = async (homeId) => {
  try {
    const res = await apiClient.get(`${API_URL}/${homeId}`);
    return res.data;
  } catch (error) {
    console.error("Error en getHomeById:", error.response?.data || error.message);
    throw error;
  }
};

export const addUserToSpecificHome = async (homeId, userIdToAdd) => {
  try {
    console.log(`Intentando agregar usuario ${userIdToAdd} al hogar ${homeId}`);
    console.log(`URL de solicitud: ${API_URL}/${homeId}/users`);
    const res = await apiClient.post(`${API_URL}/${homeId}/users`, { userIdToAdd });
    console.log("Respuesta exitosa:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error adding user to home:", error);
    console.error("Detalles del error:", {
      url: `${API_URL}/${homeId}/users`,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};

export const removeUserFromSpecificHome = async (homeId, userIdToRemove) => {
  try {
    const res = await apiClient.delete(`${API_URL}/${homeId}/users/${userIdToRemove}`);
    return res.data;
  } catch (error) {
    console.error("Error removing user from home:", error.response?.data || error.message);
    throw error;
  }
};
