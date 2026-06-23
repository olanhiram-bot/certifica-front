import type { AxiosResponse } from 'axios'
import httpClient from '@/api/http'

export interface LandingContentType {
  id: number
  name: string
}

/**
 * Obtiene los tipos de contenido para el landing (para el dropdown de tipo)
 */
export const getLandingContentTypes = (): Promise<AxiosResponse<LandingContentType[]>> =>
  httpClient.get('/landing-content-types')
