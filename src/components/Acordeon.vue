<template>
  <div class="accordion" :id="accordionId">
    <div v-for="(item, index) in data ?? []" :key="item.id ?? index" class="accordion-item">
      <h2 class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
          :data-bs-target="`#collapse-${accordionId}-${index}`" aria-expanded="false"
          :aria-controls="`collapse-${accordionId}-${index}`">
          {{ item.name }}
        </button>
      </h2>
      <div :id="`collapse-${accordionId}-${index}`" class="accordion-collapse collapse" :data-bs-parent="`#${accordionId}`">
        <div class="accordion-body" v-html="item.description"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { LandingContent } from '@/interfaces/LandingContent'

const props = defineProps<{ data?: LandingContent[]; accordionId?: string }>()
const accordionId = computed(() => props.accordionId || 'accordion-default')
</script>

