import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RegistrationSuccessPage from './pages/RegistrationSuccessPage';
import ConfiguracionHogar from './pages/ConfiguracionHogar';
import Home from './pages/Home.jsx';
import Perfil from './pages/Perfil';  
import Tareas from './pages/Tareas';
import DetalleTareas from './pages/DetalleTareas';

function App() {
  return (
    <Router>
      <Routes>
        {/* Define las rutas para tus páginas */}
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/registration-success" element={<RegistrationSuccessPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/configuracion-hogar" element={<ConfiguracionHogar />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/tareas" element={<Tareas />} />
        <Route path="/detalle-tareas" element={<DetalleTareas />} />
      </Routes>
    </Router>
  );
}

export default App;
