<template>
  <nav class="navbar navbar-expand-lg bg-white border-bottom">
    <div class="container-fluid">
      <router-link class="navbar-brand fw-semibold d-flex align-items-center gap-2" :to="homePath">
        <span class="d-inline-flex align-items-center justify-content-center rounded bg-primary text-white" style="width: 34px; height: 34px;">
          <i class="bi bi-award"></i>
        </span>
        Certifica
      </router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#sessionNav"
        aria-controls="sessionNav" aria-expanded="false" aria-label="Abrir menu">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div id="sessionNav" class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" :to="homePath">Inicio</router-link>
          </li>
        </ul>

        <div class="dropdown">
          <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
            <span class="me-2">{{ userNameDisplay }}</span>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><button class="dropdown-item" type="button" @click="logout">Cerrar sesion</button></li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const props = defineProps<{ role: 'ADMIN' | 'PROVIDER' }>()

const router = useRouter()
const authStore = useAuthStore()

const homePath = computed(() => (props.role === 'ADMIN' ? '/admin' : '/usuario'))

const userNameDisplay = computed(() => {
  const user = authStore.user
  const raw = user?.user as Record<string, unknown> | undefined
  const providerInfo = raw?.provider_info as Record<string, unknown> | undefined
  return String(providerInfo?.nombre_completo ?? raw?.name ?? raw?.email ?? user?.username ?? 'Usuario')
})

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

