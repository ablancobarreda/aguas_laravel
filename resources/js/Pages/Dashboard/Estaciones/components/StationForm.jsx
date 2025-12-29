import { useState, useEffect } from 'react';
import CustomSelect from '../../../../Components/Shared/CustomSelect';
import { fetchLocalitiesSimple } from '../../../../services/localities';
import { fetchChannelsSimple } from '../../../../services/channels';

export default function StationForm({
  onClose,
  onSubmit,
  initialData,
  loading = false
}) {
  const [formData, setFormData] = useState({
    id: '',
    location: '',
    latitude: '',
    longitude: '',
    imei: '',
    phone: '',
    basin: '',
    locality_id: null,
    channel_ids: [],
  });
  const [errors, setErrors] = useState({});
  const [localities, setLocalities] = useState([]);
  const [channels, setChannels] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    const loadSelectData = async () => {
      setLoadingData(true);
      try {
        const [localitiesData, channelsData] = await Promise.all([
          fetchLocalitiesSimple(),
          fetchChannelsSimple()
        ]);

        const localityOptions = localitiesData.map(locality => ({
          value: locality.id,
          label: `${locality.name} (${locality.municipalityName}, ${locality.provinceName})`
        }));

        const channelOptions = channelsData.map(channel => ({
          value: channel.id,
          label: channel.variable ? `${channel.variable} (${channel.name})` : channel.name
        }));

        setLocalities(localityOptions);
        setChannels(channelOptions);
      } catch (error) {
        console.error('Error loading form data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    loadSelectData();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id?.toString() || '',
        location: initialData.location || '',
        latitude: initialData.latitude?.toString() || '',
        longitude: initialData.longitude?.toString() || '',
        imei: initialData.imei || '',
        phone: initialData.phone || '',
        basin: initialData.basin || '',
        locality_id: initialData.locality_id || null,
        channel_ids: initialData.channels?.map(c => c.id) || [],
      });
    } else {
      setFormData({
        id: '',
        location: '',
        latitude: '',
        longitude: '',
        imei: '',
        phone: '',
        basin: '',
        locality_id: null,
        channel_ids: [],
      });
    }
    setErrors({});
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.id && formData.id.trim()) {
      if (formData.id.length < 3) {
        newErrors.id = 'El ID debe tener al menos 3 caracteres';
      } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.id)) {
        newErrors.id = 'El ID solo puede contener letras, números, guiones y guiones bajos';
      }
    }

    if (!formData.location.trim()) {
      newErrors.location = 'La ubicación es requerida';
    }

    if (!formData.imei.trim()) {
      newErrors.imei = 'El IMEI es requerido';
    } else if (formData.imei.length < 15) {
      newErrors.imei = 'El IMEI debe tener al menos 15 caracteres';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    }

    if (formData.latitude && isNaN(parseFloat(formData.latitude))) {
      newErrors.latitude = 'La latitud debe ser un número válido';
    }

    if (formData.longitude && isNaN(parseFloat(formData.longitude))) {
      newErrors.longitude = 'La longitud debe ser un número válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = () => {
    const hasRequiredFields = Boolean(formData.location.trim()) && Boolean(formData.imei.trim()) && Boolean(formData.phone.trim());
    const hasValidId = !formData.id || !formData.id.trim() || (formData.id.length >= 3 && /^[a-zA-Z0-9_-]+$/.test(formData.id));
    return hasRequiredFields && hasValidId;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const submitData = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        channel_ids: formData.channel_ids,
      };

      if (!initialData && !submitData.id) {
        delete submitData.id;
      }

      await onSubmit(submitData);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col max-h-[calc(100vh-200px)]">
      <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#05249E]/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-[#05249E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {initialData ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  )}
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {initialData ? 'Editar Estación' : 'Nueva Estación'}
                </h3>
                <p className="text-sm text-gray-500">
                  {initialData ? 'Modifica los datos de la estación' : 'Completa la información requerida'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto min-h-0">
        <div className="px-6 py-4 space-y-6">
          {!initialData && (
              <div>
                <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-2">
                  ID de la Estación <span className="text-gray-400">(opcional)</span>
                </label>
                <input
                  type="text"
                  id="id"
                  value={formData.id}
                  onChange={(e) => handleChange('id', e.target.value)}
                  className={`block w-full px-3 py-3 border rounded-lg text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-[#05249E] focus:border-transparent ${
                    errors.id ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ej: EST_001"
                  disabled={loading}
                />
                {errors.id && <p className="mt-1 text-sm text-red-600">{errors.id}</p>}
              </div>
            )}

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Ubicación <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className={`block w-full px-3 py-3 border rounded-lg text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-[#05249E] focus:border-transparent ${
                  errors.location ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'
                }`}
                placeholder="Ej: Estación Central Río Cauto"
                disabled={loading}
                required
              />
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
            </div>





            <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="imei" className="block text-sm font-medium text-gray-700 mb-2">
                IMEI <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="imei"
                value={formData.imei}
                onChange={(e) => handleChange('imei', e.target.value)}
                className={`block w-full px-3 py-3 border rounded-lg text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-[#05249E] focus:border-transparent ${
                  errors.imei ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'
                }`}
                placeholder="Ej: 123456789012345"
                disabled={loading}
                required
              />
              {errors.imei && <p className="mt-1 text-sm text-red-600">{errors.imei}</p>}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={`block w-full px-3 py-3 border rounded-lg text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-[#05249E] focus:border-transparent ${
                  errors.phone ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'
                }`}
                placeholder="Ej: +5355551234"
                disabled={loading}
                required
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-2">
                  Latitud
                </label>
                <input
                  type="text"
                  id="latitude"
                  value={formData.latitude}
                  onChange={(e) => handleChange('latitude', e.target.value)}
                  className={`block w-full px-3 py-3 border rounded-lg text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-[#05249E] focus:border-transparent ${
                    errors.latitude ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ej: 20.123456"
                  disabled={loading}
                />
                {errors.latitude && <p className="mt-1 text-sm text-red-600">{errors.latitude}</p>}
              </div>
              <div>
                <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-2">
                  Longitud
                </label>
                <input
                  type="text"
                  id="longitude"
                  value={formData.longitude}
                  onChange={(e) => handleChange('longitude', e.target.value)}
                  className={`block w-full px-3 py-3 border rounded-lg text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-[#05249E] focus:border-transparent ${
                    errors.longitude ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ej: -76.123456"
                  disabled={loading}
                />
                {errors.longitude && <p className="mt-1 text-sm text-red-600">{errors.longitude}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="basin" className="block text-sm font-medium text-gray-700 mb-2">
                Cuenca
              </label>
              <input
                type="text"
                id="basin"
                value={formData.basin}
                onChange={(e) => handleChange('basin', e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-[#05249E] focus:border-transparent"
                placeholder="Ej: Río Cauto"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Localidad
              </label>
              <CustomSelect
                options={localities}
                value={formData.locality_id ? localities.find(opt => opt.value === formData.locality_id) || null : null}
                onChange={(selectedValue) => {
                  handleChange('locality_id', selectedValue?.value || null);
                }}
                placeholder="Selecciona una localidad..."
                isSearchable={true}
                isClearable={true}
                isDisabled={loading || loadingData}
                isLoading={loadingData}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Canales Asociados
              </label>
              <CustomSelect
                options={channels}
                value={formData.channel_ids.map(id => channels.find(opt => opt.value === id)).filter(Boolean)}
                onChange={(selectedValues) => {
                  const channelIds = Array.isArray(selectedValues) ? selectedValues.map(opt => opt.value) : [];
                  handleChange('channel_ids', channelIds);
                }}
                placeholder="Selecciona canales..."
                isSearchable={true}
                isClearable={true}
                isMulti={true}
                isDisabled={loading || loadingData}
                isLoading={loadingData}
              />
            </div>
          </div>

          <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 bg-gray-50 sticky bottom-0">
            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !isFormValid()}
                className="px-6 py-2 text-sm font-medium text-white bg-[#05249E] rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Procesando...</span>
                  </>
                ) : (
                  <span>{initialData ? 'Actualizar' : 'Crear'}</span>
                )}
              </button>
            </div>
        </div>
      </form>
    </div>
  );
}

