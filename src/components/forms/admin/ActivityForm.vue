<template>
  <form id="activityForm" class="w-100" novalidate @submit.prevent="onSubmit">
    <!-- Nombre -->
    <div class="mb-3">
      <label for="activity_name" class="form-label">Nombre <span class="text-danger">*</span></label>
      <input
        id="activity_name"
        v-model="name"
        v-bind="nameAttrs"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': errors.name }"
        placeholder="Nombre de la actividad"
      />
      <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
    </div>

    <!-- Descripción -->
    <div class="mb-3">
      <label for="activity_description" class="form-label">Descripción</label>
      <textarea
        id="activity_description"
        v-model="description"
        v-bind="descriptionAttrs"
        class="form-control"
        :class="{ 'is-invalid': errors.description }"
        rows="3"
        placeholder="Descripción de la actividad"
      ></textarea>
      <div v-if="errors.description" class="invalid-feedback">{{ errors.description }}</div>
    </div>

    <!-- Imagen de portada (logo_file) -->
    <div class="mb-3">
      <label for="activity_logo" class="form-label">Imagen de portada</label>
      <div class="input-group">
        <input
          id="activity_logo"
          ref="logoInputRef"
          type="file"
          class="form-control"
          :class="{ 'is-invalid': logoError, 'tiene_archivo': !!selectedLogo }"
          accept=".jpg,.jpeg,.png"
          @change="handleLogoChange"
        />
        <label class="input-group-text" for="activity_logo" title="Subir imagen">
          <span class="material-icons">image</span>
        </label>
        <div v-if="logoError" class="invalid-feedback">{{ logoError }}</div>
      </div>
      <div v-if="isEditing && currentLogoUrl && !selectedLogo" class="form-text text-muted">
        <small>
          <span class="material-icons" style="font-size:12px; vertical-align:middle;">attach_file</span>
          {{ truncateFileName(getFileName(currentLogoUrl)) }}
          <a href="#" class="text-danger ms-1" title="Eliminar imagen" @click.prevent="removeCurrentLogo">✕</a>
        </small>
      </div>
    </div>

    <!-- Material de apoyo (content_file) -->
    <div class="mb-3">
      <label for="activity_content" class="form-label">
        Material de apoyo (PDF)
        <span v-if="requireContentFile" class="text-danger">*</span>
      </label>
      <div class="input-group">
        <input
          id="activity_content"
          ref="contentInputRef"
          type="file"
          class="form-control"
          :class="{ 'is-invalid': contentFileError, 'tiene_archivo': !!selectedContentFile }"
          accept=".pdf"
          @change="handleContentFileChange"
        />
        <label class="input-group-text" for="activity_content" title="Subir PDF">
          <span class="material-icons">picture_as_pdf</span>
        </label>
        <div v-if="contentFileError" class="invalid-feedback">{{ contentFileError }}</div>
      </div>
      <div v-if="isEditing && currentContentFileUrl && !selectedContentFile" class="form-text text-muted">
        <small>
          <span class="material-icons" style="font-size:12px; vertical-align:middle;">attach_file</span>
          {{ truncateFileName(getFileName(currentContentFileUrl)) }}
          <a href="#" class="text-danger ms-1" title="Eliminar archivo" @click.prevent="removeCurrentContentFile">✕</a>
        </small>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import { ref, watch } from 'vue'
import type { ActivityResource } from '@/interfaces/Section'

const props = defineProps<{
  initialData?: ActivityResource | null
  isEditing?: boolean
  requireContentFile?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', formData: FormData): void
}>()

const { defineField, handleSubmit, errors, setValues, resetForm } = useForm({
  validationSchema: {
    name: 'required|max:255',
    description: '',
  },
})

const [name, nameAttrs] = defineField('name')
const [description, descriptionAttrs] = defineField('description')

const logoInputRef = ref<HTMLInputElement | null>(null)
const contentInputRef = ref<HTMLInputElement | null>(null)

