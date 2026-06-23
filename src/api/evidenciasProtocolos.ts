import httpClient from '@/api/http'
import type { AxiosResponse } from 'axios'
import type { PaginatedResponse, ProviderStamp } from '@/api/pendientes'

export const getDashboard = (params?: Record<string, string | number>): Promise<AxiosResponse<PaginatedResponse<ProviderStamp>>> =>
  httpClient.get('/validador/dashboard', { params: { per_page: 8, ...params } })
