<template>
  <div class="container_app">
    <Breadcrum />
    <CajaDatos class="mb-4" />

    <!-- Alerta Stale -->
    <section v-if="mostrarAlertaStale" class="alert alert-info border-info d-flex align-items-center gap-3 mb-4 shadow-sm" role="alert">
      <i class="bi bi-info-circle-fill fs-4 text-info"></i>
      <div class="flex-grow-1">
        <strong>Recordatorio:</strong> Tienes expedientes asignados sin movimientos desde hace más de 2 días.
      </div>
      <button type="button" class="btn-close" aria-label="Close" @click="mostrarAlertaStale = false"></button>
    </section>

    <!-- Resumen de hoy -->
    <h2 class="h4 mb-3 fw-bold text-dark">Tu resumen de hoy:</h2>
    <section class="row g-3 mb-4">
      <div v-for="card in cards" :key="card.titulo" class="col-sm-6 col-xl-3">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between gap-3">
              <div>
                <p class="text-muted small mb-1">{{ card.titulo }}</p>
                <strong class="display-6 fw-bold text-dark">{{ card.valor }}</strong>
              </div>
              <i class="bi fs-2 text-primary" :class="card.icono"></i>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Expedientes a revisar -->
    <div class="card border-0 shadow-sm">
      <div class="card-body p-4">
        <div class="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
          <div>
            <h2 class="h4 mb-1">Expedientes a revisar</h2>
            <p class="text-muted mb-0">Gestiona y evalúa los expedientes de capacitación de los usuarios.</p>
          </div>
          <div class="d-flex flex-column flex-sm-row gap-2 align-items-center dashboard-actions ms-lg-auto w-auto">
            <button
              v-if="isAdmin"
              class="btn btn-outline-primary d-inline-flex align-items-center gap-2 px-3 py-2 w-100 w-sm-auto"
              :disabled="exportandoCSV"
              @click="exportarCSV"
            >
              <span v-if="exportandoCSV" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <i v-else class="bi bi-file-earmark-excel"></i>
              {{ exportandoCSV ? 'Exportando...' : 'Exportar CSV' }}
            </button>

            <!-- Filtro Dropdown -->
            <div class="dropdown w-100 w-sm-auto" ref="filtroRef">
              <button
                class="btn btn-outline-secondary dropdown-toggle d-inline-flex align-items-center justify-content-center gap-2 px-3 py-2 w-100"
                :class="{ 'active': hayFiltrosActivos }"
                type="button"
                @click="toggleFiltro"
              >
                <i class="bi bi-funnel"></i>
                Filtro
                <span v-if="hayFiltrosActivos" class="badge bg-primary rounded-circle p-1 ms-1"></span>
              </button>
              <ul v-if="filtroAbierto" class="dropdown-menu show p-3 end-0" style="min-width: 260px; z-index: 1050; display: block;">
                <li>
                  <h6 class="dropdown-header px-0 text-uppercase fw-bold text-muted small">Modalidad</h6>
                  <div class="d-flex flex-wrap gap-2 mt-2">
                    <button
                      v-for="op in opcionesModalidad"
                      :key="op.id"
                      class="btn btn-sm w-100 text-start"
                      :class="filtroModalidad === op.id ? 'btn-primary text-white' : 'btn-outline-secondary'"
                      @click="toggleModalidad(op.id)"
                    >
                      <i v-if="filtroModalidad === op.id" class="bi bi-check2 me-1"></i>
                      {{ op.label }}
                    </button>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Caja búsqueda -->
            <div class="input-group w-100 w-sm-auto" style="min-width: 260px;">
              <input
                v-model="busqueda"
                class="form-control"
                type="search"
                placeholder="Buscar empresa o folio..."
                @keyup.enter="buscar"
                @search="onClearSearch"
              />
              <button class="btn btn-primary" type="button" @click="buscar">
                <i class="bi bi-search"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Tabs de estados -->
        <div v-if="store.loadingStatuses" class="tabs-skeleton mb-4">
          <span v-for="n in 4" :key="n" class="tabs-skeleton__item"></span>
        </div>
        <ul v-else class="nav nav-pills gap-2 mb-4">
          <li v-for="tab in tabsConConteo" :key="tab.id" class="nav-item">
            <button
              class="nav-link d-flex align-items-center gap-2"
              :class="{ active: activeTab === tab.id }"
              type="button"
              @click="handleTabChange(tab.id)"
            >
              <i class="bi bi-folder2-open"></i>
              {{ tab.label }}
              <span class="badge ms-2" :class="activeTab === tab.id ? 'text-bg-light' : 'text-bg-secondary'">
                {{ tab.count }}
              </span>
            </button>
          </li>
        </ul>

        <!-- Tabla de contenidos -->
        <div class="table-responsive">
          <table class="table align-middle table-hover">
            <thead class="table-light">
              <tr>
                <th class="text-center">Ver detalles</th>
                <th v-if="isAdmin" class="text-center">Tomar</th>
                <th>Empresa</th>
                <th class="text-center">Folio</th>
                <th>Modalidad</th>
                <th class="text-center">Porcentaje</th>
                <th>Estado</th>
                <th>Vigencia</th>
                <th>Fecha entrega</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="store.loading">
                <td :colspan="isAdmin ? 9 : 8" class="text-center text-muted py-5">
                  <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
                  Cargando expedientes...
                </td>
              </tr>
              <tr v-else-if="store.error">
                <td :colspan="isAdmin ? 9 : 8" class="text-center text-danger py-5">{{ store.error }}</td>
              </tr>
              <tr v-else-if="pendientesFiltrados.length === 0">
                <td :colspan="isAdmin ? 9 : 8" class="text-center text-muted py-5">Sin expedientes pendientes.</td>
              </tr>
              <tr v-else v-for="item in pendientesFiltrados" :key="item.id">
                <td class="text-center">
                  <span
                    v-if="!esEnRevision(item)"
                    v-tooltip:top="'Solo disponible cuando el estatus es En revisión'"
                    class="d-inline-block"
                  >
                    <button class="btn btn-sm btn-outline-primary" disabled>Ver expediente</button>
                  </span>
                  <router-link
                    v-else
                    :to="{ name: 'admin-modulos', query: { stampId: item.id } }"
                    class="btn btn-sm btn-primary text-white"
                  >
                    Ver expediente
                  </router-link>
                </td>
                <td v-if="isAdmin" class="text-center">
                  <span
                    v-if="tomandoId === item.id"
                    v-tooltip:top="'Procesando asignación...'"
                    class="d-inline-block"
                  >
                    <button class="btn btn-sm btn-outline-secondary" disabled>
                      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    </button>
                  </span>
                  <span
                    v-else-if="!!item.reviewer_id"
                    v-tooltip:top="'El expediente ya fue asignado a un validador'"
                    class="d-inline-block"
                  >
                    <button class="btn btn-sm btn-outline-secondary" disabled>Asignado</button>
                  </span>
                  <span
                    v-else-if="!esPorRevisar(item)"
                    v-tooltip:top="'Solo se puede tomar cuando el estatus es Por revisar'"
                    class="d-inline-block"
                  >
                    <button class="btn btn-sm btn-outline-secondary" disabled>Tomar</button>
                  </span>
                  <button v-else class="btn btn-sm btn-outline-success" @click="tomarExpediente(item.id)">Tomar</button>
                </td>
                <td class="fw-semibold">{{ item.provider.name ?? item.provider.username }}</td>
                <td class="text-center">{{ item.id }}</td>
                <td>{{ item.modality_type?.name ?? '—' }}</td>
                <td class="text-center fw-bold text-primary">{{ item.percent ?? 0 }}%</td>
                <td>
                  <span
                    class="badge px-3 py-2"
                    :style="{ backgroundColor: item.stamp_status.color + '22', borderColor: item.stamp_status.color, color: '#1f2937', border: '1px solid' }"
                  >
                    {{ item.stamp_status.name }}
                  </span>
                </td>
                <td>
                  <span v-if="item.remaining_days == null" class="text-muted small">Por definir</span>
                  <span v-else class="badge px-2 py-1_5 d-inline-flex align-items-center gap-1" :class="vigenciaBadgeClass(item.remaining_days)">
                    <i class="bi bi-clock"></i>
                    {{ vigenciaEtiqueta(item.remaining_days) }}
                  </span>
                </td>
                <td>{{ item.created_at ? new Date(item.created_at).toLocaleDateString('es-MX') : '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div v-if="!store.loading && !store.error && pendientesFiltrados.length > 0" class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 pt-3 border-top mt-4">
          <span class="text-muted small">
            Página {{ store.currentPage }} de {{ store.lastPage }} · {{ store.total }} registros
          </span>
          <div class="btn-group">
            <button class="btn btn-outline-secondary btn-sm" type="button" :disabled="store.currentPage <= 1 || store.loading" @click="store.fetchPendientes(store.currentPage - 1)">
              Anterior
            </button>
            <button class="btn btn-outline-secondary btn-sm" type="button" :disabled="store.currentPage >= store.lastPage || store.loading" @click="store.fetchPendientes(store.currentPage + 1)">
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isAxiosError } from 'axios'
import { exportDashboard, getDashboardStaleAlert } from '@/api/pendientes'
import type { ProviderStamp } from '@/api/pendientes'
import { takeReviewerStamp } from '@/api/stamps'
import Breadcrum from '@/components/Breadcrum.vue'
import CajaDatos from '@/components/CajaDatos.vue'
import { useAuthStore } from '@/stores/auth'
import { usePendientesStore } from '@/stores/pendientes'
import { useStampStore } from '@/stores/stamp'
import { AuthMethod } from '@/enums/AuthMethod'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useToast } from 'vue-toast-notification'

