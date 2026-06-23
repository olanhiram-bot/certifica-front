<template>
  <div class="min-vh-100 d-flex flex-column bg-body-tertiary">
    <NavBarsessionVue :role="currentRole" />
    <div class="d-flex flex-grow-1">
      <SidebarMenuVue :role="currentRole" class="d-none d-lg-block" />
      <main class="flex-grow-1">
        <div class="container-fluid py-4">
          <router-view />
        </div>
      </main>
    </div>
    <FooterMVue />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import NavBarsessionVue from '@/components/NavBarsession.vue'
import SidebarMenuVue from '@/components/SidebarMenu.vue'
import FooterMVue from '@/components/FooterM.vue'
import { useAuthStore } from '@/stores/auth'
import { AuthMethod } from '@/enums/AuthMethod'

const props = defineProps<{ role: 'ADMIN' | 'PROVIDER' }>()
const authStore = useAuthStore()

const currentRole = computed(() => {
  if (authStore.user?.auth_method_id === AuthMethod.PROVEEDOR) return 'PROVIDER'
  if (authStore.user?.auth_method_id === AuthMethod.ADMIN) return 'ADMIN'
  return props.role ?? 'ADMIN'
})
</script>

