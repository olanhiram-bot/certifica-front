<template>
  <div class="card border-0 shadow-sm overflow-hidden">
    <div v-if="loading" class="d-flex align-items-center justify-content-center py-5">
      <span class="spinner-border text-primary" role="status" aria-label="Cargando"></span>
    </div>

    <div v-else-if="sortedData.length" id="landingCarousel" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-indicators" v-if="sortedData.length > 1">
        <button v-for="(_, index) in sortedData" :key="index" type="button" data-bs-target="#landingCarousel"
          :data-bs-slide-to="index" :class="{ active: index === 0 }" :aria-label="`Diapositiva ${index + 1}`"></button>
      </div>

      <div class="carousel-inner">
        <div v-for="(image, index) in sortedData" :key="image.id ?? index" class="carousel-item"
          :class="{ active: index === 0 }">
          <img :src="getImageUrl(image)" :alt="image.name ?? 'Contenido destacado'" class="d-block w-100 carousel-image" />
        </div>
      </div>

      <button v-if="sortedData.length > 1" class="carousel-control-prev" type="button" data-bs-target="#landingCarousel"
        data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Anterior</span>
      </button>
      <button v-if="sortedData.length > 1" class="carousel-control-next" type="button" data-bs-target="#landingCarousel"
        data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Siguiente</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { LandingContent } from '@/interfaces/LandingContent'

const props = defineProps<{ data?: LandingContent[]; loading?: boolean }>()

const storageUrl = import.meta.env.VITE_STORAGE_URL || ''

const sortedData = computed(() =>
  [...(props.data ?? [])].sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
)

const getImageUrl = (image: LandingContent): string => {
  const raw = image.image_url || image.file_url || ''
  if (!raw) return new URL('@/assets/images/standard/hero.jpg', import.meta.url).href
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw
  if (raw.startsWith('/storage/')) return `${storageUrl}${raw}`
  return `${storageUrl}/storage/${raw.replace(/^\/+/, '')}`
}
</script>

<style scoped>
.carousel-image {
  aspect-ratio: 16 / 6;
  object-fit: cover;
}
</style>

