<template>
  <div class="contenedor_general">
    <BreadcrumVue />
    <CajaTituloBannerVue :data="isAdmin ? cajaRevisionExpedienteData : cajaModulosData" />
    <CajaDatosVue :show-header-info="isAdmin" :show-progress="true" :show-progress-text="false"
      :progress-value="stampStore.percentModuls" :progress-label="`${stampStore.percentModuls}%`"
      :vigencia-fin="stampStore.vigenciaFin" :modality-name="stampStore.modalityName" />

    <template v-if="!isAdmin || activeTab === 'programa'">
      <br>
      <div class="d-flex justify-content-end gap-3">
        <FilterDropdownVue selectId="selector" :options="moduleOptions" v-model="selectedModule"
          @on-change="handleFilter" />
        <SearchVue size="sm" placeholder="¿Qué estas buscando?" @on-search="handleSearch" />
      </div>
      <PestanasSimplesVue v-if="isAdmin" :tabs="[
        { id: 'programa', label: 'Programa de formación' },
        { id: 'evaluacion', label: 'Evaluación documental' }
      ]" v-model="activeTab" @on-change="handleTabChange" />
      <br>
      <div class="modulos-list">
        <div v-if="loadingSections" class="modulos-loading">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando módulos...</span>
          </div>
          <p class="modulos-loading-text">Cargando módulos...</p>
        </div>
        <div v-else-if="filteredSections.length === 0 && !loadingSections" class="text-muted">
          No se encontraron módulos.
        </div>
        <template v-else>
        <div v-for="section in filteredSections" :key="section.id" class="mb-4">
          <h2>{{ section.name }}</h2>
          <p v-if="getModuleDescription(section.id)" class="modulo_descripcion">
            {{ getModuleDescription(section.id) }}
          </p>
          <AlertaVue v-if="!isAdmin && stampStore.modalityTypeId === 2" tipo="warning" :mostrar-cerrar="false" :data="{
            titulo: 'Subir evidencias',
            descripcion: 'Para acreditar satisfactoriamente la capacitación, deberán cargarse las evidencias correspondientes a cada módulo. Aunque solo se solicita un archivo por cada uno, este mismo deberá adjuntarse en todas las lecciones que lo integran.'
          }" />
          <div class="seccion_tarjetas_responsive">
            <div v-for="activity in section.activities" :key="activity.id" class="tarjeta_item"
              v-tooltip:top="!isAdmin && stampStore.isExpired ? 'La vigencia del expediente ha vencido (0 días restantes). No es posible subir evidencias ni visualizar el material de apoyo.' : ''">
              <!-- Revisor: muestra botón "Revisar evidencia" solo si hay archivo subido -->
              <ActivityVue v-if="isAdmin"
                :title="activity.name"
                :image="activity.image_url"
                :status="getActivityStatusObj(activity)"
                :is-validate="hasEvidence(activity)"
                @click-validate="openUploadModal(activity)"
              />
              <!-- Usuario: muestra botones de subir evidencia y ver material -->
              <ActivityVue v-else
                :title="activity.name"
                :image="activity.image_url"
                :status="getActivityStatusObj(activity)"
                :is-evidence="stampStore.modalityTypeId === 2 || hasViewedMaterial(activity)"
                :disabled-evidence="isUploadDisabled(activity)"
                :evidence-label="'Subir evidencia'"
                :evidence-icon="'upload'"
                :is-support-material="!!activity.url_content && stampStore.modalityTypeId !== 2"
                :disabled-support-material="!canViewMaterial(activity)"
                @click-evidence="openUploadModal(activity)"
                @click-support-material="goToActivity(activity, section.id)"
              />
            </div>
          </div>
        </div>
        </template>
      </div>
    </template>

    <template v-else-if="activeTab === 'evaluacion'">
      <div class="mt-4">
        <p class="text-muted">Vista de Evaluación documental</p>
      </div>
    </template>

    <!-- Modal Subir Evidencia -->
    <Modal ref="uploadModal" modalId="uploadEvidenceModal" title="Subir Evidencia" size="lg"
      :buttons="uploadModalButtons">
      <template #body>
        <label class="form-label" for="inputGroupFile">Sube un archivo adjunto</label>
        <div class="input-group">
          <input ref="fileInput" type="file" class="form-control" :class="{ 'is-invalid': fileError }"
            id="inputGroupFile" accept="application/pdf" @change="handleFileSelect">
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

    <!-- Modal Evidencia Completa -->
    <ModalEvidenciaCompleta ref="evidenciaCompletaModal" />

    <TarjetaHorizontal2Vue v-if="stampStore.percentModuls >= 100 && !isAdmin" :data="{
      titulo: 'Has finalizado la carga de evidencias del Contenido del programa de formación',
      descripcion: 'Tus evidencias han sido registradas correctamente. Ahora puedes continuar con la siguiente Etapa 4: Evaluación documental.',
      boton: 'Continuar con Evaluación documental',
      imagen: '/src/assets/tarjeta2.png'
    }" @click="router.push({ name: 'usuario-protocolos' })" />
  </div>
