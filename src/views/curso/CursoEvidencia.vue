<template>
  <div class="contenedor_general">
    <BreadcrumVue />

    <!-- Skeleton mientras cargan los datos de la cabecera -->
    <div v-if="pageLoading" class="caja_datos_skeleton">
      <Skeleton type="circle" width="56px" height="56px" class="flex-shrink-0" />
      <div class="caja_datos_skeleton__content">
        <Skeleton type="text" width="30%" />
        <Skeleton type="text" width="55%" />
        <Skeleton type="text" width="80%" />
      </div>
    </div>

    <template v-else>
      <CajaDatosVue v-if="stampStore.currentStamp" :show-progress="true" :progress-value="progressPercent"
        :progress-label="`${progressPercent.toFixed(2)}%`" :show-header-info="isAdmin" :show-progress-text="false"
        :show-modalidad="false" />
      <CajaDatosVue v-else :show-progress="true" :progress-value="0" progress-label="0%" :show-header-info="isAdmin"
        :show-progress-text="false" :show-modalidad="false" />
    </template>

    <br>

    <!-- Skeleton del cuerpo de la tarjeta -->
    <div v-if="pageLoading" class="caja_tarjeta">
      <div class="row g-0">
        <div class="col-12 col-md-5 border-end">
          <div class="p-4 d-flex flex-column gap-3">
            <Skeleton height="28px" width="60%" />
            <Skeleton height="18px" width="40%" />
            <Skeleton type="text" width="80%" />
            <Skeleton type="text" width="70%" />
            <Skeleton height="80px" />
          </div>
        </div>
        <div class="col-12 col-md-7">
          <div class="p-4 d-flex flex-column gap-3">
            <Skeleton height="28px" width="55%" />
            <Skeleton type="text" :count="3" :gap="10" width="90%" />
          </div>
        </div>
      </div>
    </div>

    <div v-else class="caja_tarjeta">
      <div class="row g-0">
        <div class="col-12 col-md-5 border-end">
          <div class="p-4">
            <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
              <h2 class="h4 fw-bold mb-0">Apartado de evidencias</h2>
            </div>

            <div class="mt-5">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <h3 class="h5 fw-bold mb-0">Evidencias</h3>
                <span class="boton_etiqueta"
                  :style="{
                    background: `linear-gradient(135deg, ${currentActivity?.status?.hexadecimal}30, ${currentActivity?.status?.hexadecimal}20)`,
                    borderColor: currentActivity?.status?.hexadecimal
                  }">
                  {{ currentActivity?.status?.name || 'Pendiente' }}
                </span>
              </div>

              <p v-if="stampStore.isExpired" class="mb-2">No se pueden entregar trabajos después de la fecha de entrega.</p>

              <!-- Si ya hay evidencia cargada, mostrar TarjetaArchivo -->
              <div v-if="currentActivity?.file_url" class="mb-4">
                <TarjetaArchivo :titulo="activity?.name || currentActivity.file_name"
                  :nombre-archivo="currentActivity.file_name"
                  :descripcion="`${currentActivity.file_size} ${currentActivity.unit_size}`"
                  :boton="isAdmin ? 'Ver' : (stampStore.isEditable ? 'Volver a enviar' : '')"
                  layout="fila"
                  :mostrar-botones-secundarios="true"
                  :mostrar-borrar="!isAdmin && stampStore.isEditable"
                  :mostrar-vista-previa="!isAdmin"
                  :es-visualizacion="isAdmin"
                  @click="isAdmin ? openPreviewModal() : openUploadModal()"
                  @vista-previa="openPreviewModal()"
                  @borrar="confirmDeleteEvidence" />
              </div>
              <p v-else class="text-muted mb-4">Aún no haz cargado ninguna evidencia</p>

              <!-- Botón para subir evidencia solo si no hay archivo cargado -->
              <button v-if="!currentActivity?.file_url" class="boton boton_primario mb-4" @click="openUploadModal"
                :disabled="loading || !stampStore.isEditable">
                <i class="bi bi-upload"></i>
                Subir evidencia
              </button>

              <div class="mt-2">
                <small class="text-muted d-block">Fecha de último envío</small>
                <span class="fw-bold">{{ currentActivity?.upload_date ? formatDate(currentActivity.upload_date) :
                  'Sin evidencia cargada' }}</span>
              </div>

              <!-- Botones de aprobar/rechazar para validador -->
              <div v-if="isAdmin" class="mt-4">
                <!-- Badge de estatus cuando ya fue evaluada -->
                <div v-if="isAlreadyEvaluated" class="evaluated-status mb-3">
                  <span class="material-icons-outlined evaluated-status__icon">
                    {{ currentActivity?.status?.name === 'Aprobado' ? 'check_circle' : 'cancel' }}
                  </span>
                  <div>
                    <p class="evaluated-status__title">Evidencia ya evaluada</p>
                    <span
                      class="boton_etiqueta"
                      :style="{
                        background: `linear-gradient(135deg, ${currentActivity?.status?.hexadecimal}30, ${currentActivity?.status?.hexadecimal}20)`,
                        borderColor: currentActivity?.status?.hexadecimal
                      }"
                    >
                      {{ currentActivity?.status?.name }}
                    </span>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12 mb-2">
                    <button
                      type="button"
                      class="boton boton_primario w-100"
                      :disabled="!currentActivity?.file_url || isAlreadyEvaluated || loadingAction"
                      @click="handleApproveActivity"
                    >
                      <span class="material-icons-outlined">check_circle</span> Aprobar evidencia
                    </button>
                  </div>
                  <div class="col-12">
                    <button
                      type="button"
                      class="boton boton_secundario w-100"
                      :disabled="isAlreadyEvaluated || loadingAction"
                      @click="commentModal?.showModal()"
                    >
                      <span class="material-icons-outlined">cancel</span> Rechazar evidencia
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-7">
          <div class="p-4">
            <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3 ">
              <h2 class="h4 fw-bold mb-0">Apartado de Revisiones</h2>
            </div>

            <div class="mt-5" v-if="comments.length > 0">
              <div v-for="comment in comments" :key="comment.id" class="mb-4">
                <div class="d-flex align-items-center gap-2 mb-2">
                  <h3 class="h6 fw-bold mb-0">{{ formatDate(comment.created_at) }}</h3>
                </div>
                <div class="mb-2">
                  <div class="fw-bold mb-1">Revisor</div>
                  <p class="mb-0">{{ comment.comment }}</p>
                </div>
                <hr class="my-3">
              </div>
            </div>
            <div v-else class="mt-5">
              <p class="text-muted">No hay comentarios aún</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Subir Evidencia -->
    <Modal ref="uploadModal" modalId="uploadEvidenceModal" title="Subir Evidencia" size="lg"
      :buttons="uploadModalButtons">
      <template #body>
        <label class="form-label" for="inputGroupFile">Sube un archivo adjunto</label>
        <div class="input-group">
          <input ref="fileInput" type="file" class="form-control" :class="{ 'is-invalid': fileError }" id="inputGroupFile" accept="application/pdf" @change="handleFileSelect">
          <label class="input-group-text" for="inputGroupFile" title="Subir archivo">
            <i class="bi bi-cloud-upload"></i>
          </label>
        </div>
        <div v-if="fileError" class="invalid-feedback d-block">{{ fileError }}</div>
        <div v-else-if="selectedFile" class="mt-2">
          <small class="text-muted">Archivo seleccionado: {{ selectedFile.name }}</small>
        </div>
      </template>
    </Modal>

    <!-- Modal Agregar Comentario -->
    <Modal ref="commentModal" modalId="addCommentModal" title="Agregar Comentario" size="lg"
      :buttons="commentModalButtons">
      <template #body>
        <div class="mb-3">
          <label for="commentInput" class="form-label">Comentario</label>
          <textarea class="form-control" id="commentInput" v-model="newComment" rows="4"
            placeholder="Escribe tu comentario..."></textarea>
        </div>
      </template>
    </Modal>

    <!-- Modal Confirmar Eliminar Evidencia -->
    <Modal ref="deleteModal" modalId="deleteEvidenceModal" title="Eliminar Evidencia" size="lg"
      :buttons="deleteModalButtons">
      <template #body>
        <p>¿Estás seguro de que deseas eliminar la evidencia?</p>
        <p class="text-muted">Esta acción no se puede deshacer.</p>
      </template>
    </Modal>

    <!-- Modal Evidencia Completa -->
    <ModalEvidenciaCompleta ref="evidenciaCompletaModal" />

    <!-- Modal Revisión Completa (Revisor) -->
    <ModalRevisionCompleta ref="revisionCompletaModal" />

    <!-- Modal Preview Evidencia -->
    <Modal ref="previewModal" modalId="previewEvidenceModal" title="Vista Previa" size="xl" :buttons="previewModalButtons">
      <template #body>
        <div v-if="isLoadingPdf" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando PDF...</span>
          </div>
        </div>
        <div v-else-if="pdfLoadError" class="text-center py-5">
          <p class="text-danger">Error al cargar el PDF. Intenta de nuevo.</p>
        </div>
        <div v-else-if="previewPdf && pdfBlobUrl" class="text-center">
          <VuePDF :pdf="previewPdf" :page="previewCurrentPage" :scale="1.2" text-layer />
          <div class="d-flex justify-content-center align-items-center gap-3 mt-3">
            <button class="btn btn-outline-secondary btn-sm" @click="previewCurrentPage--" :disabled="previewCurrentPage <= 1">
              <i class="bi bi-chevron-left"></i> Anterior
            </button>
            <span>Página {{ previewCurrentPage }} de {{ previewTotalPages }}</span>
            <button class="btn btn-outline-secondary btn-sm" @click="previewCurrentPage++" :disabled="previewCurrentPage >= previewTotalPages">
              Siguiente <i class="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { addFileToStampActivity, createStampActivityComment, deleteStampActivityFile, getStampActivityComments } from '@/api/stamp'
