import axios from 'axios';

const BASE_BACKEND_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: BASE_BACKEND_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Error en llamada API (interceptor):', error.response || error.message || error);


    const errorMessage = error.response?.data?.message || error.message || 'Ocurrió un error en la API.';
    
    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;
