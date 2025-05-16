import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Modal lateral */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 flex"
          aria-modal="true"
          role="dialog"
        >
          {/* Fondo translúcido */}
          <div
            className="fixed inset-0"
            onClick={() => setMenuOpen(false)}
          />
          {/* Drawer */}
          <div className="relative bg-white w-64 h-full shadow-lg z-50 p-6 flex flex-col">
            <button
              className="self-end mb-6 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setMenuOpen(false)}
              aria-label="Cerrar menú"
            >
              &times;
            </button>
            <button
              className="text-left text-gray-700 py-2 px-4 rounded hover:bg-gray-100 font-medium"
              onClick={() => {
                setMenuOpen(false);
                window.location.href = '/configuracion-hogar';
              }}
            >
              Configurar hogar
            </button>
            <button
              className="text-left text-gray-700 py-2 px-4 rounded hover:bg-gray-100 font-medium"
              onClick={() => {
                setMenuOpen(false);
                window.location.href = '/detalle-tareas';
              }}
            >
              Detalle de tareas
            </button>
          </div>
        </div>
      )}

      <Header onMenuClick={() => setMenuOpen(true)} />
      <main className="flex-1 flex flex-col items-center justify-start py-4 overflow-y-auto">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
