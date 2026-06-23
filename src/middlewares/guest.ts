import { useAuthStore } from '@/stores/auth'
import { AuthMethod } from '@/enums/AuthMethod'
import type { RouteLocationNormalized } from 'vue-router'

/**
 * @author JaredDmz
 * Usa el AuthStore para revisar si hay una sesión activa
 * Redirige según el auth_method_id del usuario logueado
 * @return boolean | { path: string }
 */
export default (_to: RouteLocationNormalized): boolean | { path: string } => {
  const authStore = useAuthStore()

  // Si hay sesión activa, redirigir según el auth_method_id
  if (authStore.logged) {
    const authMethodId = authStore.user?.auth_method_id
    if (authMethodId === AuthMethod.ADMIN) {
      return { path: '/admin' }
    } else if (authMethodId === AuthMethod.PROVEEDOR) {
      return { path: '/usuario' }
    }
    // Si está logueado pero no tiene auth_method_id válido, permitir acceso a rutas públicas
    return true
  }

  // Si no hay sesión, permitir acceso a rutas públicas
  return true
}
