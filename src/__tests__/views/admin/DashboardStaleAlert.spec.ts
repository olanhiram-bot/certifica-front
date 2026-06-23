import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import Dashboard from '@/views/admin/Dashboard.vue'
import * as pendientesApi from '@/api/pendientes'

// ── Mocks de módulos ─────────────────────────────────────────────────────────
vi.mock('@/api/pendientes', () => ({
  getDashboardPendientes: vi.fn(),
  getDashboardResume: vi.fn(),
  getDashboardStampStatuses: vi.fn(),
  getDashboardStaleAlert: vi.fn(),
  exportDashboard: vi.fn(),
}))

vi.mock('@/api/stamps', () => ({ takeReviewerStamp: vi.fn() }))

vi.mock('vue-toast-notification', () => ({
  useToast: () => ({ success: vi.fn(), error: vi.fn() }),
}))

// ── Helpers ───────────────────────────────────────────────────────────────────
const stubComponent = { template: '<div />' }

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: stubComponent },
      { path: '/admin/modulos', name: 'admin-modulos', component: stubComponent },
    ],
  })
}

function mountDashboard() {
  return mount(Dashboard, {
    global: {
      plugins: [makeRouter()],
      stubs: {
        Breadcrum: stubComponent,
        CajaDatos: stubComponent,
        CajaNavegadorProveedor: stubComponent,
        CajaNavegadorProveedorVue: stubComponent,
        Pagination: stubComponent,
        PestanasSimples: stubComponent,
        Table: { template: '<table><slot /></table>' },
        Teleport: true,
      },
    },
  })
}

const emptyPaginatedResponse = {
  data: {
    data: [],
    meta: { current_page: 1, last_page: 1, per_page: 8, total: 0, from: null, to: null, path: '', links: [] },
  },
}

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('Dashboard.vue – alerta de expedientes sin movimiento', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks() // limpia call counts; las implementaciones se re-asignan abajo
    // Restaurar implementaciones por defecto antes de cada test
    vi.mocked(pendientesApi.getDashboardPendientes).mockResolvedValue(emptyPaginatedResponse as any)
    vi.mocked(pendientesApi.getDashboardResume).mockResolvedValue({ data: { news: 0, comments: 0, evidences: 0, protocols: 0 } } as any)
    vi.mocked(pendientesApi.getDashboardStampStatuses).mockResolvedValue({ data: [] } as any)
    vi.mocked(pendientesApi.getDashboardStaleAlert).mockResolvedValue({ data: { has_stale: false } } as any)
  })

  it('no muestra la alerta cuando getDashboardStaleAlert devuelve has_stale: false', async () => {
    vi.mocked(pendientesApi.getDashboardStaleAlert).mockResolvedValue({ data: { has_stale: false } } as any)

    const wrapper = mountDashboard()
    await flushPromises()

    expect(wrapper.findComponent({ name: 'Alerta' }).exists()).toBe(false)
  })

  it('muestra la alerta cuando getDashboardStaleAlert devuelve has_stale: true', async () => {
    vi.mocked(pendientesApi.getDashboardStaleAlert).mockResolvedValue({ data: { has_stale: true } } as any)

    const wrapper = mountDashboard()
    await flushPromises()

    expect(wrapper.findComponent({ name: 'Alerta' }).exists()).toBe(true)
  })

  it('la alerta muestra el texto correcto sobre expedientes sin movimiento', async () => {
    vi.mocked(pendientesApi.getDashboardStaleAlert).mockResolvedValue({ data: { has_stale: true } } as any)

    const wrapper = mountDashboard()
    await flushPromises()

    expect(wrapper.findComponent({ name: 'Alerta' }).text()).toContain('2 días')
  })

  it('oculta la alerta al hacer clic en cerrar', async () => {
    vi.mocked(pendientesApi.getDashboardStaleAlert).mockResolvedValue({ data: { has_stale: true } } as any)

    const wrapper = mountDashboard()
    await flushPromises()

    expect(wrapper.findComponent({ name: 'Alerta' }).exists()).toBe(true)

    // Hacer clic en el botón de cierre real (.btn-close) de la Alerta
    await wrapper.findComponent({ name: 'Alerta' }).find('.btn-close').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent({ name: 'Alerta' }).exists()).toBe(false)
  })

  it('no muestra la alerta si el endpoint falla (silencioso)', async () => {
    vi.mocked(pendientesApi.getDashboardStaleAlert).mockRejectedValue(new Error('Network error'))

    const wrapper = mountDashboard()
    await flushPromises()

    expect(wrapper.findComponent({ name: 'Alerta' }).exists()).toBe(false)
  })

  it('llama a getDashboardStaleAlert exactamente una vez al montar', async () => {
    mountDashboard()
    await flushPromises()

    expect(pendientesApi.getDashboardStaleAlert).toHaveBeenCalledTimes(1)
  })
})
