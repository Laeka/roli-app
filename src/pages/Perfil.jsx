import React, { useState, useEffect, useRef } from 'react';
import { FaEdit } from 'react-icons/fa';
import { useUser } from '../context/UserContext';
import { getProfileByUserId, updateProfile, uploadProfileImage } from '../api/profile';
import avatarDefault from '../assets/avatar-default.png';
import Layout from '../containers/Layout';

const BASE_BACKEND_URL = import.meta.env.VITE_API_URL;

const camposEditables = [
  { key: 'estadoCivil', label: 'Estado civil' },
  { key: 'telefono', label: 'Número de teléfono' },
  { key: 'fechaNacimiento', label: 'Fecha de nacimiento', type: 'date' },
  { key: 'idioma', label: 'Idioma o región' },
];

function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

const Perfil = () => {
  const { userId } = useUser();
  const [userData, setUserData] = useState(null);
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();
  const [imagen, setImagen] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const data = await getProfileByUserId(userId);
        setUserData(data);
        if (data.fotoPerfil) {
          setImagen(data.fotoPerfil);
        }
      } catch (error) {
        console.error("Error al cargar perfil:", error);
        setError('No se pudo cargar el perfil');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [userId]);

  const handleEdit = (key) => {
    setEditField(key);
    setEditValue(userData?.[key] || '');
  };

  const handleSaveField = async (key) => {
    setLoading(true);
    try {
      const dataToUpdate = { [key]: editValue };
      const updatedData = await updateProfile(userId, dataToUpdate);
      
      // Actualizar el estado local con la respuesta
      setUserData(prev => ({ ...prev, ...updatedData }));
      setEditField(null);
      setMensaje('Campo actualizado correctamente');
      setError(null);
    } catch (err) {
      console.error("Error al actualizar campo:", err);
      setError('No se pudo actualizar el campo');
      setMensaje(null);
    } finally {
      setLoading(false);
    }
  };

  const handleImagenChange = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setLoading(true);
    
    try {
      const response = await uploadProfileImage(userId, file);
      if (response && response.fotoPerfil) {
        setImagen(response.fotoPerfil);
        setUserData(prev => ({ ...prev, fotoPerfil: response.fotoPerfil }));
      }
      setMensaje('Imagen de perfil actualizada');
      setError(null);
    } catch (err) {
      console.error("Error al subir imagen:", err);
      setError('No se pudo actualizar la imagen');
      setMensaje(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !userData) {
    return (
      <Layout>
        <div className="text-center mt-10">Cargando perfil...</div>
      </Layout>
    );
  }

  if (!userData) {
    return (
      <Layout>
        <div className="text-center mt-10">No se pudo cargar el perfil</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-100 flex flex-col items-center w-full pb-16">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 mt-8 mb-8">
          {/* Mensajes de estado */}
          {mensaje && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">{mensaje}</div>}
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
          
          {/* Foto y nombre */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              <img
                src={imagen ? imagen : avatarDefault}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover mb-2 cursor-pointer border-2 border-green-400"
                onClick={() => fileInputRef.current.click()}
                title="Haz clic para cambiar la foto"
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleImagenChange}
              />
              <span className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow group-hover:opacity-100 opacity-80 transition">
                <FaEdit className="text-green-600" />
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg">{userData.nombre || ''} {userData.apellidos || ''}</span>
            </div>
            <p className="text-gray-500 text-center mt-2">
              Revisá cómo van otras duplas, compartí logros y sumá puntos con tu roomie.
            </p>
          </div>

          {/* Puntuación */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <span className="font-medium">Puntuación total</span>
              <span className="font-bold text-green-600 text-lg">{userData.puntuacionTotal || 4.8} <span className="text-gray-400">/ 5.0</span></span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(userData.puntuacionTotal || 4.8) / 5 * 100}%` }}></div>
            </div>
          </div>

          {/* Información personal */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Información Personal</h3>
            <div className="space-y-3">
              {camposEditables.map(({ key, label, type }) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-700">{label}</span>
                    {editField === key ? (
                      <input
                        type={type || 'text'}
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      />
                    ) : (
                      <span className="text-gray-500">
                        {key === 'fechaNacimiento' ? formatDate(userData[key]) : (userData[key] || '-')}
                      </span>
                    )}
                  </div>
                  {editField === key ? (
                    <button
                      type="button"
                      className="ml-2 text-green-600 font-semibold"
                      onClick={() => handleSaveField(key)}
                      disabled={loading}
                    >
                      Guardar
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="ml-2 text-gray-400 hover:text-green-600"
                      onClick={() => handleEdit(key)}
                    >
                      <FaEdit />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Ranking del mes */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Ranking del mes</h3>
            <div className="space-y-2">
              {(userData.rankingMes || [
                { titulo: 'Pareja más romántica...', descripcion: 'John y Lisa se lucieron con detalles, cenas caseras y mucho cariño.' },
                { titulo: 'Casa más ordenada...', descripcion: '' },
                { titulo: 'Mejor comunicación...', descripcion: '' }
              ]).map((item, idx) => (
                <div key={idx} className="bg-red-50 rounded-lg px-4 py-2 text-sm">
                  <span className="font-medium">{item.titulo}</span>
                  <span className="block text-gray-500">{item.descripcion}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Logros desbloqueados */}
          <div>
            <h3 className="font-semibold mb-2">Logros desbloqueados</h3>
            <div className="space-y-2">
              {(userData.logros || [
                'Modo Limpieza Activado: 3 semanas seguidas cumpliendo las tareas del hogar.',
                'Plan entre roomies...'
              ]).map((logro, idx) => (
                <div key={idx} className="bg-yellow-50 rounded-lg px-4 py-2 text-sm flex items-center">
                  <span className="mr-2">🏅</span>
                  <span>{logro}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Perfil;
