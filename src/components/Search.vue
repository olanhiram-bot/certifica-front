<template>
  <div class="caja_busqueda" :style="size === 'sm' ? { maxWidth: '250px' } : {}">
    <label v-if="label" :for="inputId" class="form-label">{{ label }}</label>
    <form @submit.prevent="onSubmit">
      <div class="input-group">
        <Field
          v-model="searchValue"
          class="form-control"
          :class="{ 'form-control-sm': size === 'sm' }"
          type="search"
          :name="inputId"
          :id="inputId"
          :placeholder="placeholder"
          @input="onInput"
        />
        <button type="submit" class="input-group-text" :class="{ 'btn-sm': size === 'sm' }" :for="inputId" title="buscar">
          <span class="material-icons">search</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Field } from 'vee-validate'
import type { SearchProps } from '@/interfaces/SearchProps'

const props = withDefaults(defineProps<SearchProps>(), {
  label: '',
  placeholder: 'Buscar',
  inputId: 'search',
  debounce: 700,
  size: 'md',
  lastValue: ''
})

const emit = defineEmits<{
  (e: 'on-search', value: string): void
}>()

const searchValue = ref(props.lastValue)
let debounceTimeout: ReturnType<typeof setTimeout> | null = null

watch(() => props.lastValue, (newVal) => {
  searchValue.value = newVal
})

const onInput = () => {
  if (props.lazy) return

  if (debounceTimeout) clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    emit('on-search', searchValue.value)
  }, props.debounce)
}

const onSubmit = () => {
  if (debounceTimeout) clearTimeout(debounceTimeout)
  emit('on-search', searchValue.value)
}
</script>