import { approveStampActivity, rejectStampActivity } from '@/api/validator'
import axios from 'axios'
import BreadcrumVue from '@/components/Breadcrum.vue'
import CajaDatosVue from '@/components/CajaDatos.vue'
import Modal from '@/components/Modal.vue'
import ModalEvidenciaCompleta from '@/components/ModalEvidenciaCompleta.vue'
import ModalRevisionCompleta from '@/components/ModalRevisionCompleta.vue'
import Skeleton from '@/components/Skeleton.vue'
import TarjetaArchivo from '@/components/TarjetaArchivo.vue'
import type { StampActivityComment } from '@/interfaces/Stamp'
import { getActivity } from '@/api/sections'
import { AuthMethod } from '@/enums/AuthMethod'
import { useAuthStore } from '@/stores/auth'
import { useLoadingStore } from '@/stores/loading'
import { useStampStore } from '@/stores/stamp'
import { useBreadcrumbStore } from '@/stores/breadcrumb'
import { VuePDF, usePDF } from '@tato30/vue-pdf'
import '@tato30/vue-pdf/style.css'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const stampStore = useStampStore()
const authStore = useAuthStore()
const loadingStore = useLoadingStore()
const breadcrumbStore = useBreadcrumbStore()

const isProvider = computed(() => authStore.user?.auth_method_id === AuthMethod.PROVEEDOR)
const isAdmin = computed(() => authStore.user?.auth_method_id === AuthMethod.ADMIN)

