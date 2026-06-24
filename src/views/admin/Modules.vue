<template>
  <div class="container_app admin-modules-page">
    <!-- Breadcrumbs -->
    <nav aria-label="breadcrumb" class="mb-4">
      <ol class="breadcrumb mb-0">
        <li class="breadcrumb-item">
          <router-link to="/admin" class="text-decoration-none">Inicio</router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">Módulos</li>
      </ol>
    </nav>

    <!-- Page header with gradient -->
    <div class="d-flex align-items-center gap-3 mb-4">
      <div class="p-3 bg-primary bg-opacity-10 rounded-4">
        <i class="bi bi-journal-text fs-3 text-primary"></i>
      </div>
      <div>
        <h1 class="h3 mb-1 fw-bold text-dark">Módulos</h1>
        <p class="text-muted mb-0">Permite gestionar y organizar el contenido del curso.</p>
      </div>
    </div>

    <!-- Stats cards -->
    <div class="row g-3 mb-4">
      <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body p-4">
            <div class="d-flex align-items-center">
              <div class="p-2 bg-primary bg-opacity-10 rounded-3 me-3">
                <i class="bi bi-folder2-open text-primary"></i>
              </div>
              <div>
                <p class="text-muted small mb-1">Total de módulos</p>
                <h3 class="h4 mb-0 fw-bold">24</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body p-4">
            <div class="d-flex align-items-center">
              <div class="p-2 bg-success bg-opacity-10 rounded-3 me-3">
                <i class="bi bi-check-circle text-success"></i>
              </div>
              <div>
                <p class="text-muted small mb-1">Activos</p>
                <h3 class="h4 mb-0 fw-bold">18</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body p-4">
            <div class="d-flex align-items-center">
              <div class="p-2 bg-warning bg-opacity-10 rounded-3 me-3">
                <i class="bi bi-clock text-warning"></i>
              </div>
              <div>
                <p class="text-muted small mb-1">Pendientes</p>
                <h3 class="h4 mb-0 fw-bold">6</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="card border-0 shadow-sm">
      <div class="card-body p-4">
        <Sections class="mt-0" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Sections from '@/components/Sections.vue'
</script>
