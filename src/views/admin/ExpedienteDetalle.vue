<template>
  <div class="container_app">
    <Breadcrum />

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando expediente...</span>
      </div>
    </div>
    <div v-else-if="error" class="alert alert-danger shadow-sm" role="alert">
      {{ error }}
    </div>

    <template v-else-if="stamp">
      <!-- Cabecera -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div class="d-flex align-items-center gap-3">
          <h2 class="h4 mb-0 fw-bold text-dark">Expediente #{{ stamp.id }}</h2>
          <span
            class="badge px-3 py-2"
            :style="{
              backgroundColor: stamp.stamp_status?.color + '22',
              borderColor: stamp.stamp_status?.color,
              color: '#1f2937',
              border: '1px solid'
            }"
          >
            {{ stamp.stamp_status?.name }}
          </span>
        </div>
        <div class="d-flex flex-wrap gap-2">
          <button class="btn btn-danger px-4" @click="handleReject" :disabled="loadingAction">
            Rechazar
          </button>
          <button class="btn btn-success px-4 text-white" @click="handleApprove" :disabled="loadingAction">
            Aprobar
          </button>
          <button class="btn btn-outline-secondary d-inline-flex align-items-center gap-2 px-3" @click="router.back()">
            <i class="bi bi-arrow-left"></i>
            Regresar
          </button>
        </div>
      </div>

      <!-- Grid Detalle -->
      <div class="row g-4 mb-4">
        <!-- Usuario Card -->
        <div class="col-md-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body p-4">
              <h5 class="card-title text-primary fw-bold text-uppercase fs-6 mb-3 pb-2 border-bottom">Usuario</h5>
              <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
                  <span class="text-muted small">Nombre</span>
                  <span class="fw-semibold text-dark">{{ stamp.provider?.name ?? stamp.provider?.username ?? '—' }}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
                  <span class="text-muted small">Usuario</span>
                  <span class="fw-semibold text-dark">{{ stamp.provider?.username ?? '—' }}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
                  <span class="text-muted small">RFC</span>
                  <span class="fw-semibold text-dark">{{ stamp.provider?.rfc ?? '—' }}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent border-0">
                  <span class="text-muted small">Correo</span>
                  <span class="fw-semibold text-dark">{{ stamp.provider?.email ?? '—' }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Certificación Card -->
        <div class="col-md-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body p-4">
              <h5 class="card-title text-primary fw-bold text-uppercase fs-6 mb-3 pb-2 border-bottom">Certificación</h5>
              <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
                  <span class="text-muted small">Folio</span>
                  <span class="fw-semibold text-dark">{{ stamp.id }}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
                  <span class="text-muted small">Avance</span>
                  <span class="fw-semibold text-primary fw-bold">{{ stamp.percent }}%</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
                  <span class="text-muted small">Fecha de creación</span>
                  <span class="fw-semibold text-dark">{{ stamp.created_at ? new Date(stamp.created_at).toLocaleDateString('es-MX') : '—' }}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
                  <span class="text-muted small">Vigencia inicio</span>
                  <span class="fw-semibold text-dark">{{ stamp.vigency_start_date ? new Date(stamp.vigency_start_date).toLocaleDateString('es-MX') : '—' }}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
                  <span class="text-muted small">Vigencia fin</span>
                  <span class="fw-semibold text-dark">{{ stamp.vigency_end_date ? new Date(stamp.vigency_end_date).toLocaleDateString('es-MX') : '—' }}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent border-0">
                  <span class="text-muted small">Días restantes</span>
                  <span class="fw-semibold text-dark">{{ stamp.remaining_days !== null ? stamp.remaining_days + ' días' : '—' }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Actividades -->
      <section class="mt-4">
        <h3 class="h4 mb-3 fw-bold text-dark">Actividades</h3>
        <div v-if="activitiesLoading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando actividades...</span>
          </div>
        </div>
        <div v-else-if="activities.length === 0" class="alert alert-light border shadow-sm text-center py-4" role="alert">
          Sin actividades registradas.
        </div>
        <div v-else class="d-flex flex-column gap-3">
          <div v-for="activity in activities" :key="activity.id" class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
                <h4 class="h5 mb-0 fw-bold text-dark">{{ activity.activity_name }}</h4>
                <span
                  class="badge px-3 py-2"
                  :style="{
                    backgroundColor: activity.status_hexadecimal + '22',
                    borderColor: activity.status_hexadecimal,
                    color: '#1f2937',
                    border: '1px solid'
                  }"
                >
                  {{ activity.status_name }}
                </span>
              </div>
              <p class="text-muted mb-3">{{ activity.activity_description }}</p>
              
              <div v-if="activity.file_url" class="mb-3">
                <a :href="activity.file_url" target="_blank" class="btn btn-sm btn-light border d-inline-flex align-items-center gap-2 text-decoration-none">
                  <i class="bi bi-paperclip"></i>
                  {{ activity.file_name || 'Ver archivo adjunto' }}
                </a>
              </div>

              <div class="d-flex gap-2 justify-content-end border-top pt-3">
                <button class="btn btn-sm btn-outline-danger px-3" @click="handleRejectActivity(activity.id)" :disabled="loadingAction">
                  Rechazar
                </button>
                <button class="btn btn-sm btn-outline-success px-3" @click="handleApproveActivity(activity.id)" :disabled="loadingAction">
                  Aprobar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- Modal Revisión Completa -->
    <ModalRevisionCompleta ref="revisionCompletaModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import axios from 'axios'
import Breadcrum from '@/components/Breadcrum.vue'
import ModalRevisionCompleta from '@/components/ModalRevisionCompleta.vue'
import { getStamp, type StampDetalle } from '@/api/stamps'
import { useBreadcrumbStore } from '@/stores/breadcrumb'
import { approveStamp, rejectStamp, approveStampActivity, rejectStampActivity, getStampActivities } from '@/api/validator'

const route = useRoute()
const router = useRouter()
const $toast = useToast()
const breadcrumbStore = useBreadcrumbStore()

const stamp = ref<StampDetalle | null>(null)
const activities = ref<any[]>([])
const loading = ref(true)
const activitiesLoading = ref(true)
const loadingAction = ref(false)
const error = ref<string | null>(null)
const revisionCompletaModal = ref<InstanceType<typeof ModalRevisionCompleta> | null>(null)

onMounted(async () => {
  try {
    const id = Number(route.params.id)

    const [stampRes] = await Promise.all([
      getStamp(id),
      getStampActivities(id).then(res => {
        activities.value = res.data.data
      }).finally(() => {
        activitiesLoading.value = false
      })
    ])

    stamp.value = stampRes.data.data
    if (stamp.value?.provider?.name || stamp.value?.provider?.username) {
      breadcrumbStore.setCustomLabel(route.params.id as string, stamp.value.provider.name ?? stamp.value.provider.username)
    }
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.status === 403) {
      router.replace({ name: 'admin-dashboard' })
      return
    }
    error.value = 'No se pudo cargar el expediente.'
  } finally {
    loading.value = false
  }
})

