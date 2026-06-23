<template>
  <div class="col-5">
    <label v-if="label" :for="selectId" class="form-label">{{ label }}</label>
    <select :id="selectId" class="form-select" :aria-label="ariaLabel" v-model="selectedValue" @change="onChange">
      <option value="">{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import type { FilterDropdownProps } from '@/interfaces/FilterDropdownProps';
import { ref, watch } from 'vue';

const props = withDefaults(defineProps<FilterDropdownProps>(), {
  label: '',
  placeholder: 'Todo',
  selectId: 'selector',
  ariaLabel: 'Todo',
  modelValue: ''
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'on-change', value: string | number): void
}>()

const selectedValue = ref<string | number>(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  selectedValue.value = newVal
})

const onChange = () => {
  emit('update:modelValue', selectedValue.value)
  emit('on-change', selectedValue.value)
}
</script>
