import { useState } from 'react';
import { Head, router } from '@inertiajs/react';

export default function Login({ errors }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(errors?.message || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('auth_token', data.token);
        // Guardar también el usuario en localStorage para acceso rápido
        if (data.user) {
          localStorage.setItem('auth_user', JSON.stringify(data.user));
        } else if (data.id) {
          // Si el login devuelve el usuario directamente en la raíz
          localStorage.setItem('auth_user', JSON.stringify({
            id: data.id,
            username: data.username,
            role_id: data.role_id,
            role: data.role,
          }));
        }
        // Usar router.visit para navegar con Inertia
        router.visit('/dashboard');
      } else {
        setError(data.error || 'Error de autenticación');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head title="Iniciar Sesión - Aguas" />
      <div className="min-h-screen bg-gradient-to-br from-[#05249E] to-[#5D5FEF] relative overflow-hidden">
        <div className="absolute w-[400px] h-[400px] rounded-full bg-white/10 -top-48 -left-48"></div>
        <div className="absolute w-[300px] h-[300px] rounded-full bg-white/8 -bottom-36 -right-36"></div>
        <div className="absolute w-[250px] h-[250px] rounded-full bg-white/12 top-24 -right-32"></div>

        <div className="min-h-screen flex flex-col items-center justify-center p-5">
          <div className="text-center mb-8">
            <div className="w-40 h-40 mx-auto mb-8 bg-white/20 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" height="100px" viewBox="0 -960 960 960" width="272px" fill="white">
                <path d="M491-200q12-1 20.5-9.5T520-230q0-14-9-22.5t-23-7.5q-41 3-87-22.5T343-375q-2-11-10.5-18t-19.5-7q-14 0-23 10.5t-6 24.5q17 91 80 130t127 35ZM480-80q-137 0-228.5-94T160-408q0-100 79.5-217.5T480-880q161 137 240.5 254.5T800-408q0 140-91.5 234T480-80Zm0-80q104 0 172-70.5T720-408q0-73-60.5-165T480-774Q361-665 300.5-573T240-408q0 107 68 177.5T480-160Zm0-320Z"/>
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">Aguas</h2>
            <p className="text-xl text-white/90">Sistema de Monitoreo</p>
          </div>

          <div className="w-full max-w-md">
            <div className="bg-white/90 rounded-3xl p-8 backdrop-blur-sm shadow-2xl">
              <h3 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
                Iniciar Sesión
              </h3>

              {error && (
                <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-xl">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Usuario
                  </label>
                  <div className="relative bg-black/5 border border-black/10 rounded-xl">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-black/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      id="username"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-transparent text-gray-800 placeholder-black/40 border-0 focus:outline-none text-lg"
                      placeholder="Tu nombre de usuario"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <div className="relative bg-black/5 border border-black/10 rounded-xl">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-black/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 bg-transparent text-gray-800 placeholder-black/40 border-0 focus:outline-none text-lg"
                      placeholder="Tu contraseña"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black/50 hover:text-black/70 transition-colors"
                      disabled={loading}
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-8 bg-[#05249E] hover:bg-[#041f85] disabled:bg-gray-400 text-white font-semibold rounded-2xl transition-all duration-200 text-lg shadow-xl transform hover:scale-105 disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Iniciando sesión...</span>
                    </div>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                  Sistema de Monitoreo de Aguas
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Versión 1.0.6
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <p className="text-white/90 text-sm mb-2">
                  <strong>Acceso de prueba:</strong>
                </p>
                <p className="text-white/70 text-xs">
                  Usuario: <span className="font-mono bg-white/20 px-2 py-1 rounded">admin</span>
                </p>
                <p className="text-white/70 text-xs mt-1">
                  Contraseña: <span className="font-mono bg-white/20 px-2 py-1 rounded">admin</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