/** Estatus que indican que la evidencia ya fue evaluada y no se puede re-evaluar */
const EVALUATED_STATUSES = ['Aprobado', 'Rechazado']
const isAlreadyEvaluated = computed(() =>
  EVALUATED_STATUSES.includes(currentActivity.value?.status?.name ?? '')
)

const uploadModal = ref<InstanceType<typeof Modal> | null>(null)
const commentModal = ref<InstanceType<typeof Modal> | null>(null)
const deleteModal = ref<InstanceType<typeof Modal> | null>(null)
const previewModal = ref<InstanceType<typeof Modal> | null>(null)
const evidenciaCompletaModal = ref<InstanceType<typeof ModalEvidenciaCompleta> | null>(null)
const revisionCompletaModal = ref<InstanceType<typeof ModalRevisionCompleta> | null>(null)

const loading = ref(false)
const loadingDelete = ref(false)
const loadingAction = ref(false)
const pageLoading = ref(true)
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const fileError = ref<string | null>(null)
const newComment = ref('')
const comments = ref<StampActivityComment[]>([])

const storageUrl = import.meta.env.VITE_STORAGE_URL || ''

const pdfBlobUrl = ref('')
const isLoadingPdf = ref(false)
const pdfLoadError = ref(false)
const previewCurrentPage = ref(1)
const { pdf: previewPdf, pages: previewPages } = usePDF(pdfBlobUrl)
const previewTotalPages = computed(() => previewPages.value ?? 0)

