import React, { useState, useEffect } from 'react';
import { FaBars, FaHome, FaTasks, FaUser, FaCog, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { getHomesByUser } from '../api/hogar';
import homeImage from '../assets/home-image.png';
import { useUser } from '../context/UserContext';
import Layout from '../containers/Layout';
import { getTasksByHome, updateTask, deleteTask } from '../api/tareas';
import { FaTrash } from 'react-icons/fa';

const Home = () => {
  const { userId } = useUser();
  const navigate = useNavigate();
  const [home, setHome] = useState(null);
  const [tareasPendientes, setTareasPendientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingTareas, setLoadingTareas] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHome = async () => {
      if (!userId) return;
      
      setLoading(true);
      setError(null);
      try {
        const homes = await getHomesByUser(userId);
        if (homes && homes.length > 0) {
          setHome(homes[0]);
          console.log("Home encontrado:", homes[0]);
        } else {
          console.log("No se encontraron hogares para el usuario");
          setHome(null);
        }
      } catch (error) {
        console.error("Error al cargar hogares:", error);
        setError("No se pudieron cargar los hogares. Intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };
    fetchHome();
  }, [userId]);

  useEffect(() => {
    if (!home) return;
    
    const fetchTareas = async () => {
      try {
        setLoadingTareas(true);
        const response = await getTasksByHome(home._id);
        
        // Asegurar que tareasPendientes sea siempre un array
        if (Array.isArray(response)) {
          setTareasPendientes(response);
        } else {
          console.warn("La respuesta de tareas no es un array:", response);
          setTareasPendientes([]);
        }
      } catch (error) {
        console.error("Error al cargar tareas:", error);
        setTareasPendientes([]);
      } finally {
        setLoadingTareas(false);
      }
    };
    fetchTareas();
  }, [home]);

  const handleCompletarTarea = async (taskId) => {
    try {
      await updateTask(taskId, { estado: 'completada', completadaEn: new Date() });
      // Actualizar tareas después de marcar como completada
      const response = await getTasksByHome(home._id);
      if (Array.isArray(response)) {
        setTareasPendientes(response);
      }
    } catch (error) {
      console.error("Error al completar tarea:", error);
    }
  };

  const handleEliminarTarea = async (taskId) => {
    try {
      await deleteTask(taskId);
      // Actualizar tareas después de eliminar
      const response = await getTasksByHome(home._id);
      if (Array.isArray(response)) {
        setTareasPendientes(response);
      }
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  const navigateToConfiguracionHogar = () => {
    navigate('/configuracion-hogar', { state: { homeId: home?._id } });
  };

  // Función segura para filtrar tareas pendientes
  const getTareasPendientes = () => {
    if (!Array.isArray(tareasPendientes)) return [];
    return tareasPendientes.filter(t => t && t.estado !== 'completada');
  };

  return (
    <Layout>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 mt-8">
        <h2 className="text-xl font-semibold mb-6 text-center">Home</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <button 
          onClick={navigateToConfiguracionHogar}
          className="w-full bg-green-500 text-white hover:bg-green-600 rounded-lg py-3 mb-6 font-medium text-base transition-colors"
        >
          {home ? 'Ver Configuración del Hogar' : 'Configurar Nuevo Hogar'}
        </button>
        
        <div className="bg-gray-100 rounded-xl h-32 mb-6 flex flex-col items-center justify-center">
          {loading ? (
            <span className="text-gray-400">Cargando...</span>
          ) : home ? (
            <>
              <img src={homeImage} alt="Home" className="h-20 object-contain mb-1" />
              <p className="text-center font-medium text-gray-700">{home.nombre}</p>
              <p className="text-xs text-gray-500">{home.usuarios?.length || 0} usuarios</p>
            </>
          ) : (
            <div className="text-center">
              <span className="text-gray-500 block mb-2">Sin hogar configurado</span>
              <span className="text-sm text-gray-400">Haz clic en el botón superior para crear uno</span>
            </div>
          )}
        </div>
        
        {/* Indicadores de estado */}
        {home && (
          <>
            <div className="flex space-x-4 ml-2">
              <span className="inline-block w-4 h-4 rounded-full bg-green-500"></span>
              <span className="inline-block w-4 h-4 rounded-full bg-yellow-500"></span>
              <span className="inline-block w-4 h-4 rounded-full bg-red-500"></span>
            </div>
            <div className="mt-4">
              <div className="font-semibold mb-2">Tareas pendientes</div>
              
              {loadingTareas ? (
                <div className="text-gray-400">Cargando tareas...</div>
              ) : getTareasPendientes().length === 0 ? (
                <div className="text-gray-400">No hay tareas pendientes.</div>
              ) : (
                getTareasPendientes().map((t) => (
                  <div key={t._id} className="bg-gray-100 rounded-lg p-3 flex items-center justify-between mb-2">
                    <div>
                      <div className="font-medium">{t.descripcion} - <span className="capitalize">{t.estado}</span></div>
                      <div className="text-xs text-gray-500">{t.duracion}</div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white"
                        title="Marcar como completada"
                        onClick={() => handleCompletarTarea(t._id)}
                        disabled={t.estado === 'completada'}
                      >
                        ✓
                      </button>
                      <button
                        className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-white"
                        title="Eliminar tarea"
                        onClick={() => handleEliminarTarea(t._id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Home;