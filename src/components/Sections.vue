<template>
  <div class="mt-4">
    <!-- Spinner de carga -->
    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando secciones...</span>
      </div>
    </div>

    <template v-else>
      <!-- Botón para agregar sección -->
      <div v-if="isAdmin" class="b-light mb-3">
        <button type="button" class="boton boton_primario w-100" @click="openCreateSectionModal">
          <span class="material-icons">add</span> Agregar sección
        </button>
      </div>

      <!-- Secciones -->
      <template v-for="section in sections?.data" :key="section.id">
        <div :class="['row align-items-center', { 'bg-light': isAdmin, 'py-3': isAdmin, 'mt-4': isAdmin }]">
          <div :class="isAdmin ? 'col-10' : 'col-12'">
            <h4 class="mb-0">{{ section.name }}</h4>
          </div>
          <div v-if="isAdmin" class="col-2 section-actions">
            <button type="button" class="section-action" aria-label="Editar sección" @click="openEditSectionModal(section)">
              <i class="bi bi-pencil"></i>
            </button>
            <button type="button" class="section-action section-action--danger" aria-label="Eliminar sección" @click="openDeleteSectionModal(section)">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>

        <!-- Actividades -->
        <div class="row">
          <div v-for="activity in section.activities" :key="activity.id" class="col-12 col-md-6 col-lg-4 mt-2">
            <Activity
              :title="activity.name"
              :description="activity?.description || ''"
              :image="activity.image_url || ''"
              :is-edit="isAdmin"
              :is-delete="isAdmin"
              @edit="openEditActivityModal(activity, section.id)"
              @delete="openDeleteActivityModal(activity)"
            />
          </div>
          <div v-if="isAdmin" class="col-12 col-md-6 col-lg-4 mt-2">
            <div
              class="caja_tarjeta h-100 d-flex justify-content-center align-items-center"
              style="min-height: 300px;"
            >
              <button type="button" class="boton boton_primario" @click="openCreateActivityModal(section.id)">
                <span class="material-icons">add</span> Agregar actividad
              </button>
            </div>
          </div>
        </div>
      </template>

      <!-- Mensaje de sin resultados -->
      <div v-if="sections?.data?.length === 0">
        <p class="text-center">Sin resultados...</p>
      </div>
    </template>

    <!-- ——— Modal: Crear / Editar Sección ——— -->
    <Modal
      ref="sectionFormModal"
      modalId="sectionFormModal"
      :title="isSectionEditing ? 'Editar sección' : 'Agregar sección'"
      :buttons="sectionFormModalButtons"
    >
      <template #body>
        <SectionForm
          ref="sectionFormRef"
          :initial-name="selectedSection?.name"
          @submit="handleSectionFormSubmit"
        />
      </template>
    </Modal>

    <!-- ——— Modal: Eliminar Sección ——— -->
    <Modal
      ref="sectionDeleteModal"
      modalId="sectionDeleteModal"
      title="Eliminar sección"
      :buttons="sectionDeleteModalButtons"
    >
      <template #body>
        <p class="mb-3">
          ¿Estás seguro de que deseas eliminar la sección
          <strong>{{ selectedSection?.name }}</strong>?
          Esta acción eliminará también todas sus actividades y no se puede deshacer.
        </p>
        <div class="mb-1">
          <label for="section_delete_reason" class="form-label">
            Motivo de eliminación <span class="text-danger">*</span>
          </label>
          <textarea
            id="section_delete_reason"
            v-model="sectionDeleteReason"
            class="form-control"
            :class="{ 'is-invalid': sectionDeleteReasonError }"
            rows="3"
            placeholder="Indica el motivo de la eliminación..."
          ></textarea>
          <div v-if="sectionDeleteReasonError" class="invalid-feedback">{{ sectionDeleteReasonError }}</div>
        </div>
      </template>
    </Modal>

    <!-- ——— Modal: Crear / Editar Actividad ——— -->
    <Modal
      ref="activityFormModal"
      modalId="activityFormModal"
      :title="isActivityEditing ? 'Editar actividad' : 'Agregar actividad'"
      :buttons="activityFormModalButtons"
    >
      <template #body>
        <ActivityForm
          ref="activityFormRef"
          :initial-data="isActivityEditing ? selectedActivity : null"
          :is-editing="isActivityEditing"
          :require-content-file="sectionTypeId === 1"
          @submit="handleActivityFormSubmit"
        />
      </template>
    </Modal>

    <!-- ——— Modal: Eliminar Actividad ——— -->
    <Modal
      ref="activityDeleteModal"
      modalId="activityDeleteModal"
      title="Eliminar actividad"
      :buttons="activityDeleteModalButtons"
    >
      <template #body>
        <p class="mb-3">
          ¿Estás seguro de que deseas eliminar la actividad
          <strong>{{ selectedActivity?.name }}</strong>?
          Esta acción no se puede deshacer.
        </p>
        <div class="mb-1">
          <label for="activity_delete_reason" class="form-label">
            Motivo de eliminación <span class="text-danger">*</span>
          </label>
          <textarea
            id="activity_delete_reason"
            v-model="activityDeleteReason"
            class="form-control"
            :class="{ 'is-invalid': activityDeleteReasonError }"
            rows="3"
            placeholder="Indica el motivo de la eliminación..."
          ></textarea>
          <div v-if="activityDeleteReasonError" class="invalid-feedback">{{ activityDeleteReasonError }}</div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script lang="ts" setup>
