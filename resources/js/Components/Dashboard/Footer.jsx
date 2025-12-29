export default function Footer() {
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

