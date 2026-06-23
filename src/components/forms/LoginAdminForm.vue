<template>
  <form @submit.prevent="submit">
    <div class="mb-3">
      <label for="adminUsername" class="form-label">Usuario</label>
      <input id="adminUsername" v-model="form.username" class="form-control" autocomplete="username" required />
    </div>

    <div class="mb-3">
      <label for="adminPassword" class="form-label">Contrasena</label>
      <input id="adminPassword" v-model="form.password" type="password" class="form-control" autocomplete="current-password" required />
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <button class="btn btn-primary w-100" type="submit" :disabled="loading">
      {{ loading ? 'Ingresando...' : 'Iniciar sesion' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const error = ref('')

const form = reactive({
  username: 'admin',
  password: 'demo',
})

const submit = async () => {
  error.value = ''
  loading.value = true
  try {
    const response = await login(form.username, form.password)
    const { token, user, permissions } = response.data.data
    authStore.setSession(token, user, permissions)
    router.push('/admin')
  } catch (err: unknown) {
    const response = err as { response?: { data?: { error?: string; message?: string } } }
    error.value = response.response?.data?.error ?? response.response?.data?.message ?? 'Usuario o contrasena incorrectos.'
  } finally {
    loading.value = false
  }
}
</script>
