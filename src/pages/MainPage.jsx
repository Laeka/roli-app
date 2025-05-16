import React from 'react';
import { Link } from 'react-router-dom';
import RoomLifeLogo from '../assets/roomlifelogo.png';

function MainPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="text-center">
        {/* Logo centrado y con algo de espacio */}
        <img
          src={RoomLifeLogo}
          alt="Room Life Logo"
          className="mx-auto mb-8 w-32 h-32 object-contain" // w-32 h-32 para tamaño, object-contain para que la imagen no se distorsione
        />
        <h1 className="text-4xl font-bold text-gray-800 mb-8">ROOM LIFE</h1>

        {/* Opcional: Botones para navegar a Login/Registro */}
        <div className="flex flex-col space-y-4">
          <Link
            to="/login"
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-full shadow hover:bg-green-600 transition duration-200 text-center"
          >
            Iniciar Sesión
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-full shadow hover:bg-orange-600 transition duration-200 text-center"
          >
            Registrarte
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