const selectedLogo = ref<File | null>(null)
const logoError = ref<string | null>(null)
const currentLogoUrl = ref<string | null>(null)

const selectedContentFile = ref<File | null>(null)
const contentFileError = ref<string | null>(null)
const currentContentFileUrl = ref<string | null>(null)

const deleteLogoFile = ref(false)
const deleteContentFile = ref(false)

const getFileName = (url: string | null): string => {
  if (!url) return ''
  return url.split('/').pop()?.split('?')[0] ?? ''
}

const truncateFileName = (name: string, maxLen = 22): string => {
  if (!name || name.length <= maxLen) return name
  const dotIndex = name.lastIndexOf('.')
  const ext = dotIndex !== -1 ? name.substring(dotIndex) : ''
  const base = dotIndex !== -1 ? name.substring(0, dotIndex) : name
  return base.substring(0, maxLen - ext.length - 3) + '...' + ext
}

const removeCurrentLogo = () => {
  currentLogoUrl.value = null
  deleteLogoFile.value = true
}

const removeCurrentContentFile = () => {
  currentContentFileUrl.value = null
  deleteContentFile.value = true
}

const handleLogoChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] ?? null
  logoError.value = null

  if (file) {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg']
    if (!allowed.includes(file.type)) {
      logoError.value = 'Solo se permiten archivos JPG o PNG.'
      selectedLogo.value = null
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      logoError.value = 'El archivo no debe superar los 10 MB.'
      selectedLogo.value = null
      return
    }
  }

  selectedLogo.value = file
}

const handleContentFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] ?? null
  contentFileError.value = null

  if (file) {
    if (file.type !== 'application/pdf') {
      contentFileError.value = 'Solo se permiten archivos PDF.'
      selectedContentFile.value = null
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      contentFileError.value = 'El archivo no debe superar los 10 MB.'
      selectedContentFile.value = null
      return
    }
  }

  selectedContentFile.value = file
}

watch(
  () => props.initialData,
  (data) => {
    if (data) {
      setValues({
        name: data.name ?? '',
        description: data.description ?? '',
      })
      currentLogoUrl.value = data.image_url ?? null
      currentContentFileUrl.value = data.file_url_content ?? null
    } else {
      setValues({ name: '', description: '' })
      currentLogoUrl.value = null
      currentContentFileUrl.value = null
    }
    selectedLogo.value = null
    selectedContentFile.value = null
    logoError.value = null
    contentFileError.value = null
    deleteLogoFile.value = false
    deleteContentFile.value = false
  },
  { immediate: true },
)

const onSubmit = handleSubmit((values) => {
  if (logoError.value || contentFileError.value) return

  if (props.requireContentFile && !selectedContentFile.value && !currentContentFileUrl.value) {
    contentFileError.value = 'El material de apoyo (PDF) es obligatorio para actividades de tipo Módulo.'
    return
  }

  const fd = new FormData()
  fd.append('name', values.name)
  if (values.description) fd.append('description', values.description)
  if (selectedLogo.value) fd.append('logo_file', selectedLogo.value)
  if (selectedContentFile.value) fd.append('content_file', selectedContentFile.value)
  if (props.isEditing && deleteLogoFile.value && !selectedLogo.value) fd.append('activity_logo_delete', '1')
  if (props.isEditing && deleteContentFile.value && !selectedContentFile.value) fd.append('activity_content_delete', '1')

  emit('submit', fd)
})

const reset = () => {
  resetForm()
  selectedLogo.value = null
  selectedContentFile.value = null
  logoError.value = null
  contentFileError.value = null
  currentLogoUrl.value = null
  currentContentFileUrl.value = null
  deleteLogoFile.value = false
  deleteContentFile.value = false
  if (logoInputRef.value) logoInputRef.value.value = ''
  if (contentInputRef.value) contentInputRef.value.value = ''
}

defineExpose({ onSubmit, reset })
</script>
