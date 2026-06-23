<template>
  <div class="contenedor_general">
    <Breadcrum />

    <div v-if="loading" class="estado_pagina">Cargando expediente...</div>
    <div v-else-if="error" class="estado_pagina estado_pagina--error">{{ error }}</div>

    <template v-else-if="stamp">
      <div class="cabecera_detalle">
        <div class="cabecera_info">
          <h4 class="titulo_seccion">Expediente #{{ stamp.id }}</h4>
          <span
            class="badge_estado"
            :style="{
              background: stamp.stamp_status?.color + '33',
              borderColor: stamp.stamp_status?.color,
              color: '#000'
            }"
          >
            {{ stamp.stamp_status?.name }}
          </span>
        </div>
        <div class="cabecera_acciones">
          <button class="btn btn-danger" @click="handleReject" :disabled="loadingAction">
            Rechazar
          </button>
          <button class="btn btn-success" @click="handleApprove" :disabled="loadingAction">
            Aprobar
          </button>
          <button class="btn-regresar" @click="router.back()">
            <span class="material-symbols-outlined">arrow_back</span>
            Regresar
          </button>
        </div>
      </div>

      <div class="grid_detalle">
        <div class="tarjeta_detalle elevacion_5">
          <h6 class="tarjeta_titulo">Usuario</h6>
          <div class="campo">
            <span class="campo_label">Nombre</span>
            <span class="campo_valor">{{ stamp.provider?.name ?? stamp.provider?.username ?? '—' }}</span>
          </div>
          <div class="campo">
            <span class="campo_label">Usuario</span>
            <span class="campo_valor">{{ stamp.provider?.username ?? '—' }}</span>
          </div>
          <div class="campo">
            <span class="campo_label">RFC</span>
            <span class="campo_valor">{{ stamp.provider?.rfc ?? '—' }}</span>
          </div>
          <div class="campo">
            <span class="campo_label">Correo</span>
            <span class="campo_valor">{{ stamp.provider?.email ?? '—' }}</span>
          </div>
        </div>

        <div class="tarjeta_detalle elevacion_5">
          <h6 class="tarjeta_titulo">Certificacion</h6>
          <div class="campo">
            <span class="campo_label">Folio</span>
            <span class="campo_valor">{{ stamp.id }}</span>
          </div>
          <div class="campo">
            <span class="campo_label">Avance</span>
            <span class="campo_valor">{{ stamp.percent }}%</span>
          </div>
          <div class="campo">
            <span class="campo_label">Fecha de creación</span>
            <span class="campo_valor">{{ stamp.created_at ? new Date(stamp.created_at).toLocaleDateString('es-MX') : '—' }}</span>
          </div>
          <div class="campo">
            <span class="campo_label">Vigencia inicio</span>
            <span class="campo_valor">{{ stamp.vigency_start_date ? new Date(stamp.vigency_start_date).toLocaleDateString('es-MX') : '—' }}</span>
          </div>
          <div class="campo">
            <span class="campo_label">Vigencia fin</span>
            <span class="campo_valor">{{ stamp.vigency_end_date ? new Date(stamp.vigency_end_date).toLocaleDateString('es-MX') : '—' }}</span>
          </div>
          <div class="campo">
            <span class="campo_label">Días restantes</span>
            <span class="campo_valor">{{ stamp.remaining_days !== null ? stamp.remaining_days + ' días' : '—' }}</span>
          </div>
        </div>
      </div>

      <div class="seccion_actividades">
        <h5 class="titulo_seccion mt-4">Actividades</h5>
        <div v-if="activitiesLoading" class="estado_pagina">Cargando actividades...</div>
        <div v-else-if="activities.length === 0" class="estado_pagina">Sin actividades.</div>
        <div v-else class="lista_actividades">
          <div v-for="activity in activities" :key="activity.id" class="actividad_item elevacion_5">
            <div class="actividad_header">
              <span class="actividad_nombre">{{ activity.activity_name }}</span>
              <span
                class="actividad_estado"
                :style="{ background: activity.status_hexadecimal + '33', borderColor: activity.status_hexadecimal, color: '#000' }"
              >
                {{ activity.status_name }}
              </span>
            </div>
            <p class="actividad_descripcion">{{ activity.activity_description }}</p>
            <div v-if="activity.file_url" class="actividad_archivo">
              <span class="material-symbols-outlined">attach_file</span>
              <a :href="activity.file_url" target="_blank">{{ activity.file_name }}</a>
            </div>
            <div class="actividad_acciones">
              <button class="btn btn-outline-danger" @click="handleRejectActivity(activity.id)" :disabled="loadingAction">
                Rechazar
              </button>
              <button class="btn btn-outline-success" @click="handleApproveActivity(activity.id)" :disabled="loadingAction">
                Aprobar
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Modal Revisión Completa (Revisor) -->
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
import { takeReviewerStamp, approveStamp, rejectStamp, approveStampActivity, rejectStampActivity, getStampActivities } from '@/api/validator'

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
    // 403: expediente tomado por otro revisor. El interceptor ya avisó; volver al panel.
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
.estado_pagina { padding: 40px; text-align: center; color: #6c757d; }
.estado_pagina--error { color: #e53e3e; }

.cabecera_detalle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.cabecera_info { display: flex; align-items: center; gap: 14px; }
.cabecera_acciones { display: flex; gap: 10px; }
.titulo_seccion { font-size: 20px; font-weight: 700; color: #111827; margin: 0; }

.badge_estado {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  border: 2px solid;
}

.btn-regresar {
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 2px solid orange;
  color: orange;
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: 500;
  cursor: pointer;
}
.btn-regresar .material-symbols-outlined { font-size: 18px; }

.grid_detalle {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.tarjeta_detalle {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
}
.tarjeta_titulo {
  font-size: 14px;
  font-weight: 700;
  color: #f57c00;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f5f5f5;
}

.campo { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f9f9f9; }
.campo:last-child { border-bottom: none; }
.campo_label { font-size: 13px; color: #6c757d; }
.campo_valor { font-size: 13px; color: #111827; font-weight: 500; text-align: right; }

.lista_actividades { display: flex; flex-direction: column; gap: 16px; margin-top: 16px; }
.actividad_item { background: #fff; border-radius: 12px; padding: 20px; }
.actividad_header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.actividad_nombre { font-weight: 600; color: #111827; }
.actividad_estado { padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; border: 2px solid; }
.actividad_descripcion { color: #6c757d; font-size: 14px; margin: 0 0 12px; }
.actividad_archivo { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.actividad_archivo a { color: orange; }
.actividad_acciones { display: flex; gap: 10px; justify-content: flex-end; }
</style>
