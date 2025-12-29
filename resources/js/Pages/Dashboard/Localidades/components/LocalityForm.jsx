import { useState, useEffect } from 'react';
import CustomSelect from '../../../../Components/Shared/CustomSelect';
import { fetchMunicipalitiesSimple } from '../../../../services/municipalities';
import { fetchProvincesSimple } from '../../../../services/provinces';

export default function LocalityForm({
  onClose,
  onSubmit,
  initialData,
  loading = false
}) {
  const [formData, setFormData] = useState({
    name: '',
    province_id: null,
    municipality_id: null,
  });
  const [errors, setErrors] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingMunicipalities, setLoadingMunicipalities] = useState(false);

  // Cargar provincias al montar el componente
  useEffect(() => {
    const loadProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const provincesData = await fetchProvincesSimple();
        const provinceOptions = provincesData.map(province => ({
          value: province.id,
          label: province.name
        }));
        setProvinces(provinceOptions);
      } catch (error) {
        console.error('Error loading provinces:', error);
      } finally {
        setLoadingProvinces(false);
      }
    };

    loadProvinces();
  }, []);

  // Cargar municipios cuando se selecciona una provincia
  useEffect(() => {
    const loadMunicipalities = async () => {
      if (!formData.province_id) {
        setMunicipalities([]);
        return;
      }

      setLoadingMunicipalities(true);
      try {
        const municipalitiesData = await fetchMunicipalitiesSimple(formData.province_id);
        const municipalityOptions = municipalitiesData.map(municipality => ({
          value: municipality.id,
          label: municipality.name
        }));
        setMunicipalities(municipalityOptions);
      } catch (error) {
        console.error('Error loading municipalities:', error);
      } finally {
        setLoadingMunicipalities(false);
      }
    };

    loadMunicipalities();
  }, [formData.province_id]);

  // Inicializar datos cuando hay initialData (modo edición)
  useEffect(() => {
    if (initialData) {
      // Si estamos editando, necesitamos obtener la provincia del municipio
      const loadInitialData = async () => {
        if (initialData.municipality_id) {
          try {
            // Cargar todos los municipios para obtener la provincia del municipio seleccionado
            const allMunicipalities = await fetchMunicipalitiesSimple();
            const selectedMunicipality = allMunicipalities.find(m => m.id === initialData.municipality_id);
            
            if (selectedMunicipality) {
              setFormData({
                name: initialData.name || '',
                province_id: selectedMunicipality.provinceId || null,
                municipality_id: initialData.municipality_id || null,
              });
            } else {
              setFormData({
                name: initialData.name || '',
                province_id: null,
                municipality_id: initialData.municipality_id || null,
              });
            }
          } catch (error) {
            console.error('Error loading initial municipality data:', error);
            setFormData({
              name: initialData.name || '',
              province_id: null,
              municipality_id: initialData.municipality_id || null,
            });
          }
        } else {
          setFormData({
            name: initialData.name || '',
            province_id: null,
            municipality_id: null,
          });
        }
      };
      
      loadInitialData();
    } else {
      setFormData({
        name: '',
        province_id: null,
        municipality_id: null,
      });
    }
    setErrors({});
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Si se cambia la provincia, limpiar la selección de municipio
      if (field === 'province_id') {
        newData.municipality_id = null;
      }
      
      return newData;
    });
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre de la localidad es requerido';
    } else if (formData.name.length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.province_id) {
      newErrors.province_id = 'La provincia es requerida';
    }

    if (!formData.municipality_id) {
      newErrors.municipality_id = 'El municipio es requerido';
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col max-h-[calc(100vh-150px)]">
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
                {initialData ? 'Editar Localidad' : 'Nueva Localidad'}
              </h3>
              <p className="text-sm text-gray-500">
                {initialData ? 'Modifica los datos de la localidad' : 'Completa la información requerida'}
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
              Nombre de la Localidad <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`block w-full px-3 py-3 border rounded-lg text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-[#05249E] focus:border-transparent ${
                errors.name ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'
              }`}
              placeholder="Ej: Centro, Vedado, Miramar"
              disabled={loading}
              required
              autoFocus
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Provincia <span className="text-red-500">*</span>
            </label>
            <CustomSelect
              options={provinces}
              value={formData.province_id ? provinces.find(opt => opt.value === formData.province_id) || null : null}
              onChange={(selectedValue) => {
                handleChange('province_id', selectedValue?.value || null);
              }}
              placeholder="Selecciona una provincia..."
              isSearchable={true}
              isClearable={false}
              isDisabled={loading || loadingProvinces}
              isLoading={loadingProvinces}
            />
            {errors.province_id && <p className="mt-1 text-sm text-red-600">{errors.province_id}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Municipio <span className="text-red-500">*</span>
            </label>
            <CustomSelect
              options={municipalities}
              value={formData.municipality_id ? municipalities.find(opt => opt.value === formData.municipality_id) || null : null}
              onChange={(selectedValue) => {
                handleChange('municipality_id', selectedValue?.value || null);
              }}
              placeholder={formData.province_id ? "Selecciona un municipio..." : "Primero selecciona una provincia"}
              isSearchable={true}
              isClearable={false}
              isDisabled={loading || loadingMunicipalities || !formData.province_id}
              isLoading={loadingMunicipalities}
            />
            {errors.municipality_id && <p className="mt-1 text-sm text-red-600">{errors.municipality_id}</p>}
            {!formData.province_id && (
              <p className="mt-1 text-sm text-gray-500">
                Primero debes seleccionar una provincia
              </p>
            )}
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
              disabled={loading || !formData.name.trim() || !formData.province_id || !formData.municipality_id}
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