import Activity from '@/components/Activity.vue'
import Modal from '@/components/Modal.vue'
import SectionForm from '@/components/forms/admin/SectionForm.vue'
import ActivityForm from '@/components/forms/admin/ActivityForm.vue'
import * as apiSections from '@/api/sections'
import { computed, onMounted, ref } from 'vue'
import type { ActivityResource, SectionResource, SectionsResponse } from '@/interfaces/Section'
import { useAuthStore } from '@/stores/auth'
import { AuthMethod } from '@/enums/AuthMethod'
import { useToast } from 'vue-toast-notification'

const props = withDefaults(defineProps<{ sectionTypeId?: number }>(), { sectionTypeId: 1 })

const authStore = useAuthStore()
const toast = useToast()

const isAdmin = computed(() => authStore.user?.auth_method_id === AuthMethod.ADMIN)

const loading = ref(false)
const sections = ref<SectionsResponse>()

const fetchSections = async () => {
  loading.value = true
  try {
    const response = await apiSections.getSections(props.sectionTypeId)
    sections.value = response.data
  } catch {
    toast.error('No se pudieron cargar las secciones.')
  } finally {
    loading.value = false
  }
}

onMounted(fetchSections)

// ——— Section CRUD ———

const sectionFormModal = ref<InstanceType<typeof Modal> | null>(null)
const sectionDeleteModal = ref<InstanceType<typeof Modal> | null>(null)
const sectionFormRef = ref<InstanceType<typeof SectionForm> | null>(null)
const selectedSection = ref<SectionResource | null>(null)
const isSectionEditing = ref(false)
const isSavingSection = ref(false)
const isDeletingSection = ref(false)
const sectionDeleteReason = ref('')
const sectionDeleteReasonError = ref('')

const sectionFormModalButtons = computed(() => [
  { text: 'Cancelar', variant: 'terciario' as const, dismiss: true, action: () => {} },
  {
    text: isSectionEditing.value ? 'Guardar cambios' : 'Agregar',
    variant: 'primario' as const,
    loading: isSavingSection.value,
    disabled: isSavingSection.value,
    action: () => sectionFormRef.value?.onSubmit(),
  },
])

const sectionDeleteModalButtons = computed(() => [
  { text: 'Cancelar', variant: 'terciario' as const, dismiss: true, action: () => {} },
  {
    text: 'Eliminar',
    variant: 'peligro' as const,
    loading: isDeletingSection.value,
    disabled: isDeletingSection.value,
    action: handleSectionDeleteConfirm,
  },
])

const openCreateSectionModal = () => {
  isSectionEditing.value = false
  selectedSection.value = null
  sectionFormModal.value?.showModal()
}

const openEditSectionModal = (section: SectionResource) => {
  isSectionEditing.value = true
  selectedSection.value = section
  sectionFormModal.value?.showModal()
}

const openDeleteSectionModal = (section: SectionResource) => {
  selectedSection.value = section
  sectionDeleteReason.value = ''
  sectionDeleteReasonError.value = ''
  sectionDeleteModal.value?.showModal()
}

const handleSectionFormSubmit = async (data: { name: string }) => {
  isSavingSection.value = true
  try {
    if (isSectionEditing.value && selectedSection.value) {
      await apiSections.updateSection(selectedSection.value.id, {
        name: data.name,
        section_type_id: props.sectionTypeId,
      })
      toast.success('Sección actualizada correctamente.')
    } else {
      await apiSections.createSection(props.sectionTypeId, { name: data.name })
      toast.success('Sección agregada correctamente.')
      sectionFormRef.value?.reset()
    }
    sectionFormModal.value?.hideModal()
    await fetchSections()
  } catch {
    toast.error('Ocurrió un error al guardar la sección.')
  } finally {
    isSavingSection.value = false
  }
}

