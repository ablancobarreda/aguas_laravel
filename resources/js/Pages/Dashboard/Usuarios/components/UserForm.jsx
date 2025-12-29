import { useState, useEffect } from 'react';
import CustomSelect from '../../../../Components/Shared/CustomSelect';
import { fetchRolesSimple } from '../../../../services/roles';

export default function UserForm({
  onClose,
  onSubmit,
  initialData,
  loading = false
}) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role_id: null,
  });
  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const loadRoles = async () => {
      setLoadingData(true);
      try {
        const rolesData = await fetchRolesSimple();
        const roleOptions = rolesData.map(role => ({
          value: role.id,
          label: role.name
        }));
        setRoles(roleOptions);
      } catch (error) {
        console.error('Error loading roles:', error);
      } finally {
        setLoadingData(false);
      }
    };

    loadRoles();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        username: initialData.username || '',
        password: '', // No mostrar contraseña al editar
        role_id: initialData.role_id || null,
      });
    } else {
      setFormData({
        username: '',
        password: '',
        role_id: null,
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

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    } else if (formData.username.length < 3) {
      newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    }

    if (!initialData && !formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.role_id) {
      newErrors.role_id = 'El rol es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = () => {
    const hasUsername = Boolean(formData.username.trim() && formData.username.length >= 3);
    const hasPassword = initialData ? true : Boolean(formData.password.trim() && formData.password.length >= 6);
    const hasRole = Boolean(formData.role_id);
    return hasUsername && hasPassword && hasRole;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const submitData = {
        username: formData.username.trim(),
        role_id: formData.role_id,
      };

      // Solo incluir password si se está creando o si se está editando y se proporcionó una nueva
      if (!initialData || formData.password.trim()) {
        submitData.password = formData.password;
      }

      await onSubmit(submitData);
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
                {initialData ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h3>
              <p className="text-sm text-gray-500">
                {initialData ? 'Modifica los datos del usuario' : 'Completa la información requerida'}
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
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de Usuario <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              className={`block w-full px-3 py-3 border rounded-lg text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-[#05249E] focus:border-transparent ${
                errors.username ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'
              }`}
              placeholder="Ej: admin, usuario1"
              disabled={loading}
              required
              autoFocus
            />
            {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña {!initialData && <span className="text-red-500">*</span>}
              {initialData && <span className="text-gray-400 text-xs ml-1">(dejar en blanco para no cambiar)</span>}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className={`block w-full px-3 py-3 pr-10 border rounded-lg text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-[#05249E] focus:border-transparent ${
                  errors.password ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'
                }`}
                placeholder={initialData ? 'Nueva contraseña (opcional)' : 'Mínimo 6 caracteres'}
                disabled={loading}
                required={!initialData}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            {!initialData && (
              <p className="mt-1 text-sm text-gray-500">
                La contraseña debe tener al menos 6 caracteres
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rol <span className="text-red-500">*</span>
            </label>
            <CustomSelect
              options={roles}
              value={formData.role_id ? roles.find(opt => opt.value === formData.role_id) || null : null}
              onChange={(selectedValue) => {
                handleChange('role_id', selectedValue?.value || null);
              }}
              placeholder="Selecciona un rol..."
              isSearchable={true}
              isClearable={false}
              isDisabled={loading || loadingData}
              isLoading={loadingData}
            />
            {errors.role_id && <p className="mt-1 text-sm text-red-600">{errors.role_id}</p>}
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

