<template>
  <div class="bg-light min-vh-100 d-flex flex-column">
    <HeaderVue />

    <main class="container flex-grow-1 py-5">
      <div class="row justify-content-center align-items-center g-5">
        <div class="col-lg-5">
          <img src="@/assets/images/standard/card.jpg" class="img-fluid rounded shadow-sm" alt="Panel administrativo" />
        </div>
        <div class="col-lg-5">
          <div class="card shadow-sm">
            <div class="card-body p-4">
              <h1 class="h3 mb-2">Administracion</h1>
              <p class="text-muted">Acceso local para revisar y administrar expedientes.</p>
              <LoginAdminFormVue />
              <p class="small text-muted mt-3 mb-0">
                Demo admin: <strong>admin</strong> / <strong>demo</strong>
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
import LoginAdminFormVue from '@/components/forms/LoginAdminForm.vue'
</script>

