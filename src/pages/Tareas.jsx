import React, { useState, useEffect } from 'react';
import Layout from '../containers/Layout';
import { FaPlus, FaMedal, FaTrash, FaGift } from 'react-icons/fa';
import { useUser } from '../context/UserContext';
import { getTasksByHome, createTask, updateTask, deleteTask } from '../api/tareas';
import { getHomesByUser, getHomeById } from '../api/hogar';
import { getUserProfile } from '../api/usuarios';
import { getRewardsByHome, redeemReward, deleteReward } from '../api/rewards';
import AsignarTareaModal from '../components/AsignarTareaModal';
import CrearRecompensaModal from '../components/CrearRecompensaModal';

const Tareas = () => {
  const { userId } = useUser();
  const [homeId, setHomeId] = useState(null);
  const [tareasPendientes, setTareasPendientes] = useState([]);
  const [recompensas, setRecompensas] = useState([]);
  const [modalTareaOpen, setModalTareaOpen] = useState(false);
  const [modalRecompensaOpen, setModalRecompensaOpen] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [puntosUsuario, setPuntosUsuario] = useState(0);

  // Obtener el homeId del usuario
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      setInitialLoading(true);
      try {
        const homes = await getHomesByUser(userId);
        if (homes && homes.length > 0) {
          setHomeId(homes[0]._id);
          
          // Obtener los usuarios de este hogar
          const homeData = await getHomeById(homes[0]._id);
          if (homeData && Array.isArray(homeData.usuarios)) {
            setUsuarios(homeData.usuarios);
          }
        }
        
        const user = await getUserProfile(userId);
        if (user) {
          setUsuarioActual(user);
          setPuntosUsuario(user.puntos || 0);
        }
      } catch (err) {
        console.error("Error al obtener datos iniciales:", err);
        setError("Error al cargar datos iniciales");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  // Obtener tareas, ranking y recompensas
  useEffect(() => {
    if (!homeId) return;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const tareasData = await getTasksByHome(homeId);
        setTareasPendientes(Array.isArray(tareasData) ? tareasData : []);
        
        const recompensasData = await getRewardsByHome(homeId);
        setRecompensas(Array.isArray(recompensasData) ? recompensasData : []);
      } catch (err) {
        console.error("Error al obtener datos del hogar:", err);
        setError("Error al cargar tareas y recompensas");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [homeId]);

  // Función para obtener tareas pendientes de forma segura
  const getTareasPendientes = () => {
    if (!Array.isArray(tareasPendientes)) return [];
    return tareasPendientes.filter(t => t && t.estado !== 'completada');
  };

  // Guardar nueva tarea
  const handleSaveTarea = async (tarea) => {
    try {
      await createTask({ ...tarea, hogar: homeId, estado: 'pendiente' });
      setModalTareaOpen(false);
      const nuevasTareas = await getTasksByHome(homeId);
      setTareasPendientes(Array.isArray(nuevasTareas) ? nuevasTareas : []);
    } catch (err) {
      console.error("Error al guardar tarea:", err);
      setError("No se pudo guardar la tarea");
    }
  };

  // Guardar nueva recompensa - recibe la recompensa ya creada desde el modal
  const handleSaveRecompensa = async (nuevaRecompensa) => {
    try {
      // La recompensa ya fue creada en el servidor por el modal
      // No necesitamos hacer otra solicitud aquí, solo actualizar el estado local
      console.log('Recibida nueva recompensa del modal:', nuevaRecompensa);
      
      // Actualizar estado local añadiendo la nueva recompensa directamente
      setRecompensas(recompensasActuales => {
        // Verificar que recompensasActuales sea un array
        const recompensasArray = Array.isArray(recompensasActuales) ? recompensasActuales : [];
        
        // Verificar que la recompensa no exista ya en el array
        const existeRecompensa = recompensasArray.some(r => r._id === nuevaRecompensa._id);
        
        if (existeRecompensa) {
          console.log('La recompensa ya existe en el estado local, no se añade nuevamente');
          return recompensasArray;
        }
        
        console.log('Añadiendo nueva recompensa al estado local');
        return [...recompensasArray, nuevaRecompensa];
      });
      
      // Cerrar modal - esto ahora se maneja en el modal
      // setModalRecompensaOpen(false);
    } catch (err) {
      console.error("Error al procesar recompensa:", err);
      setError("No se pudo procesar la recompensa: " + (err.message || "Error desconocido"));
    }
  };

  const handleCompletarTarea = async (taskId) => {
    try {
      const response = await updateTask(taskId, { estado: 'completada', completadaEn: new Date() });
      
      // Actualizar el estado local de puntos si se retornaron los puntos actualizados
      if (response && response.puntosActualizados !== undefined && response.usuarioAsignado === userId) {
        setPuntosUsuario(response.puntosActualizados);
      } else {
        // Actualizar usuario para obtener puntos actualizados
        const userUpdated = await getUserProfile(userId);
        if (userUpdated) {
          setPuntosUsuario(userUpdated.puntos || 0);
        }
      }
      
      // Actualizar lista de tareas
      const nuevasTareas = await getTasksByHome(homeId);
      setTareasPendientes(Array.isArray(nuevasTareas) ? nuevasTareas : []);
    } catch (err) {
      console.error("Error al completar tarea:", err);
      setError("No se pudo actualizar la tarea");
    }
  };

  const handleEliminarTarea = async (taskId) => {
    try {
      await deleteTask(taskId);
      const nuevasTareas = await getTasksByHome(homeId);
      setTareasPendientes(Array.isArray(nuevasTareas) ? nuevasTareas : []);
    } catch (err) {
      console.error("Error al eliminar tarea:", err);
      setError("No se pudo eliminar la tarea");
    }
  };

  const handleCanjearRecompensa = async (rewardId) => {
    try {
      setError(null); // Limpiar errores previos
      
      // Verificar que tenemos los puntos necesarios antes de intentar canjear
      const recompensa = recompensas.find(r => r._id === rewardId);
      if (!recompensa) {
        console.error("Recompensa no encontrada:", rewardId);
        setError("No se pudo encontrar la recompensa");
        return;
      }
      
      if (puntosUsuario < recompensa.puntosCosto) {
        setError(`Puntos insuficientes. Necesitas ${recompensa.puntosCosto} puntos para canjear esta recompensa.`);
        return;
      }
      
      // Intentar canjear la recompensa
      console.log(`Intentando canjear recompensa ${rewardId} para usuario ${userId}`);
      const response = await redeemReward(rewardId, userId);
      console.log('Respuesta del canje:', response);
      
      // Actualizar puntos del usuario con la respuesta
      if (response && response.puntos !== undefined) {
        console.log(`Puntos actualizados: ${response.puntos}`);
        setPuntosUsuario(response.puntos);
        
        // Mostrar mensaje de éxito temporal
        setError("✅ Recompensa canjeada exitosamente");
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => setError(null), 3000);
      } else {
        console.warn("La respuesta no contiene puntos actualizados");
        // Actualizar usuario para obtener puntos actualizados
        const userUpdated = await getUserProfile(userId);
        if (userUpdated) {
          console.log(`Obteniendo puntos actualizados del perfil: ${userUpdated.puntos}`);
          setPuntosUsuario(userUpdated.puntos || 0);
        }
      }
      
      // Actualizar lista de recompensas
      const nuevasRecompensas = await getRewardsByHome(homeId);
      setRecompensas(Array.isArray(nuevasRecompensas) ? nuevasRecompensas : []);
    } catch (err) {
      console.error("Error al canjear recompensa:", err);
      setError("No se pudo canjear la recompensa: " + (err.response?.data?.error || err.message));
    }
  };

  const handleEliminarRecompensa = async (rewardId) => {
    try {
      await deleteReward(rewardId);
      const nuevasRecompensas = await getRewardsByHome(homeId);
      setRecompensas(Array.isArray(nuevasRecompensas) ? nuevasRecompensas : []);
    } catch (err) {
      console.error("Error al eliminar recompensa:", err);
      setError("No se pudo eliminar la recompensa");
    }
  };

  // Determinar si debemos mostrar la pantalla de carga
  const isLoading = initialLoading || loading;

  if (!userId) {
    return (
      <Layout>
        <div className="p-4 text-center">
          <div className="bg-yellow-100 text-yellow-700 p-3 rounded">
            Iniciando sesión...
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="text-center py-4">Cargando...</div>
        ) : (
          <>
            {/* Puntos y usuario */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-bold text-lg">
                  {usuarioActual ? `${usuarioActual.nombres} ${usuarioActual.apellidos}` : 'Usuario'}
                </div>
                <div className="text-xs text-gray-500">Nivel 8 🏅</div>
              </div>
              <div className="bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full font-bold text-lg">
                {puntosUsuario} pts
              </div>
            </div>

            {/* Racha y progreso */}
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-orange-500 text-xl">🔥</span>
                <span className="font-semibold text-lg">15 Días</span>
                <span className="text-gray-500">Racha mantenida</span>
              </div>
              <div className="mb-2">
                <div className="text-sm font-semibold">Level 5</div>
                <div className="text-xs text-gray-500 mb-1">3,000 pts para nivel 6</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold">Progreso semanal</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
            </div>

            {/* Botón para asignar tareas */}
            <div className="flex justify-end mb-4">
              <button
                className="bg-green-500 text-white rounded-full p-3 shadow hover:bg-green-600 transition"
                onClick={() => setModalTareaOpen(true)}
              >
                <FaPlus />
              </button>
            </div>

            {/* Tareas pendientes */}
            <div className="mb-4">
              <div className="font-semibold mb-2">Tareas pendientes</div>
              {getTareasPendientes().length === 0 && (
                <div className="text-gray-400">No hay tareas pendientes.</div>
              )}
              {getTareasPendientes().map((t, idx) => (
                <div key={t._id || idx} className="bg-gray-100 rounded-lg p-3 flex items-center justify-between mb-2">
                  <div>
                    <div className="font-medium">{t.descripcion} - <span className="capitalize">{t.estado}</span></div>
                    <div className="text-xs text-gray-500">{t.duracion}</div>
                    <div className="text-xs text-green-600 font-semibold">+{t.puntos || 0} pts</div>
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
              ))}
            </div>

            {/* Recompensas disponibles */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="font-semibold">Recompensas disponibles</div>
                <button
                  className="bg-blue-500 text-white rounded-full p-2 shadow hover:bg-blue-600 transition"
                  onClick={() => setModalRecompensaOpen(true)}
                >
                  <FaPlus size={14} />
                </button>
              </div>
              
              {recompensas.length === 0 ? (
                <div className="text-gray-400">No hay recompensas disponibles.</div>
              ) : (
                recompensas.map((r, idx) => (
                  <div key={r._id || idx} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 mb-2">
                    <div>
                      <div className="font-medium">{r.nombre}</div>
                      {r.descripcion && <div className="text-xs text-gray-500">{r.descripcion}</div>}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-sm">
                        {r.puntosCosto} pts
                      </span>
                      <button
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-white ${
                          puntosUsuario < r.puntosCosto 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                        title={puntosUsuario < r.puntosCosto 
                          ? `Necesitas ${r.puntosCosto - puntosUsuario} puntos más` 
                          : "Canjear recompensa"}
                        onClick={() => handleCanjearRecompensa(r._id)}
                        disabled={puntosUsuario < r.puntosCosto}
                      >
                        <FaGift size={14} />
                      </button>
                      <button
                        className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-white"
                        title="Eliminar recompensa"
                        onClick={() => handleEliminarRecompensa(r._id)}
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
      
      {/* Modales */}
      <AsignarTareaModal
        open={modalTareaOpen}
        onClose={() => setModalTareaOpen(false)}
        onSave={handleSaveTarea}
        usuarios={usuarios}
      />
      
      <CrearRecompensaModal
        open={modalRecompensaOpen}
        onClose={() => setModalRecompensaOpen(false)}
        onSave={handleSaveRecompensa}
        homeId={homeId}
      />
    </Layout>
  );
};

export default Tareas;
