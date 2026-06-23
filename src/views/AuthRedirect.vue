<template>
  <div class="auth-redirect-wrapper">
    <HeaderVue />
    <div class="auth-redirect-container">
      <div class="auth-redirect-content">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <h4 class="mt-3">Completando autenticación...</h4>
        <p class="text-muted">Por favor espera mientras procesamos tu sesión</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderVue from '@/components/Header.vue'

import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { AuthMethod } from '@/enums/AuthMethod'
import type { AuthUser } from '@/interfaces/User'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

onMounted(async () => {
  const authorizationCode = route.query.authorization_code as string
  const error = route.query.error as string

  if (error) {
    router.push({ name: 'login-admin', query: { error } })
    return
  }

  if (authorizationCode) {
    try {
      await authStore.handleSSOCallback(authorizationCode)
      const redirect = route.query.url_redirect as string
      if (redirect) {
        window.location.href = redirect
      } else {
        const authMethodId = authStore.user?.auth_method_id
        if (authMethodId === AuthMethod.PROVEEDOR) {
          router.push('/usuario')
        } else if (authMethodId === AuthMethod.ADMIN) {
          router.push({ name: 'admin-dashboard' })
        } else {
          router.push({ name: 'welcome' })
        }
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } }
      const errorMsg = axiosErr?.response?.data?.error ?? 'sso_failed'
      router.push({ name: 'login-admin', query: { error: errorMsg } })
    }
  } else {
    router.push({ name: 'login' })
  }
})
</script>

<style scoped>
.auth-redirect-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

.auth-redirect-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 2rem;
}

.auth-redirect-content {
  text-align: center;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>
