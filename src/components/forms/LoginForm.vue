<template>
  <form @submit.prevent="submit">
    <div class="mb-3">
      <label for="username" class="form-label">Correo o usuario</label>
      <input id="username" v-model="form.username" class="form-control" autocomplete="username" required />
    </div>

    <div class="mb-3">
      <label for="password" class="form-label">Contrasena</label>
      <input id="password" v-model="form.password" type="password" class="form-control" autocomplete="current-password" required />
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
import { AuthMethod } from '@/enums/AuthMethod'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const error = ref('')

const form = reactive({
  username: '',
  password: '',
})

const submit = async () => {
  error.value = ''
  loading.value = true
  try {
    const response = await login(form.username, form.password)
    const { token, user, permissions } = response.data.data
    authStore.setSession(token, user, permissions)
    const authMethodId = (user as { auth_method_id?: number }).auth_method_id
    router.push(authMethodId === AuthMethod.ADMIN ? '/admin' : '/usuario')
  } catch (err: unknown) {
    const response = err as { response?: { data?: { error?: string; message?: string } } }
    error.value = response.response?.data?.error ?? response.response?.data?.message ?? 'Usuario o contrasena incorrectos.'
  } finally {
    loading.value = false
  }
}
</script>
