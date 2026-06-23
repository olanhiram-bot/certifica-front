<template>
  <form id="contentForm" novalidate @submit.prevent="onSubmit">
    <!-- Tipo de contenido -->
    <div class="mb-3">
      <label for="content_type" class="form-label">Tipo <span class="text-danger">*</span></label>
      <select
        id="content_type"
        v-model="landingContentTypeId"
        v-bind="landingContentTypeIdAttrs"
        class="form-select"
        :class="{ 'is-invalid': errors.landing_content_type_id }"
      >
        <option value="" disabled>Selecciona un tipo...</option>
        <option v-for="opt in typeOptions" :key="opt.id" :value="opt.id">{{ opt.name }}</option>
      </select>
      <div v-if="errors.landing_content_type_id" class="invalid-feedback">{{ errors.landing_content_type_id }}</div>
    </div>

    <!-- Nombre -->
    <div class="mb-3">
      <label for="content_name" class="form-label">Nombre</label>
      <input
        id="content_name"
        v-model="name"
        v-bind="nameAttrs"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': errors.name }"
        placeholder="Nombre del contenido"
      />
      <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
    </div>

    <!-- Descripción -->
    <div class="mb-3">
      <label for="content_description" class="form-label">Descripción</label>
      <textarea
        id="content_description"
        v-model="description"
        v-bind="descriptionAttrs"
        class="form-control"
        :class="{ 'is-invalid': errors.description }"
        rows="3"
        placeholder="Descripción del contenido"
      ></textarea>
      <div v-if="errors.description" class="invalid-feedback">{{ errors.description }}</div>
    </div>

    <!-- Posición -->
    <div class="mb-3">
      <label for="content_position" class="form-label">Posición</label>
      <input
        id="content_position"
        v-model="position"
        v-bind="positionAttrs"
        type="number"
        min="1"
        class="form-control"
        :class="{ 'is-invalid': errors.position }"
        placeholder="Ej. 1"
      />
      <div v-if="errors.position" class="invalid-feedback">{{ errors.position }}</div>
    </div>

    <!-- Archivo -->
    <div class="mb-3">
      <label for="file_url" class="form-label">Archivo (imagen)</label>
      <div class="input-group">
        <input
          id="file_url"
          ref="fileInputRef"
          type="file"
          class="form-control"
          :class="{ 'is-invalid': fileError, 'tiene_archivo': !!selectedFile }"
          accept=".jpg,.jpeg,.png"
          @change="handleFileChange"
        />
        <label class="input-group-text" for="file_url" title="Subir archivo">
          <span class="material-icons">cloud_upload</span>
        </label>
        <div v-if="fileError" class="invalid-feedback">{{ fileError }}</div>
      </div>
      <div v-if="isEditing && currentFileUrl && !selectedFile" class="form-text">
        <span class="material-icons" style="font-size:14px; vertical-align: middle;">attach_file</span>
        Archivo actual:
        <button type="button" class="btn btn-link p-0 align-baseline" style="font-size: inherit;" @click="$emit('preview', currentFileUrl)">
          <span class="material-icons" style="font-size:14px; vertical-align: middle;">visibility</span>
          Ver archivo
        </button>.
        Selecciona un nuevo archivo para reemplazarlo.
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import { ref, watch } from 'vue'
import type { LandingContent } from '@/interfaces/LandingContent'
import type { LandingContentType } from '@/api/landingContentType'

const props = defineProps<{
  initialData?: LandingContent | null
  isEditing?: boolean
  typeOptions?: LandingContentType[]
}>()

const emit = defineEmits<{
  (e: 'submit', formData: FormData): void
  (e: 'preview', url: string): void
}>()

const { defineField, handleSubmit, errors, resetForm, setValues } = useForm({
  validationSchema: {
    landing_content_type_id: 'required|numeric',
    name: 'max:255',
    description: '',
    position: 'integer|min_value:1',
  },
})

const [landingContentTypeId, landingContentTypeIdAttrs] = defineField('landing_content_type_id')
const [name, nameAttrs] = defineField('name')
const [description, descriptionAttrs] = defineField('description')
const [position, positionAttrs] = defineField('position')

const fileInputRef = ref<HTMLInputElement | null>(null)

const selectedFile = ref<File | null>(null)
const fileError = ref<string | null>(null)
const currentFileUrl = ref<string | null>(null)

const storageUrl = (path: string) =>
  import.meta.env.VITE_STORAGE_URL ? `${import.meta.env.VITE_STORAGE_URL}/storage/${path}` : path

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] ?? null
  fileError.value = null

  if (file) {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg']
    if (!allowed.includes(file.type)) {
      fileError.value = 'Solo se permiten archivos JPG o PNG.'
      selectedFile.value = null
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      fileError.value = 'El archivo no debe superar los 10 MB.'
      selectedFile.value = null
      return
    }
  }

  selectedFile.value = file
}

watch(
  () => props.initialData,
  (data) => {
    if (data) {
      setValues({
        landing_content_type_id: data.landing_content_type_id,
        name: data.name ?? '',
        description: data.description ?? '',
        position: data.position ?? undefined,
      })
      currentFileUrl.value = data.file_url
    } else {
      const defaultType = props.typeOptions?.[0]?.id ?? ''
      setValues({
        landing_content_type_id: defaultType || undefined,
        name: '',
        description: '',
        position: undefined,
      })
      currentFileUrl.value = null
    }
    selectedFile.value = null
    fileError.value = null
  },
  { immediate: true },
)

const onSubmit = handleSubmit((values) => {
  if (fileError.value) return

  const fd = new FormData()
  fd.append('landing_content_type_id', String(values.landing_content_type_id))
  if (values.name) fd.append('name', values.name)
  if (values.description) fd.append('description', values.description)
  if (values.position != null && values.position !== '') fd.append('position', String(values.position))
  if (selectedFile.value) fd.append('file_url', selectedFile.value)

  emit('submit', fd)
})

const reset = () => {
  resetForm()
  selectedFile.value = null
  fileError.value = null
  currentFileUrl.value = null
  if (fileInputRef.value) fileInputRef.value.value = ''
}

defineExpose({ onSubmit, reset })
</script>
