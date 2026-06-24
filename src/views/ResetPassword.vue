<template>
  <div class="bg-light min-vh-100 d-flex flex-column">
    <HeaderVue />
    <main class="container flex-grow-1 py-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow-sm">
            <div class="card-body p-4">
              <h1 class="h3 mb-2">Nueva contrasena</h1>
              <p class="text-muted">Crea una nueva contrasena para recuperar el acceso.</p>

              <form @submit.prevent="submit">
                <div class="mb-3">
                  <label for="password" class="form-label">Contrasena</label>
                  <input id="password" v-model="password" type="password" class="form-control" minlength="8" autocomplete="new-password" required />
                </div>

                <div class="mb-3">
                  <label for="passwordConfirmation" class="form-label">Confirmar contrasena</label>
                  <input id="passwordConfirmation" v-model="passwordConfirmation" type="password" class="form-control" minlength="8" autocomplete="new-password" required />
                </div>

                <div v-if="message" class="alert alert-success">{{ message }}</div>
                <div v-if="error" class="alert alert-danger">{{ error }}</div>

                <button class="btn btn-primary w-100" type="submit" :disabled="loading || !canSubmit">
                  {{ loading ? 'Guardando...' : 'Cambiar contrasena' }}
                </button>
              </form>

              <p class="small text-muted mt-3 mb-0">
                <router-link to="/login">Volver al inicio de sesion</router-link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
    <FooterLoginVue />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import HeaderVue from '@/components/Header.vue'
import FooterLoginVue from '@/components/FooterLogin.vue'
import { resetPassword } from '@/api/auth'

const route = useRoute()
const email = String(route.query.email ?? '')
const token = String(route.query.token ?? '')
const password = ref('')
const passwordConfirmation = ref('')
const loading = ref(false)
const message = ref('')
const error = ref(!email || !token ? 'El enlace de recuperacion no es valido.' : '')

const canSubmit = computed(() => {
  return Boolean(email && token && password.value.length >= 8 && password.value === passwordConfirmation.value)
})

const submit = async () => {
  if (!canSubmit.value) {
    error.value = 'Verifica que las contrasenas coincidan y tengan al menos 8 caracteres.'
    return
  }

  loading.value = true
  message.value = ''
  error.value = ''

  try {
    const response = await resetPassword(email, token, password.value, passwordConfirmation.value)
    message.value = response.data.message
  } catch (err: unknown) {
    const response = err as { response?: { data?: { message?: string } } }
    error.value = response.response?.data?.message ?? 'No fue posible cambiar la contrasena.'
  } finally {
    loading.value = false
  }
}
</script>
