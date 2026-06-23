<template>
  <form id="sectionForm" class="w-100" novalidate @submit.prevent="onSubmit">
    <div class="mb-3">
      <label for="section_name" class="form-label">Nombre <span class="text-danger">*</span></label>
      <input
        id="section_name"
        v-model="name"
        v-bind="nameAttrs"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': errors.name }"
        placeholder="Nombre de la sección"
      />
      <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import { watch } from 'vue'

const props = defineProps<{
  initialName?: string
}>()

const emit = defineEmits<{
  (e: 'submit', data: { name: string }): void
}>()

const { defineField, handleSubmit, errors, setValues, resetForm } = useForm({
  validationSchema: {
    name: 'required|max:255',
  },
})

const [name, nameAttrs] = defineField('name')

watch(
  () => props.initialName,
  (val) => {
    setValues({ name: val ?? '' })
  },
  { immediate: true },
)

const onSubmit = handleSubmit((values) => {
  emit('submit', { name: values.name })
})

defineExpose({ onSubmit, reset: () => resetForm() })
</script>
