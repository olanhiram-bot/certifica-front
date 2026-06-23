<template>
  <div class="contenedor_general">
    <BreadcrumVue />
    <CajaTituloBannerVue :data="cajaData" />
    <div class="d-flex justify-content-end gap-2 mt-3">
      <button class="boton boton_primario" :disabled="!canUpload" @click="handleUploadClick">Subir
        evidencia</button>
    </div>
    <div v-if="isLastPage && !materialMarkedAsViewed" class="mt-2">
      <small class="text-muted">Desliza hasta el final del documento para habilitar</small>
    </div>

    <div class="sin_sombras mt-4">
      <div class="caja_tarjeta">
        <div class="pdf-viewer-container" ref="pdfContainer">
          <VuePDF
            v-if="pdf && pdfBlobUrl && containerWidth > 0"
            :pdf="pdf"
            :page="currentPage"
            :width="containerWidth"
            text-layer
            annotation-layer
          />
          <div v-else-if="pdfLoadError" class="text-center py-5">
            <p class="text-danger">Error al cargar el PDF</p>
          </div>
          <div v-else-if="!pdfBlobUrl && activity?.url_content && !isLoadingPdf" class="text-center py-5">
            <p class="text-muted">No hay material de apoyo disponible</p>
          </div>
          <div v-else class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando PDF...</span>
            </div>
          </div>
        </div>
        <div class="pdf-controls mt-3" v-if="pdf && pdfBlobUrl">
          <button class="boton boton_secundario" @click="prevPage" :disabled="currentPage <= 1">
            <span class="material-symbols-outlined">chevron_left</span> Anterior
          </button>
          <span class="mx-3">Página {{ currentPage }} de {{ totalPages }}</span>
          <button class="boton boton_secundario" @click="nextPage" :disabled="currentPage >= totalPages">
            Siguiente <span class="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-end mt-4" v-if="nextActivity">
      <button class="boton boton_primario" :disabled="!materialMarkedAsViewed" @click="goToNextActivity">
        Ir al siguiente curso
      </button>
    </div>

    <Modal ref="uploadModal" modalId="uploadEvidenceModal" title="Subir Evidencia" size="lg"
      :buttons="uploadModalButtons">
      <template #body>
        <label class="form-label" for="inputGroupFile">Sube un archivo adjunto</label>
        <div class="input-group">
          <input type="file" class="form-control" :class="{ 'is-invalid': fileError }" id="inputGroupFile" accept="application/pdf" @change="handleFileSelect">
          <label class="input-group-text" for="inputGroupFile" title="Subir archivo">
            <span class="material-symbols-outlined">cloud_upload</span>
          </label>
        </div>
        <div v-if="fileError" class="invalid-feedback d-block">{{ fileError }}</div>
        <div v-else-if="selectedFile" class="mt-2">
          <small class="text-muted">Archivo seleccionado: {{ selectedFile.name }}</small>
        </div>
      </template>
    </Modal>

    <!-- Modal Evidencia Completa -->
    <ModalEvidenciaCompleta ref="evidenciaCompletaModal" />
  </div>
</template>

<script setup lang="ts">
import { getActivity } from '@/api/sections'
import { addFileToStampActivity, createStampActivity, markMaterialAsViewed } from '@/api/stamp'
import axios from 'axios'
import BreadcrumVue from '@/components/Breadcrum.vue'
import CajaTituloBannerVue from '@/components/CajaTituloBanner.vue'
import Modal from '@/components/Modal.vue'
import ModalEvidenciaCompleta from '@/components/ModalEvidenciaCompleta.vue'
import type { CajaTituloData } from '@/interfaces/CajaTituloData'
import type { ActivityResource } from '@/interfaces/Section'
import type { StampActivityResource } from '@/interfaces/Stamp'
import { useLoadingStore } from '@/stores/loading'
import { useSectionsStore } from '@/stores/sections'
import { useStampStore } from '@/stores/stamp'
import { useBreadcrumbStore } from '@/stores/breadcrumb'
import { VuePDF, usePDF } from '@tato30/vue-pdf'
import '@tato30/vue-pdf/style.css'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const loadingStore = useLoadingStore()
const stampStore = useStampStore()
const sectionsStore = useSectionsStore()
const breadcrumbStore = useBreadcrumbStore()

const activity = ref<ActivityResource | null>(null)

const uploadModal = ref<InstanceType<typeof Modal> | null>(null)
const evidenciaCompletaModal = ref<InstanceType<typeof ModalEvidenciaCompleta> | null>(null)
const loadingUpload = ref(false)
const selectedFile = ref<File | null>(null)
const fileError = ref<string | null>(null)
const stampActivityId = ref<number | null>(null)
const materialMarkedAsViewed = ref(false)
const currentStampActivity = ref<StampActivityResource | null>(null)

