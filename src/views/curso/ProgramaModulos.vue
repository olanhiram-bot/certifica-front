<template>
  <div class="container_app user-dashboard modules-page">
    <section class="modules-hero mb-4">
      <div>
        <div class="row align-items-center g-4">
          <div class="col-lg-8">
            <span class="modules-hero__badge">Programa de formación</span>
            <h1 class="h3 mb-2">Módulos de capacitación</h1>
            <p class="mb-0">
              Revisa el material de cada actividad y carga tus evidencias para avanzar en tu expediente.
            </p>
          </div>
          <div class="col-lg-4">
            <div class="modules-hero__panel">
              <div>
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="small">Avance en módulos</span>
                  <strong>{{ stampStore.percentModuls }}%</strong>
                </div>
                <div class="modules-hero__progress" role="progressbar" :aria-valuenow="stampStore.percentModuls" aria-valuemin="0" aria-valuemax="100">
                  <div :style="{ width: `${stampStore.percentModuls}%` }"></div>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-3">
                  <span class="small">Vigencia</span>
                  <span class="fw-semibold">{{ stampStore.vigenciaFin ?? 'Por definir' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="card border-0 shadow-sm mb-4">
      <div class="card-body p-4">
        <div class="d-flex flex-column flex-lg-row justify-content-between gap-3">
          <div>
            <h2 class="h5 mb-1">Catálogo de módulos</h2>
            <p class="text-muted mb-0">Filtra por módulo o busca una actividad específica.</p>
          </div>
          <div class="d-flex flex-column flex-sm-row gap-2 module-toolbar">
            <select v-model="selectedModule" class="form-select" aria-label="Filtrar por módulo">
              <option value="">Todos los módulos</option>
              <option v-for="section in sortedSections" :key="section.id" :value="section.id">
                {{ section.name }}
              </option>
            </select>
            <div class="input-group">
              <input v-model="searchTerm" class="form-control" type="search" placeholder="Buscar actividad" />
              <button class="btn btn-outline-secondary" type="button" @click="clearSearch" aria-label="Limpiar búsqueda">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="stampStore.isExpired" class="alert alert-danger">
      <h2 class="h5 mb-1">Expediente fuera de vigencia</h2>
      <p class="mb-0">Puedes consultar tu avance, pero ya no se aceptan nuevas cargas de evidencia.</p>
    </section>

    <section v-if="loading" class="card border-0 shadow-sm">
      <div class="card-body p-5 text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando módulos...</span>
        </div>
        <p class="text-muted mt-3 mb-0">Cargando módulos...</p>
      </div>
    </section>

    <section v-else-if="filteredSections.length === 0" class="card border-0 shadow-sm">
      <div class="card-body p-5 text-center">
        <i class="bi bi-journal-x fs-1 text-muted"></i>
        <h2 class="h5 mt-3">No se encontraron módulos</h2>
        <p class="text-muted mb-0">Prueba con otro filtro o limpia la búsqueda.</p>
      </div>
    </section>

    <section v-else class="d-grid gap-4">
      <article v-for="section in filteredSections" :key="section.id" class="module-section">
        <div class="d-flex flex-column flex-lg-row justify-content-between gap-2 mb-3">
          <div>
            <h2 class="h4 mb-1">{{ section.name }}</h2>
            <p class="text-muted mb-0">{{ moduleDescription(section) }}</p>
          </div>
          <span class="badge text-bg-light align-self-lg-start">
            {{ section.activities.length }} actividades
          </span>
        </div>

        <div class="row g-3">
          <div v-for="activity in section.activities" :key="activity.id" class="col-md-6 col-xl-4">
            <div class="card h-100 border-0 shadow-sm activity-card">
              <div class="activity-media">
                <img :src="activityImage(activity)" :alt="activity.name" loading="lazy" @error="handleImageError" />
              </div>
              <div class="card-body d-flex flex-column p-4">
                <div class="d-flex justify-content-between gap-2 mb-3">
                  <span class="status-badge" :style="statusStyle(activity)">
                    {{ activityStatus(activity).name }}
                  </span>
                  <span v-if="hasEvidence(activity)" class="badge text-bg-success">Evidencia cargada</span>
                </div>

                <h3 class="h5 mb-2">{{ activity.name }}</h3>
                <p class="text-muted small flex-grow-1">
                  {{ activity.description || 'Revisa el material de apoyo y carga la evidencia correspondiente.' }}
                </p>

                <div v-if="selectedActivityId === activity.id" class="upload-box mb-3">
                  <label class="form-label small fw-semibold" :for="`file-${activity.id}`">Archivo PDF</label>
                  <input
                    :id="`file-${activity.id}`"
                    class="form-control form-control-sm"
                    type="file"
                    accept="application/pdf"
                    @change="handleFileSelect"
                  />
                  <div v-if="fileError" class="text-danger small mt-2">{{ fileError }}</div>
                  <div v-else-if="selectedFile" class="text-muted small mt-2">{{ selectedFile.name }}</div>
                </div>

                <div class="d-grid gap-2">
                  <button
                    class="btn btn-outline-primary"
                    type="button"
                    :disabled="!activity.url_content && !activity.file_url_content"
                    @click="goToMaterial(activity, section.id)"
                  >
                    <i class="bi bi-book me-2"></i>
                    Ver material
                  </button>

                  <button
                    v-if="hasEvidence(activity)"
                    class="btn btn-primary"
                    type="button"
                    @click="openEvidence(activity)"
                  >
                    <i class="bi bi-eye me-2"></i>
                    Ver evidencia
                  </button>

                  <button
                    v-else-if="selectedActivityId !== activity.id"
                    class="btn btn-primary"
                    type="button"
                    :disabled="!canUpload(activity)"
                    @click="startUpload(activity)"
                  >
                    <i class="bi bi-cloud-upload me-2"></i>
                    Subir evidencia
                  </button>

                  <div v-else class="d-grid gap-2">
                    <button class="btn btn-primary" type="button" :disabled="uploading" @click="submitEvidence(activity)">
                      {{ uploading ? 'Subiendo...' : 'Confirmar carga' }}
                    </button>
                    <button class="btn btn-outline-secondary" type="button" :disabled="uploading" @click="cancelUpload">
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>

    <section v-if="stampStore.percentModuls >= 100" class="card border-0 shadow-sm mt-4">
      <div class="card-body p-4 d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
        <div>
          <h2 class="h5 mb-1">Módulos completados</h2>
          <p class="text-muted mb-0">Continúa con la evaluación documental para completar tu expediente.</p>
        </div>
        <button class="btn btn-primary" type="button" @click="router.push({ name: 'usuario-protocolos' })">
          Continuar a documentos
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import { addFileToStampActivity } from '@/api/stamp'
import { getSections } from '@/api/sections'
import type { ActivityResource, SectionResource } from '@/interfaces/Section'
import { useLoadingStore } from '@/stores/loading'
import { useStampStore } from '@/stores/stamp'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const loadingStore = useLoadingStore()
const stampStore = useStampStore()

const sections = ref<SectionResource[]>([])
const loading = ref(false)
const searchTerm = ref('')
const selectedModule = ref<number | string>('')
const selectedActivityId = ref<number | null>(null)
const selectedFile = ref<File | null>(null)
const fileError = ref('')
const uploading = ref(false)

const sortedSections = computed(() => {
  return [...sections.value].sort((a, b) => sectionNumber(a.name) - sectionNumber(b.name))
})

const filteredSections = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()

  return sortedSections.value
    .filter((section) => !selectedModule.value || section.id === Number(selectedModule.value))
    .map((section) => ({
      ...section,
      activities: section.activities.filter((activity) => {
        if (!term) return true
        return `${activity.name} ${activity.description ?? ''}`.toLowerCase().includes(term)
      }),
    }))
    .filter((section) => section.activities.length > 0)
})

