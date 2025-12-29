import api from '../utils/api';

const API_BASE = '/api/municipalities';

export async function fetchMunicipalities(params = {}) {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append('page', params.page);
  if (params.limit) searchParams.append('limit', params.limit);
  if (params.search) searchParams.append('search', params.search);
  if (params.provinceId) searchParams.append('province_id', params.provinceId);
  if (params.sortBy) searchParams.append('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

  const response = await api.get(`${API_BASE}?${searchParams.toString()}`);
  return response.data;
}

export async function fetchMunicipalitiesSimple(provinceId = null) {
  // Usar parámetro 'all=true' para obtener todos los registros sin paginación
  // Si se proporciona provinceId, filtrar por provincia
  const params = new URLSearchParams();
  params.append('all', 'true');
  if (provinceId) {
    params.append('province_id', provinceId);
  }
  
  const response = await api.get(`${API_BASE}?${params.toString()}`);
  if (response.data && response.data.data) {
    return response.data.data.map(municipality => ({
      id: municipality.id,
      name: municipality.name,
      provinceId: municipality.province_id,
      provinceName: municipality.province?.name || '',
    }));
  }
  return [];
}

export async function createMunicipality(data) {
  const response = await api.post(API_BASE, data);
  return response.data;
}

export async function updateMunicipality(id, data) {
  const response = await api.put(`${API_BASE}/${id}`, data);
  return response.data;
}

export async function deleteMunicipality(id) {
  const response = await api.delete(`${API_BASE}/${id}`);
  return response.data;
}
