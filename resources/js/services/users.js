import api from '../utils/api';

const API_BASE = '/api/users';

export async function fetchUsers(params = {}) {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append('page', params.page);
  if (params.limit) searchParams.append('limit', params.limit);
  if (params.search) searchParams.append('search', params.search);
  if (params.roleId) searchParams.append('role_id', params.roleId);
  if (params.sortBy) searchParams.append('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

  const response = await api.get(`${API_BASE}?${searchParams.toString()}`);
  return response.data;
}

export async function createUser(data) {
  const response = await api.post(API_BASE, data);
  return response.data;
}

export async function updateUser(id, data) {
  const response = await api.put(`${API_BASE}/${id}`, data);
  return response.data;
}

export async function deleteUser(id) {
  const response = await api.delete(`${API_BASE}/${id}`);
  return response.data;
}

export async function resetUserPassword(id) {
  const response = await api.post(`${API_BASE}/${id}/reset-password`);
  return response.data;
}

