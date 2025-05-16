import apiClient from "./apiClient";

const API_URL = '/api/rewards';

// Obtener recompensas por hogar
export const getRewardsByHome = async (homeId) => {
  console.log(`Buscando recompensas para el hogar ${homeId}`);
  try {
    const res = await apiClient.get(`${API_URL}/home/${homeId}`);
    console.log(`Recompensas obtenidas: ${res.data.length}`);
    return res.data;
  } catch (error) {
    console.error("Error al obtener recompensas:", error.response?.data || error.message);
    if (error.response?.status === 404) {
      console.warn("La ruta de recompensas no está disponible. Verificar endpoint del servidor.");
    }
    return [];
  }
};

// Crear una nueva recompensa
export const createReward = async (rewardData) => {
  console.log('Intentando crear recompensa con datos:', rewardData);
  try {
    const res = await apiClient.post(API_URL, rewardData, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    console.log('Recompensa creada exitosamente:', res.data);
    return res.data;
  } catch (error) {
    console.error("Error al crear recompensa:", error.response?.data || error.message);
    // Registrar detalles adicionales para depuración
    if (error.response) {
      console.error("Respuesta de error:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    }
    throw error;
  }
};

// Canjear recompensa
export const redeemReward = async (rewardId, userId) => {
  try {
    const res = await apiClient.post(`${API_URL}/redeem`, { rewardId, userId });
    return res.data;
  } catch (error) {
    console.error("Error al canjear recompensa:", error.response?.data || error.message);
    throw error;
  }
};

// Eliminar recompensa
export const deleteReward = async (rewardId) => {
  try {
    const res = await apiClient.delete(`${API_URL}/${rewardId}`);
    return res.data;
  } catch (error) {
    console.error("Error al eliminar recompensa:", error.response?.data || error.message);
    throw error;
  }
};

// Obtener historial de recompensas canjeadas por usuario
export const getUserRewardHistory = async (userId) => {
  try {
    const res = await apiClient.get(`${API_URL}/user/${userId}/history`);
    return res.data;
  } catch (error) {
    console.error("Error al obtener historial de recompensas:", error.response?.data || error.message);
    return [];
  }
}; 
