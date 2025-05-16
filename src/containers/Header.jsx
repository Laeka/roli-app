import React from 'react';
import { FaBars, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Header = ({ onMenuClick }) => {
  const { logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white py-4 border-b border-gray-200 flex items-center justify-center relative">
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-700"
        onClick={onMenuClick}
        aria-label="Abrir menú"
      >
        <FaBars />
      </button>
      <span className="font-bold text-lg flex items-center">
        ROLI
      </span>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-gray-700 hover:text-red-600 transition"
        onClick={handleLogout}
        aria-label="Cerrar sesión"
      >
        <FaSignOutAlt />
      </button>
    </header>
  );
};

export default Header;
