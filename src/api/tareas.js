import axios from 'axios';

const API_URL = '/api/tasks';

// Obtener tareas por hogar
export const getTasksByHome = async (homeId) => {
  try {
    const res = await axios.get(`${API_URL}/home/${homeId}`);
    return res.data;
  } catch (error) {
    console.error("Error al obtener tareas:", error.response?.data || error.message);
    throw error;
  }
};

// Crear una nueva tarea
export const createTask = async (taskData) => {
  try {
    const res = await axios.post(API_URL, taskData);
    return res.data;
  } catch (error) {
    console.error("Error al crear tarea:", error.response?.data || error.message);
    throw error;
  }
};

// Actualizar una tarea
export const updateTask = async (taskId, taskData) => {
  try {
    const res = await axios.patch(`${API_URL}/${taskId}`, taskData);
    return res.data;
  } catch (error) {
    console.error("Error al actualizar tarea:", error.response?.data || error.message);
    throw error;
  }
};

// Eliminar una tarea
export const deleteTask = async (taskId) => {
  try {
    const res = await axios.delete(`${API_URL}/${taskId}`);
    return res.data;
  } catch (error) {
    console.error("Error al eliminar tarea:", error.response?.data || error.message);
    throw error;
  }
};

// Obtener ranking
export const getRanking = async (homeId) => {
  try {
    const res = await axios.get(`${API_URL}/home/${homeId}/ranking`);
    return res.data;
  } catch (error) {
    console.error("Error al obtener ranking:", error.response?.data || error.message);
    return [];
  }
};

// Obtener recompensas
export const getRewards = async (homeId) => {
  try {
    const res = await axios.get(`${API_URL}/home/${homeId}/rewards`);
    return res.data;
  } catch (error) {
    console.error("Error al obtener recompensas:", error.response?.data || error.message);
    return [];
  }
};

// Obtener historial de tareas
export const getTaskHistory = async (homeId) => {
  try {
    const res = await axios.get(`${API_URL}/home/${homeId}/historial`);
    return res.data;
  } catch (error) {
    console.error("Error al obtener historial de tareas:", error.response?.data || error.message);
    return [];
  }
};

// Obtener estadísticas de tareas
export const getTaskStats = async (homeId) => {
  try {
    const res = await axios.get(`${API_URL}/home/${homeId}/estadisticas`);
    return res.data;
  } catch (error) {
    console.error("Error al obtener estadísticas de tareas:", error.response?.data || error.message);
    return {};
  }
};
