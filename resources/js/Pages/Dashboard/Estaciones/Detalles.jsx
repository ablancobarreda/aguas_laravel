import { useState, useEffect, useCallback } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import DashboardShell from '../../../Components/Dashboard/DashboardShell';
import { fetchEquipmentById } from '../../../services/equipment';
import { fetchStationRecords } from '../../../services/records';
import CustomSelect from '../../../Components/Shared/CustomSelect';

export default function EstacionDetalles(props) {
  // Obtener stationId de las props de Inertia
  const stationId = props?.stationId;

  // Debug: verificar props recibidas
  useEffect(() => {
    console.log('=== EstacionDetalles Debug ===');
    console.log('Props recibidas:', props);
    console.log('stationId extraído:', stationId);
    console.log('===========================');
  }, [props, stationId]);

  const [station, setStation] = useState(null);
  const [records, setRecords] = useState([]);
  const [stationLoading, setStationLoading] = useState(true);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [stationError, setStationError] = useState('');
  const [recordsError, setRecordsError] = useState('');

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
  });

  const [isGeneralOpen, setIsGeneralOpen] = useState(false);
  const [isTechnicalOpen, setIsTechnicalOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isChannelsOpen, setIsChannelsOpen] = useState(false);

  const loadStation = useCallback(async () => {
    if (!stationId) {
      setStationError('ID de estación no proporcionado');
      setStationLoading(false);
      return;
    }

    setStationLoading(true);
    setStationError('');
    try {
      const response = await fetchEquipmentById(stationId);
      console.log('Response from fetchEquipmentById:', response);

      // La respuesta puede venir en diferentes formatos
      if (response) {
        if (response.data) {
          setStation(response.data);
        } else if (response.error) {
          setStationError(response.error);
        } else if (response.success === false) {
          setStationError(response.message || 'Error al obtener la estación');
        } else {
          // Si la respuesta es directamente el objeto de la estación
          setStation(response);
        }
      } else {
        setStationError('No se recibió respuesta del servidor');
      }
    } catch (err) {
      console.error('Error loading station:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response,
        data: err.response?.data,
        status: err.response?.status
      });

      const errorMessage = err.response?.data?.error
        || err.response?.data?.message
        || err.message
        || 'Error al cargar la estación';

      setStationError(errorMessage);
    } finally {
      setStationLoading(false);
    }
  }, [stationId]);

  const loadRecords = useCallback(async () => {
    if (!stationId) return;

    setRecordsLoading(true);
    setRecordsError('');
    try {
      const formatDateForAPI = (dateTimeString) => {
        if (!dateTimeString) return '';
        const date = new Date(dateTimeString);
        return date.toISOString().slice(0, 19).replace('T', ' ');
      };

      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };

      if (filters.startDate) {
        params.startDate = formatDateForAPI(filters.startDate);
      }
      if (filters.endDate) {
        params.endDate = formatDateForAPI(filters.endDate);
      }

      const response = await fetchStationRecords(stationId, params);
      console.log('Response from fetchStationRecords:', response);

      if (response && response.data) {
        setRecords(response.data);
        setPagination(response.pagination);
      } else if (response && response.error) {
        setRecordsError(response.error);
      } else {
        setRecordsError('Error al cargar los registros');
      }
    } catch (err) {
      console.error('Error loading records:', err);
      setRecordsError('Error al cargar los registros');
    } finally {
      setRecordsLoading(false);
    }
  }, [stationId, pagination.page, pagination.limit, filters.startDate, filters.endDate]);

  useEffect(() => {
    loadStation();
  }, [loadStation]);

  // Cargar registros cuando cambian los filtros o paginación
  useEffect(() => {
    if (stationId) {
      loadRecords();
    }
  }, [stationId, pagination.page, pagination.limit, filters.startDate, filters.endDate]);

  const handleApplyFilters = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({ startDate: '', endDate: '' });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);

    let start = Math.max(1, pagination.page - half);
    let end = Math.min(pagination.totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const prepareExportData = () => {
    if (!records.length) return [];

    return records.map(record => ({
      'Fecha Reg': record?.record_date?.replaceAll('-', '/') || '-',
      'Hora Inicio': record.start_time || '-',
      'Hora Fin': record.end_time || '-',
      'Time': record.time || '-',
      'CMD': record.cmd || 'RESULT',
      'Vals': record.vals || '-',
      'Bateria': record.batt ? `${record.batt}%` : '-',
      'Señal': record.sigs ? `${record.sigs} dB` : '-',
      'Red': record.nwtype || '-',
      'Power': record.powr || '1',
      'Creado': formatDateTime(record.created_at)
    }));
  };

  const DropdownCard = ({ title, icon, iconBg, isOpen, setIsOpen, children }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`${iconBg} p-2 rounded-lg`}>
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <svg
          className={`h-5 w-5 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 pb-6 border-t border-gray-100">
          <div className="pt-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );

  if (stationLoading) {
    return (
      <DashboardShell>
        <Head title="Detalles de Estación - Aguas" />
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-[#05249E] rounded-full"></div>
                <p className="mt-4 text-gray-600">Cargando estación...</p>
                {stationId && (
                  <p className="mt-2 text-sm text-gray-500">ID: {stationId}</p>
                )}
                {!stationId && (
                  <p className="mt-2 text-sm text-yellow-600">⚠️ Esperando ID de estación...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (!stationLoading && (stationError || !station)) {
    return (
      <DashboardShell>
        <Head title="Detalles de Estación - Aguas" />
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">
                <svg className="h-12 w-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="font-semibold mb-2 text-lg">Error al cargar la estación</p>
                <p className="text-sm text-gray-700 mb-4">{stationError || 'Estación no encontrada'}</p>
                {stationId ? (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-xs text-gray-500 mb-1">ID de estación:</p>
                    <p className="text-sm font-mono text-gray-900">{stationId}</p>
                  </div>
                ) : (
                  <div className="bg-yellow-50 rounded-lg p-4 mb-4">
                    <p className="text-xs text-yellow-700">⚠️ No se recibió el ID de la estación</p>
                    <p className="text-xs text-yellow-600 mt-1">Verifica la URL o intenta navegar desde el dashboard</p>
                  </div>
                )}
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => router.visit('/dashboard')}
                  className="bg-[#05249E] text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Volver al Dashboard
                </button>
                {stationId && (
                  <button
                    onClick={() => {
                      setStationLoading(true);
                      setStationError('');
                      loadStation();
                    }}
                    className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Reintentar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <Head title={`${station.location || station.id} - Detalles - Aguas`} />
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.visit('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Detalles de la Estación
                </h1>
                <p className="text-gray-600 mt-1">
                  {station.location || 'Desarrollo'} - {station.id}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                loadStation();
                loadRecords();
              }}
              className="bg-[#05249E] text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualizar
            </button>
          </div>
        </div>

        {/* Dropdowns de Información */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DropdownCard
            title="Información General"
            icon={
              <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            iconBg="bg-blue-100"
            isOpen={isGeneralOpen}
            setIsOpen={setIsGeneralOpen}
          >
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">ID de la Estación</label>
                <p className="text-lg font-mono text-gray-900">{station.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Ubicación</label>
                <p className="text-lg text-gray-900">{station.location || 'No especificada'}</p>
              </div>
            </div>
          </DropdownCard>

          <DropdownCard
            title="Información Técnica"
            icon={
              <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            }
            iconBg="bg-green-100"
            isOpen={isTechnicalOpen}
            setIsOpen={setIsTechnicalOpen}
          >
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">IMEI</label>
                <p className="text-lg font-mono text-gray-900">{station.imei}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Teléfono</label>
                <p className="text-lg font-mono text-gray-900">{station.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Cuenca</label>
                <p className="text-lg text-gray-900">{station.basin || 'No especificada'}</p>
              </div>
            </div>
          </DropdownCard>

          <DropdownCard
            title="Ubicación Geográfica"
            icon={
              <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
            iconBg="bg-purple-100"
            isOpen={isLocationOpen}
            setIsOpen={setIsLocationOpen}
          >
            <div className="space-y-3">
              {station.locality ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Localidad</label>
                    <p className="text-lg text-gray-900">{station.locality.name}</p>
                  </div>
                  {station.locality.municipality && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Municipio</label>
                        <p className="text-lg text-gray-900">{station.locality.municipality.name}</p>
                      </div>
                      {station.locality.municipality.province && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Provincia</label>
                          <p className="text-lg text-gray-900">{station.locality.municipality.province.name}</p>
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : (
                <div className="text-gray-500">Información geográfica no disponible</div>
              )}
              {(station.latitude || station.longitude) && (
                <div className="pt-2 border-t">
                  <label className="text-sm font-medium text-gray-500">Coordenadas</label>
                  <p className="text-sm font-mono text-gray-700">
                    {station.latitude ? parseFloat(station.latitude).toFixed(6) : '-'}, {station.longitude ? parseFloat(station.longitude).toFixed(6) : '-'}
                  </p>
                </div>
              )}
            </div>
          </DropdownCard>

          {station.channels && station.channels.length > 0 && (
            <DropdownCard
              title="Canales y Sensores"
              icon={
                <svg className="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              iconBg="bg-orange-100"
              isOpen={isChannelsOpen}
              setIsOpen={setIsChannelsOpen}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {station.channels.map((channel) => (
                  <div key={channel.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{channel.name} - {channel.variable}</h4>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {channel.col_rel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </DropdownCard>
          )}
        </div>

        {/* Registros Históricos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Registros Históricos</h2>
          </div>

          {/* Filtros */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha y hora de inicio
                </label>
                <input
                  type="datetime-local"
                  value={filters.startDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#05249E] focus:border-[#05249E] text-gray-900"
                />
              </div>
              <div className="flex-1 min-w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha y hora de fin
                </label>
                <input
                  type="datetime-local"
                  value={filters.endDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#05249E] focus:border-[#05249E] text-gray-900"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleApplyFilters}
                  className="bg-[#05249E] text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filtrar
                </button>
                <button
                  onClick={handleClearFilters}
                  className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Limpiar
                </button>
              </div>
            </div>
          </div>

          {/* Tabla de Registros */}
          {recordsLoading ? (
            <div className="p-8">
              <div className="animate-pulse space-y-4">
                <div className="grid grid-cols-11 gap-4 pb-4 border-b border-gray-200">
                  {[...Array(11)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="grid grid-cols-11 gap-4 py-3">
                    {[...Array(11)].map((_, j) => (
                      <div key={j} className="h-4 bg-gray-100 rounded"></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ) : recordsError ? (
            <div className="p-8 text-center text-red-600">
              Error: {recordsError}
            </div>
          ) : records.length === 0 ? (
            <div className="px-6 py-12">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay registros disponibles
                </h3>
                <p className="text-gray-500 text-sm">
                  No se encontraron registros para los filtros seleccionados.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Fecha Reg
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Hora Inicio
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Hora Fin
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        CMD
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Vals
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Batería
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Señal
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Red
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Power
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Creado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {records.map((record, index) => (
                      <tr
                        key={record.id}
                        className={`${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                        } hover:bg-blue-50/50 transition-all duration-200`}
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {record?.record_date?.replaceAll('-', '/') || '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-700">
                          {record.start_time || '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-700">
                          {record.end_time || '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-600">
                          {record.time || '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {record.cmd || 'RESULT'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-[#05249E]">
                          {record.vals || '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {record.batt ? `${record.batt}%` : '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {record.sigs ? `${record.sigs} dB` : '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {record.nwtype || '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {record.powr || '1'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-gray-500">
                          {formatDateTime(record.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="lg:hidden">
                <div className="p-4 space-y-4">
                  {records.map((record) => (
                    <div
                      key={record.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-base font-medium text-gray-900">
                            Registro #{record.id}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {station?.location || 'Desarrollo'}
                          </p>
                        </div>
                        <div className="text-lg font-bold text-[#05249E]">
                          {record.vals || '-'}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-gray-500">Fecha:</span>
                          <p className="font-mono">{record?.record_date?.replaceAll('-', '/') || '-'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">CMD:</span>
                          <p>{record.cmd || 'RESULT'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Inicio:</span>
                          <p className="font-mono">{record.start_time || '-'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Fin:</span>
                          <p className="font-mono">{record.end_time || '-'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Batería:</span>
                          <p>{record.batt ? `${record.batt}%` : '-'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Señal:</span>
                          <p>{record.sigs ? `${record.sigs} dB` : '-'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Paginación */}
              {pagination.totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-700">Mostrar</span>
                      <CustomSelect
                        options={[
                          { value: 25, label: '25' },
                          { value: 50, label: '50' },
                          { value: 100, label: '100' },
                          { value: 200, label: '200' }
                        ]}
                        value={{ value: pagination.limit, label: pagination.limit.toString() }}
                        onChange={(selectedValue) => {
                          if (selectedValue) {
                            setPagination(prev => ({ ...prev, limit: selectedValue.value, page: 1 }));
                          }
                        }}
                        size="sm"
                        isSearchable={false}
                        isClearable={false}
                      />
                      <span className="text-sm text-gray-700">por página</span>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-sm font-medium text-gray-800">
                        {pagination.total > 0 ? (
                          <>
                            Mostrando {((pagination.page - 1) * pagination.limit) + 1} a{' '}
                            {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
                            {pagination.total} elementos
                          </>
                        ) : (
                          'No hay elementos para mostrar'
                        )}
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                          disabled={!pagination.hasPrevPage}
                          className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>

                        {generatePageNumbers().map((pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                            className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-200 ${
                              pageNum === pagination.page
                                ? 'bg-[#05249E] text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        ))}

                        <button
                          onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                          disabled={!pagination.hasNextPage}
                          className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

