import { useAuthStore } from '@/stores/auth'
import { AuthMethod } from '@/enums/AuthMethod'
import type { RouteLocationNormalized } from 'vue-router'

/**
 * @author JaredDmz
 * Middleware de autenticación
 * Verifica si hay sesión activa y redirige según el auth_method_id
 */
export default (to: RouteLocationNormalized): boolean | { path: string } | { name: string } => {
  const authStore = useAuthStore()

  if (!authStore.logged) {
    return { path: '/login' }
  }

  // Si está logueado y accede a rutas de login, redirigir según su auth_method_id
  if (to.path === '/login') {
    const authMethodId = authStore.user?.auth_method_id
    if (authMethodId === AuthMethod.ADMIN) {
      return { name: 'admin-dashboard' }
    } else if (authMethodId === AuthMethod.PROVEEDOR) {
      return { path: '/usuario' }
    }
    // Fallback si no tiene auth_method_id válido
    return { path: '/login' }
  }

  // Verificar si la ruta requiere un auth_method_id específico
  const requiredAuthMethod = to.meta.requiredAuthMethod as number | undefined
  if (requiredAuthMethod !== undefined) {
    const authMethodId = authStore.user?.auth_method_id
    if (authMethodId !== requiredAuthMethod) {
      if (authMethodId === AuthMethod.ADMIN) {
        return { name: 'admin-dashboard' }
      } else if (authMethodId === AuthMethod.PROVEEDOR) {
        return { path: '/usuario' }
      }
      return { path: '/login' }
    }
  }

  return true
}
