import api from '../utils/api';

const API_BASE = '/api/records';

export async function fetchStationRecords(stationId, params = {}) {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append('page', params.page);
  if (params.limit) searchParams.append('limit', params.limit);
  if (params.startDate) searchParams.append('startDate', params.startDate);
  if (params.endDate) searchParams.append('endDate', params.endDate);

  const response = await api.get(`${API_BASE}/station/${stationId}?${searchParams.toString()}`);
  return response.data;
}

