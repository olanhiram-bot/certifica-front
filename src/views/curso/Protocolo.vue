<template>
  <div class="contenedor_general">
    <BreadcrumVue />
    <CajaTituloBannerVue :data="isAdmin ? cajaRevisionExpedienteData : cajaProtocoloData" />

    <CajaDatosVue :show-header-info="false" :show-progress="true" :show-progress-text="false"
      :progress-value="stampStore.percentEvaluations" :progress-label="`${stampStore.percentEvaluations}%`"
      :vigencia-fin="stampStore.vigenciaFin" :modality-name="stampStore.modalityName" />

    <template v-if="!isAdmin || activeTab === 'evaluacion'">
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
      <div class="modulos-list mb-5">
        <div v-if="loadingCards" class="d-flex justify-content-center align-items-center py-5">
          <div class="spinner-border me-2" role="status" style="color: var(--color_primario); width: 2.5rem; height: 2.5rem;">
            <span class="visually-hidden">Cargando...</span>
          </div>
          Cargando protocolos...
        </div>
        <template v-else>
          <div v-for="section in filteredSections" :key="section.id">
            <h2>{{ section.name }}</h2>
            <AlertaVue v-if="!isAdmin && stampStore.modalityTypeId === 2" tipo="warning" :mostrar-cerrar="false" :data="{
              titulo: 'Subir evidencias',
              descripcion: 'Para acreditar satisfactoriamente la capacitación, deberán cargarse las evidencias correspondientes a cada módulo. Aunque solo se solicita un archivo por cada uno, este mismo deberá adjuntarse en todas las lecciones que lo integran.'
            }" />
            <div class="row row-cols-1 row-cols-md-3 g-3 align-items-stretch">
              <div v-for="activity in section.activities" :key="activity.id" class="col d-flex"
                v-tooltip:top="!isAdmin && stampStore.isExpired ? 'La vigencia del expediente ha vencido (0 días restantes). No es posible subir documentos.' : ''">
                <TarjetaArchivo :titulo="activity.name" :descripcion="getFileName(activity)"
                  :boton="getBotonText(activity)" :estado="getActivityStatus(activity)"
                  :estado-color="getActivityStatusColor(activity)" :es-visualizacion="false"
                  :disabled-boton="isActionDisabled(activity)"
                  @click="handleActivityClick(activity, section.id)" />
              </div>
            </div>
          </div>
        </template>
      </div>
      <div v-if="isAdmin" class="caja_datos default d-flex justify-content-between align-items-center">
        <div>
          <h3>Liberar Certifica</h3>
          <p>Disponible cuando el 100% de los protocolos enviados estén aprobados.</p>
        </div>
        <button
          class="boton boton_primario"
          :disabled="!puedeLiberarCertificacion || liberandoCertificacion"
          @click="liberarCertificacion"
        >
          Liberar
        </button>
      </div>
      <SeccionTextoVue :data="seccionTextoData3" />
      <div class="modulos-list">
        <div class="mb-4">
          <div v-if="loadingRecursos" class="d-flex justify-content-center align-items-center py-4">
            <div class="spinner-border me-2" role="status" style="color: var(--color_primario); width: 2rem; height: 2rem;">
              <span class="visually-hidden">Cargando...</span>
            </div>
            Cargando recursos...
          </div>
          <div v-else class="row row-cols-1 row-cols-md-3 g-3 align-items-stretch">
            <div v-for="recurso in recursos" :key="recurso.id" class="col d-flex">
              <TarjetaArchivo
                :titulo="recurso.name ?? ''"
                :descripcion="recurso.description ?? ''"
                boton="Ver material"
                @click="openRecursoModal(recurso)" />
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="activeTab === 'programa'">
      <div class="mt-4">
        <p class="text-muted">Vista de Programa de formación - Módulos</p>
      </div>
    </template>
    <TarjetaHorizontal2Vue v-if="stampStore.percentEvaluations >= 100 && !isAdmin" :data="{
      titulo: 'Has finalizado la carga de evidencias de la Evaluación documental del Contenido del programa de formación',
      descripcion: 'Tus evidencias han sido registradas correctamente. Espera a que el equipo de Certifica revise y libere el certificacion.',
      imagen: '/src/assets/tarjeta2.png'
    }" />
  </div>

  <Modal ref="uploadModal" modalId="uploadEvidenceModal" title="Subir Evidencia" size="lg" :buttons="modalButtons">
    <template #body>
      <label class="form-label" for="inputGroupFile">Sube un archivo adjunto</label>
      <div class="input-group">
        <input ref="fileInput" type="file" class="form-control" :class="{ 'is-invalid': fileError }" id="inputGroupFile"
          accept="application/pdf" @change="handleFileSelect">
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

  <Modal
    ref="confirmacionLiberarModal"
    modalId="confirmarLiberarCertificacionModal"
    title="Liberar Certifica"
    :buttons="confirmacionLiberarButtons"
  >
    <template #body>
      <p>¿Estás seguro de que deseas liberar el Certifica? Esta acción no se puede deshacer.</p>
    </template>
  </Modal>

  <!-- Modal Ver Material de Recursos -->
  <Modal ref="recursoModal" modalId="recursoMaterialModal" title="Ver material" size="xl" :buttons="recursoModalButtons">
    <template #body>
      <div v-if="recursoLoading" class="text-center py-5">
        <div class="spinner-border" role="status" style="color: var(--color_primario);">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>
      <div v-else-if="recursoError" class="text-center py-5">
        <p class="text-danger">No se pudo cargar el material. Intenta de nuevo.</p>
      </div>
      <div v-else-if="recursoEsMp4" class="text-center">
        <video :src="recursoUrl" controls class="w-100" style="max-height: 70vh;">
          Tu navegador no soporta la reproducción de videos.
        </video>
      </div>
      <template v-else-if="recursoPdfBlobUrl">
        <div class="text-center">
          <VuePDF :pdf="recursoPdf" :page="recursoPaginaActual" :scale="1.2" text-layer />
        </div>
        <div class="d-flex justify-content-center align-items-center gap-3 mt-3">
          <button class="boton boton_secundario" @click="recursoPaginaActual--" :disabled="recursoPaginaActual <= 1">
            <span class="material-icons-outlined">chevron_left</span> Anterior
          </button>
          <span>Página {{ recursoPaginaActual }} de {{ recursoTotalPaginas }}</span>
          <button class="boton boton_secundario" @click="recursoPaginaActual++" :disabled="recursoPaginaActual >= recursoTotalPaginas">
            Siguiente <span class="material-icons-outlined">chevron_right</span>
          </button>
        </div>
      </template>
      <div v-else-if="recursoPdfDirectUrl" class="text-center">
        <iframe
          :src="recursoPdfDirectUrl"
          class="w-100"
          style="height: 70vh; border: 0;"
          title="Vista previa de PDF"
        />
      </div>
    </template>
  </Modal>

