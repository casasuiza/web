import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login, register, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (isLogin) {
      const loginSuccess = await login(username, password);
      if (loginSuccess) {
        setTimeout(() => {
          const userData = JSON.parse(localStorage.getItem('user') || '{}');
          if (userData.rol?.toLowerCase() === 'admin') {
            navigate('/admin');
          } else {
            setError('Acceso denegado: Solo administradores pueden acceder');
            logout();
          }
        }, 100);
      } else {
        setError('Credenciales inválidas');
      }
    } else {
      const registerSuccess = await register(username, email, password);
      if (registerSuccess) {
        setSuccess('Usuario registrado exitosamente. Ahora puedes iniciar sesión.');
        setIsLogin(true);
        setUsername('');
        setEmail('');
        setPassword('');
      } else {
        setError('Error al registrar usuario');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-custom-red">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold text-center">
          {isLogin ? 'Iniciar sesión' : 'Registrarse'}
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
          )}
          {isLogin ? (
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
          ) : (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
          )}
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded"
          >
            {isLogin ? 'Entrar' : 'Registrarse'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setSuccess('');
              setUsername('');
              setEmail('');
              setPassword('');
            }}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
          >
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded"
          >
            Volver
          </button>
        </form>
      </div>
    </div>
  );
}