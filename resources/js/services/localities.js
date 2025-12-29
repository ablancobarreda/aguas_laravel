import api from '../utils/api';

const API_BASE = '/api/localities';

export async function fetchLocalities(params = {}) {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append('page', params.page);
  if (params.limit) searchParams.append('limit', params.limit);
  if (params.search) searchParams.append('search', params.search);
  if (params.municipalityId) searchParams.append('municipality_id', params.municipalityId);
  if (params.sortBy) searchParams.append('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);
  
  const response = await api.get(`${API_BASE}?${searchParams.toString()}`);
  return response.data;
}

export async function fetchLocalitiesSimple() {
  // Usar parámetro 'all=true' para obtener todos los registros sin paginación
  const response = await api.get(`${API_BASE}?all=true`);
  if (response.data && response.data.data) {
    return response.data.data.map(loc => ({
      id: loc.id,
      name: loc.name,
      municipalityName: loc.municipality?.name || '',
      provinceName: loc.municipality?.province?.name || '',
    }));
  }
  return [];
}

export async function createLocality(data) {
  const response = await api.post(API_BASE, data);
  return response.data;
}

export async function updateLocality(id, data) {
  const response = await api.put(`${API_BASE}/${id}`, data);
  return response.data;
}

export async function deleteLocality(id) {
  const response = await api.delete(`${API_BASE}/${id}`);
  return response.data;
}
