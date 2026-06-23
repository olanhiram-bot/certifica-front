import type { AxiosResponse } from 'axios'
import httpClient from '@/api/http'
import type { ValidatorStamp, ValidatorStampActivity } from '@/interfaces/ValidatorStamp'

type ValidatorStampResponse = { data: ValidatorStamp }
type ValidatorStampActivitiesResponse = { data: ValidatorStampActivity[] }
type ValidatorStampActivityResponse = { data: ValidatorStampActivity; meta?: { evidence_complete?: boolean; message?: string | null } }

export const getStamp = (id: number): Promise<AxiosResponse<ValidatorStampResponse>> =>
  httpClient.get(`/stamps/${id}`)

export const takeReviewerStamp = (stampId: number): Promise<AxiosResponse<ValidatorStampResponse>> =>
  httpClient.put(`/admin/stamps/${stampId}/take-reviewer`)

export const approveStamp = (stampId: number): Promise<AxiosResponse<ValidatorStampResponse>> =>
  httpClient.put(`/stamps/${stampId}/approve`)

export const rejectStamp = (stampId: number, reason: string): Promise<AxiosResponse<ValidatorStampResponse>> =>
  httpClient.put(`/stamps/${stampId}/reject`, { reason })

export const approveStampActivity = (stampActivityId: number): Promise<AxiosResponse<ValidatorStampActivityResponse>> =>
  httpClient.put(`/stamp-activities/${stampActivityId}/approved`)

export const rejectStampActivity = (stampActivityId: number): Promise<AxiosResponse<ValidatorStampActivityResponse>> =>
  httpClient.put(`/stamp-activities/${stampActivityId}/rejected`)

export const getStampActivities = (stampId: number): Promise<AxiosResponse<ValidatorStampActivitiesResponse>> =>
  httpClient.get(`/stamps/${stampId}/stamp-activities`)

export const getStampActivity = (stampActivityId: number): Promise<AxiosResponse<ValidatorStampActivityResponse>> =>
  httpClient.get(`/stamp-activities/${stampActivityId}`)

export const releaseStamp = (stampId: number): Promise<AxiosResponse<ValidatorStampResponse>> =>
  httpClient.put(`/admin/stamps/${stampId}/release-stamp`)