</template>

<script setup lang="ts">
import axios from 'axios'
import { VuePDF, usePDF } from '@tato30/vue-pdf'
import '@tato30/vue-pdf/style.css'
import { addFileToStampActivity, createStampActivity } from '@/api/stamp'
import { releaseStamp } from '@/api/validator'
import { getRecursos } from '@/api/landingContent'
import BreadcrumVue from '@/components/Breadcrum.vue'
import CajaDatosVue from '@/components/CajaDatos.vue'
import CajaTituloBannerVue from '@/components/CajaTituloBanner.vue'
import FilterDropdownVue from '@/components/FilterDropdown.vue'
import Modal from '@/components/Modal.vue'
import ModalEvidenciaCompleta from '@/components/ModalEvidenciaCompleta.vue'
import PestanasSimplesVue from '@/components/PestanasSimples.vue'
import SearchVue from '@/components/Search.vue'
import SeccionTextoVue from '@/components/SeccionTexto.vue'
import AlertaVue from '@/components/Alerta.vue'
import TarjetaArchivo from '@/components/TarjetaArchivo.vue'
import TarjetaHorizontal2Vue from '@/components/TarjetaHorizontal2.vue'
import { cajaProtocoloData, cajaRevisionExpedienteData } from '@/data/cajaLineamientosData'
import { seccionTextoData3 } from '@/data/seccionTextoData'
import { AuthMethod } from '@/enums/AuthMethod'
import type { ActivityResource } from '@/interfaces/Section'
import type { LandingContent } from '@/interfaces/LandingContent'
import { useAuthStore } from '@/stores/auth'
import { useBreadcrumbStore } from '@/stores/breadcrumb'
import { useLoadingStore } from '@/stores/loading'
import { useSectionsStore } from '@/stores/sections'
import { useStampStore } from '@/stores/stamp'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'

