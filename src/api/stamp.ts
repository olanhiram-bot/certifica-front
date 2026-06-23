import type { AxiosResponse } from 'axios'
import httpClient from '@/api/http'
import type { Stamp, StampActivity, StampActivityResource, StampActivityComment } from '@/interfaces/Stamp'

type StampResponse = { data: Stamp }
type StampActivitiesResponse = { data: StampActivityResource[] }
type StampActivityResponse = { data: StampActivity }
type StampActivityResourceResponse = { data: StampActivityResource; meta?: { evidence_complete?: boolean; message?: string | null } }
type StampActivityCommentResponse = { data: StampActivityComment; meta?: { evidence_complete?: boolean; message?: string | null } }
type StampActivityCommentsResponse = { data: StampActivityComment[] }

const getCurrentByProvider = (): Promise<AxiosResponse<StampResponse>> =>
  httpClient.get('/stamps/current-by-provider')

const createStamp = (modalityTypeId: number): Promise<AxiosResponse<StampResponse>> =>
  httpClient.post('/stamps', { modality_type_id: modalityTypeId })

const activateStamp = (stampId: number): Promise<AxiosResponse<StampResponse>> =>
  httpClient.patch(`/stamps/${stampId}`, { is_active: true })

const getStampActivities = (
  stampId: number
): Promise<AxiosResponse<StampActivitiesResponse>> =>
  httpClient.get(`/stamps/${stampId}/stamp-activities`)

const createStampActivity = (
  stampId: number,
  activityId: number
): Promise<AxiosResponse<StampActivityResponse>> =>
  httpClient.post(`/stamps/${stampId}/stamp-activities`, { activity_id: activityId })

const getStampActivity = (
  stampActivityId: number
): Promise<AxiosResponse<StampActivityResourceResponse>> =>
  httpClient.get(`/stamp-activities/${stampActivityId}`)

const addFileToStampActivity = (
  stampActivityId: number,
  file: File
): Promise<AxiosResponse<StampActivityResourceResponse>> => {
  const formData = new FormData()
  formData.append('file', file)
  return httpClient.post(`/stamp-activities/${stampActivityId}/add-file`, formData)
}

const getStampActivityComments = (
  stampActivityId: number
): Promise<AxiosResponse<StampActivityCommentsResponse>> =>
  httpClient.get(`/stamp-activities/${stampActivityId}/comment`)

const createStampActivityComment = (
  stampActivityId: number,
  comment: string
): Promise<AxiosResponse<StampActivityCommentResponse>> =>
  httpClient.post(`/stamp-activities/${stampActivityId}/comment`, { comment })

const markMaterialAsViewed = (
  stampActivityId: number
): Promise<AxiosResponse<StampActivityResourceResponse>> =>
  httpClient.put(`/stamp-activities/${stampActivityId}/material-was-viwed`)

const deleteStamp = (
  stampId: number,
  deletedReason?: string
): Promise<AxiosResponse<StampResponse>> =>
  httpClient.delete(`/stamps/${stampId}`, { data: { deleted_reason: deletedReason } })

const deleteStampActivityFile = (
  stampActivityId: number
): Promise<AxiosResponse<StampActivityResourceResponse>> =>
  httpClient.put(`/stamp-activities/${stampActivityId}/deleted-file`)

export { getCurrentByProvider, createStamp, activateStamp, getStampActivities, createStampActivity, getStampActivity, addFileToStampActivity, getStampActivityComments, createStampActivityComment, markMaterialAsViewed, deleteStamp, deleteStampActivityFile }