const store = usePendientesStore()
const toast = useToast()
const authStore = useAuthStore()
const stampStore = useStampStore()
const isAdmin = computed(() => authStore.user?.auth_method_id === AuthMethod.ADMIN)
const busqueda = ref('')
const exportandoCSV = ref(false)
const mostrarAlertaStale = ref(false)
const activeTab = ref('todos')

// ── Filtro dropdown ─────────────────────────────────────────────────────────
const filtroRef = ref<HTMLElement | null>(null)
const filtroAbierto = ref(false)
const filtroModalidad = ref<number | null>(null)

const toggleFiltro = () => {
  filtroAbierto.value = !filtroAbierto.value
}

const opcionesModalidad = [
  { id: 1, label: 'Sistema Certifica' },
  { id: 2, label: 'Usuario Externo' },
]

const hayFiltrosActivos = computed(() => filtroModalidad.value !== null)

const tabFilters = ref<Record<string, string | number>>({})

const applyDropdown = () => {
  const extra: Record<string, string | number> = {}
  if (filtroModalidad.value !== null) extra.modality_type_id = filtroModalidad.value
  if (busqueda.value.trim()) extra.search = busqueda.value.trim()
  store.setFilter({ ...tabFilters.value, ...extra })
  store.fetchPendientes()
}

