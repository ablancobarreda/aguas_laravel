import api from '../utils/api';

const API_BASE = '/api/provinces';

export async function fetchProvinces(params = {}) {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append('page', params.page);
  if (params.limit) searchParams.append('limit', params.limit);
  if (params.search) searchParams.append('search', params.search);
  if (params.sortBy) searchParams.append('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

  const response = await api.get(`${API_BASE}?${searchParams.toString()}`);
  return response.data;
}

export async function fetchProvincesSimple() {
  // Usar parámetro 'all=true' para obtener todos los registros sin paginación
  const response = await api.get(`${API_BASE}?all=true`);
  if (response.data && response.data.data) {
    return response.data.data.map(province => ({
      id: province.id,
      name: province.name,
    }));
  }
  return [];
}

export async function createProvince(data) {
  const response = await api.post(API_BASE, data);
  return response.data;
}

export async function updateProvince(id, data) {
  const response = await api.put(`${API_BASE}/${id}`, data);
  return response.data;
}

export async function deleteProvince(id) {
  const response = await api.delete(`${API_BASE}/${id}`);
  return response.data;
}
