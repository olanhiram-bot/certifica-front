import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import authMiddleware from '../auth'
import { useAuthStore } from '@/stores/auth'
import type { RouteLocationNormalized } from 'vue-router'

const mockTo = {
  path: '/test',
  name: 'test',
  params: {},
  query: {},
  hash: '',
  matched: [],
  fullPath: '/test',
  redirectedFrom: undefined,
  meta: {},
} as RouteLocationNormalized

describe('auth middleware', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('debe retornar redirección a /login cuando el usuario no está autenticado', () => {
    const authStore = useAuthStore()
    authStore.logged = false

    const result = authMiddleware(mockTo)

    expect(result).toEqual({ path: '/login' })
  })

  it('debe retornar true cuando el usuario está autenticado', () => {
    const authStore = useAuthStore()
    authStore.logged = true

    const result = authMiddleware(mockTo)

    expect(result).toBe(true)
  })
})
