<template>
  <div class="bg-light min-vh-100 d-flex flex-column">
    <HeaderVue />

    <main class="container flex-grow-1 py-5">
      <div class="row justify-content-center align-items-center g-5">
        <div class="col-lg-5">
          <div class="auth-panel">
            <i class="bi bi-person-plus"></i>
            <h2>Registro abierto</h2>
            <p>Crea tu cuenta local y empieza a usar la plataforma sin servicios externos.</p>
          </div>
        </div>
        <div class="col-lg-5">
          <div class="card shadow-sm">
            <div class="card-body p-4">
              <h1 class="h3 mb-2">Crear cuenta</h1>
              <p class="text-muted">Registro abierto para iniciar tu expediente.</p>

              <form @submit.prevent="submit">
                <div class="mb-3">
                  <label class="form-label" for="name">Nombre</label>
                  <input id="name" v-model="form.name" class="form-control" required />
                </div>

                <div class="mb-3">
                  <label class="form-label" for="email">Correo</label>
                  <input id="email" v-model="form.email" type="email" class="form-control" required />
                </div>

                <div class="mb-3">
                  <label class="form-label" for="password">Contrasena</label>
                  <input id="password" v-model="form.password" type="password" class="form-control" minlength="8" required />
                </div>

                <div class="mb-3">
                  <label class="form-label" for="passwordConfirmation">Confirmar contrasena</label>
                  <input id="passwordConfirmation" v-model="form.passwordConfirmation" type="password" class="form-control"
                    minlength="8" required />
                </div>

                <div v-if="error" class="alert alert-danger">
                  {{ error }}
                  <div v-if="emailAlreadyExists" class="mt-2">
                    <router-link to="/login" class="alert-link">Iniciar sesion con este correo</router-link>
                  </div>
                </div>

                <button class="btn btn-primary w-100" type="submit" :disabled="loading">
                  {{ loading ? 'Creando cuenta...' : 'Registrarme' }}
                </button>
              </form>

              <p class="small text-muted mt-3 mb-0">
                ¿Ya tienes cuenta?
                <router-link to="/login">Inicia sesion</router-link>
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
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import HeaderVue from '@/components/Header.vue'
import FooterLoginVue from '@/components/FooterLogin.vue'
import { register } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const error = ref('')
const emailAlreadyExists = ref(false)

const form = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirmation: '',
})

const submit = async () => {
  error.value = ''
  emailAlreadyExists.value = false

  if (form.password !== form.passwordConfirmation) {
    error.value = 'Las contrasenas no coinciden.'
    return
  }

  loading.value = true
  try {
    const response = await register(form.name, form.email, form.password, form.passwordConfirmation)
    const { token, user, permissions } = response.data.data
    authStore.setSession(token, user, permissions)
    router.push('/usuario')
  } catch (err: unknown) {
    const response = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } }
    const errors = response.response?.data?.errors
    emailAlreadyExists.value = Boolean(errors?.email)
    error.value = errors?.email?.[0] ?? response.response?.data?.message ?? 'No fue posible crear la cuenta.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-panel {
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  border-radius: 12px;
  color: #fff;
  min-height: 420px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: end;
}

.auth-panel i {
  font-size: 3rem;
  margin-bottom: auto;
}

.auth-panel p {
  color: rgb(255 255 255 / 80%);
  margin-bottom: 0;
}
</style>
