import { useState, useEffect, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import DashboardShell from '../../../Components/Dashboard/DashboardShell';
import { fetchEquipment, createEquipment, updateEquipment, deleteEquipment } from '../../../services/equipment';
import { fetchLocalitiesSimple } from '../../../services/localities';
import StationsTable from './components/StationsTable';
import StationForm from './components/StationForm';
import DeleteConfirmDialog from '../../../Components/Shared/DeleteConfirmDialog';
import CustomSelect from '../../../Components/Shared/CustomSelect';

export default function Estaciones() {
  const [stations, setStations] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [stationToDelete, setStationToDelete] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
  });

  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    locality: null,
    basin: '',
  });

  // Sorting state
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Search debounce
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setFilters(prev => ({ ...prev, search: debouncedSearchTerm }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, [debouncedSearchTerm]);

  // Load localities for filter
  useEffect(() => {
    const loadLocalities = async () => {
      try {
        const localitiesData = await fetchLocalitiesSimple();
        const localityOptions = localitiesData.map(locality => ({
          value: locality.id,
          label: `${locality.name} (${locality.municipalityName}, ${locality.provinceName})`
        }));
        setLocalities(localityOptions);
      } catch (error) {
        console.error('Error loading localities:', error);
      }
    };
    loadLocalities();
  }, []);

  // Load stations
  const loadStations = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchEquipment({
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        search: filters.search,
        locality_id: filters.locality,
        basin: filters.basin,
        sortBy,
        sortOrder,
      });

      if (response.success) {
        setStations(response.data || []);
        setPagination({
          currentPage: response.pagination.page,
          itemsPerPage: response.pagination.limit,
          totalItems: response.pagination.totalItems,
          totalPages: response.pagination.totalPages,
        });
      } else {
        setError('Error al cargar las estaciones');
      }
    } catch (error) {
      console.error('Error loading stations:', error);
      setError('Error al cargar las estaciones');
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.itemsPerPage, filters, sortBy, sortOrder]);

  useEffect(() => {
    loadStations();
  }, [loadStations]);

  const handleCreateStation = () => {
    setSelectedStation(null);
    setFormOpen(true);
  };

  const handleEditStation = (station) => {
    setSelectedStation(station);
    setFormOpen(true);
  };

  const handleDeleteStation = (station) => {
    setStationToDelete(station);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data) => {
    setFormLoading(true);
    setError('');
    setSuccess('');
    try {
      if (selectedStation) {
        await updateEquipment(selectedStation.id, data);
        setSuccess('Estación actualizada exitosamente');
      } else {
        await createEquipment(data);
        setSuccess('Estación creada exitosamente');
      }
      setFormOpen(false);
      loadStations();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error al procesar la solicitud');
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!stationToDelete) return;

    setFormLoading(true);
    setError('');
    setSuccess('');
    try {
      await deleteEquipment(stationToDelete.id);
      setSuccess('Estación eliminada exitosamente');
      setDeleteDialogOpen(false);
      setStationToDelete(null);
      loadStations();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error al eliminar la estación');
    } finally {
      setFormLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setPagination(prev => ({
      ...prev,
      itemsPerPage: newItemsPerPage,
      currentPage: 1,
    }));
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      search: '',
      locality: null,
      basin: '',
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const hasActiveFilters = searchTerm || filters.locality;

  return (
    <DashboardShell>
      <Head title="Estaciones - Aguas" />
      <div className="space-y-6">
        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Header */}
        {!formOpen ? ( <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0 mb-4 lg:mb-0">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-[#05249E]/10 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#05249E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Gestión de Estaciones
                  </h1>
                  <p className="text-gray-600">
                    Administra las estaciones de monitoreo de aguas.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={handleCreateStation}
                className="inline-flex items-center px-4 py-2 bg-[#05249E] text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#05249E] transition-all duration-200 shadow-sm"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nueva Estación
              </button>
            </div>
          </div>
        </div>
) : (
  <></>
)}

        {/* Filters */}
        {!formOpen ? ( <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 flex-1">
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar estaciones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-12 block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#05249E] focus:border-transparent text-sm font-medium"
                  />
                </div>
              </div>
              <div className="w-full sm:w-64">
                <CustomSelect
                  options={localities}
                  value={filters.locality ? localities.find(opt => opt.value === filters.locality) || null : null}
                  onChange={(selectedValue) => {
                    handleFilterChange('locality', selectedValue?.value || null);
                  }}
                  placeholder="Filtrar por localidad..."
                  isSearchable={true}
                  isClearable={true}
                />
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center px-3 py-2 bg-gray-50 rounded-lg">
                <span className="text-sm font-semibold text-gray-900">
                  {pagination.totalItems}
                </span>
                <span className="text-sm text-gray-700 ml-1">
                  {pagination.totalItems === 1 ? 'estación' : 'estaciones'}
                </span>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#05249E] hover:text-blue-700 font-medium transition-colors"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>
        </div>
) : (
  <></>
)}

        {/* Table or Form */}
        {formOpen ? (
          <StationForm
            onClose={() => setFormOpen(false)}
            onSubmit={handleFormSubmit}
            initialData={selectedStation}
            loading={formLoading}
          />
        ) : (
          <StationsTable
            stations={stations}
            loading={loading}
            onEdit={handleEditStation}
            onDelete={handleDeleteStation}
            onSort={handleSort}
            sortBy={sortBy}
            sortOrder={sortOrder}
            pagination={pagination}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}

        <DeleteConfirmDialog
          isOpen={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          itemName={stationToDelete?.location || stationToDelete?.id || ''}
          loading={formLoading}
          title="Eliminar Estación"
        />
      </div>
    </DashboardShell>
  );
}
