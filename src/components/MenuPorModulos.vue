<template>


  <li v-for="section in sortedModules" :key="section.id" class="menu-item-module">
    <a :href="'#modulo_' + section.id" data-bs-toggle="collapse" aria-expanded="false"
      class="d-flex align-items-center justify-content-between py-2 px-3 rounded text-decoration-none">
      <span class="text-dark">{{ section.name }}</span>
    </a>
    <ul v-if="section.activities?.length" class="collapse list-unstyled ps-3 mt-1" :id="'modulo_' + section.id">
      <li v-for="activity in section.activities" :key="activity.id" class="mb-1">
        <router-link
          :to="{ name: 'usuario-modulo-curso', params: { id: activity.id }, query: { sectionId: section.id } }"
          class="d-block py-1 px-2 rounded text-decoration-none text-secondary" active-class="bg-light text-dark">
          {{ activity.name }}
        </router-link>
      </li>
    </ul>
  </li>
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

<style scoped>
.menu-item-module a[data-bs-toggle="collapse"] {
  cursor: pointer;
}

.menu-item-module a:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