</template>

<script setup lang="ts">
import { addFileToStampActivity } from '@/api/stamp'
import BreadcrumVue from '@/components/Breadcrum.vue'
import CajaDatosVue from '@/components/CajaDatos.vue'
import CajaTituloBannerVue from '@/components/CajaTituloBanner.vue'
import FilterDropdownVue from '@/components/FilterDropdown.vue'
import Modal from '@/components/Modal.vue'
import ModalEvidenciaCompleta from '@/components/ModalEvidenciaCompleta.vue'
import PestanasSimplesVue from '@/components/PestanasSimples.vue'
import SearchVue from '@/components/Search.vue'
import ActivityVue from '@/components/Activity.vue'
import AlertaVue from '@/components/Alerta.vue'
import TarjetaHorizontal2Vue from '@/components/TarjetaHorizontal2.vue'
import { cajaModulosData, cajaRevisionExpedienteData } from '@/data/cajaLineamientosData'
import type { ActivityResource, SectionResource } from '@/interfaces/Section'
import { AuthMethod } from '@/enums/AuthMethod'
import { useAuthStore } from '@/stores/auth'
import { useBreadcrumbStore } from '@/stores/breadcrumb'
import { useLoadingStore } from '@/stores/loading'
import { useSectionsStore } from '@/stores/sections'
import { useStampStore } from '@/stores/stamp'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const stampStore = useStampStore()
const loadingStore = useLoadingStore()
const authStore = useAuthStore()
const breadcrumbStore = useBreadcrumbStore()
const sectionsStore = useSectionsStore()
const $toast = useToast()

const isAdmin = computed(() => authStore.user?.auth_method_id === AuthMethod.ADMIN)
const activeTab = computed(() => route.name === 'admin-modulos' ? 'programa' : 'evaluacion')

const handleTabChange = (tabId: string) => {
  if (tabId === 'evaluacion') {
    router.push({ name: 'admin-protocolos', query: route.query })
  }
}

const sections = computed(() => sectionsStore.sections)
const loadingSections = computed(() => sectionsStore.loading)
const searchTerm = ref('')
const selectedModule = ref<number | string>('')

const uploadModal = ref<InstanceType<typeof Modal> | null>(null)
const evidenciaCompletaModal = ref<InstanceType<typeof ModalEvidenciaCompleta> | null>(null)
const selectedActivityId = ref<number | null>(null)
const selectedFile = ref<File | null>(null)
const fileError = ref<string | null>(null)
const loadingUpload = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

// Obtiene el stamp_activity correspondiente al certificacion actual para una actividad
const currentStampActivity = (activity: ActivityResource) => {
  return activity.stamp_activity ?? null
}

// Estado de la actividad para mostrar en badge
const getActivityStatusObj = (activity: ActivityResource) => {
  const sa = currentStampActivity(activity)
  if (!sa?.status?.name) return { name: 'Sin iniciar', color: '#bdbdbd' }
  return { name: sa.status.name, color: sa.status.hexadecimal ?? '' }
}