const route = useRoute()
const router = useRouter()
const stampStore = useStampStore()
const loadingStore = useLoadingStore()
const authStore = useAuthStore()
const breadcrumbStore = useBreadcrumbStore()
const sectionsStore = useSectionsStore()
const $toast = useToast()

const isAdmin = computed(() => authStore.user?.auth_method_id === AuthMethod.ADMIN)
const activeTab = computed(() => route.name === 'admin-protocolos' ? 'evaluacion' : 'programa')

const handleTabChange = (tabId: string) => {
  if (tabId === 'programa') {
    router.push({ name: 'admin-modulos', query: route.query })
  }
}

// â”€â”€â”€ Secciones desde el store â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const sections = computed(() => sectionsStore.sections)
const loadingCards = computed(() => sectionsStore.loading)

const searchTerm = ref('')
const selectedModule = ref<number | string>('')
const liberandoCertificacion = ref(false)

// ─── Recursos (content-type 6) ────────────────────────────────────────────────
const recursos = ref<LandingContent[]>([])
const loadingRecursos = ref(false)

// ─── Modal Ver Material ────────────────────────────────────────────────────────
const storageUrl = import.meta.env.VITE_STORAGE_URL || ''
const recursoModal = ref<InstanceType<typeof Modal> | null>(null)
const recursoLoading = ref(false)
const recursoError = ref(false)
const recursoEsMp4 = ref(false)
const recursoUrl = ref('')
const recursoPdfBlobUrl = ref('')
const recursoPdfDirectUrl = ref('')
const recursoPaginaActual = ref(1)
const { pdf: recursoPdf, pages: recursoPaginas } = usePDF(recursoPdfBlobUrl)
const recursoTotalPaginas = computed(() => recursoPaginas.value ?? 0)

// â”€â”€â”€ Helpers de stamp_activity embebido â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/** Devuelve el stamp_activity embebido dentro de la actividad, si existe. */
const stampActivityOf = (activity: ActivityResource) => activity.stamp_activity ?? null

const getActivityStatus = (activity: ActivityResource): string =>
  stampActivityOf(activity)?.status?.name ?? 'Sin Iniciar'

const getActivityStatusColor = (activity: ActivityResource): string =>
  stampActivityOf(activity)?.status?.hexadecimal ?? '#bdbdbd'

const hasEvidence = (activity: ActivityResource): boolean =>
  !!(stampActivityOf(activity)?.file_name || stampActivityOf(activity)?.file_path)

const getStampActivityId = (activity: ActivityResource): number | null =>
  stampActivityOf(activity)?.id ?? null

const truncateFileName = (name: string, maxBase = 15): string => {
  const dotIndex = name.lastIndexOf('.')
  if (dotIndex <= 0) return name.length > maxBase ? name.slice(0, maxBase) + '...' : name
  const base = name.slice(0, dotIndex)
  const ext = name.slice(dotIndex)
  return base.length > maxBase ? base.slice(0, maxBase) + '...' + ext : name
}

const getFileName = (activity: ActivityResource): string => {
  const name = stampActivityOf(activity)?.file_name
  return name ? truncateFileName(name) : 'Sin archivo'
}

const getBotonText = (activity: ActivityResource): string => {
  if (isAdmin.value) return 'Revisar evidencia'
  return hasEvidence(activity) ? 'Volver a enviar' : 'Subir evidencia'
}

