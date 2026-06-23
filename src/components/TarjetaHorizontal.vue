<template>
  <section class="card border-0 shadow-sm mb-4">
    <div class="row g-0 align-items-stretch">
      <div v-if="data?.imagen" class="col-lg-4">
        <img :src="data.imagen" :alt="data.alt || data.titulo || 'Imagen'" class="h-100 w-100 object-fit-cover rounded-start" />
      </div>
      <div :class="data?.imagen ? 'col-lg-8' : 'col-12'">
        <div class="card-body p-4">
          <h2 v-if="data?.titulo" class="h4">{{ data.titulo }}</h2>
          <div v-if="paragraphs.length" class="text-muted">
            <p v-for="(paragraph, index) in paragraphs" :key="index">{{ paragraph }}</p>
          </div>
          <ul v-if="data?.vinetas?.length" class="text-muted">
            <li v-for="(item, index) in data.vinetas" :key="index">{{ item }}</li>
          </ul>
          <ul v-if="data?.vinetas2?.length" class="text-muted">
            <li v-for="(item, index) in data.vinetas2" :key="index">{{ item }}</li>
          </ul>
          <button v-if="data?.boton && data?.mostrar_boton !== false" class="btn btn-primary" type="button">
            {{ data.boton }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TarjetaData } from '@/interfaces/TarjetaData'

const props = defineProps<{ data?: TarjetaData }>()

const paragraphs = computed(() =>
  props.data?.descripcion
    ? props.data.descripcion.split('\n').map((paragraph) => paragraph.trim()).filter(Boolean)
    : [],
)
</script>

