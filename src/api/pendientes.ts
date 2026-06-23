import type { AxiosResponse } from 'axios'
import httpClient from '@/api/http'

export interface StampStatus {
  id: string
  name: string
  color: string
}

export interface ProviderInfo {
  id: string
  username: string
  email: string | null
  rfc: string | null
  name: string | null
}

export interface ModalityType {
  id: number
  name: string
}

export interface ProviderStamp {
  id: number
  vigency_start_date: string | null
  vigency_end_date: string | null
  percent: number
  provider: ProviderInfo
  stamp_status: StampStatus
  modality_type: ModalityType | null
  created_at: string
  remaining_days: number | null
  reviewer_id: number | null
}

export interface LinkPaginateMeta {
  url: string | null
  label: string
  active: boolean
}

export interface PaginatedMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
  path: string
  links: LinkPaginateMeta[]
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginatedMeta
}

export interface StampStatusWithCount {
  id: number
  name: string
  hexadecimal: string
  providers_count: number
}

export interface DashboardResume {
  news: number
  comments: number
  evidences: number
  protocols: number
}

export const getDashboardPendientes = (params?: Record<string, string | number>): Promise<AxiosResponse<PaginatedResponse<ProviderStamp>>> =>
  httpClient.get('/admin/dashboard', { params: { per_page: 8, ...params } })

export const getDashboardResume = (): Promise<AxiosResponse<DashboardResume>> =>
  httpClient.get('/admin/dashboard/resume')

export const getDashboardStampStatuses = (): Promise<AxiosResponse<StampStatusWithCount[]>> =>
  httpClient.get('/admin/dashboard/stamp-statuses')

export const exportDashboard = (params?: Record<string, string | number>): Promise<AxiosResponse<Blob>> =>
  httpClient.get('/admin/dashboard/export', { params, responseType: 'blob' })

export const getDashboardStaleAlert = (): Promise<AxiosResponse<{ has_stale: boolean }>> =>
  httpClient.get('/admin/dashboard/stale-alert')
