import React, { useState } from 'react';
import { createReward } from '../api/rewards';

const CrearRecompensaModal = ({ open, onClose, homeId, onSave }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [puntosCosto, setPuntosCosto] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nombre || !puntosCosto || isNaN(parseInt(puntosCosto))) {
      setError('Por favor completa todos los campos correctamente');
      return;
    }
    
    if (!homeId) {
      setError('No se ha proporcionado un ID de hogar válido');
      console.error('Error: homeId es inválido o nulo', { homeId });
      return;
    }
    
    if (loading) {
      console.log('Ya hay una solicitud en proceso, ignorando clic adicional');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const rewardData = {
        nombre,
        descripcion,
        puntosCosto: parseInt(puntosCosto),
        hogar: homeId
      };
      
      console.log('Enviando solicitud para crear recompensa');
      const nuevaRecompensa = await createReward(rewardData);
      console.log('Recompensa creada exitosamente:', nuevaRecompensa);
      
      setNombre('');
      setDescripcion('');
      setPuntosCosto('');
      
      setTimeout(() => {
        onSave(nuevaRecompensa);
        onClose();
      }, 0);
    } catch (err) {
      console.error("Error al crear recompensa:", err);
      setError('No se pudo crear la recompensa: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };
  
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">
        <h2 className="text-lg font-bold mb-4">Crear nueva recompensa</h2>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm text-gray-700 mb-1">Nombre*</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Ej: Salida al cine"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm text-gray-700 mb-1">Descripción (opcional)</label>
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Describe la recompensa"
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              rows="2"
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">Costo en puntos*</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              placeholder="Ej: 500"
              value={puntosCosto}
              onChange={e => setPuntosCosto(e.target.value)}
              required
              min="1"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearRecompensaModal; 