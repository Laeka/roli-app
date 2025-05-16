import React, { useState, useEffect } from 'react';
import { getAllUsers } from '../api/usuarios';

const AsignarTareaModal = ({ open, onClose, onSave, usuarios: usuariosProp }) => {
  const [descripcion, setDescripcion] = useState('');
  const [usuario, setUsuario] = useState('');
  const [duracion, setDuracion] = useState('');
  const [puntos, setPuntos] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Usar usuarios proporcionados como prop si están disponibles
  useEffect(() => {
    if (Array.isArray(usuariosProp) && usuariosProp.length > 0) {
      setUsuarios(usuariosProp);
      // Si hay usuarios y ninguno está seleccionado, seleccionar el primero por defecto
      if (!usuario && usuariosProp.length > 0) {
        setUsuario(usuariosProp[0]._id);
      }
    }
  }, [usuariosProp, usuario]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar que los puntos sean un número
    const puntosValue = parseInt(puntos);
    if (isNaN(puntosValue) || puntosValue < 0) {
      setError('Los puntos deben ser un número válido mayor o igual a 0');
      return;
    }
    
    onSave({ 
      descripcion, 
      usuarioAsignado: usuario, 
      duracion,
      puntos: puntosValue 
    });
    
    // Limpiar formulario
    setDescripcion('');
    setUsuario('');
    setDuracion('');
    setPuntos('');
  };

  // Cargar usuarios solo si no se proporcionaron como prop
  useEffect(() => {
    const fetchData = async () => {
      // Si ya tenemos usuarios proporcionados, no necesitamos cargarlos
      if (Array.isArray(usuariosProp) && usuariosProp.length > 0) {
        return;
      }
      
      setLoading(true);
      setError(null);
      try {
        const data = await getAllUsers();
        console.log("Usuarios cargados en modal:", data);
        if (Array.isArray(data)) {
          setUsuarios(data);
          // Si hay usuarios y ninguno está seleccionado, seleccionar el primero por defecto
          if (data.length > 0 && !usuario) {
            setUsuario(data[0]._id);
          }
        } else {
          console.error("La respuesta no es un array:", data);
          setError("Error al cargar usuarios");
          setUsuarios([]);
        }
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
        setError("Error al cargar usuarios: " + (err.message || "Desconocido"));
        setUsuarios([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (open) {
      fetchData();
    }
  }, [open, usuariosProp, usuario]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">
        <h2 className="text-lg font-bold mb-4">Asignar tarea</h2>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm text-gray-700 mb-1">Descripción*</label>
            <input
              className="w-full p-2 border rounded"
              placeholder="Descripción de la tarea"
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm text-gray-700 mb-1">Asignar a*</label>
            {loading ? (
              <div className="w-full p-2 border rounded bg-gray-100">
                Cargando usuarios...
              </div>
            ) : (
              <select
                className="w-full p-2 border rounded"
                value={usuario}
                onChange={e => setUsuario(e.target.value)}
                required
                disabled={usuarios.length === 0}
              >
                {usuarios.length === 0 ? (
                  <option value="">No hay usuarios disponibles</option>
                ) : (
                  usuarios.map(u => (
                    <option key={u._id} value={u._id}>
                      {u.nombres || u.nombre} {u.apellidos || u.apellido}
                    </option>
                  ))
                )}
              </select>
            )}
          </div>
          
          <div className="mb-3">
            <label className="block text-sm text-gray-700 mb-1">Duración*</label>
            <input
              className="w-full p-2 border rounded"
              placeholder="Ej: 20 min"
              value={duracion}
              onChange={e => setDuracion(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">Puntos*</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              placeholder="Ej: 100"
              value={puntos}
              onChange={e => setPuntos(e.target.value)}
              required
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              Puntos que ganará el usuario al completar la tarea
            </p>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
              disabled={loading || usuarios.length === 0}
            >
              Aceptar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AsignarTareaModal;
