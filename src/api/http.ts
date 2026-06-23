import router from '@/router'
import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth'
import { AuthMethod } from '@/enums/AuthMethod'
import { useToast } from 'vue-toast-notification'
import { useLoadingStore } from '@/stores/loading'

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  timeout: 50000, //in milliseconds 1000 = 1s
  headers: {
    Accept: 'application/json',
  },
})

httpClient.interceptors.request.use(async (request: InternalAxiosRequestConfig) => {
  const authStore = useAuthStore()

  if (authStore.logged) {
    request.headers.Authorization = `Bearer ${authStore.token}`
  }

  return request
})

httpClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const loadingStore = useLoadingStore()
    loadingStore.clearLoading()
    return response
  },
  (error: AxiosError<{ message?: string }>) => {
    const authStore = useAuthStore()
    const toast = useToast()
    const loadingStore = useLoadingStore()
    loadingStore.clearLoading()

    const status = error.response?.status
    const url = error.config?.url || ''

    if (!status) {
      toast.error('No se pudo conectar con el servidor.')
      return Promise.reject(error)
    }

    if (status === 401 || status === 419) {
      // Errores de credenciales de sesión expiradas
      const authMethodId = authStore.user?.auth_method_id
      authStore.logout()
      router.push({ path: authMethodId === AuthMethod.ADMIN ? '/admin/login' : '/login' })
    }

    if (status === 422) {
      // Errores de validación de tipo de datos
      toast.error(error.response?.data?.message ?? 'Error de validación de datos.')
    }

    if (status === 403) {
      toast.error(error.response?.data?.message ?? 'El usuario no tiene permisos para acceder al recurso.')
    }

    if (status === 500 && !url.includes('/stamps/current-by-provider')) {
      toast.error('Error de conexion al servidor.')
    }

    if (status === 429) {
      toast.warning('Protección de seguridad activada. Demasiadas solicitudes al servidor, espere 1 minuto para continuar.')
    }

    return Promise.reject(error)
  },
)

export default httpClient
