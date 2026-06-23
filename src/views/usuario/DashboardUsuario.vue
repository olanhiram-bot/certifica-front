<template>
  <div class="container_app user-dashboard">
    <section class="card border-0 shadow-sm mb-4">
      <div class="card-body p-4">
        <div class="row align-items-center g-4">
          <div class="col-lg-8">
            <span class="badge text-bg-primary mb-3">Espacio de trabajo</span>
            <h1 class="h3 mb-2">Dashboard de usuario</h1>
            <p class="text-muted mb-0">
              Consulta el avance de tu expediente, revisa tus evidencias y continua con la
              capacitacion.
            </p>
          </div>
          <div class="col-lg-4">
            <div class="progress-card">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="small text-muted">Avance general</span>
                <strong>{{ stampStore.percent }}%</strong>
              </div>
              <div class="progress" role="progressbar" :aria-valuenow="stampStore.percent" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar" :style="{ width: `${stampStore.percent}%` }"></div>
              </div>
              <div class="d-flex justify-content-between align-items-center mt-3">
                <span class="small text-muted">Modalidad</span>
                <span class="fw-semibold text-end">{{ stampStore.modalityName }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="statusMessage" class="alert mb-4" :class="statusMessage.className">
      <h2 class="h5 mb-1">{{ statusMessage.title }}</h2>
      <p class="mb-0">{{ statusMessage.description }}</p>
    </section>

    <section class="row g-3 mb-4">
      <div v-for="card in summaryCards" :key="card.label" class="col-sm-6 col-xl-3">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between gap-3">
              <div>
                <p class="text-muted small mb-1">{{ card.label }}</p>
                <strong class="display-6 dashboard-number">{{ card.value }}</strong>
              </div>
              <i class="bi fs-2 text-primary" :class="card.icon"></i>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="card border-0 shadow-sm">
      <div class="card-body p-4">
        <div class="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
          <div>
            <h2 class="h4 mb-1">Evidencias</h2>
            <p class="text-muted mb-0">Revisa el estado de las actividades cargadas en tu expediente.</p>
          </div>
          <div class="d-flex flex-column flex-sm-row gap-2 dashboard-actions">
            <select v-model="selectedSectionType" class="form-select" aria-label="Tipo de seccion" @change="handleSectionTypeChange">
              <option value="">Todas las secciones</option>
              <option v-for="option in sectionTypeOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
            <div class="input-group">
              <input
                v-model="searchTerm"
                class="form-control"
                type="search"
                placeholder="Buscar actividad"
                @keyup.enter="handleSearch"
              />
              <button class="btn btn-outline-primary" type="button" @click="handleSearch">
                <i class="bi bi-search"></i>
              </button>
            </div>
          </div>
        </div>

        <ul class="nav nav-pills gap-2 mb-4">
          <li v-for="tab in tabs" :key="tab.id" class="nav-item">
            <button
              class="nav-link"
              :class="{ active: activeTab === tab.id }"
              type="button"
              @click="handleTabChange(tab.id)"
            >
              {{ tab.label }}
              <span class="badge ms-2" :class="activeTab === tab.id ? 'text-bg-light' : 'text-bg-secondary'">
                {{ tab.count }}
              </span>
            </button>
          </li>
        </ul>

        <div class="table-responsive">
          <table class="table align-middle">
            <thead>
              <tr>
                <th>Actividad</th>
                <th>Modulo</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th class="text-end">Accion</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loadingTable">
                <td colspan="5" class="text-center text-muted py-5">Cargando evidencias...</td>
              </tr>
              <tr v-else-if="stampActivities.length === 0">
                <td colspan="5" class="text-center text-muted py-5">Sin evidencias registradas.</td>
              </tr>
              <tr v-for="item in stampActivities" v-else :key="item.id">
                <td class="fw-semibold">{{ item.activity.name }}</td>
                <td>{{ item.activity.section?.name ?? 'Sin modulo' }}</td>
                <td>
                  <span class="status-badge" :style="statusStyle(item.status.hexadecimal)">
                    {{ item.status.name }}
                  </span>
                </td>
                <td>{{ formatDate(item.created_at) }}</td>
                <td class="text-end">
                  <button
                    class="btn btn-sm btn-outline-primary"
                    type="button"
                    :disabled="!stampStore.isEditable || stampStore.isExpired"
                    @click="verEvidencia(item)"
                  >
                    Ver evidencia
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 pt-3 border-top">
          <span class="text-muted small">
            Pagina {{ pagination.page }} de {{ pagination.lastPage }} · {{ pagination.total }} registros
          </span>
          <div class="btn-group">
            <button class="btn btn-outline-secondary btn-sm" type="button" :disabled="pagination.page <= 1 || loadingTable" @click="handlePageChange(pagination.page - 1)">
              Anterior
            </button>
            <button class="btn btn-outline-secondary btn-sm" type="button" :disabled="pagination.page >= pagination.lastPage || loadingTable" @click="handlePageChange(pagination.page + 1)">
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="d-flex flex-column flex-md-row justify-content-end gap-2 mt-4">
      <button class="btn btn-outline-secondary" type="button" @click="abrirCancelacion">
        Tomar en otro momento
      </button>
      <button class="btn btn-primary" type="button" :disabled="stampStore.isExpired" @click="router.push({ name: 'usuario-programa-modulos' })">
        Continuar capacitacion
      </button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import { getDashboardActividades, getDashboardResumen, getDashboardStatusWithTotals } from '@/api/usuario-dashboard'
import type { DashboardStatusActivity } from '@/interfaces/DashboardStatus'
import type { DashboardStampActivity } from '@/interfaces/DashboardStampActivity'
import { useLoadingStore } from '@/stores/loading'
import { useStampStore } from '@/stores/stamp'

interface LinkPaginate {
  url: string | null
  label: string
  active: boolean
}

const router = useRouter()
const toast = useToast()
const loadingStore = useLoadingStore()
const stampStore = useStampStore()

const statusActivities = ref<DashboardStatusActivity[]>([])
const stampActivities = ref<DashboardStampActivity[]>([])
const loadingTable = ref(false)
const activeTab = ref('all')
const selectedSectionType = ref<number | string>('')
const searchTerm = ref('')
const summary = ref({
  days_remaining: 0,
  comments: 0,
  evidences_to_upload: 0,
  protocols_to_upload: 0,
})
const pagination = ref({
  page: 1,
  perPage: 10,
  total: 0,
  lastPage: 1,
  links: [] as LinkPaginate[],
})

const sectionTypeOptions = [
  { label: 'Modulos', value: 1 },
  { label: 'Evaluacion documental', value: 2 },
]

const summaryCards = computed(() => [
  { label: 'Dias restantes', value: summary.value.days_remaining, icon: 'bi-calendar-check' },
  { label: 'Comentarios', value: summary.value.comments, icon: 'bi-chat-left-text' },
  { label: 'Evidencias por subir', value: summary.value.evidences_to_upload, icon: 'bi-cloud-upload' },
  { label: 'Documentos por subir', value: summary.value.protocols_to_upload, icon: 'bi-file-earmark-check' },
])

const tabs = computed(() => [
  {
    id: 'all',
    label: 'Todo',
    count: statusActivities.value.reduce((sum, status) => sum + status.total_activities, 0),
  },
  ...statusActivities.value.map((status) => ({
    id: String(status.stamp_id),
    label: status.status,
    count: status.total_activities,
  })),
])

const statusMessage = computed(() => {
  if (stampStore.isAprobado) {
    return {
      className: 'alert-success',
      title: 'Capacitacion concluida',
      description: 'Tu expediente fue aprobado. Ya puedes consultar tu certificado cuando este disponible.',
    }
  }

  if (stampStore.isExpired) {
    return {
      className: 'alert-danger',
      title: 'Expediente fuera de vigencia',
      description: 'El tiempo para subir evidencias termino. No se aceptaran nuevas cargas.',
    }
  }

  if (stampStore.isEnRevision) {
    return {
      className: 'alert-primary',
      title: 'Expediente en revision',
      description: 'Tus evidencias fueron enviadas y estan siendo evaluadas.',
    }
  }

  return {
    className: 'alert-info',
    title: 'Expediente activo',
    description: `Completa los modulos y documentos requeridos antes de la fecha limite: ${stampStore.vigenciaFin ?? 'por definir'}.`,
  }
})

const fetchSummary = async () => {
  try {
    const response = await getDashboardResumen()
    const payload = response.data as unknown as { data?: typeof summary.value } & typeof summary.value
    summary.value = payload.data ?? {
      days_remaining: Number(payload.days_remaining) || 0,
      comments: Number(payload.comments) || 0,
      evidences_to_upload: Number(payload.evidences_to_upload) || 0,
      protocols_to_upload: Number(payload.protocols_to_upload) || 0,
    }
  } catch {
    summary.value = {
      days_remaining: stampStore.remainingDays ?? 0,
      comments: 0,
      evidences_to_upload: 0,
      protocols_to_upload: 0,
    }
  }
}

const fetchStatusActivities = async () => {
  try {
    const sectionTypeId = selectedSectionType.value ? Number(selectedSectionType.value) : undefined
    const response = await getDashboardStatusWithTotals(searchTerm.value, sectionTypeId)
    const payload = response.data as unknown as { data?: DashboardStatusActivity[] } | DashboardStatusActivity[]
    statusActivities.value = Array.isArray(payload) ? payload : payload.data ?? []
  } catch {
    statusActivities.value = []
  }
}

const fetchStampActivities = async (page = pagination.value.page) => {
  loadingTable.value = true

  try {
    const sectionTypeId = selectedSectionType.value ? Number(selectedSectionType.value) : undefined
    const statusId = activeTab.value === 'all' ? undefined : Number(activeTab.value)
    const response = await getDashboardActividades(searchTerm.value, sectionTypeId, statusId, page)
    const payload = response.data as unknown as {
      data?: DashboardStampActivity[]
      meta?: {
        current_page?: number
        per_page?: number
        total?: number
        last_page?: number
        links?: LinkPaginate[]
      }
      current_page?: number
      per_page?: number
      total?: number
      last_page?: number
      links?: LinkPaginate[]
    }
    const meta = payload.meta ?? payload

    stampActivities.value = payload.data ?? []
    pagination.value = {
      page: Number(meta?.current_page) || page,
      perPage: Number(meta?.per_page) || 10,
      total: Number(meta?.total) || stampActivities.value.length,
      lastPage: Number(meta?.last_page) || 1,
      links: meta?.links ?? [],
    }
  } catch {
    stampActivities.value = []
    pagination.value = { page: 1, perPage: 10, total: 0, lastPage: 1, links: [] }
  } finally {
    loadingTable.value = false
  }
}

const refreshDashboard = async (page = 1) => {
  await Promise.all([fetchSummary(), fetchStatusActivities()])
  await fetchStampActivities(page)
}

const handleSearch = () => {
  pagination.value.page = 1
  refreshDashboard(1)
}

const handleSectionTypeChange = () => {
  activeTab.value = 'all'
  pagination.value.page = 1
  refreshDashboard(1)
}

const handleTabChange = (tabId: string) => {
  activeTab.value = tabId
  pagination.value.page = 1
  fetchStampActivities(1)
}

const handlePageChange = (page: number) => {
  if (page < 1 || page > pagination.value.lastPage) return
  fetchStampActivities(page)
}

const verEvidencia = (item: DashboardStampActivity) => {
  if (!stampStore.isEditable) {
    toast.warning('El expediente se encuentra en revision y no puede ser modificado.')
    return
  }

  router.push({ name: 'usuario-curso-evidencia', params: { id: item.id } })
}

const abrirCancelacion = async () => {
  const reason = window.prompt('Escribe el motivo para pausar o cancelar tu expediente:')
  if (!reason?.trim()) return

  loadingStore.setLoading('Cancelando proceso...')
  try {
    await stampStore.deleteCurrentStamp(reason.trim())
    toast.success('Tu proceso se cancelo correctamente.')
    router.push({ name: 'usuario-instrucciones' })
  } catch {
    toast.error('No fue posible cancelar el proceso.')
  } finally {
    loadingStore.clearLoading()
  }
}

const formatDate = (date: string) => {
  if (!date) return 'Sin fecha'
  return new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium' }).format(new Date(date))
}

const statusStyle = (color: string) => ({
  backgroundColor: `${color || '#6c757d'}22`,
  borderColor: color || '#6c757d',
  color: '#1f2937',
})

onMounted(async () => {
  loadingStore.setLoading('Cargando dashboard...')
  try {
    await stampStore.fetchCurrentStamp()
    await refreshDashboard()
  } finally {
    loadingStore.clearLoading()
  }
})
</script>

<style scoped>
.user-dashboard {
  padding-bottom: 2rem;
}

.progress-card {
  background: #f8fafc;
  border: 1px solid #d9dee8;
  border-radius: 8px;
  padding: 1rem;
}

.dashboard-number {
  color: #202733;
  font-size: 2rem;
  line-height: 1;
}

.dashboard-actions {
  width: min(100%, 560px);
}

.dashboard-actions .form-select {
  min-width: 210px;
}

.nav-pills .nav-link {
  border: 1px solid #d9dee8;
  color: #344054;
}

.nav-pills .nav-link.active {
  background-color: #2563eb;
  border-color: #2563eb;
}

.status-badge {
  border: 1px solid;
  border-radius: 999px;
  display: inline-flex;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1;
  padding: 0.45rem 0.7rem;
  white-space: nowrap;
}

@media (max-width: 575.98px) {
  .dashboard-actions,
  .dashboard-actions .form-select {
    width: 100%;
  }
}
</style>