const isActionDisabled = (activity: ActivityResource): boolean => {
  if (isAdmin.value) return !hasEvidence(activity)
  if (stampStore.isRechazado && isProtocolApproved(activity)) return true
  return stampStore.isExpired || !stampStore.isEditable
}

const handleActivityClick = (activity: ActivityResource, sectionId: number) => {
  const saId = getStampActivityId(activity)

  if (!isAdmin.value && stampStore.isRechazado && isProtocolApproved(activity)) {
    $toast.warning('Esta actividad ya fue aprobada y no puede ser modificada.')
    return
  }

  if (!isAdmin.value && (stampStore.isExpired || !stampStore.isEditable)) {
    const message = stampStore.isExpired
      ? 'El expediente está fuera de vigencia. No se aceptan nuevas cargas.'
      : 'El expediente se encuentra en revisión y no puede ser modificado.'
    $toast.warning(message)
    return
  }

  if (isAdmin.value && !hasEvidence(activity)) return

  if (!saId) {
    openUploadModal(activity.id, sectionId)
    return
  }

  if (isAdmin.value) {
    router.push({ name: 'admin-curso-evidencia', params: { id: saId }, query: { ...route.query, from: 'protocolos' } })
    return
  }

  router.push({ name: 'usuario-curso-evidencia', params: { id: saId }, query: { from: 'protocolos' } })
}

// â”€â”€â”€ Filtros / opciones â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const sortedSections = computed(() =>
  [...sections.value].sort((a, b) => {
    const numA = parseInt(a.name.replace(/\D/g, '')) || 0
    const numB = parseInt(b.name.replace(/\D/g, '')) || 0
    return numA - numB
  })
)

const moduleOptions = computed(() =>
  sortedSections.value.map(section => ({ label: section.name, value: section.id }))
)

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
        activities: section.activities.filter(a => a.name.toLowerCase().includes(term))
      }))
      .filter(section => section.activities.length > 0)
  }

  return result
})

const handleSearch = (term: string) => { searchTerm.value = term }
const handleFilter = (moduleId: number | string) => { selectedModule.value = moduleId }

// â”€â”€â”€ Liberar certificacion â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const protocoloActivities = computed(() => sections.value.flatMap(s => s.activities))

const isProtocolApproved = (activity: ActivityResource): boolean => {
  const sa = stampActivityOf(activity)
  if (!sa) return false
  return sa.stamp_activity_status_id === 6
    || sa.status?.name?.trim().toLowerCase() === 'aprobado'
}

const puedeLiberarCertificacion = computed(() =>
  protocoloActivities.value.length > 0
  && protocoloActivities.value.every(a => isProtocolApproved(a))
)

const liberarCertificacion = () => {
  if (!stampStore.currentStamp || !puedeLiberarCertificacion.value || liberandoCertificacion.value) return
  confirmacionLiberarModal.value?.showModal()
}

const confirmarLiberarCertificacion = async () => {
  if (!stampStore.currentStamp) return
  confirmacionLiberarModal.value?.hideModal()
  liberandoCertificacion.value = true
  loadingStore.setLoading('Liberando certificacion...')
  try {
    await releaseStamp(stampStore.currentStamp.id)
    $toast.success('Certifica liberado correctamente')
    router.push({ name: 'admin-dashboard' })
  } catch (error) {
    console.error('Error al liberar certificacion:', error)
    $toast.error('Error al liberar el certificacion')
  } finally {
    liberandoCertificacion.value = false
    loadingStore.clearLoading()
  }
}

const confirmacionLiberarButtons = computed(() => [
  { text: 'Cancelar', variant: 'secundario' as const, dismiss: true, action: () => {} },
  {
    text: 'Liberar',
    variant: 'primario' as const,
    action: confirmarLiberarCertificacion,
    loading: liberandoCertificacion.value,
    disabled: !puedeLiberarCertificacion.value || liberandoCertificacion.value
  }
])

