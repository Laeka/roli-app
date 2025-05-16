import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa'; // Importa el ícono de checkmark

function RegistrationSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
      <div className="bg-white p-8 rounded-lg shadow-md"> {/* Contenedor con sombra y esquinas redondeadas */}
        {/* Ícono de éxito */}
        <FaCheckCircle className="mx-auto text-green-500 text-6xl mb-4" /> {/* Ícono grande y verde centrado */}

        {/* Mensaje de éxito */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">¡Registro exitoso!</h2>

        <Link
          to="/login"
          className="inline-block px-6 py-3 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50" // Botón verde redondeado
        >
          Ir a Iniciar Sesión
        </Link>
      </div>
    </div>
  );
}

export default RegistrationSuccessPage;
