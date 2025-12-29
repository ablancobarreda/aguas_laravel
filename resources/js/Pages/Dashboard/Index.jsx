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

  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const time = now.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    return `${time} ${date}`;
  };

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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Monitoreo de Estaciones
              </h1>
              <p className="text-gray-600 mt-1">
                Resumen de datos en tiempo real de todas las estaciones
              </p>
            </div>
            <div className="flex items-center gap-2 text-[#05249E] mt-4 lg:mt-0">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">
                {getCurrentDateTime()}
              </span>
            </div>
          </div>
        </div>


        {/* Map */}
        {!loading && !error && filteredStations.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Mapa de Estaciones
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Visualiza la ubicación de todas las estaciones en Cuba
              </p>
            </div>
            <div style={{ height: '600px', width: '100%' }}>
              <CubaMap
                stations={filteredStations}
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
