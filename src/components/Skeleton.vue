<template>
  <div
    v-if="count === 1"
    class="skeleton"
    :class="[`skeleton--${type}`, { 'skeleton--animated': animated }]"
    :style="blockStyle"
    role="status"
    aria-busy="true"
    aria-label="Cargando…"
  />
  <div v-else class="skeleton-group" :style="{ gap: `${gap}px` }">
    <div
      v-for="n in count"
      :key="n"
      class="skeleton"
      :class="[`skeleton--${type}`, { 'skeleton--animated': animated }]"
      :style="blockStyle"
      role="status"
      aria-busy="true"
      aria-label="Cargando…"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type SkeletonType = 'text' | 'circle' | 'rect'

const props = withDefaults(
  defineProps<{
    /** Shape variant */
    type?: SkeletonType
    /** CSS width  (e.g. '100%', '200px') */
    width?: string
    /** CSS height (e.g. '14px', '80px') */
    height?: string
    /** Border-radius override */
    borderRadius?: string
    /** Number of identical blocks to render stacked */
    count?: number
    /** Gap between stacked blocks in px */
    gap?: number
    /** Enable shimmer animation */
    animated?: boolean
  }>(),
  {
    type: 'rect',
    width: '100%',
    height: undefined,
    borderRadius: undefined,
    count: 1,
    gap: 8,
    animated: true,
  }
)

const defaultHeight = computed(() => {
  if (props.height) return props.height
  switch (props.type) {
    case 'text':   return '14px'
    case 'circle': return props.width   // square → circle via border-radius
    default:       return '40px'
  }
})

const defaultRadius = computed(() => {
  if (props.borderRadius) return props.borderRadius
  switch (props.type) {
    case 'text':   return '4px'
    case 'circle': return '50%'
    default:       return '6px'
  }
})

const blockStyle = computed(() => ({
  width: props.width,
  height: defaultHeight.value,
  borderRadius: defaultRadius.value,
}))
</script>

<style scoped>
@keyframes skeleton-shimmer {
  0%   { background-position: -600px 0; }
  100% { background-position: 600px 0; }
}

.skeleton {
  display: block;
  background-color: #e9ecef;
  flex-shrink: 0;
}

.skeleton--animated {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 1200px 100%;
  animation: skeleton-shimmer 1.4s infinite linear;
}

.skeleton-group {
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
