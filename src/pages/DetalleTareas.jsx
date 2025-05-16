import React, { useEffect, useState } from 'react';
import Layout from '../containers/Layout';
import { useUser } from '../context/UserContext';
import { getHomesByUser } from '../api/hogar';
import { getTaskHistory, getTaskStats } from '../api/tareas';
import { getDailyLogs, createDailyLog } from '../api/dailylog';
import { FaPlus, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import AgregarNotaModal from '../components/AgregarNotaModal';
import SelectorEmocion from '../components/SelectorEmocion';
import { FaMeh, FaSmile, FaFrown, FaSurprise, FaGrinStars, FaMehRollingEyes } from 'react-icons/fa';
const emocionesIconos = {
  Neutro: <FaMeh className="text-gray-500" />,
  Bien: <FaSmile className="text-green-500" />,
  Triste: <FaFrown className="text-blue-500" />,
  Intrigado: <FaSurprise className="text-yellow-500" />,
  Calmado: <FaGrinStars className="text-purple-500" />,
  Temeroso: <FaMehRollingEyes className="text-red-500" />,
};

const DetalleTareas = () => {
  const { userId } = useUser();
  const [homeId, setHomeId] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [estadisticas, setEstadisticas] = useState({});
  const [logs, setLogs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [editNota, setEditNota] = useState('');
  const [editEmocion, setEditEmocion] = useState('Neutro');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHome = async () => {
      if (!userId) return;
      try {
        const homes = await getHomesByUser(userId);
        if (homes && homes.length > 0) setHomeId(homes[0]._id);
      } catch (err) {
        console.error("Error al obtener hogar del usuario:", err);
        setError("Error al cargar información del hogar");
      }
    };
    fetchHome();
  }, [userId]);

  useEffect(() => {
    if (!homeId) return;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const historialData = await getTaskHistory(homeId);
        setHistorial(Array.isArray(historialData) ? historialData : []);
        
        const statsData = await getTaskStats(homeId);
        setEstadisticas(statsData || {});
        
        const logsData = await getDailyLogs(homeId);
        setLogs(Array.isArray(logsData) ? logsData : []);
      } catch (err) {
        console.error("Error al obtener datos de tareas:", err);
        setError("Error al cargar historial y estadísticas");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [homeId]);

  // Función para obtener el historial de forma segura
  const getHistorialSeguro = () => {
    return Array.isArray(historial) ? historial : [];
  };

  // Función para obtener logs de forma segura
  const getLogsSeguro = () => {
    return Array.isArray(logs) ? logs : [];
  };

  const handleAddNota = async (data) => {
    try {
      await createDailyLog({
        ...data,
        homeId,
        userId
      });
      setModalOpen(false);
      const logsData = await getDailyLogs(homeId);
      setLogs(Array.isArray(logsData) ? logsData : []);
    } catch (err) {
      console.error("Error al agregar nota:", err);
      setError("No se pudo agregar la nota");
    }
  };

  const handleEditClick = (idx) => {
    const logsArray = getLogsSeguro();
    if (idx >= 0 && idx < logsArray.length) {
      setEditIdx(idx);
      setEditNota(logsArray[idx].nota || '');
      setEditEmocion(logsArray[idx].emocion || 'Neutro');
    }
  };

  const handleUpdateNota = async (idx) => {
    try {
      const logsArray = getLogsSeguro();
      if (idx < 0 || idx >= logsArray.length) return;
      
      const log = logsArray[idx];
      await createDailyLog({
        fecha: log.fecha,
        emocion: editEmocion,
        nota: editNota,
        homeId,
        userId,
        logId: log._id // para actualización
      });
      setEditIdx(null);
      const logsData = await getDailyLogs(homeId);
      setLogs(Array.isArray(logsData) ? logsData : []);
    } catch (err) {
      console.error("Error al actualizar nota:", err);
      setError("No se pudo actualizar la nota");
    }
  };

  return (
    <Layout>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-4">Cargando...</div>
        ) : (
          <>
            {/* Historial de tareas */}
            <h2 className="text-lg font-bold mb-4">Historial de tareas</h2>
            <div className="mb-6">
              {getHistorialSeguro().length === 0 && <div className="text-gray-400">No hay tareas completadas.</div>}
              {getHistorialSeguro().map((t, idx) => (
                <div key={idx} className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-medium">{t.descripcion}</span>
                    <span className="text-xs text-gray-500 ml-2">{new Date(t.completadaEn).toLocaleDateString('es-ES')}</span>
                  </div>
                  <span className="text-xs text-gray-500">{t.usuarioAsignado?.nombres || '-'}</span>
                </div>
              ))}
            </div>

            {/* Estadísticas */}
            <h2 className="text-lg font-bold mb-2">Estadísticas</h2>
            <div className="mb-6">
              <div className="mb-1">Últimos 7 días:</div>
              <div className="text-sm">Tareas completadas: <span className="font-bold">{estadisticas.tareasCompletadas || 0}</span></div>
              <div className="text-sm">Emociones positivas: <span className="font-bold">{estadisticas.emocionesPositivas || 0}</span></div>
              <div className="text-sm">Días con racha: <span className="font-bold">{estadisticas.rachaDias || 0}</span></div>
            </div>

            {/* Emociones y notas diarias */}
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold">Emociones y notas</h2>
              <button
                className="bg-green-500 text-white rounded-full p-2 shadow hover:bg-green-600 transition"
                onClick={() => setModalOpen(true)}
                title="Agregar nota y emoción"
              >
                <FaPlus />
              </button>
            </div>
            <div>
              {getLogsSeguro().length === 0 && <div className="text-gray-400">No hay registros diarios.</div>}
              {getLogsSeguro().map((log, idx) => (
                <div key={idx} className="mb-2 bg-gray-50 rounded-lg p-2 relative">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{new Date(log.fecha).toLocaleDateString('es-ES')}</span>
                    {editIdx === idx ? (
                      <SelectorEmocion
                        onSelect={emocion => setEditEmocion(emocion)}
                        valorInicial={editEmocion}
                      />
                    ) : (
                      <span className="text-xl">{emocionesIconos[log.emocion || 'Neutro']}</span>
                    )}
                    {editIdx === idx ? (
                      <>
                        <button
                          className="ml-2 text-green-600"
                          onClick={() => handleUpdateNota(idx)}
                          title="Guardar"
                        >
                          <FaCheck />
                        </button>
                        <button
                          className="ml-2 text-red-500"
                          onClick={() => setEditIdx(null)}
                          title="Cancelar"
                        >
                          <FaTimes />
                        </button>
                      </>
                    ) : (
                      <button
                        className="ml-2 text-gray-400 hover:text-green-600"
                        onClick={() => handleEditClick(idx)}
                        title="Editar nota y emoción"
                      >
                        <FaEdit />
                      </button>
                    )}
                  </div>
                  {editIdx === idx ? (
                    <textarea
                      className="w-full mt-2 p-2 border rounded"
                      value={editNota}
                      onChange={e => setEditNota(e.target.value)}
                    />
                  ) : (
                    log.nota && <div className="text-xs text-gray-600 mt-1">{log.nota}</div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <AgregarNotaModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleAddNota}
      />
    </Layout>
  );
};

export default DetalleTareas;
