import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useLoadingStore } from '../loading'

describe('useLoadingStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('debe tener estado inicial inactivo', () => {
    const store = useLoadingStore()
    expect(store.active).toBe(false)
    expect(store.msg).toBe('')
  })

  it('debe activar el loading con mensaje', () => {
    const store = useLoadingStore()
    store.setLoading('Cargando datos...')
    expect(store.active).toBe(true)
    expect(store.msg).toBe('Cargando datos...')
  })

  it('debe limpiar el loading', () => {
    const store = useLoadingStore()
    store.setLoading('Procesando...')
    store.clearLoading()
    expect(store.active).toBe(false)
    expect(store.msg).toBe('')
  })
})