<template>
  <div class="seccion_titulo">
    <div class="icono_seccion">
      <svg version="1.1" id="Corchete" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px" y="0px" viewBox="0 0 32.7 32" xml:space="preserve">
        <path
          d="M0,28.1C0,30.3,1.7,32,3.9,32h20.5c2.1,0,3.9-1.5,4.4-3.5l1.3-5.8c0.7-2.9,2-5.5,2.4-6.3l0.3-0.5l-0.3-0.5c-0.4-0.7-1.7-3.3-2.4-6.3l-1.2-5.5C28.3,1.5,26.4,0,24.1,0H3.9C1.7,0,0,1.7,0,3.9V28.1z">
        </path>
      </svg>
    </div>
    <h3 v-if="data?.titulo">{{ data.titulo }}</h3>
    <p v-if="data?.descripcion">{{ data.descripcion }}</p>
  </div>
</template>

<script setup lang="ts">
import type { SeccionTextoData } from '@/interfaces/SeccionTextoData'

defineProps<{
  data?: SeccionTextoData
}>()
</script>
