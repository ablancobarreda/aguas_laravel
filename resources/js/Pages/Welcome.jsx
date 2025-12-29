import { Head } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Aguas - Sistema de Monitoreo" />
            <div className="min-h-screen bg-gradient-to-br from-[#05249E] to-[#5D5FEF] relative overflow-hidden">
                {/* Elementos decorativos de fondo */}
                <div className="absolute w-[400px] h-[400px] rounded-full bg-white/10 -top-48 -left-48"></div>
                <div className="absolute w-[300px] h-[300px] rounded-full bg-white/8 -bottom-36 -right-36"></div>
                <div className="absolute w-[250px] h-[250px] rounded-full bg-white/12 top-24 -right-32"></div>

                <div className="min-h-screen flex flex-col items-center justify-center p-5">

                    {/* Logo y branding principal */}
                    <div className="text-center mb-12">
                        <div className="w-40 h-40 mx-auto mb-8 bg-white/20 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" height="100px" viewBox="0 -960 960 960" width="100px" fill="white">
                                <path d="M491-200q12-1 20.5-9.5T520-230q0-14-9-22.5t-23-7.5q-41 3-87-22.5T343-375q-2-11-10.5-18t-19.5-7q-14 0-23 10.5t-6 24.5q17 91 80 130t127 35ZM480-80q-137 0-228.5-94T160-408q0-100 79.5-217.5T480-880q161 137 240.5 254.5T800-408q0 140-91.5 234T480-80Zm0-80q104 0 172-70.5T720-408q0-73-60.5-165T480-774Q361-665 300.5-573T240-408q0 107 68 177.5T480-160Zm0-320Z"/>
                            </svg>
                        </div>

                        <h1 className="text-6xl font-bold text-white mb-4">Aguas</h1>
                        <p className="text-2xl text-white/90 mb-2">Sistema de Monitoreo Avanzado</p>
                        <p className="text-lg text-white/70">Calidad de Aguas en Tiempo Real</p>
                    </div>

                    {/* Acciones principales */}
                    <div className="space-y-4 w-full max-w-sm">

                        {/* Botón principal de acceso */}
                        {auth.user ? (
                            <a
                                href="/dashboard"
                                className="w-full py-4 px-8 bg-white/90 hover:bg-white text-[#05249E] font-semibold rounded-2xl transition-all duration-200 flex items-center justify-center space-x-3 text-lg shadow-xl backdrop-blur-sm transform hover:scale-105"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                <span>Ir al Dashboard</span>
                            </a>
                        ) : (
                            <a
                                href="/login"
                                className="w-full py-4 px-8 bg-white/90 hover:bg-white text-[#05249E] font-semibold rounded-2xl transition-all duration-200 flex items-center justify-center space-x-3 text-lg shadow-xl backdrop-blur-sm transform hover:scale-105"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span>Acceder al Sistema</span>
                            </a>
                        )}

                        {/* Botón secundario */}
                        {!auth.user && (
                            <a
                                href="/register"
                                className="w-full py-3 px-6 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 backdrop-blur-sm border border-white/20"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                                <span>Crear Cuenta</span>
                            </a>
                        )}
                    </div>

                    {/* Características del sistema */}
                    <div className="mt-16 max-w-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-white font-semibold mb-2">Monitoreo en Tiempo Real</h3>
                                <p className="text-white/70 text-sm">Seguimiento continuo de estaciones</p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h3 className="text-white font-semibold mb-2">Acceso Seguro</h3>
                                <p className="text-white/70 text-sm">Autenticación robusta y sesiones únicas</p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                </div>
                                <h3 className="text-white font-semibold mb-2">Análisis Geográfico</h3>
                                <p className="text-white/70 text-sm">Mapas interactivos y ubicaciones</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-12 text-center">
                        <p className="text-white/70 text-sm mb-2">Laravel v{laravelVersion} (PHP v{phpVersion})</p>
                        <p className="text-white/50 text-xs">© {new Date().getFullYear()} Sistema Aguas</p>
                        <p className="text-white/40 text-xs mt-1">Desarrollado con Laravel + Inertia + React</p>
                    </div>
                </div>
            </div>
        </>
    );
}