const sectionNumber = (name: string) => {
  return Number(name.match(/\d+/)?.[0] ?? 0)
}

const moduleDescription = (section: SectionResource) => {
  const descriptions: Record<number, string> = {
    1: 'Material introductorio para conocer los criterios de la certificación y preparar las primeras evidencias.',
    2: 'Actividades enfocadas en diagnóstico, prevención y atención dentro del entorno laboral.',
    3: 'Herramientas para documentar prácticas internas y fortalecer procesos de atención.',
    4: 'Cierre del programa de formación y preparación para la evaluación documental.',
  }

  return descriptions[section.id] ?? 'Revisa las actividades y carga la evidencia solicitada para este módulo.'
}

const activityStatus = (activity: ActivityResource) => {
  const status = activity.stamp_activity?.status
  return {
    name: status?.name ?? 'Sin iniciar',
    color: status?.hexadecimal ?? '#6c757d',
  }
}

const statusStyle = (activity: ActivityResource) => {
  const status = activityStatus(activity)
  return {
    backgroundColor: `${status.color}22`,
    borderColor: status.color,
    color: '#1f2937',
  }
}

const hasEvidence = (activity: ActivityResource) => {
  return Boolean(activity.stamp_activity?.file_url)
}

const isActivityApproved = (activity: ActivityResource) => {
  const statusName = activity.stamp_activity?.status?.name?.trim().toLowerCase()
  return activity.stamp_activity?.stamp_activity_status_id === 6 || statusName === 'aprobado'
}

