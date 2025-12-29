import { useState, useEffect, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import DashboardShell from '../../../Components/Dashboard/DashboardShell';
import { fetchMunicipalities, createMunicipality, updateMunicipality, deleteMunicipality } from '../../../services/municipalities';
import MunicipalitiesTable from './components/MunicipalitiesTable';
import MunicipalityForm from './components/MunicipalityForm';
import DeleteConfirmDialog from '../../../Components/Shared/DeleteConfirmDialog';

export default function Municipios() {
  const [municipalities, setMunicipalities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);
  const [municipalityToDelete, setMunicipalityToDelete] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
  });

  const [filters, setFilters] = useState({ search: '' });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
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

  const loadMunicipalities = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchMunicipalities({
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        search: filters.search,
        sortBy,
        sortOrder,
      });

      if (response.success) {
        setMunicipalities(response.data || []);
        setPagination({
          currentPage: response.pagination.page,
          itemsPerPage: response.pagination.limit,
          totalItems: response.pagination.totalItems,
          totalPages: response.pagination.totalPages,
        });
      } else {
        setError('Error al cargar los municipios');
      }
    } catch (err) {
      console.error('Error loading municipalities:', err);
      setError('Error al cargar los municipios');
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.itemsPerPage, filters, sortBy, sortOrder]);

  useEffect(() => {
    loadMunicipalities();
  }, [loadMunicipalities]);

  const handleCreateMunicipality = () => {
    setSelectedMunicipality(null);
    setFormOpen(true);
  };

  const handleEditMunicipality = (municipality) => {
    setSelectedMunicipality(municipality);
    setFormOpen(true);
  };

  const handleDeleteMunicipality = (municipality) => {
    setMunicipalityToDelete(municipality);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data) => {
    setFormLoading(true);
    setError('');
    setSuccess('');
    try {
      if (selectedMunicipality) {
        await updateMunicipality(selectedMunicipality.id, data);
        setSuccess('Municipio actualizado exitosamente');
      } else {
        await createMunicipality(data);
        setSuccess('Municipio creado exitosamente');
      }
      setFormOpen(false);
      loadMunicipalities();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error al procesar la solicitud');
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!municipalityToDelete) return;
    setFormLoading(true);
    setError('');
    setSuccess('');
    try {
      await deleteMunicipality(municipalityToDelete.id);
      setSuccess('Municipio eliminado exitosamente');
      setDeleteDialogOpen(false);
      setMunicipalityToDelete(null);
      loadMunicipalities();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error al eliminar el municipio');
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

  return (
    <DashboardShell>
      <Head title="Municipios - Aguas" />
      <div className="space-y-6">
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

        {!formOpen ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de Municipios</h1>
                    <p className="text-gray-600">Administra los municipios del sistema</p>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={handleCreateMunicipality}
                  className="inline-flex items-center px-4 py-2 bg-[#05249E] text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#05249E] transition-all duration-200 shadow-sm"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Nuevo Municipio
                </button>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}

        {!formOpen ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar municipios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-12 block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#05249E] focus:border-transparent text-sm font-medium"
                  />
                </div>
              </div>
              <div className="flex items-center px-3 py-2 bg-gray-50 rounded-lg">
                <span className="text-sm font-semibold text-gray-900">{pagination.totalItems}</span>
                <span className="text-sm text-gray-700 ml-1">municipios</span>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}

        {/* Table or Form */}
        {formOpen ? (
          <MunicipalityForm
            onClose={() => setFormOpen(false)}
            onSubmit={handleFormSubmit}
            initialData={selectedMunicipality}
            loading={formLoading}
          />
        ) : (
          <MunicipalitiesTable
            municipalities={municipalities}
            loading={loading}
            onEdit={handleEditMunicipality}
            onDelete={handleDeleteMunicipality}
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
          itemName={municipalityToDelete?.name || ''}
          loading={formLoading}
          title="Eliminar Municipio"
        />
      </div>
    </DashboardShell>
  );
}
