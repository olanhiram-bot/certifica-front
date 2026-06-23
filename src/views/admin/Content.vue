<template>
  <div class="contenedor_general default">
    <!-- Breadcrumbs -->
    <div class="row">
      <div class="col-md-12">
        <nav class="migas mb-3" style="padding-left: 0px;">
          <router-link to="/admin">Inicio</router-link><span>Contenido</span>
        </nav>
      </div>
    </div>

    <!-- Botones -->
    <div class="row gy-2">
      <div class="col-md-4">
        <button class="boton boton_primario" @click="openCreateModal"><span class="material-icons">add</span> Agregar</button>
      </div>
      <div class="col-md-8 d-flex justify-content-end align-items-end gap-4">
        <div class="dropdown" style="position: relative;" ref="dropdownRef">
          <button class="boton boton_terciario d-inline-flex align-items-center gap-2" @click.stop="showDropdown = !showDropdown" type="button">
            <span class="material-icons">filter_list</span>
            Tipo
            <span class="material-icons" style="font-size: 18px;">arrow_drop_down</span>
          </button>
          <ul v-if="showDropdown" class="dropdown-menu show" style="display: block; position: absolute; right: 0; min-width: 180px; z-index: 1050;">
            <li v-for="option in typeOptions" :key="option.id">
              <a class="dropdown-item" href="#" @click.prevent="selectType(option)">{{ option.name }}</a>
            </li>
          </ul>
        </div>
        <Search class="w-auto" placeholder="Buscar contenido..." @on-search="handleSearch" />
      </div>
    </div>

    <!-- Titulo -->
    <div class="row">
      <div class="col-md-12">
        <div class="seccion_titulo mt-4" style="margin-top: 0px;">
          <h3>Contenido</h3>
          <p>Permite gestionar y organizar el contenido de la plataforma.</p>
        </div>
      </div>
    </div>

    <!-- Tabla de contenido -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="caja_tabla">
          <Table :thead="['Media', 'Nombre', 'Módulo', 'Posición', 'Acciones']">
            <tr v-if="contentItems.length === 0 && !loadingTable">
              <td colspan="5" class="estado_tabla text-center">Sin contenido.</td>
            </tr>
            <tr v-else-if="loadingTable">
              <td colspan="5" class="estado_tabla text-center">
                Cargando...
              </td>
            </tr>
            <tr v-for="item in contentItems" :key="item.id">
              <td>
                <a v-if="item.file_url || item.image_url" @click="openPreview(item)">Ver contenido</a>
                <span v-else>—</span>
              </td>
              <td>{{ item.name ?? '—' }}</td>
              <td>{{ item.landing_content_type?.name ?? '—' }}</td>
              <td>{{ item.position ?? '—' }}</td>
              <td>
                <button class="boton boton_terciario solo_icono" @click="openEditModal(item)"><span class="material-icons">edit</span></button>
                <button class="boton boton_terciario solo_icono" @click="openDeleteModal(item)"><span class="material-icons">delete</span></button>
              </td>
            </tr>
          </Table>

          <div v-if="!loadingTable && contentItems.length > 0" class="barra_paginacion">
            <Pagination :links="pagination.links" :current-page="pagination.page" :per-page="pagination.perPage"
              :total="pagination.total" :to="pagination.to" @on-page="handlePageChange" />
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Preview Evidencia -->
    <Modal ref="previewModal" modalId="previewEvidenceModal" title="Vista Previa" size="xl" :buttons="previewModalButtons">
      <template #body>
        <div v-if="isLoadingPdf" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>
        <div v-else-if="pdfLoadError" class="text-center py-5">
          <p class="text-danger">Error al cargar el archivo. Intenta de nuevo.</p>
        </div>
        <div v-else-if="previewIsImage && previewImageUrl" class="text-center">
          <img :src="previewImageUrl" class="img-fluid rounded" alt="Vista previa" />
        </div>
        <div v-else-if="previewPdf && pdfBlobUrl" class="text-center">
          <VuePDF :pdf="previewPdf" :page="previewCurrentPage" :scale="1.2" text-layer @on-error="handlePdfError" />
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

    <!-- Modal Crear / Editar Contenido -->
    <Modal
      ref="formModal"
      modalId="contentFormModal"
      :title="isEditing ? 'Editar Contenido' : 'Agregar Contenido'"
      :buttons="formModalButtons"
    >
      <template #body>
        <ContentForm
          ref="contentFormRef"
          :initial-data="selectedItem"
          :is-editing="isEditing"
          :type-options="typeOptions"
          @submit="handleFormSubmit"
          @preview="openPreviewByUrl"
        />
      </template>
    </Modal>

    <!-- Modal Eliminar Contenido -->
    <Modal
      ref="deleteModal"
      modalId="contentDeleteModal"
      title="Eliminar Contenido"
      :buttons="deleteModalButtons"
    >
      <template #body>
        <p class="mb-3">
          ¿Estás seguro de que deseas eliminar <strong>{{ selectedItem?.name ?? 'este contenido' }}</strong>?
          Esta acción no se puede deshacer.
        </p>
        <div class="mb-1">
          <label for="delete_reason" class="form-label">Motivo de eliminación <span class="text-danger">*</span></label>
          <textarea
            id="delete_reason"
            v-model="deleteReason"
            class="form-control"
            :class="{ 'is-invalid': deleteReasonError }"
            rows="3"
            placeholder="Indica el motivo de la eliminación..."
          ></textarea>
          <div v-if="deleteReasonError" class="invalid-feedback">{{ deleteReasonError }}</div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import Pagination from '@/components/Pagination.vue'
