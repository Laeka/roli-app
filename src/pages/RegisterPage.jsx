import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import AuthLink from '../components/AuthLink';
import MessageDisplay from '../components/MessageDisplay';
import CenteredCard from '../components/CenteredCard';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    telefono: '',
    email: '',
    estadoRegion: '',
    residencia: '',
    habitacion: '',
    universidad: '',
    username: '',
    contrasena: '',
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    try {
      const data = await registerUser(formData);
      setMessage(data.message || 'Registro exitoso');
      setIsError(false);
      console.log('Usuario registrado:', data);
      navigate('/registration-success');
    } catch (error) {
      console.error('Error en el registro:', error);
      setMessage(error || 'Error al registrar usuario');
      setIsError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <CenteredCard className="max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Registro</h2>

        <form onSubmit={handleSubmit}>
          <InputField label="Nombres" id="nombres" name="nombres" value={formData.nombres} onChange={handleChange} required />
          <InputField label="Apellidos" id="apellidos" name="apellidos" value={formData.apellidos} onChange={handleChange} required />
          <InputField label="Teléfono" id="telefono" name="telefono" type="tel" value={formData.telefono} onChange={handleChange} required />
          <InputField label="Correo electrónico" id="email" name="email" type="email" value={formData.correoElectronico} onChange={handleChange} required />
          <InputField label="Estado/Región" id="estadoRegion" name="estadoRegion" value={formData.estadoRegion} onChange={handleChange} required />
          <InputField label="Residencia" id="residencia" name="residencia" value={formData.residencia} onChange={handleChange} required />
          <InputField label="Habitación" id="habitacion" name="habitacion" value={formData.habitacion} onChange={handleChange} required />
          <InputField label="Universidad (Opcional)" id="universidad" name="universidad" value={formData.universidad} onChange={handleChange} />
          <InputField label="Username" id="username" name="username" value={formData.username} onChange={handleChange} required />
          <InputField label="Contraseña" id="contrasena" name="contrasena" type="password" value={formData.contrasena} onChange={handleChange} required />

          <MessageDisplay message={message} isError={isError} />

          <div className="mb-4">
            <PrimaryButton type="submit">
              Aceptar
            </PrimaryButton>
          </div>

          <AuthLink to="/login">
            ¿Ya tienes cuenta? Inicia sesión aquí.
          </AuthLink>
        </form>
      </CenteredCard>
    </div>
  );
}

export default RegisterPage;
