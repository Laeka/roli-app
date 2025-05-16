import React from 'react';
import { FaHome, FaTasks, FaUser} from 'react-icons/fa';
import { Link, useLocation} from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  

  return (
    <nav className="sticky bottom-0 w-full bg-white border-t border-gray-200 flex justify-around py-2 z-10">
      <Link to="/home" className={`flex flex-col items-center ${location.pathname === '/home' ? 'text-green-600' : 'text-gray-500'}`}>
        <FaHome className="text-xl" />
        <span className="text-xs">Inicio</span>
      </Link>
      <Link to="/tareas" className={`flex flex-col items-center ${location.pathname === '/tareas' ? 'text-green-600' : 'text-gray-500'}`}>
        <FaTasks className="text-xl" />
        <span className="text-xs">Tareas</span>
      </Link>
      <Link to="/perfil" className={`flex flex-col items-center ${location.pathname === '/perfil' ? 'text-green-600' : 'text-gray-500'}`}>
        <FaUser className="text-xl" />
        <span className="text-xs">Perfil</span>
      </Link>
    </nav>
  );
};

export default Footer;
