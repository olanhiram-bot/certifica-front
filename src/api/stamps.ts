import type { AxiosResponse } from 'axios'
import httpClient from '@/api/http'
import type { StampStatus, ProviderInfo } from '@/api/pendientes'

export interface StampDetalle {
  id: number
  percent: number
  vigency_start_date: string | null
  vigency_end_date: string | null
  created_at: string
  remaining_days: number | null
  provider: ProviderInfo & { name: string | null }
  stamp_status: StampStatus
}

export const getStamp = (id: number): Promise<AxiosResponse<{ data: StampDetalle }>> =>
  httpClient.get(`/stamps/${id}`)

export const takeReviewerStamp = (id: number): Promise<AxiosResponse<{ data: StampDetalle }>> =>
  httpClient.put(`/admin/stamps/${id}/take-reviewer`)
