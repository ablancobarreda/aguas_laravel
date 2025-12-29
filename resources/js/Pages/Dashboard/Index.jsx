import { useState, useEffect, useCallback } from 'react';
import { Head, router } from '@inertiajs/react';
import DashboardShell from '../../Components/Dashboard/DashboardShell';
import CubaMap from '../../Components/Dashboard/CubaMap';
import { fetchRainfallData } from '../../services/equipment';

export default function Dashboard() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStations, setFilteredStations] = useState([]);
  const [selectedStationId, setSelectedStationId] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);



  const loadStations = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchRainfallData();
      if (response.data) {
        setStations(response.data);
        setFilteredStations(response.data);
      } else {
        setError('No se pudieron cargar las estaciones');
      }
    } catch (err) {
      console.error('Error loading stations:', err);
      setError('Error al cargar las estaciones');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStations();
  }, [loadStations]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredStations(stations);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase().trim();
    const filtered = stations.filter(station => {
      const locationMatch = station.location?.toLowerCase().includes(searchTermLower);
      const idMatch = String(station.id).toLowerCase().includes(searchTermLower);
      return locationMatch || idMatch;
    });

    setFilteredStations(filtered);
  }, [searchTerm, stations]);

  const getRainfallColor = (value) => {
    if (value === null || value === undefined) return '#6B7280';
    if (value === 0) return '#9CA3AF';
    if (value > 0 && value <= 50) return '#8B5CF6';
    if (value > 50 && value <= 100) return '#3B82F6';
    if (value > 100 && value <= 150) return '#06B6D4';
    if (value > 150 && value <= 200) return '#10B981';
    if (value > 200 && value <= 250) return '#F59E0B';
    if (value > 250) return '#EF4444';
    return '#6B7280';
  };

  const renderChannelValues = (station) => {
    if (!station.channels || station.channels.length === 0) {
      return (
        <div className="flex items-center justify-center py-4 text-gray-500">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">Sin canales de datos disponibles</span>
        </div>
      );
    }

    // Ordenar canales: 01, 02, otros, 05, 03
    const channelOrder = ['01', '02', '05', '03'];
    const orderedChannels = [];
    const otherChannels = [];

    station.channels.forEach(channel => {
      const index = channelOrder.indexOf(channel.name);
      if (index !== -1) {
        orderedChannels[index] = channel;
      } else {
        otherChannels.push(channel);
      }
    });

    const allChannels = [
      ...orderedChannels.filter(Boolean),
      ...otherChannels
    ];

    return (
      <div className="space-y-2">
        {allChannels.map((channel) => {
          const valueColor = getRainfallColor(channel.latest_value);

          return (
            <div
              key={`${station.id}-channel-${channel.id}`}
              className="p-2.5 bg-gray-50 rounded-lg border-l-3"
              style={{ borderLeftColor: valueColor }}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs font-semibold text-gray-900 truncate flex-1">
                  {channel.variable || `Canal ${channel.id}`}
                </span>
                {channel.time_info && (
                  <span className="text-[10px] text-gray-500 ml-2 flex-shrink-0 whitespace-nowrap">
                    {channel.time_info}
                  </span>
                )}
              </div>
              <div className="text-sm font-bold" style={{ color: valueColor }}>
                {channel.latest_value !== undefined && channel.latest_value !== null
                  ? `${channel.latest_value} ${channel.unidad_medida || ''}`.trim()
                  : 'Sin datos'}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <DashboardShell>
      <Head title="Dashboard - Aguas" />
      <div className="space-y-6">
        {/* Header */}

        {/* Map */}
        {!loading && !error && stations.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between lg:gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">
                    Mapa de Estaciones
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Visualiza la ubicación de todas las estaciones en Cuba
                  </p>
                </div>

                {/* Search Bar - Desktop: right side, Mobile: below title */}
                <div className="mt-4 lg:mt-0 lg:w-80 relative">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Buscar estación..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsSearchOpen(true);
                      }}
                      onFocus={() => setIsSearchOpen(true)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#05249E] focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Lista de resultados */}
                  {isSearchOpen && searchTerm && (
                    <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-64 overflow-y-auto">
                      {filteredStations.length === 0 ? (
                        <div className="p-4 text-center text-sm font-medium text-gray-700">
                          SIN RESULTADOS
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-200">
                          {filteredStations.slice(0, 10).map((station) => {
                            // Verificar coordenadas
                            let lat = station.latitude;
                            let lng = station.longitude;

                            if (typeof lat === 'string') {
                              lat = parseFloat(lat);
                            }
                            if (typeof lng === 'string') {
                              lng = parseFloat(lng);
                            }

                            const cubaLatRange = [19, 24];
                            const cubaLngRange = [-85, -74];

                            let finalLat = lat;
                            let finalLng = lng;

                            if (lat >= cubaLngRange[0] && lat <= cubaLngRange[1] &&
                                lng >= cubaLatRange[0] && lng <= cubaLatRange[1]) {
                              finalLat = lng;
                              finalLng = lat;
                            }

                            const isValidLat = !isNaN(finalLat) && finalLat >= 19 && finalLat <= 24;
                            const isValidLng = !isNaN(finalLng) && finalLng >= -85 && finalLng <= -74;
                            const hasValidCoords = isValidLat && isValidLng;

                            return (
                              <button
                                key={station.id}
                                onClick={() => {
                                  setSelectedStationId(station.id);
                                  setIsSearchOpen(false);
                                  setSearchTerm('');
                                }}
                                disabled={!hasValidCoords}
                                className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                                  !hasValidCoords ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {station.location || station.id}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                      {station.locality?.name || ''}
                                      {station.locality?.municipality?.name && `, ${station.locality.municipality.name}`}
                                      {station.locality?.municipality?.province?.name && `, ${station.locality.municipality.province.name}`}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-0.5">ID: {station.id}</p>
                                  </div>
                                  {!hasValidCoords && (
                                    <span className="text-xs text-gray-400 ml-2">Sin coordenadas</span>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cerrar búsqueda al hacer click fuera */}
            {isSearchOpen && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsSearchOpen(false)}
              />
            )}

            <div style={{ height: '600px', width: '100%' }}>
              <CubaMap
                stations={filteredStations.length > 0 ? filteredStations : stations}
                selectedStationId={selectedStationId}
                onStationClick={(station) => {
                  setSelectedStationId(station.id);
                }}
                onViewDetails={(station) => {
                  router.visit(`/dashboard/estaciones/${station.id}/detalles`);
                }}
              />
            </div>
          </div>
        )}


        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-[#05249E] rounded-full"></div>
            <p className="mt-4 text-gray-600">Cargando estaciones...</p>
          </div>
        )}

      </div>
    </DashboardShell>
  );
}