const currentActivity = computed(() => stampStore.currentActivity)
const stampActivityId = computed(() => Number(route.params.id))
const isFromProtocols = computed(() => route.query.from === 'protocolos')
const progressPercent = computed(() =>
  isFromProtocols.value ? stampStore.percentEvaluations : stampStore.percentModuls
)

const fileUrl = computed(() => {
  if (!currentActivity.value?.file_url) return ''
  const filePath = currentActivity.value.file_url
  // Si el backend ya devuelve una URL absoluta, usarla directamente
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) return filePath
  return storageUrl + filePath
})

const fetchComments = async () => {
  try {
    const response = await getStampActivityComments(stampActivityId.value)
    comments.value = response.data.data
  } catch (error) {
    console.error('Error al obtener comentarios:', error)
  }
}

onMounted(async () => {
  await loadData()
})

onUnmounted(() => {
  if (pdfBlobUrl.value) {
    URL.revokeObjectURL(pdfBlobUrl.value)
  }
})

const activity = ref<any>(null)

// Watch for route changes to reload evidence
watch(() => route.params.id, async () => {
  await loadData()
})

const loadData = async () => {
  const newStampActivityId = Number(route.params.id)
  if (!newStampActivityId) return

  pageLoading.value = true
  loadingStore.setLoading('Cargando evidencia...')
  try {
    // Siempre cargamos la actividad y los comentarios primero
    await Promise.all([
      stampStore.fetchStampActivityById(newStampActivityId),
      fetchComments()
    ])

    if (isAdmin.value) {
      // Para admin: usamos el stamp_id de la actividad para obtener la certificacion y los datos del usuario
      const stampId = stampStore.currentActivity?.stamp_id
      if (stampId) {
        await stampStore.fetchStampByIdAsAdmin(stampId)
      }
    } else {
      // Para usuario: obtenemos la certificacion asociado al usuario autenticado
      if (!stampStore.currentStamp) {
        await stampStore.fetchCurrentStamp()
      }
    }

    // Intentar obtener el nombre de la actividad
    if (stampStore.currentActivity?.activity_id) {
      const activityResponse = await getActivity(stampStore.currentActivity.activity_id)
      activity.value = activityResponse.data.data
      if (activity.value?.name) {
        breadcrumbStore.setCustomLabel(route.params.id as string, activity.value.name)
      }
    }
  } finally {
    loadingStore.clearLoading()
    pageLoading.value = false
  }
}

const openUploadModal = () => {
  selectedFile.value = null
  fileError.value = null
  uploadModal.value?.showModal()
}

