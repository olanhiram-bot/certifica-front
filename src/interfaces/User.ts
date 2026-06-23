export interface ProviderInfo {
  provider_id: number
  tipo_persona: string
  nombre_completo: string
  nombre_comercial: string
  rfc: string
  estratificacion: string
  no_sire: string | null
  url_perfil: string
}

export interface UserData {
  user_id: number
  username: string
  role: string
  email: string
  rfc: string
  provider_info: ProviderInfo | null
}

export interface AuthUser {
  auth_method_id: number
  username: string
  user: UserData
  updated_at: string
  created_at: string
  id: number
}

export interface UserResponse {
  id?: number
  username?: string
  name?: string
  email?: string
  role?: string
  rfc?: string
  user?: Record<string, unknown>
  auth_method_id?: number
  created_at?: string
  updated_at?: string
}

/**
 * Interfaz para la estructura de usuario SSO con pivot
 * Estructura: user.user.pivot.role_id
 */
export interface SSOUser {
  user: {
    pivot?: {
      role_id?: number
    }
  }
}