import Search from '@/components/Search.vue'
import Table from '@/components/Table.vue'
import { getLandingContentsByType, createLandingContent, updateLandingContent, deleteLandingContent } from '@/api/landingContent'
import type { LandingContent } from '@/interfaces/LandingContent'
import type { LinkPaginate } from '@/interfaces/LinkPaginate'
import { onMounted, onBeforeUnmount, ref, watch, computed } from 'vue'
import Modal from '@/components/Modal.vue'
import { VuePDF, usePDF } from '@tato30/vue-pdf'
import { getFileExtension } from '@/utils/strings'
import { getLandingContentTypes, type LandingContentType } from '@/api/landingContentType'
import ContentForm from '@/components/forms/admin/ContentForm.vue'
import { useToast } from 'vue-toast-notification'

const toast = useToast()

const contentItems = ref<LandingContent[]>([])
const loadingTable = ref(false)
const currentPage = ref(1)
// TODO: contentType se asignará dinámicamente desde el botón "Tipo" cuando exista el endpoint
const contentType = ref(1)
const filterValue = ref('')
const showDropdown = ref(false)
const typeOptions = ref<LandingContentType[]>([])
const selectedTypeLabel = computed(() => {
  const found = typeOptions.value.find(opt => opt.id === contentType.value)
  return found ? found.name : 'Tipo'
})

const selectType = (option: LandingContentType) => {
  contentType.value = option.id
  filterValue.value = ''
  showDropdown.value = false
  contentItems.value = []
  fetchContent()
}

const dropdownRef = ref<HTMLElement | null>(null)

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    showDropdown.value = false
  }
}

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
const pagination = ref({ page: 1, perPage: 10, total: 0, lastPage: 1, to: 0, links: [] as LinkPaginate[] })

const handleSearch = (value: string) => {
  filterValue.value = value
  currentPage.value = 1
  contentItems.value = []
  fetchContent()
}

const fetchContent = async () => {
  loadingTable.value = true
  try {
    const response = await getLandingContentsByType(contentType.value, currentPage.value, filterValue.value || undefined)
    const res = response.data as any
    const meta = res.meta || res
    const data: LandingContent[] = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : [])
    contentItems.value = data
    pagination.value = {
      page: Number(meta.current_page) || 1,
      perPage: Number(meta.per_page) || 10,
      total: Number(meta.total) || 0,
      lastPage: Number(meta.last_page) || 1,
      to: Number(meta.to) || 0,
      links: meta.links || [],
    }
  } catch (error) {
    console.error('Error fetching content:', error)
  } finally {
    loadingTable.value = false
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchContent()
}

// Preview modal
const previewModal = ref<InstanceType<typeof Modal> | null>(null)
const previewIsImage = ref(false)
const previewImageUrl = ref<string | null>(null)
const isLoadingPdf = ref(false)
const pdfLoadError = ref(false)
const pdfBlobUrl = ref<string | null>(null)
const previewCurrentPage = ref(1)
const previewUrl = ref<string>('')
const { pdf: previewPdf, pages: previewTotalPages } = usePDF(previewUrl)
const previewModalButtons = [{ text: 'Cerrar', variant: 'terciario' as const, dismiss: true, action: () => {} }]

watch(previewPdf, (pdf) => {
  if (pdf) {
    isLoadingPdf.value = false
    pdfBlobUrl.value = previewUrl.value
  }
})

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp']

const openPreviewByUrl = (url: string) => {
  openPreviewFull(url)
}

