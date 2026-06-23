import type { AxiosResponse } from 'axios'
import httpClient from '@/api/http'
import type { LandingContent } from '@/interfaces/LandingContent'
import type { PaginateResponse } from '@/interfaces/Paginate'

type LandingContentResponse = { data: LandingContent[] }
type LandingContentPaginatedResponse = PaginateResponse & { data: LandingContent[] }

/**
 * Obtiene los elementos del carousel (content_type = 1 = "Carrusel")
 */
const getCarouselItems = (): Promise<AxiosResponse<LandingContentResponse>> =>
  httpClient.get('/content-types/1/landing-contents')

/**
 * Obtiene los FAQs (content_type = 2 = "Preguntas Frecuentes")
 */
const getFaqItems = (): Promise<AxiosResponse<LandingContentResponse>> =>
  httpClient.get('/content-types/2/landing-contents')

/**
 * Obtiene los elementos del acordeón (content_type = 3 = "Acordeón")
 */
const getAccordionItems = (): Promise<AxiosResponse<LandingContentResponse>> =>
  httpClient.get('/content-types/3/landing-contents')

/**
 * Obtiene los elementos del acordeón de usuario externo (content_type = 4)
 */
const getAccordionUsuarioItems = (): Promise<AxiosResponse<LandingContentResponse>> =>
  httpClient.get('/content-types/4/landing-contents')

/**
 * Obtiene las instituciones (content_type = 5 = "Instituciones")
 */
const getInstituciones = (): Promise<AxiosResponse<LandingContentResponse>> =>
  httpClient.get('/content-types/5/landing-contents')

/**
 * Obtiene los recursos de protocolos (content_type = 6 = "Recursos Protocolos")
 */
const getRecursos = (): Promise<AxiosResponse<LandingContentResponse>> =>
  httpClient.get('/content-types/6/landing-contents')

/**
 * Obtiene los materiales de ayuda (content_type = 7 = "Ayuda")
 */
const getAyudaItems = (): Promise<AxiosResponse<LandingContentResponse>> =>
  httpClient.get('/content-types/7/landing-contents')

/**
 * Obtiene los contenidos de un tipo dado con soporte de paginación.
 * Usado en la vista de administración de contenido.
 */
const getLandingContentsByType = (
  contentType: number,
  page: number = 1,
  filter?: string,
): Promise<AxiosResponse<LandingContentPaginatedResponse>> =>
  httpClient.get(`/content-types/${contentType}/landing-contents`, {
    params: { page, ...(filter ? { filter } : {}) },
  })

/**
 * Crea un nuevo elemento de contenido bajo un tipo de contenido dado.
 */
const createLandingContent = (
  contentTypeId: number,
  formData: FormData,
): Promise<AxiosResponse<LandingContent>> =>
  httpClient.post(`/admin/content-types/${contentTypeId}/landing-contents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

/**
 * Actualiza un elemento de contenido existente.
 * Usa POST con _method=PUT para compatibilidad con multipart/form-data.
 */
const updateLandingContent = (
  id: number,
  formData: FormData,
): Promise<AxiosResponse<LandingContent>> => {
  formData.append('_method', 'PUT')
  return httpClient.post(`/admin/landing-contents/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

/**
 * Elimina un elemento de contenido con un motivo de eliminación.
 */
const deleteLandingContent = (
  id: number,
  deletedReason: string,
): Promise<AxiosResponse<boolean>> =>
  httpClient.delete(`/admin/landing-contents/${id}`, {
    data: { deleted_reason: deletedReason },
  })

export {
  getCarouselItems,
  getFaqItems,
  getAccordionItems,
  getAccordionUsuarioItems,
  getInstituciones,
  getRecursos,
  getAyudaItems,
  getLandingContentsByType,
  createLandingContent,
  updateLandingContent,
  deleteLandingContent,
}