const handleApprove = async () => {
  if (!stamp.value) return
  loadingAction.value = true
  try {
    await approveStamp(stamp.value.id)
    $toast.success('Certificacion aprobada correctamente')
    router.back()
  } catch {
    $toast.error('Error al aprobar la certificacion')
  } finally {
    loadingAction.value = false
  }
}

const handleReject = async () => {
  if (!stamp.value) return
  const reason = prompt('Motivo del rechazo:')
  if (!reason) return
  loadingAction.value = true
  try {
    await rejectStamp(stamp.value.id, reason)
    $toast.success('Certificacion rechazada correctamente')
    router.back()
  } catch {
    $toast.error('Error al rechazar la certificacion')
  } finally {
    loadingAction.value = false
  }
}

const handleApproveActivity = async (activityId: number) => {
  loadingAction.value = true
  try {
    const response = await approveStampActivity(activityId)
    const res = await getStampActivities(stamp.value!.id)
    activities.value = res.data.data

    const meta = response.data.meta
    if (meta?.evidence_complete) {
      revisionCompletaModal.value?.showModal('aprobado', () => router.push('/admin'))
    } else {
      $toast.success('Evidencia aprobada')
    }
  } catch {
    $toast.error('Error al aprobar evidencia')
  } finally {
    loadingAction.value = false
  }
}

const handleRejectActivity = async (activityId: number) => {
  loadingAction.value = true
  try {
    await rejectStampActivity(activityId)
    $toast.success('Evidencia rechazada')
    const res = await getStampActivities(stamp.value!.id)
    activities.value = res.data.data
  } catch {
    $toast.error('Error al rechazar evidencia')
  } finally {
    loadingAction.value = false
  }
}
</script>

<style scoped>
/* No overrides needed since we're using standard Bootstrap classes */
</style>
