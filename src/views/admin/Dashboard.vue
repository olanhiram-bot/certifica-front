<template>
  <div class="contenedor_general">
    <Breadcrum />
    <CajaDatos />

    <Alerta v-if="mostrarAlertaStale" tipo="informativo" icon="info" :mostrar-cerrar="true" @cerrar="mostrarAlertaStale = false">
      <template #contenido>
        <b>Recordatorio</b> Tienes expedientes asignados sin movimientos desde hace más de 2 días.
      </template>
    </Alerta>

    <h4 class="titulo_seccion mt-4">Tu resumen de hoy:</h4>

    <CajaNavegadorUsuarioVue endpoint="/admin/dashboard/resume"
      :labels="['Nuevos', 'Comentarios', 'Evidencias', 'Evaluación documental']" />
    <br>

    <h4 class="titulo_seccion">Expedientes a revisar</h4>

    <div class="barra_acciones">
      <button v-if="isAdmin" class="btn-exportar" :disabled="exportandoCSV" @click="exportarCSV">
        <span v-if="exportandoCSV" class="btn-exportar__loading" aria-hidden="true"></span>
        {{ exportandoCSV ? 'Exportando...' : 'Exportar CSV' }}
      </button>
      <div class="acciones_derecha">

        <!-- Botón Filtro + dropdown -->
        <div class="filtro_wrapper" ref="filtroRef">
          <button class="btn-filtro" :class="{ 'btn-filtro--activo': hayFiltrosActivos }" @click="toggleFiltro">
            Filtro
            <span v-if="hayFiltrosActivos" class="filtro_dot"></span>
            <span class="material-symbols-outlined">{{ filtroAbierto ? 'expand_less' : 'expand_more' }}</span>
          </button>
        </div>

        <!-- Panel renderizado en body para evitar overflow:hidden de padres -->
        <Teleport to="body">
          <div v-if="filtroAbierto" ref="filtroPanelRef" class="filtro_panel elevacion_5" :style="panelStyle">
            <!-- Modalidad -->
            <p class="filtro_label">Modalidad</p>
            <div class="filtro_chips">
              <button v-for="op in opcionesModalidad" :key="op.id" class="filtro_chip"
                :class="{ 'filtro_chip--activo': filtroModalidad === op.id }" @click="toggleModalidad(op.id)">
                {{ op.label }}
              </button>
            </div>
          </div>
        </Teleport>

        <div class="caja_busqueda">
          <div class="input-group">
            <input v-model="busqueda" class="form-control" type="search" placeholder="¿Qué estás buscando?"
              @keyup.enter="buscar" @search="onClearSearch">
            <button type="button" class="input-group-text" @click="buscar">
              <span class="material-symbols-outlined">search</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="caja_navtab">
      <div v-if="store.loadingStatuses" class="tabs-skeleton">
        <span v-for="n in 4" :key="n" class="tabs-skeleton__item"></span>
      </div>
      <PestanasSimples v-else :tabs="tabsConConteo" @on-change="onTabChange" />
      <div class="tab-content">

        <div class="tab-pane fade show active" id="tab-content">
          <div v-if="store.loading" class="estado_tabla">Cargando expedientes...</div>
          <div v-else-if="store.error" class="estado_tabla estado_tabla--error">{{ store.error }}</div>
          <Table v-else
            :thead="isAdmin ? ['Ver detalles', 'Tomar', 'Empresa', 'Folio', 'Modalidad', 'Porcentaje', 'Estado', 'Vigencia', 'Fecha entrega'] : ['Ver detalles', 'Empresa', 'Folio', 'Modalidad', 'Porcentaje', 'Estado', 'Vigencia', 'Fecha entrega']">
            <tr v-if="pendientesFiltrados.length === 0">
              <td colspan="9" class="estado_tabla">Sin expedientes pendientes.</td>
            </tr>
            <tr v-for="item in pendientesFiltrados" :key="item.id">
              <td>
                <span
                  v-if="!esEnRevision(item)"
                  v-tooltip:top="'Solo disponible cuando el estatus es En revisión'"
                  class="d-inline-block"
                >
                  <button class="btn-detalle" disabled>Ver expediente</button>
                </span>
                <router-link
                  v-else
                  :to="{ name: 'admin-modulos', query: { stampId: item.id } }"
                  class="btn-detalle"
                >
                  Ver expediente
                </router-link>
              </td>
              <td v-if="isAdmin">
                <span
                  v-if="tomandoId === item.id"
                  v-tooltip:top="'Procesando asignación...'"
                  class="d-inline-block"
                >
                  <button class="btn-tomar" disabled>
                    <span class="btn-exportar__loading" aria-hidden="true"></span>
                  </button>
                </span>
                <span
                  v-else-if="!!item.reviewer_id"
                  v-tooltip:top="'El expediente ya fue asignado a un validador'"
                  class="d-inline-block"
                >
                  <button class="btn-tomar" disabled>Asignado</button>
                </span>
                <span
                  v-else-if="!esPorRevisar(item)"
                  v-tooltip:top="'Solo se puede tomar cuando el estatus es Por revisar'"
                  class="d-inline-block"
                >
                  <button class="btn-tomar" disabled>Tomar</button>
                </span>
                <button v-else class="btn-tomar" @click="tomarExpediente(item.id)">Tomar</button>
              </td>
              <td>{{ item.provider.name ?? item.provider.username }}</td>
              <td>{{ item.id }}</td>
              <td>{{ item.modality_type?.name ?? '—' }}</td>
              <td>{{ item.percent ?? 0 }}%</td>
              <td>
                <span class="badge"
                  :style="{ background: item.stamp_status.color + '33', borderColor: item.stamp_status.color, color: '#000' }">
                  {{ item.stamp_status.name }}
                </span>
              </td>
              <td>
                <span v-if="item.remaining_days == null" class="text-muted">Por definir</span>
                <span v-else class="vigencia_chip" :class="vigenciaClass(item.remaining_days)">
                  <span class="material-symbols-outlined vigencia_icon">schedule</span>
                  {{ vigenciaEtiqueta(item.remaining_days) }}
                </span>
              </td>
              <td>{{ item.created_at ? new Date(item.created_at).toLocaleDateString('es-MX') : '—' }}</td>
            </tr>
          </Table>

          <div v-if="!store.loading && !store.error" class="barra_paginacion">
            <span class="pagina_info">Página {{ store.currentPage }} de {{ store.lastPage }}</span>
            <Pagination :links="store.links" :current-page="store.currentPage" :per-page="store.perPage"
              :total="store.total" :to="store.to ?? undefined" @on-page="store.fetchPendientes($event)" />
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
import Alerta from '@/components/Alerta.vue'
import Breadcrum from '@/components/Breadcrum.vue'
import CajaDatos from '@/components/CajaDatos.vue'
import CajaNavegadorUsuarioVue from '@/components/CajaNavegadorUsuario.vue'
import Pagination from '@/components/Pagination.vue'
import PestanasSimples from '@/components/PestanasSimples.vue'
import Table from '@/components/Table.vue'
import type { TabItem } from '@/interfaces/PestanasSimplesProps'
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