const canUpload = (activity: ActivityResource) => {
  if (!stampStore.currentStamp) return false
  if (!stampStore.isEditable || stampStore.isExpired) return false
  if (stampStore.isRechazado && isActivityApproved(activity)) return false
  return true
}

const activityImage = (activity: ActivityResource) => {
  const image = activity.image_url || activity.file_url
  if (!image) return '/src/assets/images/standard/card.jpg'
  if (/^https?:\/\//.test(image)) return image
  if (image.startsWith('/storage/')) return `${import.meta.env.VITE_STORAGE_URL}${image}`
  if (image.startsWith('/')) return image
  return `${import.meta.env.VITE_STORAGE_URL}/storage/${image}`
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.classList.add('error')
  img.src = '/src/assets/images/standard/card.jpg'
}

const loadSections = async () => {
  loading.value = true
  try {
    if (!stampStore.currentStamp) {
      await stampStore.fetchCurrentStamp()
    }

    if (!stampStore.currentStamp?.id) {
      toast.warning('Primero crea tu expediente para consultar los módulos.')
      router.push({ name: 'usuario-instrucciones' })
      return
    }

    const response = await getSections(1, stampStore.currentStamp.id)
    sections.value = response.data.data ?? []
  } catch {
    sections.value = []
    toast.error('No fue posible cargar los módulos.')
  } finally {
    loading.value = false
  }
}

const goToMaterial = async (activity: ActivityResource, sectionId: number) => {
  if (!activity.url_content && !activity.file_url_content) return

  loadingStore.setLoading('Abriendo material...')
  try {
    if (!activity.stamp_activity && stampStore.currentStamp?.id) {
      await stampStore.addActivityToStamp(activity.id)
    }

    router.push({
      name: 'usuario-modulo-curso',
      params: { id: activity.id },
      query: { sectionId: String(sectionId) },
    })
  } catch {
    toast.error('No fue posible abrir el material.')
  } finally {
    loadingStore.clearLoading()
  }
}

const openEvidence = (activity: ActivityResource) => {
  const stampActivityId = activity.stamp_activity?.id
  if (!stampActivityId) return
  router.push({ name: 'usuario-curso-evidencia', params: { id: stampActivityId } })
}

const startUpload = (activity: ActivityResource) => {
  selectedActivityId.value = activity.id
  selectedFile.value = null
  fileError.value = ''
}

const cancelUpload = () => {
  selectedActivityId.value = null
  selectedFile.value = null
  fileError.value = ''
}

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0] ?? null
  selectedFile.value = null
  fileError.value = ''

  if (!file) return

  if (file.type !== 'application/pdf') {
    fileError.value = 'Solo se aceptan archivos PDF.'
    input.value = ''
    return
  }

  if (file.size > 10 * 1024 * 1024) {
    fileError.value = 'El archivo no debe superar 10 MB.'
    input.value = ''
    return
  }

  selectedFile.value = file
}

