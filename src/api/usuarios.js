import axios from 'axios';

// Usamos la ruta directamente, sin prefijo /api ya que el proxy lo manejará
const API_URL = '/api/users';

export const getAllUsers = async () => {
  console.log('Llamando a getAllUsers con URL:', API_URL);
  try {
    // Añadimos opciones para mejorar la compatibilidad con el proxy
    const res = await axios.get(API_URL, {
      headers: {
        'Content-Type': 'application/json',
        // Asegurarse de que no haya cache
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      // Timeout de 10 segundos
      timeout: 10000,
      // Para evitar problemas con credenciales
      withCredentials: false
    });
    console.log('Respuesta de usuarios:', res.data);
    return res.data;
  } catch (error) {
    const errorMessage = error.response 
      ? `Error ${error.response.status}: ${JSON.stringify(error.response.data)}` 
      : error.message;
    console.error("Error al obtener usuarios:", errorMessage);
    console.error("URL que falló:", API_URL);
    console.error("Detalles completos del error:", error);
    
    // Intentar directamente con la URL del servidor si falla el proxy
    try {
      console.log('Intentando obtener usuarios directamente desde el servidor...');
      const directRes = await axios.get('http://localhost:5001/users', {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Respuesta directa de usuarios:', directRes.data);
      return directRes.data;
    } catch (directError) {
      console.error('También falló la solicitud directa:', directError.message);
      // Devolvemos un array vacío en lugar de propagar el error
      return [];
    }
  }
};

export const getUserProfile = async (userId) => {
  console.log('Llamando a getUserProfile para userId:', userId);
  try {
    const res = await axios.get(`${API_URL}/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    console.log('Respuesta del perfil de usuario:', res.data);
    return res.data;
  } catch (error) {
    const errorMessage = error.response 
      ? `Error ${error.response.status}: ${JSON.stringify(error.response.data)}` 
      : error.message;
    console.error("Error al obtener perfil de usuario:", errorMessage);
    console.error("URL que falló:", `${API_URL}/${userId}`);
    
    // Intentar directamente con la URL del servidor si falla el proxy
    try {
      console.log('Intentando obtener perfil de usuario directamente...');
      const directRes = await axios.get(`http://localhost:5001/users/${userId}`);
      console.log('Respuesta directa del perfil:', directRes.data);
      return directRes.data;
    } catch (directError) {
      console.error('También falló la solicitud directa:', directError.message);
      // Devolvemos null en lugar de propagar el error
      return null;
    }
  }
};
