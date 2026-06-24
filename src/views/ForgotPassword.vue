<template>
  <div class="bg-light min-vh-100 d-flex flex-column">
    <HeaderVue />
    <main class="container flex-grow-1 py-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow-sm">
            <div class="card-body p-4">
              <h1 class="h3 mb-2">Recuperar cuenta</h1>
              <p class="text-muted">Escribe tu correo Gmail registrado y te enviaremos un enlace para cambiar tu contrasena.</p>

              <form @submit.prevent="submit">
                <div class="mb-3">
                  <label for="email" class="form-label">Correo Gmail</label>
                  <input id="email" v-model="email" type="email" class="form-control" autocomplete="email" required />
                </div>

                <div v-if="message" class="alert alert-success">{{ message }}</div>
                <div v-if="error" class="alert alert-danger">{{ error }}</div>

                <button class="btn btn-primary w-100" type="submit" :disabled="loading">
                  {{ loading ? 'Enviando...' : 'Enviar enlace' }}
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
import { ref } from 'vue'
import HeaderVue from '@/components/Header.vue'
import FooterLoginVue from '@/components/FooterLogin.vue'
import { forgotPassword } from '@/api/auth'

const email = ref('')
const loading = ref(false)
const message = ref('')
const error = ref('')

const submit = async () => {
  loading.value = true
  message.value = ''
  error.value = ''

  try {
    const response = await forgotPassword(email.value)
    message.value = response.data.message
  } catch {
    error.value = 'No fue posible enviar el correo de recuperacion.'
  } finally {
    loading.value = false
  }
}
</script>
