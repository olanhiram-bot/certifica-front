import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import guestMiddleware from '../guest'
import { useAuthStore } from '@/stores/auth'
import { AuthMethod } from '@/enums/AuthMethod'

describe('guest middleware', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('debe retornar true cuando ya está en /login', () => {
    const authStore = useAuthStore()
    authStore.logged = false

    const result = guestMiddleware({ path: '/login' } as never)

    expect(result).toBe(true)
  })

  it('debe retornar redirección a /proveedor cuando el usuario PROVIDER está autenticado', () => {
    const authStore = useAuthStore()
    authStore.logged = true
    authStore.user = { auth_method_id: AuthMethod.PROVEEDOR } as never

    const result = guestMiddleware({ path: '/otro' } as never)

    expect(result).toEqual({ path: '/proveedor' })
  })

  it('debe retornar redirección a /admin cuando el usuario ADMIN está autenticado', () => {
    const authStore = useAuthStore()
    authStore.logged = true
    authStore.user = { auth_method_id: AuthMethod.ADMIN } as never

    const result = guestMiddleware({ path: '/otro' } as never)

    expect(result).toEqual({ path: '/admin' })
  })

  it('debe retornar redirección a /admin cuando el usuario VALIDATOR está autenticado', () => {
    const authStore = useAuthStore()
    authStore.logged = true
    authStore.user = { auth_method_id: AuthMethod.ADMIN } as never

    const result = guestMiddleware({ path: '/otro' } as never)

    expect(result).toEqual({ path: '/admin' })
  })

  it('debe retornar true cuando el usuario no está autenticado', () => {
    const authStore = useAuthStore()
    authStore.logged = false

    const result = guestMiddleware({ path: '/otro' } as never)

    expect(result).toBe(true)
  })
})
