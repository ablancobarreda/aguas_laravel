import api from '../utils/api';

const API_BASE = '/api/equipment';

export async function fetchEquipment(params = {}) {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.append('page', params.page);
  if (params.limit) searchParams.append('limit', params.limit);
  if (params.search) searchParams.append('search', params.search);
  if (params.locality_id) searchParams.append('locality_id', params.locality_id);
  if (params.basin) searchParams.append('basin', params.basin);
  if (params.sortBy) searchParams.append('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

  const response = await api.get(`${API_BASE}?${searchParams.toString()}`);
  return response.data;
}

export async function fetchEquipmentById(id) {
  const response = await api.get(`${API_BASE}/${id}`);
  return response.data;
}

export async function createEquipment(data) {
  const response = await api.post(API_BASE, data);
  return response.data;
}

export async function updateEquipment(id, data) {
  const response = await api.put(`${API_BASE}/${id}`, data);
  return response.data;
}

export async function deleteEquipment(id) {
  const response = await api.delete(`${API_BASE}/${id}`);
  return response.data;
}

export async function fetchRainfallData() {
  const response = await api.get(`${API_BASE}/rainfall`);
  return response.data;
}