const submitEvidence = async (activity: ActivityResource) => {
  if (!selectedFile.value) {
    fileError.value = 'Selecciona un archivo PDF.'
    return
  }

  if (!canUpload(activity)) {
    toast.warning('Esta actividad no permite nuevas cargas.')
    return
  }

  uploading.value = true
  try {
    const stampActivity = activity.stamp_activity ?? await stampStore.addActivityToStamp(activity.id)
    if (!stampActivity?.id) throw new Error('No stamp activity')

    const response = await addFileToStampActivity(stampActivity.id, selectedFile.value)
    const message = response.data.meta?.message ?? 'Evidencia cargada correctamente.'
    toast.success(message)

    cancelUpload()
    await stampStore.fetchCurrentStamp()
    await loadSections()
    router.push({ name: 'usuario-curso-evidencia', params: { id: stampActivity.id } })
  } catch {
    toast.error('No fue posible subir la evidencia.')
  } finally {
    uploading.value = false
  }
}

const clearSearch = () => {
  searchTerm.value = ''
}

watch(() => route.query.moduleId, (moduleId) => {
  selectedModule.value = moduleId ? Number(moduleId) : ''
}, { immediate: true })

onMounted(loadSections)
</script>

<style scoped>
.modules-page {
  padding-bottom: 2rem;
}

.modules-hero {
  background: linear-gradient(110deg, #234b78 0%, #1f5fc8 70%, #2f66de 100%);
  border-radius: 10px;
  color: #fff;
  padding: 1.5rem 1.75rem;
}

.modules-hero p {
  color: rgb(255 255 255 / 78%);
}

.modules-hero__badge {
  background: rgb(255 255 255 / 14%);
  border: 1px solid rgb(255 255 255 / 28%);
  border-radius: 999px;
  display: inline-flex;
  font-size: 0.72rem;
  font-weight: 800;
  margin-bottom: 1rem;
  padding: 0.35rem 0.7rem;
}

.modules-hero__panel {
  background: rgb(255 255 255 / 12%);
  border: 1px solid rgb(255 255 255 / 28%);
  border-radius: 8px;
  padding: 1.25rem;
}

.modules-hero__progress {
  background: rgb(255 255 255 / 22%);
  border-radius: 999px;
  height: 8px;
  overflow: hidden;
}

.modules-hero__progress > div {
  background: #fff;
  border-radius: inherit;
  height: 100%;
}

.module-toolbar {
  width: min(100%, 560px);
}

.module-toolbar .form-select {
  min-width: 220px;
}

.module-section {
  background: transparent;
}

.activity-card {
  overflow: hidden;
}

.activity-media {
  aspect-ratio: 16 / 9;
  background: #eef2f7;
  overflow: hidden;
}

.activity-media img {
  display: block;
  height: 100%;
  object-fit: cover;
  object-position: center;
  width: 100%;
  transition: transform 0.3s ease;
}

.activity-card:hover .activity-media img {
  transform: scale(1.05);
}

.activity-media img.error {
  object-fit: contain;
  padding: 1rem;
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

.upload-box {
  background: #f8fafc;
  border: 1px solid #d9dee8;
  border-radius: 8px;
  padding: 0.85rem;
}

@media (max-width: 575.98px) {
  .module-toolbar,
  .module-toolbar .form-select {
    width: 100%;
  }
}
</style>