// El revisor siempre ve el botón "Revisar evidencia"
const hasEvidence = (_activity: ActivityResource): boolean => {
  return true
}

// ¿El usuario ya vio el material de apoyo?
const hasViewedMaterial = (activity: ActivityResource): boolean => {
  return currentStampActivity(activity)?.material_was_view === true
}

// ¿Se puede ver el material de apoyo? Siempre habilitado cuando existe contenido
const canViewMaterial = (activity: ActivityResource): boolean => {
  if (stampStore.isRechazado && isActivityApproved(activity)) return false
  return !!activity.url_content
}

// ¿La actividad ya fue aprobada?
const isActivityApproved = (activity: ActivityResource): boolean => {
  const sa = currentStampActivity(activity)
  if (!sa) return false
  return sa.stamp_activity_status_id === 6 || sa.status?.name?.trim().toLowerCase() === 'aprobado'
}

// ¿Está deshabilitado el botón "Subir evidencia"?
// - Modalidad 2: siempre habilitado (modality_type_id siempre está en el store)
// - Modalidad 1: el botón sólo se muestra cuando material_was_view = true (ver :is-evidence)
// - Cuando la certificacion está "Rechazado", las actividades aprobadas quedan bloqueadas
const isUploadDisabled = (activity: ActivityResource): boolean => {
  if (stampStore.isRechazado && isActivityApproved(activity)) return true
  if (stampStore.modalityTypeId === 2) return false
  if (!stampStore.isEditable) return true
  if (stampStore.isExpired) return true
  return false
}

const moduleOptions = computed(() => {
  return sortedSections.value.map(section => ({
    label: section.name,
    value: section.id
  }))
})

const sortedSections = computed(() => {
  return [...sections.value].sort((a, b) => {
    const numA = parseInt(a.name.replace(/\D/g, '')) || 0
    const numB = parseInt(b.name.replace(/\D/g, '')) || 0
    return numA - numB
  })
})

const filteredSections = computed(() => {
  let result = sortedSections.value

  if (selectedModule.value) {
    result = result.filter(section => section.id === selectedModule.value)
  }

  if (searchTerm.value.trim()) {
    const term = searchTerm.value.toLowerCase()
    result = result
      .map(section => ({
        ...section,
        activities: section.activities.filter(activity =>
          activity.name.toLowerCase().includes(term)
        )
      }))
      .filter(section => section.activities.length > 0)
  }

  return result
})

const getModuleDescription = (sectionId: number): string => {
  if (sectionId === 1) {
    return 'En este módulo contarás con material de consulta adicional a tu disposición. Una vez que hayas revisado las guías, podrás cargar tus evidencias de aprendizaje.'
  }

  if (sectionId === 2) {
    return 'Comprende la violencia de género desde sus raices hasta sus manifestaciones. En este módulo contarás con material de consulta adicional a tu disposición. Al finalizar, podrás cargar tus evidencias de aprendizaje.'
  }

  if (sectionId === 3) {
    return 'Desarrolla las habilidades necesarias para atender casos de acoso y hostigamiento de forma efectiva y sin victimizar. En este módulo contarás con material de consulta.'
  }

  if (sectionId === 4) {
    return 'Explora el papel de las masculinidades en la construcción de entornos más igualitarios. En este módulo contarás con material de consulta adicional a tu disposición. Al finalizar, podrás cargar tus evidencias de aprendizaje'
  }
  return ''
}

