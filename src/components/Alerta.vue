<template>
  <div class="alert d-flex align-items-start gap-3" :class="alertClass" role="alert">
    <i v-if="mostrarIcono" :class="iconClass" class="fs-4 flex-shrink-0"></i>
    <div class="flex-grow-1">
      <h5 v-if="data?.titulo" class="alert-heading mb-1">{{ data.titulo }}</h5>
      <p v-if="data?.descripcion" class="mb-0">{{ data.descripcion }}</p>
      <slot name="contenido"></slot>
      <button v-if="data?.textoBoton" class="btn btn-sm btn-primary mt-3" type="button" @click="emit('accion')">
        {{ data.textoBoton }}
      </button>
    </div>
    <button v-if="mostrarCerrar" type="button" class="btn-close" aria-label="Cerrar" @click="emit('cerrar')"></button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AlertaProps } from '@/interfaces/AlertaProps'

const props = withDefaults(defineProps<AlertaProps>(), {
  tipo: 'info',
  icon: 'info',
  mostrarCerrar: true,
  mostrarIcono: true,
})

const emit = defineEmits<{ accion: []; cerrar: [] }>()

const alertClass = computed(() => {
  switch (props.tipo) {
    case 'success':
      return 'alert-success'
    case 'error':
      return 'alert-danger'
    case 'warning':
      return 'alert-warning'
    case 'primario':
      return 'alert-primary'
    default:
      return 'alert-info'
  }
})

const iconClass = computed(() => {
  switch (props.tipo) {
    case 'success':
      return 'bi bi-check-circle'
    case 'error':
      return 'bi bi-x-circle'
    case 'warning':
      return 'bi bi-exclamation-triangle'
    default:
      return 'bi bi-info-circle'
  }
})
</script>

