import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth'
import type { UserResponse } from '@/interfaces/User'

describe('useAuthStore', () => {
  beforeEach(() => {
    // Crear una nueva instancia de Pinia antes de cada test
    setActivePinia(createPinia())
  })

  it('debe inicializar con el estado por defecto', () => {
    const store = useAuthStore()

    expect(store.logged).toBe(false)
    expect(store.token).toBe('')
    expect(store.user).toBeNull()
    expect(store.permissions).toEqual([])
  })

  it('debe establecer la sesión correctamente', () => {
    const store = useAuthStore()
    const mockUser: UserResponse = {
      id: 123,
      name: 'Test User',
      email: 'test@example.com',
    }
    const mockToken = 'test-token-123'
    const mockPermissions = ['read', 'write', 'delete']

    store.setSession(mockToken, mockUser, mockPermissions)

    expect(store.logged).toBe(true)
    expect(store.token).toBe(mockToken)
    expect(store.user).toEqual(mockUser)
    expect(store.permissions).toEqual(mockPermissions)
  })

  it('debe cerrar sesión y limpiar todos los datos', () => {
    const store = useAuthStore()

    // Primero establecer una sesión
    const mockUser: UserResponse = {
      id: 123,
      name: 'Test User',
      email: 'test@example.com',
    }
    store.setSession('token', mockUser, ['read'])

    // Luego hacer logout
    store.logout()

    expect(store.logged).toBe(false)
    expect(store.token).toBe('')
    expect(store.user).toBeNull()
    expect(store.permissions).toEqual([])
  })

  it('debe actualizar los permisos de forma independiente', () => {
    const store = useAuthStore()

    store.permissions = ['read', 'write']
    expect(store.permissions).toHaveLength(2)
    expect(store.permissions).toContain('read')
    expect(store.permissions).toContain('write')

    store.permissions.push('delete')
    expect(store.permissions).toHaveLength(3)
    expect(store.permissions).toContain('delete')
  })
})