const openPreview = (item: LandingContent) => {
  const url = item.file_url
  if (!url) return
  openPreviewFull(url)
}

const openPreviewFull = (url: string) => {
  const fullUrl = import.meta.env.VITE_STORAGE_URL ? `${import.meta.env.VITE_STORAGE_URL}/storage/${url}` : url

  const ext = getFileExtension(url)

  // Reset state
  pdfLoadError.value = false
  previewCurrentPage.value = 1
  previewIsImage.value = false
  previewImageUrl.value = null
  pdfBlobUrl.value = null

  if (IMAGE_EXTENSIONS.includes(ext)) {
    previewIsImage.value = true
    previewImageUrl.value = fullUrl
    isLoadingPdf.value = false
  } else if (fullUrl !== previewUrl.value) {
    isLoadingPdf.value = true
    previewUrl.value = fullUrl
  } else {
    // Same URL already loaded
    isLoadingPdf.value = false
    pdfBlobUrl.value = fullUrl
  }

  previewModal.value?.showModal()
}

const handlePdfError = () => {
  isLoadingPdf.value = false
  pdfLoadError.value = true
}

const fetchContentTypes = async () => {
  try {
    const response = await getLandingContentTypes()
    const raw = response.data as any
    typeOptions.value = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : [])
    const hasType1 = typeOptions.value.some(t => t.id === 1)
    contentType.value = hasType1 ? 1 : (typeOptions.value[0]?.id ?? 1)
    fetchContent()
  } catch (error) {
    console.error('Error fetching content types:', error)
  }
}

// ——— Create / Edit modal ———
const formModal = ref<InstanceType<typeof Modal> | null>(null)
const contentFormRef = ref<InstanceType<typeof ContentForm> | null>(null)
const selectedItem = ref<LandingContent | null>(null)
const isEditing = ref(false)
const isSaving = ref(false)

const formModalButtons = computed(() => [
  {
    text: 'Cancelar',
    variant: 'terciario' as const,
    dismiss: true,
    action: () => {},
  },
  {
    text: isEditing.value ? 'Guardar cambios' : 'Agregar',
    variant: 'primario' as const,
    loading: isSaving.value,
    disabled: isSaving.value,
    action: () => contentFormRef.value?.onSubmit(),
  },
])

const openCreateModal = () => {
  isEditing.value = false
  selectedItem.value = null
  formModal.value?.showModal()
}

const openEditModal = (item: LandingContent) => {
  isEditing.value = true
  selectedItem.value = item
  formModal.value?.showModal()
}

const handleFormSubmit = async (formData: FormData) => {
  isSaving.value = true
  const typeId = Number(formData.get('landing_content_type_id')) || contentType.value
  try {
    if (isEditing.value && selectedItem.value) {
      await updateLandingContent(selectedItem.value.id, formData)
      toast.success('Contenido actualizado correctamente.')
    } else {
      await createLandingContent(typeId, formData)
      toast.success('Contenido agregado correctamente.')
      contentFormRef.value?.reset()
    }
    formModal.value?.hideModal()
    currentPage.value = 1
    fetchContent()
  } catch {
    toast.error('Ocurrió un error al guardar el contenido.')
  } finally {
    isSaving.value = false
  }
}

// ——— Delete modal ———
const deleteModal = ref<InstanceType<typeof Modal> | null>(null)
const deleteReason = ref('')
const deleteReasonError = ref('')
const isDeleting = ref(false)

const deleteModalButtons = computed(() => [
  {
    text: 'Cancelar',
    variant: 'terciario' as const,
    dismiss: true,
    action: () => {},
  },
  {
    text: 'Eliminar',
    variant: 'peligro' as const,
    loading: isDeleting.value,
    disabled: isDeleting.value,
    action: handleDeleteConfirm,
  },
])

const openDeleteModal = (item: LandingContent) => {
  selectedItem.value = item
  deleteReason.value = ''
  deleteReasonError.value = ''
  deleteModal.value?.showModal()
}

const handleDeleteConfirm = async () => {
  deleteReasonError.value = ''
  if (!deleteReason.value.trim()) {
    deleteReasonError.value = 'El motivo de eliminación es requerido.'
    return
  }
  if (!selectedItem.value) return

  isDeleting.value = true
  try {
    await deleteLandingContent(selectedItem.value.id, deleteReason.value.trim())
    toast.success('Contenido eliminado correctamente.')
    deleteModal.value?.hideModal()
    currentPage.value = 1
    fetchContent()
  } catch {
    toast.error('Ocurrió un error al eliminar el contenido.')
  } finally {
    isDeleting.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  fetchContentTypes()
})
</script>

