import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { saveHomeConfig, getHomesByUser, addUserToSpecificHome, getHomeById } from '../api/hogar';
import { getAllUsers } from '../api/usuarios';
import { useUser } from '../context/UserContext';
import Layout from '../containers/Layout';

const espaciosDisponibles = [
  'Cocina',
  'Sala',
  'Comedor',
  'Patio',
  'Baño(s)',
  'Habitación',
  'Aparta estudio'
];

const ConfiguracionHogar = ({ homeId: propHomeId, onConfigSaved }) => {
  const location = useLocation();
  const homeIdFromLocation = location.state?.homeId;
  const { userId } = useUser();
  const [espaciosSeleccionados, setEspaciosSeleccionados] = useState([]);
  const [modulos, setModulos] = useState({
    horarioTrabajo: false,
    normasCasa: false,
    convivencia: false,
  });
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState(null);
  const [usersError, setUsersError] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [homeUsers, setHomeUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [currentHomeId, setCurrentHomeId] = useState(propHomeId || homeIdFromLocation);
  const [addingUser, setAddingUser] = useState(false);
  const [configLoaded, setConfigLoaded] = useState(false);

  // Cargar configuración existente al montar el componente
  useEffect(() => {
    const fetchConfig = async () => {
      if (!userId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Obtener hogares del usuario
        const homes = await getHomesByUser(userId);
        if (homes && homes.length > 0) {
          const home = homes[0];
          setCurrentHomeId(home._id);
          
          // Espacios seleccionados
          if (home.modulos && Array.isArray(home.modulos)) {
            setEspaciosSeleccionados(home.modulos.map(m => m.nombre));
          }
          
          // Configuración de módulos
          if (home.configuracion) {
            setModulos({
              horarioTrabajo: !!home.configuracion.horarioTrabajo,
              normasCasa: !!home.configuracion.normasCasa,
              convivencia: !!home.configuracion.convivencia,
            });
          }
          
          // Obtener detalles del hogar para los usuarios
          const homeDetails = await getHomeById(home._id);
          if (homeDetails && homeDetails.usuarios && Array.isArray(homeDetails.usuarios)) {
            setHomeUsers(homeDetails.usuarios);
          } else {
            console.warn("No se recibieron usuarios válidos del hogar");
            setEspaciosSeleccionados([]);
            setModulos({ horarioTrabajo: false, normasCasa: false, convivencia: false });
            setHomeUsers([]);
          }
        }
        setConfigLoaded(true);
      } catch (error) {
        console.error("Error al cargar la configuración del hogar:", error);
        setError("Error al cargar la configuración del hogar. Por favor, intenta de nuevo.");
        setConfigLoaded(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchConfig();
  }, [userId]);
  
  // Cargar todos los usuarios en un efecto separado
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      setUsersError(null);
      
      try {
        console.log("Cargando usuarios...");
        // Obtener todos los usuarios
        const users = await getAllUsers();
        console.log("Respuesta de getAllUsers:", users);
        
        // Asegurar que users es un array
        if (Array.isArray(users)) {
          console.log(`Se obtuvieron ${users.length} usuarios`);
          setAllUsers(users);
        } else {
          console.warn("La respuesta de getAllUsers no es un array:", users);
          setUsersError("No se pudieron cargar los usuarios correctamente");
          setAllUsers([]);
        }
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
        setUsersError(`Error al cargar usuarios: ${error.message}`);
        setAllUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };
    
    fetchUsers();
  }, []);

  const handleEspacioChange = (espacio) => {
    if (!espacio) return;
    
    setEspaciosSeleccionados((prev) => {
      // Asegurar que prev es un array
      const currentSeleccion = Array.isArray(prev) ? prev : [];
      
      // Si ya existe, eliminar; de lo contrario, agregar
      if (currentSeleccion.includes(espacio)) {
        return currentSeleccion.filter((e) => e !== espacio);
      } else {
        return [...currentSeleccion, espacio];
      }
    });
  };

  const handleModuloChange = (modulo) => {
    setModulos((prev) => ({
      ...prev,
      [modulo]: !prev[modulo],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const modulosPayload = Array.isArray(espaciosSeleccionados)
        ? espaciosSeleccionados.map(nombreEspacio => ({
          nombre: nombreEspacio,
          estado: 'pendiente'
        }))
        : [];

      let dataToSend;
      let result;

      if(currentHomeId) {
        dataToSend = {
          configuracion: modulos,
          modulos: modulosPayload,
        }
        result = await saveHomeConfig(dataToSend, currentHomeId);
        alert('¡Configuración del hogar actualizada!');
      }else {
        if (!userId) {
          setError("Error: Usuario no identificado. No se puede crear el hogar.");
          setLoading(false);
          return;
        }
        const defaultHomeName = 'Mi Hogar';
        dataToSend = {
          nombre: defaultHomeName,
          primerUsuarioId: userId,
          configuracion: modulos,
          modulos: modulosPayload,
        };
        result = await saveHomeConfig(dataToSend, null);
        setCurrentHomeId(result._id);
        
        const homeDetails = await getHomeById(result._id);
        if (homeDetails && homeDetails.usuarios) {
            setHomeUsers(homeDetails.usuarios);
        }
        alert('¡Hogar creado y configuración guardada!');
      }

      if (onConfigSaved) onConfigSaved();
    } catch (error) {
      console.error("Error al guardar la configuración:", error);
      setError("Error al guardar la configuración. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!selectedUserId || !currentHomeId) {
      alert('Seleccione un usuario y asegúrese de que existe un hogar configurado');
      return;
    }
    
    setAddingUser(true);
    try {
      await addUserToSpecificHome(currentHomeId, selectedUserId);
      
      // Actualizar la lista de usuarios del hogar
      const homeDetails = await getHomeById(currentHomeId);
      if (homeDetails && homeDetails.usuarios && Array.isArray(homeDetails.usuarios)) {
        setHomeUsers(homeDetails.usuarios);
      } else {
        console.warn("No se recibieron usuarios válidos del hogar después de agregar un usuario");
      }
      
      setSelectedUserId('');
      alert('Usuario agregado correctamente');
    } catch (error) {
      console.error("Error al agregar usuario:", error);
      alert('Error al agregar usuario al hogar');
    } finally {
      setAddingUser(false);
    }
  };

  // Función segura para filtrar usuarios disponibles
  const getAvailableUsers = () => {
    if (!Array.isArray(allUsers)) return [];
    if (!Array.isArray(homeUsers)) return allUsers;
    
    return allUsers.filter(user => 
      user && 
      !homeUsers.some(homeUser => homeUser && homeUser._id === user._id) && 
      user._id !== userId
    );
  };

  // Filtrar usuarios que no están en el hogar
  const availableUsers = getAvailableUsers();

  // Determinar si debemos mostrar la pantalla de carga
  const isInitialLoading = !userId || (!configLoaded && loading);

  if (isInitialLoading) {
    return (
      <Layout>
        <div className="p-4 text-center">
          <div className="bg-yellow-100 text-yellow-700 p-3 rounded">
            Cargando información de usuario...
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-100 flex flex-col items-center w-full pb-16">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 mt-8 mb-8">
          {loading && (
            <div className="bg-blue-100 text-blue-700 p-3 rounded mb-4">
              Cargando configuración...
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {/* Título y descripción */}
          <h2 className="text-xl font-semibold mb-2">Configuración del Hogar</h2>
          <p className="text-gray-500 mb-6">
            Define cómo es tu espacio y con quién lo compartes.
          </p>

          {/* Selección de usuarios */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Usuarios del hogar</h3>
            
            {/* Estado de carga y errores para usuarios */}
            {loadingUsers && (
              <div className="text-sm text-blue-600 mb-2">
                Cargando usuarios disponibles...
              </div>
            )}
            
            {usersError && (
              <div className="bg-red-100 text-red-700 p-2 rounded mb-2 text-sm">
                {usersError}
              </div>
            )}
            
            {/* Lista de usuarios actuales */}
            {Array.isArray(homeUsers) && homeUsers.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Usuarios actuales:</p>
                <ul className="bg-gray-50 p-2 rounded">
                  {homeUsers.map(user => (
                    <li key={user._id} className="py-1 px-2 text-sm">
                      {user.nombre || user.nombres || user.email || user.username || user._id}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Selector para agregar nuevos usuarios */}
            <div className="flex space-x-2">
              <select 
                value={selectedUserId} 
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="flex-grow border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                disabled={!currentHomeId && availableUsers.length === 0 || addingUser || loadingUsers}
              >
                <option value="">
                  {loadingUsers 
                    ? "Cargando usuarios..." 
                    : !currentHomeId
                    ? "Cree un hogar primero"
                    : availableUsers.length === 0 
                      ? "No hay usuarios disponibles" 
                      : "Seleccione un usuario para agregar"}
                </option>
                {currentHomeId && Array.isArray(availableUsers) && availableUsers.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.nombre || user.nombres || user.email || user.username || user._id}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddUser}
                disabled={!selectedUserId || addingUser || loadingUsers}
                className="bg-green-500 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-green-600 transition disabled:opacity-50"
              >
                {addingUser ? 'Agregando...' : 'Agregar'}
              </button>
            </div>
            
            {/* Mensaje cuando no hay usuarios disponibles */}
            {!loadingUsers && availableUsers.length === 0 && !usersError && (
              <div className="text-sm text-gray-500 mt-2">
                No hay más usuarios disponibles para agregar al hogar.
              </div>
            )}
          </div>

          {/* Selección de espacios */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block font-medium mb-2">Seleccione*:</label>
              <div className="space-y-2">
                {Array.isArray(espaciosDisponibles) && espaciosDisponibles.map((espacio) => (
                  <label key={espacio} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="espacios"
                      value={espacio}
                      checked={Array.isArray(espaciosSeleccionados) && espaciosSeleccionados.includes(espacio)}
                      onChange={() => handleEspacioChange(espacio)}
                      className="accent-green-500"
                    />
                    <span>{espacio}</span>
                  </label>
                ))}
              </div>
            </div>

          {/* Configuración de módulos */}
          <div className="mb-8">
            <label className="block font-medium mb-2">Configuración de módulos</label>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-purple-50 rounded-lg px-4 py-2">
                <span className="text-purple-700 font-medium">Horario de trabajo</span>
                <input
                  type="checkbox"
                  checked={modulos.horarioTrabajo}
                  onChange={() => handleModuloChange('horarioTrabajo')}
                  className="accent-purple-500 w-5 h-5"
                />
              </div>
              <div className="flex items-center justify-between bg-red-50 rounded-lg px-4 py-2">
                <span className="text-red-700 font-medium">Normas de la casa</span>
                <input
                  type="checkbox"
                  checked={modulos.normasCasa}
                  onChange={() => handleModuloChange('normasCasa')}
                  className="accent-red-500 w-5 h-5"
                />
              </div>
              <div className="flex items-center justify-between bg-blue-50 rounded-lg px-4 py-2">
                <span className="text-blue-700 font-medium">Convivencia</span>
                <input
                  type="checkbox"
                  checked={modulos.convivencia}
                  onChange={() => handleModuloChange('convivencia')}
                  className="accent-blue-500 w-5 h-5"
                />
              </div>
            </div>
          </div>

          {/* Botón aceptar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white rounded-lg py-3 font-semibold text-lg hover:bg-green-600 transition disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Aceptar'}
          </button>
        </form>
      </div>
    </div>
  </Layout>
);
};

export default ConfiguracionHogar;
