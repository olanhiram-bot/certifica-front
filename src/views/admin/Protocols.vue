<template>
  <div class="contenedor_general">
    <!-- Breadcrumbs -->
    <div class="row">
      <div class="col-md-12">
        <nav class="migas" style="padding-left: 0px;">
          <router-link to="/admin">Inicio</router-link><span>Gestión documental</span>
        </nav>
      </div>
    </div>

    <!-- Titulo -->
    <div class="row">
      <div class="col-md-12">
        <div class="seccion_titulo mt-4" style="margin-top: 0px;">
          <h3>Gestión documental</h3>
          <p>Permite gestionar y organizar el contenido de la evaluación documental.</p>
        </div>
      </div>
    </div>

    <!-- Tabla de contenido -->
    <Sections class="mt-4" :section-type-id="2" />
  </div>
</template>

<script lang="ts" setup>
import Sections from '@/components/Sections.vue'
</script>
