import apiClient from "./apiClient";

const API_URL = '/api/dailyLog';

export const getDailyLogs = async (homeId) => {
  try {
    const res = await apiClient.get(`${API_URL}/${homeId}`);
    return res.data;
  } catch (error) {
    console.error("Error al obtener registros diarios:", error.response?.data || error.message);
    throw error;
  }
};

export const createDailyLog = async (logData) => {
  try {
    const res = await apiClient.post(`${API_URL}/${logData.homeId}`, logData);
    return res.data;
  } catch (error) {
    console.error("Error al crear registro diario:", error.response?.data || error.message);
    throw error;
  }
};
