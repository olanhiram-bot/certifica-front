import { useAuthStore } from '@/stores/auth'

/**
 * Verifica si el usuario tiene un permiso específico.
 *
 * @param permission
 * @returns boolean
 */
export function checkPermission(permission: string): boolean {
  const authStore = useAuthStore()
  const permissions = authStore.permissions
  return permissions.includes(permission)
}