const handleSectionDeleteConfirm = async () => {
  if (!selectedSection.value) return
  if (!sectionDeleteReason.value.trim()) {
    sectionDeleteReasonError.value = 'El motivo de eliminación es requerido.'
    return
  }
  sectionDeleteReasonError.value = ''
  isDeletingSection.value = true
  try {
    await apiSections.deleteSection(selectedSection.value.id, sectionDeleteReason.value.trim())
    toast.success('Sección eliminada correctamente.')
    sectionDeleteModal.value?.hideModal()
    await fetchSections()
  } catch {
    toast.error('Ocurrió un error al eliminar la sección.')
  } finally {
    isDeletingSection.value = false
  }
}

// ——— Activity CRUD ———

const activityFormModal = ref<InstanceType<typeof Modal> | null>(null)
const activityDeleteModal = ref<InstanceType<typeof Modal> | null>(null)
const activityFormRef = ref<InstanceType<typeof ActivityForm> | null>(null)
const selectedActivity = ref<ActivityResource | null>(null)
const targetSectionId = ref<number | null>(null)
const isActivityEditing = ref(false)
const isSavingActivity = ref(false)
const isDeletingActivity = ref(false)
const activityDeleteReason = ref('')
const activityDeleteReasonError = ref('')

const activityFormModalButtons = computed(() => [
  { text: 'Cancelar', variant: 'terciario' as const, dismiss: true, action: () => {} },
  {
    text: isActivityEditing.value ? 'Guardar cambios' : 'Agregar',
    variant: 'primario' as const,
    loading: isSavingActivity.value,
    disabled: isSavingActivity.value,
    action: () => activityFormRef.value?.onSubmit(),
  },
])

const activityDeleteModalButtons = computed(() => [
  { text: 'Cancelar', variant: 'terciario' as const, dismiss: true, action: () => {} },
  {
    text: 'Eliminar',
    variant: 'peligro' as const,
    loading: isDeletingActivity.value,
    disabled: isDeletingActivity.value,
    action: handleActivityDeleteConfirm,
  },
])

const openCreateActivityModal = (sectionId: number) => {
  isActivityEditing.value = false
  selectedActivity.value = null
  targetSectionId.value = sectionId
  activityFormModal.value?.showModal()
}

const openEditActivityModal = (activity: ActivityResource, sectionId: number) => {
  isActivityEditing.value = true
  selectedActivity.value = activity
  targetSectionId.value = sectionId
  activityFormModal.value?.showModal()
}

const openDeleteActivityModal = (activity: ActivityResource) => {
  selectedActivity.value = activity
  activityDeleteReason.value = ''
  activityDeleteReasonError.value = ''
  activityDeleteModal.value?.showModal()
}

const handleActivityFormSubmit = async (formData: FormData) => {
  if (!targetSectionId.value) return
  isSavingActivity.value = true
  try {
    if (isActivityEditing.value && selectedActivity.value) {
      await apiSections.updateActivity(selectedActivity.value.id, targetSectionId.value, formData)
      toast.success('Actividad actualizada correctamente.')
    } else {
      await apiSections.createActivity(targetSectionId.value, formData)
      toast.success('Actividad agregada correctamente.')
    }
    activityFormRef.value?.reset()
    activityFormModal.value?.hideModal()
    await fetchSections()
  } catch {
    toast.error('Ocurrió un error al guardar la actividad.')
  } finally {
    isSavingActivity.value = false
  }
}

const handleActivityDeleteConfirm = async () => {
  if (!selectedActivity.value) return
  if (!activityDeleteReason.value.trim()) {
    activityDeleteReasonError.value = 'El motivo de eliminación es requerido.'
    return
  }
  activityDeleteReasonError.value = ''
  isDeletingActivity.value = true
  try {
    await apiSections.deleteActivity(selectedActivity.value.id, activityDeleteReason.value.trim())
    toast.success('Actividad eliminada correctamente.')
    activityDeleteModal.value?.hideModal()
    await fetchSections()
  } catch {
    toast.error('Ocurrió un error al eliminar la actividad.')
  } finally {
    isDeletingActivity.value = false
  }
}
</script>

<style scoped>
.section-actions {
  display: flex;
  gap: 0.4rem;
  justify-content: flex-end;
}

.section-action {
  align-items: center;
  background: #f5f8ff;
  border: 1px solid #d8e3ff;
  border-radius: 999px;
  color: #2563eb;
  display: inline-flex;
  height: 34px;
  justify-content: center;
  padding: 0;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  width: 34px;
}

.section-action:hover,
.section-action:focus-visible {
  background: #e8f0ff;
  border-color: #b8cbff;
  color: #1d4ed8;
}

.section-action--danger {
  background: #fff7f7;
  border-color: #ffd6d6;
  color: #dc2626;
}

.section-action--danger:hover,
.section-action--danger:focus-visible {
  background: #fff0f0;
  border-color: #ffb8b8;
  color: #b91c1c;
}

.section-action i {
  font-size: 0.95rem;
  line-height: 1;
}
</style>
