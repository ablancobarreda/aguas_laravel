import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { AuthProvider, useAuth } from '../../contexts/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

function DashboardShellContent({ children, auth }) {
  const { user, isLoading, updateUserFromProps } = useAuth();
  const { url, props } = usePage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentModule, setCurrentModule] = useState('Dashboard');

  // Actualizar usuario desde las props de Inertia si están disponibles
  useEffect(() => {
    if (props?.auth?.user) {
      updateUserFromProps(props.auth.user);
    }
  }, [props?.auth?.user, updateUserFromProps]);

  useEffect(() => {
    const pathSegments = url.split('/');
    const module = pathSegments[pathSegments.length - 1];

    const moduleNames = {
      'dashboard': 'Dashboard',
      'estaciones': 'Estaciones',
      'canales': 'Canales',
      'registros': 'Registros',
      'usuarios': 'Usuarios',
      'roles': 'Roles',
      'provincias': 'Provincias',
      'municipios': 'Municipios',
      'localidades': 'Localidades',
      'configuracion': 'Configuración'
    };

    setCurrentModule(moduleNames[module] || 'Dashboard');
  }, [url]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#05249E] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h1>
          <p className="text-red-600">Usuario no autenticado</p>
          <a href="/login" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
            Ir al login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        currentModule={currentModule}
        setCurrentModule={setCurrentModule}
      />

      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header
          setSidebarOpen={setSidebarOpen}
          currentModule={currentModule}
        />

        <main className="flex-grow py-6">
          <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default function DashboardShell({ children, auth }) {
  return (
    <AuthProvider>
      <DashboardShellContent auth={auth}>{children}</DashboardShellContent>
    </AuthProvider>
  );
}

