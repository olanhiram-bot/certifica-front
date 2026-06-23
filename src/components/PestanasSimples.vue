<template>
  <div class="caja_navtab">
    <nav>
      <div class="nav nav-tabs" role="tablist">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="nav-link"
          :class="{ active: activeTab === tab.id }"
          :id="`${tab.id}-tab`"
          data-bs-toggle="tab"
          :data-bs-target="`#${tab.id}`"
          type="button"
          role="tab"
          :aria-controls="tab.id"
          :aria-selected="activeTab === tab.id"
          @click="selectTab(tab.id)"
        >
          <span v-if="tab.icon" class="material-symbols-outlined me-1">{{ tab.icon }}</span>
          {{ tab.label }}
          <span
            v-if="tab.count !== undefined"
            class="badge rounded-pill ms-1"
            :class="activeTab === tab.id ? 'bg-warning text-white' : 'bg-warning bg-opacity-25 text-warning'"
          >{{ tab.count }}</span>
        </button>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { PestanasSimplesProps } from '@/interfaces/PestanasSimplesProps'

const props = defineProps<PestanasSimplesProps>()

const emit = defineEmits<{
  (e: 'on-change', tabId: string): void
  (e: 'update:modelValue', tabId: string): void
}>()

const activeTab = ref(props.modelValue || props.tabs?.[0]?.id || '')

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    activeTab.value = newVal
  }
})

const selectTab = (tabId: string) => {
  activeTab.value = tabId
  emit('update:modelValue', tabId)
  emit('on-change', tabId)
}
</script>


