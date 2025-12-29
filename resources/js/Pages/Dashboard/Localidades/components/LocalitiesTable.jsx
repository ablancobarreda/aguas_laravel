import CustomSelect from '../../../../Components/Shared/CustomSelect';

export default function LocalitiesTable({
  localities,
  loading,
  onEdit,
  onDelete,
  onSort,
  sortBy,
  sortOrder,
  pagination,
  onPageChange,
  onItemsPerPageChange,
}) {
  const getSortIcon = (field) => {
    if (sortBy !== field) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortOrder === 'asc' ? (
      <svg className="w-4 h-4 text-[#05249E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-[#05249E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
      </svg>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-8 text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-[#05249E] rounded-full"></div>
          <p className="mt-2 text-gray-600">Cargando localidades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Versión móvil - Cards */}
      <div className="block lg:hidden divide-y divide-gray-200 min-h-[200px]">
        {localities.length === 0 ? (
          <div className="p-8 text-center">
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay localidades</h3>
              <p className="mt-1 text-sm text-gray-500">Comienza creando una nueva localidad.</p>
            </div>
          </div>
        ) : (
          localities.map((locality) => (
            <div key={locality.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs font-medium text-gray-500">ID:</span>
                    <span className="text-sm font-medium text-gray-900">{locality.id}</span>
                  </div>
                  <div className="mb-2">
                    <div className="font-medium text-gray-900">{locality.name}</div>
                  </div>
                  {locality.municipality && (
                    <div className="mb-2">
                      <span className="text-xs text-gray-500">Municipio:</span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 ml-1">
                        {locality.municipality.name}
                      </span>
                    </div>
                  )}
                  {locality.municipality?.province && (
                    <div className="mb-2">
                      <span className="text-xs text-gray-500">Provincia:</span>
                      <span className="text-xs text-gray-900 ml-1">{locality.municipality.province.name}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Creado:</span>
                    <span className="text-xs text-gray-900">{formatDate(locality.created_at)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => onEdit(locality)}
                    className="text-[#05249E] hover:text-blue-700 transition-colors p-2"
                    title="Editar"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(locality)}
                    className="text-red-600 hover:text-red-700 transition-colors p-2"
                    title="Eliminar"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Versión desktop - Tabla */}
      <div className="hidden lg:block overflow-x-auto overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Nombre</span>
                  {getSortIcon('name')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Municipio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provincia</th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => onSort('createdAt')}
              >
                <div className="flex items-center space-x-1">
                  <span>Fecha de Creación</span>
                  {getSortIcon('createdAt')}
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {localities.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay localidades</h3>
                    <p className="mt-1 text-sm text-gray-500">Comienza creando una nueva localidad.</p>
                  </div>
                </td>
              </tr>
            ) : (
              localities.map((locality) => (
                <tr key={locality.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {locality.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-medium">{locality.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {locality.municipality ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {locality.municipality.name}
                      </span>
                    ) : (
                      <span className="text-gray-400">Sin municipio</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {locality.municipality?.province ? (
                      <span className="text-gray-600">
                        {locality.municipality.province.name}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(locality.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEdit(locality)}
                        className="text-[#05249E] hover:text-blue-700 transition-colors p-1"
                        title="Editar"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete(locality)}
                        className="text-red-600 hover:text-red-700 transition-colors p-1"
                        title="Eliminar"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Mostrar</span>
              <CustomSelect
                options={[
                  { value: 5, label: '5' },
                  { value: 10, label: '10' },
                  { value: 20, label: '20' },
                  { value: 50, label: '50' }
                ]}
                value={{ value: pagination.itemsPerPage, label: pagination.itemsPerPage.toString() }}
                onChange={(selectedValue) => {
                  if (selectedValue) {
                    onItemsPerPageChange(selectedValue.value);
                  }
                }}
                size="sm"
                isSearchable={false}
                isClearable={false}
              />
              <span className="text-sm text-gray-700">por página</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Anterior
              </button>
              <span className="text-sm text-gray-700">
                Página {pagination.currentPage} de {pagination.totalPages}
              </span>
              <button
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

