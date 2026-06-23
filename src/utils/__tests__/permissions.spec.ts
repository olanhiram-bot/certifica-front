import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { checkPermission } from '../permissions'
import { useAuthStore } from '@/stores/auth'

describe('Permissions Utils', () => {
  beforeEach(() => {
    // Crear una nueva instancia de Pinia antes de cada test
    setActivePinia(createPinia())
  })

  describe('checkPermission', () => {
    it('debe retornar true si el usuario tiene el permiso requerido', () => {
      const authStore = useAuthStore()

      authStore.setSession(
        '1n30D3lmEp239',
        {
          id: 1,
          name: 'Test User',
          email: 'test@example.com'
        },
        ['read', 'write']
      )

      expect(checkPermission('read')).toBe(true)
      expect(checkPermission('write')).toBe(true)
    })

    it('debe retornar false si el usuario no tiene el permiso requerido', () => {
      const authStore = useAuthStore()
      authStore.setSession(
        '1n30D3lmEp239',
        {
          id: 1,
          name: 'Test User',
          email: 'test@example.com'
        },
        ['read']
      )

      expect(checkPermission('write')).toBe(false)
    })

    it('debe retornar false si el usuario no ha iniciado sesión', () => {
      expect(checkPermission('read')).toBe(false)
    })

    it('debe retornar false si el usuario cerró sesión', () => {
      const authStore = useAuthStore()

      // Simular el inicio de sesión del usuario
      authStore.setSession(
        '1n30D3lmEp239',
        {
          id: 1,
          name: 'Test User',
          email: 'test@example.com'
        },
        ['read', 'write']
      )

      // Simular el cierre de sesión del usuario
      authStore.logout()

      expect(checkPermission('read')).toBe(false)
      expect(checkPermission('write')).toBe(false)
    })
  })
})
