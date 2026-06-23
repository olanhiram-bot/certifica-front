<template>
  <section class="card border-0 shadow-sm mb-4">
    <div class="card-body p-4">
      <div class="row align-items-center g-4">
        <div :class="data.imagen ? 'col-lg-7' : 'col-12'">
          <h1 class="h3 mb-2">{{ data.titulo }}</h1>
          <p class="text-muted mb-0">{{ data.descripcion }}</p>
          <button v-if="data.textoBoton" class="btn btn-primary mt-3" type="button" @click="$emit('accion')">
            {{ data.textoBoton }}
          </button>
        </div>
        <div v-if="data.imagen" class="col-lg-5">
          <img :src="data.imagen" :alt="data.titulo" class="img-fluid rounded" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { CajaTituloData } from '@/interfaces/CajaTituloData'

defineProps<{ data: CajaTituloData }>()
defineEmits<{ accion: [] }>()
</script>