const toggleModalidad = (id: number) => {
  filtroModalidad.value = filtroModalidad.value === id ? null : id
  applyDropdown()
}

const onClickOutside = (e: MouseEvent) => {
  const target = e.target as Node
  const dentroBoton = filtroRef.value?.contains(target)
  if (!dentroBoton) {
    filtroAbierto.value = false
  }
}

onMounted(async () => {
  stampStore.clearCurrentProvider()
  document.addEventListener('mousedown', onClickOutside)
  await store.fetchPendientes()
  await store.fetchTabCounts()
  try {
    const { data } = await getDashboardStaleAlert()
    mostrarAlertaStale.value = data.has_stale
  } catch {
    // silently ignore — la alerta no es crítica
  }
})
onBeforeUnmount(() => document.removeEventListener('mousedown', onClickOutside))

// ── Tabs y Conteos ──────────────────────────────────────────────────────────
const cards = computed(() => [
  { titulo: 'Nuevos', valor: store.resumenCards.nuevos, icono: 'bi-calendar-event' },
  { titulo: 'Comentarios', valor: store.resumenCards.comentarios, icono: 'bi-chat-left-text' },
  { titulo: 'Evidencias', valor: store.resumenCards.evidencias, icono: 'bi-cloud-upload' },
  { titulo: 'Evaluación documental', valor: store.resumenCards.protocolos, icono: 'bi-file-earmark-text' },
])