// ── Filtro dropdown ─────────────────────────────────────────────────────────
const filtroRef = ref<HTMLElement | null>(null)
const filtroPanelRef = ref<HTMLElement | null>(null)
const filtroAbierto = ref(false)
const filtroModalidad = ref<number | null>(null)
const panelStyle = ref({ top: '0px', left: '0px' })

const toggleFiltro = () => {
  if (!filtroAbierto.value && filtroRef.value) {
    const rect = filtroRef.value.getBoundingClientRect()
    panelStyle.value = {
      top: `${rect.bottom + window.scrollY + 8}px`,
      left: `${rect.left + window.scrollX}px`,
    }
  }
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
  const dentroPanel = filtroPanelRef.value?.contains(target)
  if (!dentroBoton && !dentroPanel) {
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

// ── Tabs ─────────────────────────────────────────────────────────────────────
const cards = computed(() => [
  { titulo: 'Nuevos', valor: store.resumenCards.nuevos, icono: 'calendar_month' },
  { titulo: 'Comentarios', valor: store.resumenCards.comentarios, icono: 'forum' },
  { titulo: 'Evidencias', valor: store.resumenCards.evidencias, icono: 'video_camera_back' },
  { titulo: 'Evaluación documental', valor: store.resumenCards.protocolos, icono: 'assignment_add' },
])

const tabsConConteo = computed<TabItem[]>(() => [
  { id: 'todos', label: 'Todos', icon: 'account_balance', count: store.tabCounts.todos, filters: {} as Record<string, string | number> },
  ...store.stampStatuses.map(s => ({
    id: String(s.id),
    label: s.name,
    icon: 'account_balance',
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

// ── Exportar ─────────────────────────────────────────────────────────────────
const exportarCSV = async () => {
  if (exportandoCSV.value) return

  exportandoCSV.value = true
  try {
    const res = await exportDashboard({ ...store.activeFilters })
    const url = URL.createObjectURL(new Blob([res.data]))
    const link = document.createElement('a')
    link.href = url
    link.download = `usuarioes_${new Date().toISOString().slice(0, 10)}.xlsx`
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
const vigenciaClass = (days: number): string => {
  if (days <= 0) return 'es_error_important'
  if (days <= 3) return 'es_alerta_important'
  if (days <= 10) return 'es_exito_important'
  return ''
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
  border-bottom: 2px solid #dee2e6;
}

.tabs-skeleton__item {
  height: 36px;
  width: 110px;
  border-radius: 6px;
  background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Alerta */
:deep(.seccion_alerta) {
  margin-top: 20px;
  margin-bottom: 28px;
  height: 90px;
  border: 1.5px solid var(--azul_informativo) !important;
  border-radius: 8px;
  display: flex;
  align-items: center;
}

:deep(.seccion_alerta .caja_alerta) {
  width: 100%;
}

:deep(.seccion_alerta .material-symbols-outlined) {
  color: var(--azul_informativo);
  font-variation-settings: 'FILL' 1;
  font-size: 26px;
}

.titulo_seccion {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 16px;
}

.contenedor_cards {
  display: flex;
  gap: 20px;
  align-items: stretch;
  padding: 4px 0 32px;
}



.titulo {
  font-size: 15px;
  color: #374151;
  margin: 0 0 6px;
  font-weight: 500;
}

.numero {
  font-size: 42px;
  font-weight: 700;
  margin: 0;
  line-height: 1;
}

.numero--morado {
  color: #6b3fa0;
}

.numero--rojo {
  color: #e53e3e;
}

.icono {
  font-size: 52px;
  color: #7c3aed;
  opacity: 0.75;
}

.barra_acciones {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.acciones_derecha {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filtro_wrapper {
  position: relative;
}

.btn-filtro--activo {
  background: #ffd5a8 !important;
  color: #c75000 !important;
}

.filtro_dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: orange;
  display: inline-block;
}

.filtro_panel {
  position: absolute;
  z-index: 9999;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  min-width: 280px;
  border: 1px solid #f0f0f0;
}

.filtro_label {
  font-size: 11px;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0 0 10px;
}

.filtro_label:not(:first-child) {
  margin-top: 16px;
}

.filtro_chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filtro_chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 999px;
  border: 1.5px solid #e5e7eb;
  background: #f9fafb;
  color: #374151;
  font-size: 13px;
  cursor: pointer;
  transition: all .15s;
}

.filtro_chip:hover {
  border-color: orange;
  color: #f57c00;
}

.filtro_chip--activo {
  border-color: orange;
  background: #fff7ed;
  color: #f57c00;
  font-weight: 600;
}

.chip_dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.tab-content .tab-pane {
  padding: 0;
}

.btn-exportar,
.btn-filtro {
  border-radius: 3px;
  cursor: pointer;
  width: 200px;
  height: 48px;
}

.btn-exportar {
  border: 2px solid orange;
  color: orange;
  background: transparent;
  padding: 10px 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-exportar:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-exportar__loading {
  width: 16px;
  height: 16px;
  border: 2px solid rgb(245 124 0 / 28%);
  border-top-color: #f57c00;
  border-radius: 50%;
  animation: btn-exportar-spin 0.8s linear infinite;
}

.btn-filtro {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: #fde8d0;
  color: #f57c00;
  border: none;
  padding: 10px 24px;
  font-weight: 500;
}

.btn-filtro .material-symbols-outlined {
  font-size: 20px;
}

.caja_busqueda .input-group {
  border: 2px solid orange;
  border-radius: 9px;
  overflow: hidden;
  background: white;
  height: 48px;
}

.caja_busqueda .form-control {
  border: none !important;
  background: white;
  color: #6c757d;
  box-shadow: none !important;
  width: 220px;
  text-align: center;
}

.caja_busqueda .input-group-text,
.caja_busqueda .input-group-text:hover,
.caja_busqueda .input-group-text:focus,
.caja_busqueda .input-group-text:active {
  background: orange;
  border: none;
  color: white;
  cursor: pointer;
}

.btn-detalle {
  display: inline-block;
  background: orange;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
}

.btn-detalle:hover {
  background: #e65c00;
  color: white;
}

.btn-detalle:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.btn-tomar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: transparent;
  color: #0075C9;
  border: 1.5px solid #0075C9;
  padding: 5px 14px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  min-width: 80px;
  transition: all .15s;
}

.btn-tomar:hover:not(:disabled) {
  background: #0075C9;
  color: white;
}

.btn-tomar:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  border-color: #9ca3af;
  color: #9ca3af;
}

.estado_tabla {
  padding: 24px;
  text-align: center;
  color: #6c757d;
  font-size: 14px;
}

.estado_tabla--error {
  color: #e53e3e;
}

.badge {
  display: inline-block;
  padding: 5px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  border: 2px solid;
  white-space: nowrap;
}

.barra_paginacion {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border-top: 1px solid #f0f0f0;
}

.pagina_info {
  font-size: 12px;
  color: #f57c00;
  font-weight: 500;
  white-space: nowrap;
}

:deep(.barra_paginacion .row) {
  display: flex;
  align-items: center;
  margin: 0;
  width: auto;
}

:deep(.barra_paginacion .col-md-2) {
  display: none;
}

:deep(.barra_paginacion .col-md-10) {
  padding: 0;
  width: auto;
}

:deep(.barra_paginacion .seccion_paginacion) {
  display: flex;
  justify-content: flex-end;
}

:deep(.barra_paginacion .paginacion_paginas) {
  display: flex;
  align-items: center;
  gap: 4px;
}

:deep(.barra_paginacion .boton_primario),
:deep(.barra_paginacion .boton_secundario),
:deep(.barra_paginacion a) {
  padding: 2px 8px;
  font-size: 12px;
  min-width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.tab-content) {
  box-shadow: none !important;
}

:deep(.estilo_tabla thead tr th),
:deep(.estilo_tabla tbody tr td) {
  text-align: center;
  vertical-align: middle;
}

.vigencia_chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
}

.vigencia_icon {
  font-size: 15px;
  font-variation-settings: 'FILL' 1;
}

@keyframes btn-exportar-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
