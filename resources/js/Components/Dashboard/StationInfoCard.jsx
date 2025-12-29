export default function StationInfoCard({ station, onClose, onViewDetails }) {
  if (!station) return null;

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

  // Encontrar canales específicos
  const findChannel = (name) => {
    return station.channels?.find(ch => ch.name === name);
  };

  const channel01 = findChannel('01'); // Lluvia actual 5min
  const channel02 = findChannel('02'); // Lluvia Ult Hora
  const channel03 = findChannel('03'); // Acum. Lluvia Ayer
  const channel05 = findChannel('05'); // Acum. Lluvia Hoy

  // La batería viene directamente del último registro, no de un canal
  const batteryValue = station.battery;

  const formatValue = (value, unit = '') => {
    if (value === null || value === undefined) return 'Sin datos';
    return `${value} ${unit}`.trim();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {station.location || 'Desarrollo'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">ID: {station.id}</p>
          </div>
          <div className="flex items-center text-[#05249E] text-sm ml-4">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{station.last_record_date || '-'}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors ml-4"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - Similar a la imagen de referencia */}
        <div className="p-6 space-y-3">
          {/* Lluvia actual 5min */}
          {channel01 && (
            <div className="p-3 bg-gray-50 rounded-lg border-l-4" style={{ borderLeftColor: getRainfallColor(channel01.latest_value) }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-gray-900">Lluvia actual 5min</span>
                {channel01.time_info && (
                  <span className="text-xs text-gray-500 italic">{channel01.time_info}</span>
                )}
              </div>
              <div className="text-base font-bold" style={{ color: getRainfallColor(channel01.latest_value) }}>
                {formatValue(channel01.latest_value, channel01.unidad_medida || 'mm')}
              </div>
            </div>
          )}

          {/* Lluvia Ult Hora */}
          {channel02 && (
            <div className="p-3 bg-gray-50 rounded-lg border-l-4" style={{ borderLeftColor: getRainfallColor(channel02.latest_value) }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-gray-900">Lluvia Ult Hora</span>
                {channel02.time_info && (
                  <span className="text-xs text-gray-500 italic">{channel02.time_info}</span>
                )}
              </div>
              <div className="text-base font-bold" style={{ color: getRainfallColor(channel02.latest_value) }}>
                {formatValue(channel02.latest_value, channel02.unidad_medida || 'mm')}
              </div>
            </div>
          )}

          {/* Acum. Lluvia Ayer */}
          {channel03 && (
            <div className="p-3 bg-gray-50 rounded-lg border-l-4" style={{ borderLeftColor: getRainfallColor(channel03.latest_value) }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-gray-900">Acum. Lluvia Ayer</span>
                {channel03.time_info && (
                  <span className="text-xs text-gray-500 italic">{channel03.time_info}</span>
                )}
              </div>
              <div className="text-base font-bold" style={{ color: getRainfallColor(channel03.latest_value) }}>
                {formatValue(channel03.latest_value, channel03.unidad_medida || 'mm')}
              </div>
            </div>
          )}

          {/* Acum. Lluvia Hoy */}
          {channel05 && (
            <div className="p-3 bg-gray-50 rounded-lg border-l-4" style={{ borderLeftColor: getRainfallColor(channel05.latest_value) }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-gray-900">Acum. Lluvia Hoy</span>
                {channel05.time_info && (
                  <span className="text-xs text-gray-500 italic">{channel05.time_info}</span>
                )}
              </div>
              <div className="text-base font-bold" style={{ color: getRainfallColor(channel05.latest_value) }}>
                {formatValue(channel05.latest_value, channel05.unidad_medida || 'mm')}
              </div>
            </div>
          )}

          {/* Batería */}
          {batteryValue !== null && batteryValue !== undefined && (
            <div className="p-3 bg-gray-50 rounded-lg border-l-4" style={{ borderLeftColor: getRainfallColor(parseFloat(batteryValue)) }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-gray-900">Batería</span>
                {station.last_record_date && (
                  <span className="text-xs text-gray-500 italic">{station.last_record_date}</span>
                )}
              </div>
              <div className="text-base font-bold" style={{ color: getRainfallColor(parseFloat(batteryValue)) }}>
                {formatValue(batteryValue, '%')}
              </div>
            </div>
          )}
        </div>

        {/* Footer con botón */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end">
          <button
            onClick={onViewDetails}
            className="px-6 py-2 text-sm font-medium text-white bg-[#05249E] rounded-lg hover:bg-blue-700 transition-colors"
          >
            Más Información
          </button>
        </div>
      </div>
    </div>
  );
}

