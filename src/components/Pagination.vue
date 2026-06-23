<template>
  <div class="row mt-3">
    <div class="col-md-2">
      <p class="text-muted">
        <small>{{ to ? to : perPageOp }} de {{ total }}</small>
      </p>
    </div>
    <div class="col-md-10">
      <div class="seccion_paginacion justify-content-end">
        <div class="paginacion_paginas">
          <button v-if="currentPage > 1" @click="prev" :disabled="currentPage <= 1" class="boton_secundario">&lt;</button>
          <template v-for="item in links" :key="item.label">
            <a
              v-if="!isNaN(parseInt(item.label))"
              @click="onPage(parseInt(item.label))"
              :class="{ boton_primario: item.active }"
              style="cursor:pointer"
            >
              {{ item.label }}
            </a>
          </template>

          <template v-for="item in links" :key="'next-' + item.label">
            <button 
              v-if="item.label.toLowerCase().includes('next') && item.url"
              @click="onPage(currentPage + 1)" 
              :disabled="!item.url"
              class="boton_secundario"
            >
              &gt;
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { LinkPaginate } from '@/interfaces/LinkPaginate'

const props = defineProps<{
  links: LinkPaginate[]
  currentPage: number
  perPage: number
  total: number
  to?: number
}>()

const emits = defineEmits(['on-page', 'update:currentPage'])

const perPageOp = computed(() => {
  if (props.perPage < props.total) {
    return props.perPage
  }
  return props.total
})

const prev = () => {
  // Validar que la pagina actual sea mayor a 1
  if (props.currentPage > 1) {
    onPage(props.currentPage - 1)
  }
}

const next = () => {
  // Validar que la página actual sea menor al total de páginas
  if (props.currentPage < props.links.length - 2) {
    onPage(props.currentPage + 1)
  }
}

const onPage = (page: number) => {
  emits('update:currentPage', page)
  emits('on-page', page)
}
</script>
