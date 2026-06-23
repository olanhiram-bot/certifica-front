<template>
  <section class="card border-0 shadow-sm mb-4 overflow-hidden">
    <div class="row g-0 align-items-center">
      <div class="col-lg-7">
        <div class="card-body p-4">
          <h1 class="h3 mb-2">{{ data.titulo }}</h1>
          <p class="text-muted mb-0">{{ data.descripcion }}</p>
          <button v-if="data.textoBoton" class="btn btn-primary mt-3" type="button" @click="$emit('accion')">
            {{ data.textoBoton }}
          </button>
        </div>
      </div>
      <div v-if="data.imagen" class="col-lg-5">
        <img :src="data.imagen" :alt="data.titulo" class="w-100 h-100 object-fit-cover" style="min-height: 220px;" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { CajaTituloData } from '@/interfaces/CajaTituloData'

defineProps<{ data: CajaTituloData }>()
defineEmits<{ accion: [] }>()
</script>