const openUploadModal = (activity: ActivityResource) => {
  if (!stampStore.currentStamp?.id) return

  if (isAdmin.value) {
    const sa = currentStampActivity(activity)
    if (sa) {
      router.push({ name: 'admin-curso-evidencia', params: { id: sa.id }, query: { ...route.query, from: 'modulos' } })
    }
    return
  }

  const existingStampActivity = currentStampActivity(activity)

  if (!isAdmin.value && stampStore.isRechazado && isActivityApproved(activity)) {
    $toast.warning('Esta actividad ya fue aprobada y no puede ser modificada.')
    return
  }

  if (existingStampActivity?.file_url) {
    router.push({
      name: 'usuario-curso-evidencia',
      params: { id: existingStampActivity.id }
    })
    return
  }

  if (!isAdmin.value && stampStore.modalityTypeId !== 2) {
    if (stampStore.isExpired) {
      $toast.warning('El expediente está fuera de vigencia. No se aceptan nuevas cargas.')
      return
    }
    if (!stampStore.isEditable) {
      $toast.warning('El expediente se encuentra en revisión y no puede ser modificado.')
      return
    }
  }

  selectedActivityId.value = activity.id
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

  if (!selectedActivityId.value || !stampStore.currentStamp) {
    $toast.error('Error al subir la evidencia')
    return
  }

  if (stampStore.isExpired) {
    $toast.warning('El expediente está fuera de vigencia. No se aceptan nuevas cargas.')
    return
  }

  loadingUpload.value = true
  try {
    const stampActivity = await stampStore.addActivityToStamp(selectedActivityId.value)
    if (stampActivity?.id) {
      const response = await addFileToStampActivity(stampActivity.id, selectedFile.value!)

      const meta = response.data.meta
      uploadModal.value?.hideModal()

      if (meta?.evidence_complete) {
        evidenciaCompletaModal.value?.showModal()
      } else if (meta?.message) {
        $toast.success(meta.message)
      } else {
        $toast.success('Evidencia subida correctamente')
      }
      selectedFile.value = null
      fileError.value = null
      if (fileInput.value) fileInput.value.value = ''
      await stampStore.fetchCurrentStamp()
      router.push({ name: 'usuario-curso-evidencia', params: { id: stampActivity.id } })
    }
  } catch (error) {
    $toast.error('Error al subir la evidencia')
    console.error(error)
  } finally {
    loadingUpload.value = false
  }
}

const uploadModalButtons = computed(() => [
  { text: 'Cancelar', variant: 'secundario' as const, dismiss: true, action: () => { } },
  { text: 'Subir', variant: 'primario' as const, action: handleUpload, loading: loadingUpload.value, disabled: !selectedFile.value || !!fileError.value || loadingUpload.value }
])

const handleSearch = (term: string) => {
  searchTerm.value = term
}

const handleFilter = (moduleId: number | string) => {
  selectedModule.value = moduleId
}

const goToActivity = async (activity: ActivityResource, sectionId: number) => {
  const sa = currentStampActivity(activity)

  loadingStore.setLoading('Iniciando actividad...')
  try {
    if (!sa) {
      await stampStore.addActivityToStamp(activity.id)
    }
    router.push({
      name: isAdmin.value ? 'admin-modulo-curso' : 'usuario-modulo-curso',
      params: { id: activity.id },
      query: { sectionId: sectionId.toString() }
    })
  } catch {
    $toast.error('Error al iniciar la actividad. Intenta de nuevo.')
  } finally {
    loadingStore.clearLoading()
  }
}

const fetchSections = async (stampId?: number) => {
  await sectionsStore.fetchSections(1, stampId)
}

const fetchStampById = async (stampId: number) => {
  const { getStamp } = await import('@/api/validator')
  const stampRes = await getStamp(stampId)
  const stampData = stampRes.data.data
  stampStore.setCurrentProvider(stampData.provider ?? null)
  stampStore.currentStamp = {
    id: stampData.id,
    is_active: stampData.is_active,
    percent: stampData.percent,
    percent_moduls: stampData.percent_moduls,
    percent_evaluations: stampData.percent_evaluations,
    stamp_status_id: stampData.stamp_status_id,
    stamp_status: stampData.stamp_status,
    vigency_start_date: stampData.vigency_start_date,
    vigency_end_date: stampData.vigency_end_date,
    provider_id: stampData.provider?.id ?? stampData.provider_id,
    reviewer_id: stampData.reviewer_id,
    modality_type_id: stampData.modality_type_id,
    created_at: stampData.created_at,
    updated_at: stampData.updated_at,
    created_by: null,
    updated_by: null,
    deleted_by: null,
    deleted_at: null,
    deleted_reason: null
  }
}