const openPreviewModal = async () => {
  const url = fileUrl.value
  if (!url) return

  previewCurrentPage.value = 1
  pdfLoadError.value = false
  isLoadingPdf.value = true
  previewModal.value?.showModal()

  try {
    if (pdfBlobUrl.value) {
      URL.revokeObjectURL(pdfBlobUrl.value)
      pdfBlobUrl.value = ''
    }
    const response = await axios.get(url, { responseType: 'blob' })
    const blob = new Blob([response.data], { type: 'application/pdf' })
    pdfBlobUrl.value = URL.createObjectURL(blob)
  } catch (error) {
    console.error('Error al cargar el PDF:', error)
    pdfLoadError.value = true
  } finally {
    isLoadingPdf.value = false
  }
}

const closePreviewModal = () => {
  previewModal.value?.hideModal()
  if (pdfBlobUrl.value) {
    URL.revokeObjectURL(pdfBlobUrl.value)
    pdfBlobUrl.value = ''
  }
}

const openCommentModal = () => {
  commentModal.value?.showModal()
}

const validateFile = (file: File | null): string | null => {
  if (!file) return 'El archivo es requerido'
  if (file.type !== 'application/pdf') return 'Solo se permiten archivos en formato PDF'
  const maxSizeMb = Number(import.meta.env.VITE_MAX_FILE_SIZE_MB) || 10
  if (file.size > maxSizeMb * 1024 * 1024) return `El archivo no debe superar los ${maxSizeMb} MB`
  return null
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    const error = validateFile(file)
    if (error) {
      fileError.value = error
      target.value = ''
      selectedFile.value = null
    } else {
      fileError.value = null
      selectedFile.value = file
    }
  } else {
    selectedFile.value = null
    fileError.value = null
  }
}

