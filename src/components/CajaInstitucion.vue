<template>
  <div v-if="instituciones && instituciones.length > 0" class="mt-3">
    <div class="row row-cols-1 row-cols-md-2 g-3">
      <div v-for="(institucion, index) in instituciones" :key="index" class="col">
        <div class="caja_datos d-flex align-items-center h-100">
          <div class="caja_boleto me-3 flex-shrink-0">
            <img :src="storageUrl + institucion.image_url" :alt="institucion.name?.slice(0, 2) || 'IN'" style="width:80px; height:80px; object-fit:contain" />
          </div>

          <div class="flex-grow-1">
            <div class="caja_boleto">
              <span>Nombre de la institución</span>
              <h4 class="text-break">{{ institucion.name }}</h4>
            </div>

            <div class="caja_boleto mt-2">
              <div class="institucion-descripcion small" v-html="institucion.description"></div>
            </div>

            <div class="renglon_boleto">
              <a v-if="institucion.link" :href="institucion.link" target="_blank" rel="noopener noreferrer"
                class="small text-break">
                Visitar sitio
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LandingContent } from '@/interfaces/LandingContent';

interface CajaInstitucionProps {
  titulo?: string
  instituciones?: LandingContent[]
}

defineProps<CajaInstitucionProps>()

const storageUrl = import.meta.env.VITE_STORAGE_URL as string
</script>

<style scoped>
/* Estilos para contenido dinámico generado por v-html */
.institucion-descripcion :deep(span) {
  font-weight: 600;
  color: #333;
  display: block;
  margin-top: 0.5rem;
}

.institucion-descripcion :deep(span:first-child) {
  margin-top: 0;
}

.institucion-descripcion :deep(p) {
  margin-bottom: 0.25rem;
  color: #555;
  word-wrap: break-word;
  overflow-wrap: break-word;
}
</style>
