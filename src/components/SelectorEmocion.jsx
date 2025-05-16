import React from 'react';
import { FaMeh, FaSmile, FaFrown, FaSurprise, FaGrinStars, FaMehRollingEyes } from 'react-icons/fa';

const emociones = [
  { nombre: 'Neutro', icono: <FaMeh className="text-gray-500" /> },
  { nombre: 'Bien', icono: <FaSmile className="text-green-500" /> },
  { nombre: 'Triste', icono: <FaFrown className="text-blue-500" /> },
  { nombre: 'Intrigado', icono: <FaSurprise className="text-yellow-500" /> },
  { nombre: 'Calmado', icono: <FaGrinStars className="text-purple-500" /> },
  { nombre: 'Temeroso', icono: <FaMehRollingEyes className="text-red-500" /> },
];

const SelectorEmocion = ({ onSelect }) => (
  <div className="flex space-x-2 bg-white p-2 rounded shadow z-50">
    {emociones.map(e => (
      <button
        key={e.nombre}
        className="p-1 hover:bg-gray-100 rounded"
        onClick={() => onSelect(e.nombre)}
        title={e.nombre}
        type="button"
      >
        {e.icono}
      </button>
    ))}
  </div>
);

export default SelectorEmocion;
