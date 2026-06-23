<template>
  <div v-if="stampStore.percentModuls >= 100" class="caja_tarjeta es_horizontal redonda_horizontal" style="min-height: 90px; padding: 12px; aspect-ratio: auto;">
    <div class="cuerpo_tarjeta text-start">
      <h4 class="titulo_tarjeta">{{ data?.titulo || 'Título' }}</h4>
      <p class="texto_tarjeta">{{ data?.descripcion || 'Descripción' }}</p>
      <button v-if="data?.boton" type="button" class="boton boton_primario" @click="handleClick">{{ data.boton }}</button>
    </div>
    <div class="imagen_tarjeta" v-if="data?.imagen">
      <img decoding="async" :src="data.imagen" :alt="data?.alt || ''" loading="lazy" class="imagen-chica" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TarjetaData } from '@/interfaces/TarjetaData';
import { useStampStore } from '@/stores/stamp';

const stampStore = useStampStore()

defineProps<{
  data?: TarjetaData
}>()

const emit = defineEmits<{
  click: []
}>()

const handleClick = () => {
  emit('click')
}
</script>

<style scoped>
:deep(.cuerpo_tarjeta) {
  align-items: flex-start !important;
  text-align: left !important;
  justify-content: flex-start !important;
  gap: 8px;
  padding: 16px !important;
}

:deep(.caja_tarjeta) {
  height: auto !important;
  min-height: auto !important;
}

.imagen-chica {
  width: auto !important;
  height: auto !important;
}

.imagen_tarjeta {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  aspect-ratio: unset !important;
}
</style>
