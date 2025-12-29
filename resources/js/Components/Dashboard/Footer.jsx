import { useState, useEffect } from 'react';
export default function Footer() {

    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const date = now.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            const time = now.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
            setCurrentTime(`${date} ${time}`);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, []);

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="w-full py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">

          {/* Left side - Company info */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900">
                Sistema Aguas
              </span>
            </div>

            <div className="text-xs text-gray-500 ml-4">
              © {new Date().getFullYear()} Sistema de Monitoreo Avanzado
            </div>
          </div>

          {/* Right side - Version and tech info */}
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>Hora actual: {currentTime}</span>
            <span className="hidden sm:block">•</span>
            <span>Versión 1.0.6</span>
            <span className="hidden sm:block">•</span>
            <span className="hidden sm:inline">Desarrollado con Laravel + Inertia</span>
            <span className="hidden sm:block">•</span>
            <span className="hidden sm:inline">MySQL Database</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

