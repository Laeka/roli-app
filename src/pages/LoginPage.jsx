import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import AuthLink from '../components/AuthLink';
import MessageDisplay from '../components/MessageDisplay';
import CenteredCard from '../components/CenteredCard';
import { useUser } from '../context/UserContext';

function LoginPage() {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    try {
      const data = await loginUser(emailOrUsername, contrasena);
      setMessage(data.message || 'Inicio de sesión exitoso');
      setIsError(false);
      if (data && data.userId) {
        login(data.userId);
      }
      navigate('/home');
    } catch (error) {
      console.error('Error en el login:', error);
      setMessage(error || 'Error al iniciar sesión');
      setIsError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <CenteredCard className="max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Inicio de Sesión</h2>

        <form onSubmit={handleSubmit}>
          <InputField
            label="Email o Username"
            id="emailOrUsername"
            name="emailOrUsername"
            type="text"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            required
          />

          <InputField
            label="Contraseña"
            id="password"
            name="contrasena"
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />

          <MessageDisplay message={message} isError={isError} />

          <div className="mb-4">
            <PrimaryButton type="submit">
              Iniciar sesión
            </PrimaryButton>
          </div>

          <div className="text-center mb-4">
             <Link
              to="/register"
              className="inline-block w-full px-4 py-2 bg-orange-500 text-white font-semibold rounded-full shadow hover:bg-orange-600 transition duration-200 text-center focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
             >
              Registrarte
            </Link>
          </div>


          <AuthLink to="/forgot-password">
            ¿Olvidaste tu contraseña?
          </AuthLink>
        </form>
      </CenteredCard>
    </div>
  );
}

export default LoginPage;
