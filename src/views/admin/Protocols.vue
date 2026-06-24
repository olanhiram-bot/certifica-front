<template>
  <div class="container_app">
    <!-- Breadcrumbs -->
    <nav aria-label="breadcrumb" class="mb-4">
      <ol class="breadcrumb mb-0">
        <li class="breadcrumb-item">
          <router-link to="/admin" class="text-decoration-none">Inicio</router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">Gestión documental</li>
      </ol>
    </nav>

    <!-- Page header -->
    <div class="d-flex align-items-center gap-3 mb-4">
      <div class="p-2 bg-primary bg-opacity-10 rounded-3">
        <i class="bi bi-file-earmark-text fs-4 text-primary"></i>
      </div>
      <div>
        <h1 class="h4 mb-0 fw-bold text-dark">Gestión documental</h1>
        <p class="text-muted mb-0 small">Permite gestionar y organizar el contenido de la evaluación documental.</p>
      </div>
    </div>

    <!-- Contenido -->
    <div class="card border-0 shadow-sm">
      <div class="card-body p-4">
        <Sections class="mt-0" :section-type-id="2" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Sections from '@/components/Sections.vue'
</script>
