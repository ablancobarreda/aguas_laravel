import { useState } from 'react';
import { router } from '@inertiajs/react';
import { useAuth } from '../../contexts/AuthContext';
import LogoutConfirmDialog from '../Shared/LogoutConfirmDialog';

export default function Header({ setSidebarOpen, currentModule }) {
  const { user } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleConfirmLogout = async () => {
    setLogoutLoading(true);
    const token = localStorage.getItem('auth_token');

    try {
      if (token) {
        // Llamar a la API de logout
        const response = await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          // Usar router.visit para redirigir con Inertia
          router.visit('/login', {
            method: 'get',
            preserveState: false,
            preserveScroll: false,
          });
        } else {
          // Si falla, limpiar igual y redirigir
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          router.visit('/login');
        }
      } else {
        router.visit('/login');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Limpiar y redirigir de todas formas
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      router.visit('/login');
    } finally {
      setLogoutLoading(false);
      setShowLogoutDialog(false);
    }
  };

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Left side - Mobile menu button + Module title */}
        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#05249E]"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Abrir menú</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <h1 className="text-xl font-semibold text-gray-900 block sm:hidden">
            {currentModule}
          </h1>
        </div>

        {/* Right side - User info, Logout */}
        <div className="flex items-center space-x-4">

          {/* User info */}
          <div className="hidden sm:flex sm:items-center sm:space-x-2">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.username}
              </p>
              <p className="text-xs text-gray-500">
                {user?.role?.name || 'Usuario'}
              </p>
            </div>
            <div className="w-8 h-8 bg-[#05249E] rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogoutClick}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:block">Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={handleConfirmLogout}
        loading={logoutLoading}
      />
    </div>
  );
}