onMounted(async () => {
  const moduleId = route.query.moduleId
  if (moduleId) {
    selectedModule.value = Number(moduleId)
  }
  loadingStore.setLoading('Cargando módulos...')
  try {
    if (isAdmin.value && route.query.stampId) {
      const stampId = Number(route.query.stampId)
      try {
        await fetchStampById(stampId)
      } catch (e) {
        // 403: el expediente ya fue tomado por otro revisor. El interceptor ya
        // mostró el mensaje; devolvemos al admin al panel para no dejarlo en una vista vacía.
        if (axios.isAxiosError(e) && e.response?.status === 403) {
          router.replace({ name: 'admin-dashboard' })
          return
        }
        throw e
      }
      // Persistir el stampId para que el breadcrumb y sidebar puedan usarlo
      // incluso cuando la ruta activa no tiene el query param (ej: validador-curso-evidencia)
      breadcrumbStore.setValidatorStampId(stampId)
    } else {
      if (!stampStore.currentStamp || !stampStore.loaded) {
        await stampStore.fetchCurrentStamp()
      }
    }
    const stampIdParam = isAdmin.value && route.query.stampId ? Number(route.query.stampId) : undefined
    await fetchSections(stampIdParam)
  } finally {
    loadingStore.clearLoading()
  }

  if (route.query.scrollToBottom === '1') {
    await nextTick()
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }
})

watch(() => route.query.moduleId, (newModuleId) => {
  if (newModuleId) {
    selectedModule.value = Number(newModuleId)
  } else {
    selectedModule.value = ''
  }
})

defineExpose({
  sections: sortedSections
})
</script>

<style scoped>
:deep(.seccion_alerta) {
  margin: 22px 0 28px;
  padding: 0;
}

:deep(.seccion_alerta .caja_alerta) {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 22px 28px;
}

:deep(.seccion_alerta .material-symbols-outlined) {
  flex-shrink: 0;
  margin-top: 2px;
}

:deep(.seccion_alerta .contendido_alerta) {
  line-height: 1.35;
}

:deep(.seccion_alerta .contendido_alerta b) {
  margin-right: 6px;
}

.modulos-list {
  width: 100%;
  overflow: visible;
}

.modulos-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  gap: 1rem;
}

.modulos-loading-text {
  margin: 0;
  color: var(--bs-secondary);
  font-size: 1rem;
}

.modulos-list>div {
  overflow: visible;
}

.modulos-list h2 {
  margin-bottom: 0.25rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.modulo_descripcion {
  margin: 0 0 1rem;
  color: #1f2937;
  font-size: 14px;
  line-height: 1.35;
}

.seccion_tarjetas_responsive {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(1, 1fr);
  width: 100%;
  box-sizing: border-box;
  overflow: visible;
  position: relative;
}

.seccion_tarjetas_responsive .tarjeta_item {
  min-width: 0;
  width: 100%;
  box-sizing: border-box;
  overflow: visible;
  position: relative;
  z-index: 1;
  display: block;
}

.seccion_tarjetas_responsive .tarjeta_item :deep(.seccion_tarjetas) {
  display: block;
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0;
}

.seccion_tarjetas_responsive .tarjeta_item :deep(.caja_tarjeta) {
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  flex-basis: auto;
  flex-shrink: 1;
  flex-grow: 0;
  position: relative;
  z-index: 2;
  margin: 0;
}

.seccion_tarjetas_responsive .tarjeta_item :deep(.imagen_tarjeta) {
  width: 100%;
  max-width: 100%;
  flex-shrink: 0;
}

.seccion_tarjetas_responsive .tarjeta_item :deep(.titulo_tarjeta) {
  display: block;
  min-height: 4.5rem;
  overflow: visible;
  text-overflow: clip;
  white-space: normal;
  overflow-wrap: anywhere;
  -webkit-line-clamp: unset;
  -webkit-box-orient: initial;
}

@media (min-width: 576px) {
  .seccion_tarjetas_responsive {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media (min-width: 992px) {
  .seccion_tarjetas_responsive {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
}
</style>
