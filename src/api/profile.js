import axios from 'axios';

const API_URL = '/api/profile';

// Obtener perfil de un usuario por ID
export const getProfileByUserId = async (userId) => {
  try {
    const res = await axios.get(`${API_URL}/${userId}`);
    return res.data;
  } catch (error) {
    console.error("Error al obtener perfil:", error.response?.data || error.message);
    throw error;
  }
};

// Actualizar perfil
export const updateProfile = async (userId, profileData) => {
  try {
    const res = await axios.patch(`${API_URL}/${userId}`, profileData);
    return res.data;
  } catch (error) {
    console.error("Error al actualizar perfil:", error.response?.data || error.message);
    throw error;
  }
};

// Upload profile image
export const uploadProfileImage = async (userId, imageFile) => {
  try {
    const formData = new FormData();
    formData.append('fotoPerfil', imageFile);
    
    const res = await axios.post(`${API_URL}/${userId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  } catch (error) {
    console.error("Error al subir imagen:", error.response?.data || error.message);
    throw error;
  }
};