// â”€â”€â”€ Modal subir evidencia â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const uploadModal = ref<InstanceType<typeof Modal> | null>(null)
const evidenciaCompletaModal = ref<InstanceType<typeof ModalEvidenciaCompleta> | null>(null)
const confirmacionLiberarModal = ref<InstanceType<typeof Modal> | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const selectedActivityId = ref<number | null>(null)
const selectedFile = ref<File | null>(null)
const fileError = ref<string | null>(null)
const loadingUpload = ref(false)

const validateFile = (file: File | null): string | null => {
  if (!file) return 'El archivo es requerido'
  if (file.type !== 'application/pdf') return 'Solo se permiten archivos en formato PDF'
  const maxSizeMb = Number(import.meta.env.VITE_MAX_FILE_SIZE_MB) || 10
  if (file.size > maxSizeMb * 1024 * 1024) return `El archivo no debe superar los ${maxSizeMb} MB`
  return null
}

const openUploadModal = (activityId: number, _sectionId: number) => {
  selectedActivityId.value = activityId
  selectedFile.value = null
  fileError.value = null
  if (fileInput.value) fileInput.value.value = ''
  uploadModal.value?.showModal()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files?.[0]) {
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
  if (error) { fileError.value = error; return }

  if (!selectedActivityId.value || !stampStore.currentStamp) {
    $toast.error('No tienes una certificacion activa')
    return
  }

  if (stampStore.isExpired) {
    $toast.warning('El expediente estÃ¡ fuera de vigencia. No se aceptan nuevas cargas.')
    return
  }

  loadingUpload.value = true
  try {
    const stampActivity = await createStampActivity(stampStore.currentStamp.id, selectedActivityId.value)
    const stampActivityId = stampActivity.data.data.id
    const response = await addFileToStampActivity(stampActivityId, selectedFile.value!)

    const meta = response.data.meta
    uploadModal.value?.hideModal()

    selectedFile.value = null
    fileError.value = null
    if (fileInput.value) fileInput.value.value = ''

    await stampStore.fetchCurrentStamp()

    if (meta?.evidence_complete) {
      evidenciaCompletaModal.value?.showModal()
      return
    }

    $toast.success(meta?.message ?? 'Evidencia subida correctamente')
    router.push({ name: 'usuario-curso-evidencia', params: { id: stampActivityId }, query: { from: 'protocolos' } })
  } catch (err) {
    $toast.error('Error al subir la evidencia')
    console.error(err)
  } finally {
    loadingUpload.value = false
  }
}

const modalButtons = computed(() => [
  { text: 'Cancelar', variant: 'secundario' as const, dismiss: true, action: () => {} },
  {
    text: 'Subir',
    variant: 'primario' as const,
    action: handleUpload,
    loading: loadingUpload.value,
    disabled: !selectedFile.value || !!fileError.value || loadingUpload.value
  }
])

