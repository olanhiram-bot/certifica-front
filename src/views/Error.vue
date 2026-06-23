<template>
  <div class="min-vh-100 d-flex flex-column bg-light">
    <HeaderVue />
    <main class="container flex-grow-1 d-flex align-items-center py-5">
      <div class="row justify-content-center w-100">
        <div class="col-md-8 col-lg-6">
          <div class="card shadow-sm text-center">
            <div class="card-body p-5">
              <i class="bi bi-exclamation-triangle display-4 text-warning"></i>
              <h1 class="h3 mt-3">Pagina no encontrada</h1>
              <p class="text-muted">La ruta solicitada no existe o ya no esta disponible.</p>
              <router-link class="btn btn-primary" to="/">Volver al inicio</router-link>
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
</script>

