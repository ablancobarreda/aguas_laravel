import { Head } from '@inertiajs/react';
import DashboardShell from '../../../Components/Dashboard/DashboardShell';

export default function Configuracion() {
  return (
    <DashboardShell>
      <Head title="Configuración - Aguas" />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Configuración del Sistema
          </h1>
          <p className="mt-2 text-gray-600">
            Administra la configuración general del sistema de monitoreo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configuración de API */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="px-6 py-5">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-[#05249E]/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#05249E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Configuración de API
                </h3>
              </div>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  Configura las URLs y parámetros de conexión del servidor API.
                </p>
              </div>
            </div>
          </div>

          {/* Configuración de Tema */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="px-6 py-5">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-[#05249E]/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#05249E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Preferencias de Visualización
                </h3>
              </div>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  Personaliza la apariencia y comportamiento de la interfaz.
                </p>
              </div>
            </div>
          </div>

          {/* Configuración FTP */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="px-6 py-5">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-[#05249E]/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#05249E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Configuración FTP
                </h3>
              </div>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  Administra la configuración del servidor FTP para transferencia de datos.
                </p>
              </div>
            </div>
          </div>

          {/* Información de Cuenta */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="px-6 py-5">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-[#05249E]/10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#05249E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Información de Cuenta
                </h3>
              </div>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  Gestiona tu información personal y cambia tu contraseña.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