// â”€â”€â”€ Carga inicial â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const fetchStampById = async (stampId: number) => {
  const { getStamp } = await import('@/api/validator')
  const stampRes = await getStamp(stampId)
  const stampData = stampRes.data.data
  stampStore.setCurrentProvider(stampData.provider ?? null)
  stampStore.currentStamp = {
    id: stampData.id,
    is_active: stampData.is_active,
    percent: stampData.percent,
    percent_moduls: stampData.percent_moduls ?? stampData.percent,
    percent_evaluations: stampData.percent_evaluations ?? 0,
    stamp_status_id: stampData.stamp_status?.id ?? stampData.stamp_status_id,
    stamp_status: stampData.stamp_status,
    vigency_start_date: stampData.vigency_start_date,
    vigency_end_date: stampData.vigency_end_date,
    provider_id: stampData.provider?.id ?? stampData.provider_id,
    reviewer_id: stampData.reviewer_id,
    modality_type_id: stampData.modality_type_id ?? 2,
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
  breadcrumbStore.setPreviousRoute(route.name as string)

  if (isAdmin.value && route.query.stampId) {
    const stampId = Number(route.query.stampId)
    try {
      await fetchStampById(stampId)
    } catch (e) {
      // 403: expediente tomado por otro revisor. Regresar al panel.
      if (axios.isAxiosError(e) && e.response?.status === 403) {
        router.replace({ name: 'admin-dashboard' })
        return
      }
      throw e
    }
    breadcrumbStore.setValidatorStampId(stampId)
  } else if (!isAdmin.value) {
    if (!stampStore.currentStamp) {
      await stampStore.fetchCurrentStamp()
    }
    if (!stampStore.canAccessProtocols) {
      $toast.warning('Completa el 100% de los mÃ³dulos primero')
      router.push({ name: 'usuario-programa-modulos' })
      return
    }
  }

  if (route.query.moduleId) {
    selectedModule.value = Number(route.query.moduleId)
  }

  const stampId = isAdmin.value && route.query.stampId
    ? Number(route.query.stampId)
    : undefined

  await sectionsStore.fetchSections(2, stampId)

  loadingRecursos.value = true
  try {
    const res = await getRecursos()
    recursos.value = res.data.data
  } catch (e) {
    console.error('Error al cargar recursos:', e)
  } finally {
    loadingRecursos.value = false
  }
})

const getRecursoFullUrl = (recurso: LandingContent): string => {
  const rawPath = (recurso.image_url || recurso.file_url || recurso.url_content || '').trim()
  if (!rawPath) return ''
  if (rawPath.startsWith('http://') || rawPath.startsWith('https://')) return rawPath

  // Normaliza rutas relativas para evitar URLs inválidas por doble o falta de slash.
  if (!storageUrl) return rawPath
  const normalizedBase = storageUrl.endsWith('/') ? storageUrl.slice(0, -1) : storageUrl
  const normalizedPath = `/${rawPath.replace(/^\/+/, '')}`
  return `${normalizedBase}${normalizedPath}`
}

const openRecursoModal = async (recurso: LandingContent) => {
  const url = getRecursoFullUrl(recurso)
  if (!url) return

  recursoLoading.value = true
  recursoError.value = false
  recursoEsMp4.value = url.toLowerCase().includes('.mp4')
  recursoUrl.value = url
  recursoPdfDirectUrl.value = ''
  recursoPaginaActual.value = 1
  if (recursoPdfBlobUrl.value) {
    URL.revokeObjectURL(recursoPdfBlobUrl.value)
    recursoPdfBlobUrl.value = ''
  }
  recursoModal.value?.showModal()

  if (recursoEsMp4.value) {
    recursoLoading.value = false
    return
  }

  try {
    const response = await axios.get(url, { responseType: 'blob' })
    const blob = new Blob([response.data], { type: 'application/pdf' })
    recursoPdfBlobUrl.value = URL.createObjectURL(blob)
  } catch (error) {
    // Si el backend no expone CORS para XHR, usamos visor nativo sin descargar por axios.
    recursoPdfDirectUrl.value = url
    if (!axios.isAxiosError(error)) {
      console.error('Error al cargar el material:', error)
    }
  } finally {
    recursoLoading.value = false
  }
}

const cerrarRecursoModal = () => {
  recursoModal.value?.hideModal()
  recursoPdfDirectUrl.value = ''
  if (recursoPdfBlobUrl.value) {
    URL.revokeObjectURL(recursoPdfBlobUrl.value)
    recursoPdfBlobUrl.value = ''
  }
}

const recursoModalButtons = computed(() => [
  { text: 'Cerrar', variant: 'secundario' as const, action: cerrarRecursoModal }
])

onUnmounted(() => {
  breadcrumbStore.setPreviousRoute(null)
  if (recursoPdfBlobUrl.value) {
    URL.revokeObjectURL(recursoPdfBlobUrl.value)
  }
})

watch(() => route.query.moduleId, (newModuleId) => {
  selectedModule.value = newModuleId ? Number(newModuleId) : ''
})

defineExpose({ sections: sortedSections })
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
  display: flex;
  flex-direction: column;
  gap: 4rem;
}
</style>
