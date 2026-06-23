<template>
  <div class="bg-light min-vh-100 d-flex flex-column">
    <HeaderVue />

    <main class="container flex-grow-1 py-5">
      <div class="row justify-content-center align-items-center g-5">
        <div class="col-lg-5">
          <div class="auth-panel">
            <i class="bi bi-shield-check"></i>
            <h2>Acceso seguro</h2>
            <p>Continua tu proceso, revisa tus modulos y consulta el estado de tus evidencias.</p>
          </div>
        </div>
        <div class="col-lg-5">
          <div class="card shadow-sm">
            <div class="card-body p-4">
              <h1 class="h3 mb-2">Iniciar sesion</h1>
              <p class="text-muted">Accede con tu cuenta registrada.</p>
              <LoginFormVue />
              <p class="small text-muted mt-3 mb-0">
                ¿No tienes cuenta?
                <router-link to="/registro">Registrate</router-link>
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
import HeaderVue from '@/components/Header.vue'
import FooterLoginVue from '@/components/FooterLogin.vue'
import LoginFormVue from '@/components/forms/LoginForm.vue'
</script>

<style scoped>
.auth-panel {
  background: linear-gradient(135deg, #1d4ed8, #0f766e);
  border-radius: 12px;
  color: #fff;
  min-height: 360px;
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
  color: rgb(255 255 255 / 78%);
  margin-bottom: 0;
}
</style>
