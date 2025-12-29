import { useState, useEffect, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import DashboardShell from '../../../Components/Dashboard/DashboardShell';
import { fetchProvinces, createProvince, updateProvince, deleteProvince } from '../../../services/provinces';
import ProvincesTable from './components/ProvincesTable';
import ProvinceForm from './components/ProvinceForm';
import DeleteConfirmDialog from '../../../Components/Shared/DeleteConfirmDialog';

export default function Provincias() {
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [provinceToDelete, setProvinceToDelete] = useState(null);
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

  const loadProvinces = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchProvinces({
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        search: filters.search,
        sortBy,
        sortOrder,
      });

      if (response.success) {
        setProvinces(response.data || []);
        setPagination({
          currentPage: response.pagination.page,
          itemsPerPage: response.pagination.limit,
          totalItems: response.pagination.totalItems,
          totalPages: response.pagination.totalPages,
        });
      } else {
        setError('Error al cargar las provincias');
      }
    } catch (err) {
      console.error('Error loading provinces:', err);
      setError('Error al cargar las provincias');
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.itemsPerPage, filters, sortBy, sortOrder]);

  useEffect(() => {
    loadProvinces();
  }, [loadProvinces]);

  const handleCreateProvince = () => {
    setSelectedProvince(null);
    setFormOpen(true);
  };

  const handleEditProvince = (province) => {
    setSelectedProvince(province);
    setFormOpen(true);
  };

  const handleDeleteProvince = (province) => {
    setProvinceToDelete(province);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data) => {
    setFormLoading(true);
    setError('');
    setSuccess('');
    try {
      if (selectedProvince) {
        await updateProvince(selectedProvince.id, data);
        setSuccess('Provincia actualizada exitosamente');
      } else {
        await createProvince(data);
        setSuccess('Provincia creada exitosamente');
      }
      setFormOpen(false);
      loadProvinces();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error al procesar la solicitud');
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!provinceToDelete) return;
    setFormLoading(true);
    setError('');
    setSuccess('');
    try {
      await deleteProvince(provinceToDelete.id);
      setSuccess('Provincia eliminada exitosamente');
      setDeleteDialogOpen(false);
      setProvinceToDelete(null);
      loadProvinces();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Error al eliminar la provincia');
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
      <Head title="Provincias - Aguas" />
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de Provincias</h1>
                    <p className="text-gray-600">Administra las provincias del sistema</p>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={handleCreateProvince}
                  className="inline-flex items-center px-4 py-2 bg-[#05249E] text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#05249E] transition-all duration-200 shadow-sm"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Nueva Provincia
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
                    placeholder="Buscar provincias..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-12 block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#05249E] focus:border-transparent text-sm font-medium"
                  />
                </div>
              </div>
              <div className="flex items-center px-3 py-2 bg-gray-50 rounded-lg">
                <span className="text-sm font-semibold text-gray-900">{pagination.totalItems}</span>
                <span className="text-sm text-gray-700 ml-1">provincias</span>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}

        {/* Table or Form */}
        {formOpen ? (
          <ProvinceForm
            onClose={() => setFormOpen(false)}
            onSubmit={handleFormSubmit}
            initialData={selectedProvince}
            loading={formLoading}
          />
        ) : (
          <ProvincesTable
            provinces={provinces}
            loading={loading}
            onEdit={handleEditProvince}
            onDelete={handleDeleteProvince}
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
          itemName={provinceToDelete?.name || ''}
          loading={formLoading}
          title="Eliminar Provincia"
        />
      </div>
    </DashboardShell>
  );
}