const tabsConConteo = computed(() => [
  { id: 'todos', label: 'Todos', count: store.tabCounts.todos, filters: {} as Record<string, string | number> },
  ...store.stampStatuses.map(s => ({
    id: String(s.id),
    label: s.name,
    count: s.providers_count,
    filters: { stamp_status_id: s.id } as Record<string, string | number>,
  })),
])

const onTabChange = (tabId: string) => {
  const tab = tabsConConteo.value.find(t => t.id === tabId)
  tabFilters.value = tab?.filters ?? {}
  const extra: Record<string, string | number> = {}
  if (filtroModalidad.value !== null) extra.modality_type_id = filtroModalidad.value
  store.setFilter({ ...tabFilters.value, ...extra })
  store.fetchPendientes()
}

const handleTabChange = (tabId: string) => {
  activeTab.value = tabId
  onTabChange(tabId)
}

// ── Exportar ─────────────────────────────────────────────────────────────────
const exportarCSV = async () => {
  if (exportandoCSV.value) return

  exportandoCSV.value = true
  try {
    const res = await exportDashboard({ ...store.activeFilters })
    const url = URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.download = `expedientes_${new Date().toISOString().slice(0, 10)}.xlsx`
    link.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error al exportar CSV:', error)
    if (!isAxiosError(error) || !error.response) {
      toast.error('No fue posible exportar el archivo.')
    }
  } finally {
    exportandoCSV.value = false
  }
}

// ── Helpers de estado ────────────────────────────────────────────────────────
const EN_REVISION_STATUS_ID = 3
const POR_REVISAR_STATUS_ID = 2
const esEnRevision = (item: ProviderStamp): boolean => Number(item.stamp_status.id) === EN_REVISION_STATUS_ID
const esPorRevisar = (item: ProviderStamp): boolean => Number(item.stamp_status.id) === POR_REVISAR_STATUS_ID

// ── Tomar expediente ─────────────────────────────────────────────────────────
const tomandoId = ref<number | null>(null)

const tomarExpediente = async (id: number) => {
  if (tomandoId.value) return
  tomandoId.value = id
  try {
    await takeReviewerStamp(id)
    toast.success('Expediente asignado correctamente.')
    await store.fetchPendientes(store.currentPage)
  } catch {
    // el httpClient ya muestra el toast de error
  } finally {
    tomandoId.value = null
  }
}

// ── Búsqueda via API ──────────────────────────────────────────────────────────
const buscar = () => {
  const extra: Record<string, string | number> = {}
  if (filtroModalidad.value !== null) extra.modality_type_id = filtroModalidad.value
  if (busqueda.value.trim()) extra.search = busqueda.value.trim()
  store.setFilter({ ...tabFilters.value, ...extra })
  store.fetchPendientes()
}

const onClearSearch = () => {
  if (!busqueda.value) buscar()
}

const pendientesFiltrados = computed(() => store.pendientes)

// ── Vigencia ─────────────────────────────────────────────────────────────────
const vigenciaBadgeClass = (days: number): string => {
  if (days <= 0) return 'text-bg-danger'
  if (days <= 3) return 'text-bg-warning text-dark'
  if (days <= 10) return 'text-bg-success'
  return 'text-bg-secondary'
}

const vigenciaEtiqueta = (days: number): string => {
  if (days < 0) return 'Vencido'
  if (days === 0) return 'Hoy vence'
  if (days === 1) return '1 día'
  return `${days} días`
}
</script>

<style scoped>
.tabs-skeleton {
  display: flex;
  gap: 8px;
  padding: 8px 0;
}

.tabs-skeleton__item {
  height: 38px;
  width: 110px;
  border-radius: var(--app-radius);
  background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.nav-pills .nav-link {
  border: 1px solid var(--app-border);
  color: var(--app-muted);
  font-weight: 600;
  border-radius: var(--app-radius);
  padding: 0.5rem 1rem;
}

.nav-pills .nav-link.active {
  background-color: var(--app-primary);
  color: #fff;
  border-color: var(--app-primary);
}

.nav-pills .nav-link.active .badge {
  background-color: #fff !important;
  color: var(--app-primary) !important;
}

.table th,
.table td {
  padding: 0.875rem 1rem;
}
</style>