const pdfContainer = ref<HTMLElement | null>(null)
const containerWidth = ref(0)

const updateContainerWidth = () => {
  containerWidth.value = pdfContainer.value?.offsetWidth ?? Math.min(window.innerWidth - 32, 800)
}

const currentPage = ref(1)
const isAtBottom = ref(false)
const lastScrollTime = ref(0)

const pdfBlobUrl = ref('')
const isLoadingPdf = ref(false)
const pdfLoadError = ref(false)

const { pdf, pages } = usePDF(pdfBlobUrl)

const handlePdfLinkClick = (event: Event) => {
  if (!pdfContainer.value) return

  const target = event.target as HTMLElement | null
  const link = target?.closest(
    '.annotationLayer a[href], .annotation-layer a[href], .textLayer a[href], .text-layer a[href]'
  ) as HTMLAnchorElement | null
  if (!link) return

  const href = link.getAttribute('href')?.trim()
  if (!href || href.startsWith('#')) return

  event.preventDefault()
  window.open(href, '_blank', 'noopener,noreferrer')
}

const fetchPdfAsBlob = async (urlContent: string) => {
  if (!urlContent) return

  isLoadingPdf.value = true
  pdfLoadError.value = false

  const fullUrl = urlContent
  console.log('Fetching PDF from:', fullUrl)
  try {
    const response = await axios.get(fullUrl, { responseType: 'blob' })
    console.log('PDF loaded, size:', response.data.size)
    if (pdfBlobUrl.value) {
      URL.revokeObjectURL(pdfBlobUrl.value)
    }
    const blob = new Blob([response.data], { type: 'application/pdf' })
    pdfBlobUrl.value = URL.createObjectURL(blob)
  } catch (error) {
    console.error('Error fetching PDF:', error)
    pdfLoadError.value = true
  } finally {
    isLoadingPdf.value = false
  }
}

watch(() => activity.value?.url_content, (newUrlContent) => {
  console.log('watch url_content:', newUrlContent)
  if (newUrlContent) {
    fetchPdfAsBlob(newUrlContent)
  } else {
    if (pdfBlobUrl.value) {
      URL.revokeObjectURL(pdfBlobUrl.value)
    }
    pdfBlobUrl.value = ''
  }
}, { immediate: true })

watch(pdfLoadError, async (hasError) => {
  if (hasError && stampStore.currentStamp && !materialMarkedAsViewed.value) {
    await markAsViewed()
  }
})

// Re-medir contenedor justo antes de renderizar el PDF
watch(pdfBlobUrl, async (newUrl) => {
  if (newUrl) {
    await nextTick()
    updateContainerWidth()
  }
})

const totalPages = computed(() => pages.value ?? 0)
const isLastPage = computed(() => currentPage.value >= totalPages.value && totalPages.value > 0)

const handleScroll = () => {
  if (!isLastPage.value || materialMarkedAsViewed.value || isAtBottom.value) return

  const currentScrollTime = Date.now()
  if (currentScrollTime - lastScrollTime.value < 300) return

  const scrollTop = window.scrollY
  const scrollHeight = document.documentElement.scrollHeight
  const clientHeight = window.innerHeight
  const isScrolledToBottom = scrollTop + clientHeight >= scrollHeight - 100

  if (isScrolledToBottom) {
    lastScrollTime.value = currentScrollTime
    isAtBottom.value = true
    markAsViewed()
  }
}

const markAsViewed = async () => {
  if (!stampActivityId.value || materialMarkedAsViewed.value) return

  loadingStore.setLoading('Registrando progreso...')
  try {
    await markMaterialAsViewed(stampActivityId.value)
    materialMarkedAsViewed.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (error) {
    console.error('Error marking material as viewed:', error)
  } finally {
    loadingStore.clearLoading()
  }
}

const canUpload = computed(() => materialMarkedAsViewed.value)

const hasEvidence = computed(() => {
  return currentStampActivity.value?.file_url || currentStampActivity.value?.file_path
})

const handleUploadClick = () => {
  if (!canUpload.value) return

  // Si ya tiene evidencia cargada, redirigir a la vista de evidencia
  if (hasEvidence.value && stampActivityId.value) {
    router.push({
      name: 'usuario-curso-evidencia',
      params: { id: stampActivityId.value }
    })
    return
  }

  // Si no tiene evidencia, abrir el modal para subir
  openUploadModal()
}

const cajaData = computed<CajaTituloData>(() => {
  return {
    titulo: activity.value?.name || 'Cargando...',
    descripcion: activity.value?.description || ''
  }
})

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    isAtBottom.value = false
    lastScrollTime.value = Date.now() + 500
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    isAtBottom.value = false
    lastScrollTime.value = Date.now() + 500
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const openUploadModal = () => {
  selectedFile.value = null
  fileError.value = null
  uploadModal.value?.showModal()
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

  if (!stampActivityId.value) {
    toast.error('No tienes una certificacion activa')
    return
  }

  loadingUpload.value = true
  loadingStore.setLoading('Subiendo evidencia...')
  try {
    const response = await addFileToStampActivity(stampActivityId.value, selectedFile.value!)

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

    router.push({ name: 'usuario-curso-evidencia', params: { id: stampActivityId.value } })
  } catch (error) {
    toast.error('Error al subir la evidencia')
    console.error(error)
  } finally {
    loadingUpload.value = false
    loadingStore.clearLoading()
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
    loading: loadingUpload.value,
    disabled: !selectedFile.value || !!fileError.value || loadingUpload.value
  }
])

