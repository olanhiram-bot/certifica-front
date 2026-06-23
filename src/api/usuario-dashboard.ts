import type { AxiosResponse } from 'axios'
import httpClient from '@/api/http'
import type { DashboardResume } from '@/interfaces/Dashboard'
import type { DashboardStatusActivity } from '@/interfaces/DashboardStatus'
import type { DashboardStampActivity } from '@/interfaces/DashboardStampActivity'

type DashboardResumeResponse = { data: DashboardResume }

export const getDashboardResumen = (): Promise<AxiosResponse<DashboardResumeResponse>> =>
  httpClient.get('/dashboard/resume')

export const getDashboardStatusWithTotals = (
  search?: string,
  sectionTypeId?: number
): Promise<AxiosResponse<{ data: DashboardStatusActivity[] }>> => {
  const params: Record<string, string | number> = {}
  if (search) params.search = search
  if (sectionTypeId) params.section_type_id = sectionTypeId
  return httpClient.get('/dashboard/status-with-totals-activities', { params })
}

export const getDashboardActividades = (
  search?: string,
  sectionTypeId?: number,
  statusId?: number,
  page = 1
): Promise<AxiosResponse<{ data: DashboardStampActivity[], meta: any }>> => {
  const params: Record<string, string | number> = { page: page }
  if (search) params.search = search
  if (sectionTypeId) params.section_type_id = sectionTypeId
  if (statusId) params.status_id = statusId
  return httpClient.get('/dashboard/stamp-activities', { params })
}