<template>
  <a href="#" data-bs-toggle="collapse" data-bs-target="#menu_modulos"
    class="d-flex align-items-center justify-content-between py-2 px-3 rounded">
    <span class="d-flex align-items-center">
      <span class="material-icons me-2">school</span>
      Módulos
    </span>
  </a>

  <ul class="collapse list-unstyled ps-4 mt-1" id="menu_modulos">
    <li v-for="section in sortedModules" :key="section.id" class="menu-item-module">
      <router-link
        :to="{ name: 'usuario-programa-modulos', query: { moduleId: section.id } }"
        class="d-block py-2 px-3 rounded text-decoration-none text-dark" active-class="bg-light text-dark">
        {{ section.name }}
      </router-link>
    </li>
    <li class="menu-item-module">
      <router-link
        :to="{ name: 'usuario-evidencias-protocolos' }"
        class="d-block py-2 px-3 rounded text-decoration-none text-dark"
        active-class="bg-light text-dark"
      >
        Evidencias y Evaluación documental
      </router-link>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { getSections } from '@/api/sections'
import type { SectionResource } from '@/interfaces/Section'
import { computed, onMounted, ref } from 'vue'

const modules = ref<SectionResource[]>([])

const sortedModules = computed(() => {
  return [...modules.value].sort((a, b) => {
    const numA = parseInt(a.name.replace(/\D/g, '')) || 0
    const numB = parseInt(b.name.replace(/\D/g, '')) || 0
    return numA - numB
  })
})

onMounted(async () => {
  try {
    const response = await getSections(1)
    modules.value = response.data.data
  } catch (error) {
    console.error('Error fetching modules:', error)
  }
})
</script>