const handleUpload = async () => {
  const error = validateFile(selectedFile.value)
  if (error) {
    fileError.value = error
    return
  }

  if (!isAdmin.value && !stampStore.isEditable) {
    toast.warning('El expediente se encuentra en revisión y no puede ser modificado.')
    return
  }

  loading.value = true
  try {
    const response = await addFileToStampActivity(stampActivityId.value, selectedFile.value!)
    stampStore.currentActivity = response.data.data

    const meta = response.data.meta
    uploadModal.value?.hideModal()

    if (meta?.evidence_complete) {
      evidenciaCompletaModal.value?.showModal()
    } else if (meta?.message) {
      toast.success(meta.message)
    } else {
      toast.success('Evidencia subida correctamente')
    }
    selectedFile.value = null
    fileError.value = null
    if (fileInput.value) fileInput.value.value = ''

    await stampStore.fetchCurrentStamp()
  } catch (error) {
    toast.error('Error al subir la evidencia')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const confirmDeleteEvidence = () => {
  deleteModal.value?.showModal()
}

const handleDeleteEvidence = async () => {
  if (!isAdmin.value && !stampStore.isEditable) {
    toast.warning('El expediente se encuentra en revisión y no puede ser modificado.')
    return
  }

  loadingDelete.value = true
  try {
    await deleteStampActivityFile(stampActivityId.value)
    await stampStore.fetchStampActivityById(stampActivityId.value)
    toast.success('Evidencia eliminada correctamente')
    deleteModal.value?.hideModal()
  } catch (error) {
    toast.error('Error al eliminar la evidencia')
    console.error(error)
  } finally {
    loadingDelete.value = false
  }
}

const handleAddComment = async () => {
  if (!newComment.value.trim()) {
    toast.error('Por favor escribe un comentario')
    return
  }

  loading.value = true
  try {
    const response = await createStampActivityComment(stampActivityId.value, newComment.value)
    comments.value.unshift(response.data.data)
    commentModal.value?.hideModal()
    newComment.value = ''
    await stampStore.fetchStampActivityById(stampActivityId.value)

    const meta = response.data.meta
    if (meta?.evidence_complete) {
      const stampId = route.query.stampId
      const from = route.query.from
      const onComplete = (stampId && (from === 'modulos' || from === 'protocolos'))
        ? () => router.push({ path: from === 'protocolos' ? '/admin/protocolos' : '/admin/modulos', query: { stampId, scrollToBottom: '1' } })
        : () => router.push('/admin')
      revisionCompletaModal.value?.showModal('rechazado', onComplete)
    } else {
      toast.success('Observación guardada correctamente')
      router.back()
    }
  } catch (error) {
    toast.error('Error al guardar la observación')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleApproveActivity = async () => {
  loadingAction.value = true
  try {
    const response = await approveStampActivity(stampActivityId.value)
    await stampStore.fetchStampActivityById(stampActivityId.value)

    const meta = response.data.meta
    if (meta?.evidence_complete) {
      const stampId = route.query.stampId
      const from = route.query.from
      const onComplete = (stampId && (from === 'modulos' || from === 'protocolos'))
        ? () => router.push({ path: from === 'protocolos' ? '/admin/protocolos' : '/admin/modulos', query: { stampId, scrollToBottom: '1' } })
        : () => router.push('/admin')
      revisionCompletaModal.value?.showModal('aprobado', onComplete)
    } else {
      toast.success('Evidencia aprobada correctamente')
    }
  } catch {
    toast.error('Error al aprobar la evidencia')
  } finally {
    loadingAction.value = false
  }
}

const handleRejectActivity = async () => {
  loadingAction.value = true
  try {
    await rejectStampActivity(stampActivityId.value)
    toast.success('Evidencia rechazada correctamente')
    await stampStore.fetchStampActivityById(stampActivityId.value)
    if (!isAdmin.value) {
      router.push({ name: 'usuario-modulos' })
    }
  } catch {
    toast.error('Error al rechazar la evidencia')
  } finally {
    loadingAction.value = false
  }
}

const uploadModalButtons = computed(() => [
  {
    text: 'Cancelar',
    variant: 'secundario' as const,
    dismiss: true,
    action: () => { }
  },
  {
    text: 'Subir',
    variant: 'primario' as const,
    action: handleUpload,
    loading: loading.value,
    disabled: !selectedFile.value || !!fileError.value || loading.value
  }
])

const commentModalButtons = computed(() => [
  {
    text: 'Cancelar',
    variant: 'secundario' as const,
    dismiss: true,
    action: () => { }
  },
  {
    text: 'Agregar',
    variant: 'primario' as const,
    action: handleAddComment,
    loading: loading.value,
    disabled: !newComment.value.trim() || loading.value
  }
])

const deleteModalButtons = computed(() => [
  {
    text: 'Cancelar',
    variant: 'secundario' as const,
    dismiss: true,
    action: () => { }
  },
  {
    text: 'Eliminar',
    variant: 'peligro' as const,
    action: handleDeleteEvidence,
    loading: loadingDelete.value,
    disabled: loadingDelete.value
  }
])

const previewModalButtons = [
  {
    text: 'Cerrar',
    variant: 'secundario' as const,
    action: closePreviewModal
  }
]

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getBadgeTextColor = (hexColor?: string) => {
  if (!hexColor) return '#8e6db1'
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#ffffff'
}
</script>

<style scoped>
.badge_estado {
  border: 1px solid #8e6db1;
  border-radius: 20px;
  padding: 2px 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.evaluated-status {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 10px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
}

.evaluated-status__icon {
  font-size: 28px;
  flex-shrink: 0;
  color: #6c757d;
}

.evaluated-status__title {
  font-size: 0.75rem;
  color: #6c757d;
  margin: 0 0 4px;
  font-weight: 500;
}

.boton:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* caja_datos_skeleton layout (los bloques los renderiza el componente <Skeleton>) */
.caja_datos_skeleton__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
