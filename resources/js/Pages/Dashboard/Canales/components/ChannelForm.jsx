import { useState, useEffect } from 'react';
import CustomSelect from '../../../../Components/Shared/CustomSelect';

export default function ChannelForm({
  onClose,
  onSubmit,
  initialData,
  loading = false
}) {
  const [formData, setFormData] = useState({
    name: '',
    col_rel: '',
    variable: '',
    unidad_medida: '',
    es_acuifero: false,
  });
  const [errors, setErrors] = useState({});

  const unidadMedidaOptions = [
    { value: 'm', label: 'metros (m)' },
    { value: 'cm', label: 'centímetros (cm)' },
    { value: 'mm', label: 'milímetros (mm)' },
    { value: 'L', label: 'litros (L)' },
    { value: 'L/s', label: 'litros por segundo (L/s)' },
    { value: 'm³', label: 'metros cúbicos (m³)' },
    { value: 'm³/s', label: 'metros cúbicos por segundo (m³/s)' },
    { value: '°C', label: 'grados Celsius (°C)' },
    { value: 'pH', label: 'pH' },
    { value: 'mg/L', label: 'miligramos por litro (mg/L)' },
    { value: 'ppm', label: 'partes por millón (ppm)' },
    { value: 'µS/cm', label: 'microsiemens por centímetro (µS/cm)' },
    { value: 'NTU', label: 'unidades nefelométricas de turbidez (NTU)' },
    { value: 'kPa', label: 'kilopascales (kPa)' },
    { value: 'bar', label: 'bar' },
    { value: 'V', label: 'voltios (V)' },
    { value: 'mA', label: 'miliamperios (mA)' },
    { value: '%', label: 'porcentaje (%)' },
  ];

  const esAcuiferoOptions = [
    { value: true, label: 'Acuífero' },
    { value: false, label: 'Superficial' },
  ];

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        col_rel: initialData.col_rel || '',
        variable: initialData.variable || '',
        unidad_medida: initialData.unidad_medida || '',
        es_acuifero: initialData.es_acuifero || false,
      });
    } else {
      setFormData({
        name: '',
        col_rel: '',
        variable: '',
        unidad_medida: '',
        es_acuifero: false,
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

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del canal es requerido';
    }

    if (!formData.col_rel.trim()) {
      newErrors.col_rel = 'La columna relacional es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      await onSubmit(formData);
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
                  {initialData ? 'Editar Canal' : 'Nuevo Canal'}
                </h3>
                <p className="text-sm text-gray-500">
                  {initialData ? 'Modifica los datos del canal' : 'Completa la información requerida'}
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
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`block w-full px-3 py-3 border rounded-lg text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-[#05249E] focus:border-transparent ${
                  errors.name ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'
                }`}
                placeholder="Ej: Canal de Precipitación"
                disabled={loading}
                required
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="col_rel" className="block text-sm font-medium text-gray-700 mb-2">
                Columna Relacional <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="col_rel"
                value={formData.col_rel}
                onChange={(e) => handleChange('col_rel', e.target.value)}
                className={`block w-full px-3 py-3 border rounded-lg text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-[#05249E] focus:border-transparent ${
                  errors.col_rel ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'
                }`}
                placeholder="Ej: precip"
                disabled={loading}
                required
              />
              {errors.col_rel && <p className="mt-1 text-sm text-red-600">{errors.col_rel}</p>}
            </div>

            <div>
              <label htmlFor="variable" className="block text-sm font-medium text-gray-700 mb-2">
                Variable
              </label>
              <input
                type="text"
                id="variable"
                value={formData.variable}
                onChange={(e) => handleChange('variable', e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-[#05249E] focus:border-transparent"
                placeholder="Ej: Precipitación"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unidad de Medida
              </label>
              <CustomSelect
                options={unidadMedidaOptions}
                value={formData.unidad_medida ? unidadMedidaOptions.find(opt => opt.value === formData.unidad_medida) || null : null}
                onChange={(selectedValue) => {
                  handleChange('unidad_medida', selectedValue?.value || '');
                }}
                placeholder="Selecciona una unidad..."
                isSearchable={true}
                isClearable={true}
                isDisabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo
              </label>
              <CustomSelect
                options={esAcuiferoOptions}
                value={esAcuiferoOptions.find(opt => opt.value === formData.es_acuifero) || null}
                onChange={(selectedValue) => {
                  handleChange('es_acuifero', selectedValue?.value || false);
                }}
                placeholder="Selecciona el tipo..."
                isClearable={false}
                isDisabled={loading}
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
                disabled={loading || !formData.name.trim() || !formData.col_rel.trim()}
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