const goToNextActivity = () => {
  if (nextActivity.value) {
    // Reset PDF viewer state before navigation
    currentPage.value = 1
    isAtBottom.value = false
    lastScrollTime.value = 0
    if (pdfBlobUrl.value) {
      URL.revokeObjectURL(pdfBlobUrl.value)
      pdfBlobUrl.value = ''
    }
    pdfLoadError.value = false
    isLoadingPdf.value = false

    router.push({
      name: 'usuario-modulo-curso',
      params: { id: nextActivity.value.id },
      query: { sectionId: nextActivity.value.sectionId.toString() }
    })
  }
}

const currentActivityId = computed(() => parseInt(route.params.id as string))

const allActivities = computed(() => {
  const all: { id: number; sectionId: number }[] = []
  sectionsStore.sections.forEach(section => {
    section.activities.forEach(act => {
      all.push({ id: act.id, sectionId: section.id })
    })
  })
  return all
})

const nextActivity = computed(() => {
  const activities = allActivities.value
  const currentIndex = activities.findIndex(a => a.id === currentActivityId.value)
  if (currentIndex < 0 || currentIndex >= activities.length - 1) return null
  return activities[currentIndex + 1]
})

const fetchActivity = async () => {
  const activityId = currentActivityId.value
  materialMarkedAsViewed.value = false
  stampActivityId.value = null
  activity.value = null
  currentStampActivity.value = null

  currentPage.value = 1
  isAtBottom.value = false
  lastScrollTime.value = 0
  if (pdfBlobUrl.value) {
    URL.revokeObjectURL(pdfBlobUrl.value)
    pdfBlobUrl.value = ''
  }
  pdfLoadError.value = false
  isLoadingPdf.value = false

  if (!stampStore.currentStamp) return

  try {
    // Single API call: GET /activities/{id} — ActivityController::show
    const response = await getActivity(activityId)
    activity.value = response.data.data
    if (activity.value?.name) {
      breadcrumbStore.setCustomLabel(route.params.id as string, activity.value.name)
    }

    // Get stamp activity from store (populated by addActivityToStamp in ProgramaModulos).
    // Avoids any extra API call in the normal navigation flow.
    let sa = stampStore.stampActivities.find(s => s.activity_id === activityId)
    if (!sa) {
      // Fallback for direct URL access: create/find stamp activity
      const saResponse = await createStampActivity(stampStore.currentStamp.id, activityId)
      sa = saResponse.data.data
    }
    stampActivityId.value = sa.id
    currentStampActivity.value = sa as unknown as StampActivityResource
    materialMarkedAsViewed.value = sa.material_was_view === true
  } catch (error) {
    console.error('Error al cargar la actividad:', error)
  }
}

watch(
  () => route.params.id,
  () => {
    fetchActivity()
  }
)

onMounted(async () => {
  await nextTick()
  updateContainerWidth()

  loadingStore.setLoading('Cargando curso...')
  try {
    if (!stampStore.currentStamp) {
      await stampStore.fetchCurrentStamp()
    }
    await fetchActivity()
  } finally {
    loadingStore.clearLoading()
  }
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', updateContainerWidth)
  pdfContainer.value?.addEventListener('click', handlePdfLinkClick, true)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', updateContainerWidth)
  pdfContainer.value?.removeEventListener('click', handlePdfLinkClick, true)
})
</script>

<style scoped>
.pdf-viewer-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
}

.pdf-viewer-container :deep(.vue-pdf) {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pdf-viewer-container :deep(.vue-pdf > div) {
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pdf-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: transparent;
}

:deep(.text-layer) {
  opacity: 0.4;
}

:deep(.text-layer span) {
  color: transparent;
}

:deep(.text-layer ::selection) {
  background: rgba(141, 13, 253, 0.3);
}
</style>
