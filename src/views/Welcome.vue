<template>
  <div class="bg-white min-vh-100 d-flex flex-column">
    <HeaderVue />

    <main class="flex-grow-1">
      <section class="py-5 bg-light border-bottom">
        <div class="container">
          <div class="row align-items-center g-5">
            <div class="col-lg-6">
              <span class="badge text-bg-primary mb-3">Plataforma abierta</span>
              <h1 class="display-5 fw-bold">Capacitacion y validacion para cualquier usuario</h1>
              <p class="lead text-muted">
                Registra tu cuenta, completa modulos, carga evidencias y da seguimiento a tu expediente desde una
                version local sin dependencias externas.
              </p>
              <div class="d-flex gap-2 flex-wrap">
                <router-link class="btn btn-primary btn-lg" to="/registro">Crear cuenta</router-link>
                <router-link class="btn btn-outline-secondary btn-lg" to="/login">Iniciar sesion</router-link>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="hero-panel shadow-sm">
                <div class="hero-panel__content">
                  <i class="bi bi-journal-check"></i>
                  <span>Modulo</span>
                  <strong>Capacitacion activa</strong>
                </div>
                <div class="hero-panel__content">
                  <i class="bi bi-upload"></i>
                  <span>Evidencias</span>
                  <strong>Entrega guiada</strong>
                </div>
                <div class="hero-panel__content">
                  <i class="bi bi-clipboard2-check"></i>
                  <span>Revision</span>
                  <strong>Seguimiento claro</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="py-5">
        <div class="container">
          <div class="row g-4">
            <div class="col-md-4">
              <div class="card h-100">
                <div class="card-body">
                  <i class="bi bi-person-plus fs-2 text-primary"></i>
                  <h2 class="h5 mt-3">Registro abierto</h2>
                  <p class="text-muted mb-0">Cualquier usuario puede crear una cuenta local y comenzar su proceso.</p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card h-100">
                <div class="card-body">
                  <i class="bi bi-journal-check fs-2 text-primary"></i>
                  <h2 class="h5 mt-3">Capacitacion</h2>
                  <p class="text-muted mb-0">Organiza modulos, recursos y evidencias sin servicios externos.</p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card h-100">
                <div class="card-body">
                  <i class="bi bi-clipboard-check fs-2 text-primary"></i>
                  <h2 class="h5 mt-3">Validacion</h2>
                  <p class="text-muted mb-0">El panel administrativo permite revisar y dar seguimiento a expedientes.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <FooterXLVue />
  </div>
</template>

<script setup lang="ts">
import HeaderVue from '@/components/Header.vue'
import FooterXLVue from '@/components/FooterXL.vue'
</script>

<style scoped>
.hero-panel {
  background:
    linear-gradient(135deg, rgb(37 99 235 / 92%), rgb(14 165 233 / 82%)),
    radial-gradient(circle at top right, rgb(255 255 255 / 35%), transparent 35%);
  border-radius: 12px;
  color: #fff;
  display: grid;
  gap: 1rem;
  min-height: 320px;
  padding: 2rem;
}

.hero-panel__content {
  align-items: center;
  background: rgb(255 255 255 / 13%);
  border: 1px solid rgb(255 255 255 / 22%);
  border-radius: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.15rem 0.75rem;
  padding: 1rem;
}

.hero-panel__content i {
  font-size: 1.7rem;
  grid-row: span 2;
}

.hero-panel__content span {
  color: rgb(255 255 255 / 78%);
  font-size: 0.9rem;
}

.hero-panel__content strong {
  font-size: 1.05rem;
}
</style>
