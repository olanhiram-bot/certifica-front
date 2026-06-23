<template>
  <aside class="border-end bg-light flex-shrink-0" style="width: 260px; min-height: calc(100vh - 58px);">
    <div class="p-3">
      <div class="text-uppercase text-muted small fw-semibold mb-2">{{ roleLabel }}</div>
      <nav class="nav nav-pills flex-column gap-1">
        <router-link v-for="item in menuItems" :key="item.to" :to="item.to" class="nav-link d-flex align-items-center gap-2"
          active-class="active">
          <i :class="item.icon"></i>
          <span>{{ item.label }}</span>
        </router-link>
      </nav>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ role: 'ADMIN' | 'PROVIDER' }>()

const roleLabel = computed(() => (props.role === 'ADMIN' ? 'Administracion' : 'Usuario'))

const menuItems = computed(() => {
  if (props.role === 'ADMIN') {
    return [
      { label: 'Panel', to: '/admin', icon: 'bi bi-speedometer2' },
      { label: 'Contenido', to: '/admin/content/landing', icon: 'bi bi-layout-text-window' },
      { label: 'Modulos', to: '/admin/content/modulos', icon: 'bi bi-journal-text' },
      { label: 'Documentos', to: '/admin/content/protocolos', icon: 'bi bi-file-earmark-text' },
    ]
  }

  return [
    { label: 'Inicio', to: '/usuario', icon: 'bi bi-house' },
    { label: 'Dashboard', to: '/usuario/dashboard', icon: 'bi bi-bar-chart' },
    { label: 'Modulos', to: '/usuario/programa-modulos', icon: 'bi bi-journal-bookmark' },
    { label: 'Documentos', to: '/usuario/protocolos', icon: 'bi bi-folder2-open' },
  ]
})
</script>

