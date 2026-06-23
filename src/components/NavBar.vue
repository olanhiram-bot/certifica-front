<template>
  <nav class="navbar bg-white border-bottom">
    <div class="container">
      <span class="navbar-text text-muted">Version local</span>
      <div class="d-flex gap-2">
        <RouterLink to="/registro" class="btn btn-primary">Crear cuenta</RouterLink>
        <RouterLink to="/login" class="btn btn-outline-secondary">Iniciar sesion</RouterLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

