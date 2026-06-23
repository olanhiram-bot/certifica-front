import httpClient from '@/api/http'
import type { ActivityResource, ActivityResponse, SectionResource, SectionsResponse } from '@/interfaces/Section'
import type { AxiosResponse } from 'axios'

/**
 * Obtiene las secciones por tipo de sección (sectionsType).
 * Opcionalmente acepta stampId para que el backend incluya el stamp_activity correspondiente.
 */
const getSections = (sectionsType: number, stampId?: number): Promise<AxiosResponse<SectionsResponse>> => {
  const params = stampId ? { stamp_id: stampId } : {}
  return httpClient.get(`/sections-types/${sectionsType}/sections`, { params })
}

/**
 * Crea una nueva sección bajo el tipo dado.
 */
const createSection = (
  sectionTypeId: number,
  data: { name: string },
): Promise<AxiosResponse<{ data: SectionResource }>> =>
  httpClient.post(`/admin/sections-types/${sectionTypeId}/sections`, data)

/**
 * Actualiza una sección existente.
 */
const updateSection = (
  sectionId: number,
  data: { name: string; section_type_id: number },
): Promise<AxiosResponse<{ data: SectionResource }>> =>
  httpClient.put(`/admin/sections/${sectionId}`, data)

/**
 * Elimina una sección por su ID.
 */
const deleteSection = (
  sectionId: number,
  deletedReason: string,
): Promise<AxiosResponse<void>> =>
  httpClient.delete(`/admin/sections/${sectionId}`, {
    data: { deleted_reason: deletedReason },
  })

/**
 * Obtiene una actividad por su ID
 */
const getActivity = (activityId: number): Promise<AxiosResponse<ActivityResponse>> =>
  httpClient.get(`/activities/${activityId}`)

/**
 * Crea una nueva actividad bajo la sección dada.
 */
const createActivity = (
  sectionId: number,
  formData: FormData,
): Promise<AxiosResponse<{ data: ActivityResource }>> =>
  httpClient.post(`/admin/sections/${sectionId}/activities`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

/**
 * Actualiza una actividad existente.
 * Usa POST con _method=PUT para compatibilidad con multipart/form-data.
 */
const updateActivity = (
  activityId: number,
  sectionId: number,
  formData: FormData,
): Promise<AxiosResponse<{ data: ActivityResource }>> => {
  formData.append('_method', 'PUT')
  formData.append('section_id', String(sectionId))
  return httpClient.post(`/admin/activities/${activityId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

/**
 * Elimina una actividad por su ID.
 */
const deleteActivity = (
  activityId: number,
  deletedReason: string,
): Promise<AxiosResponse<void>> =>
  httpClient.delete(`/admin/activities/${activityId}`, {
    data: { deleted_reason: deletedReason },
  })

export {
  getActivity,
  getSections,
  createSection,
  updateSection,
  deleteSection,
  createActivity,
  updateActivity,
  deleteActivity,
}

