import React, { useState } from 'react';

const emociones = [
  'Neutro',
  'Bien',
  'Triste',
  'Intrigado',
  'Calmado',
  'Temeroso'
];

const AgregarNotaModal = ({ open, onClose, onSave }) => {
  const [nota, setNota] = useState('');
  const [emocion, setEmocion] = useState('Neutro');
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ fecha, emocion, nota });
    setNota('');
    setEmocion('Neutro');
    setFecha(new Date().toISOString().slice(0, 10));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">
        <h2 className="text-lg font-bold mb-4">Agregar nota y emoción</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="w-full mb-2 p-2 border rounded"
            type="date"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
            required
          />
          <select
            className="w-full mb-2 p-2 border rounded"
            value={emocion}
            onChange={e => setEmocion(e.target.value)}
            required
          >
            {emociones.map(e => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
          <textarea
            className="w-full mb-4 p-2 border rounded"
            placeholder="Escribe una nota..."
            value={nota}
            onChange={e => setNota(e.target.value)}
            required
          />
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">Aceptar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgregarNotaModal;
