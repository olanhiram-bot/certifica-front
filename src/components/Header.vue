<template>
  <nav class="navbar navbar-expand-lg bg-white border-bottom">
    <div class="container">
      <router-link class="navbar-brand fw-semibold d-flex align-items-center gap-2" to="/">
        <span class="d-inline-flex align-items-center justify-content-center rounded bg-primary text-white" style="width: 36px; height: 36px;">
          <i class="bi bi-award"></i>
        </span>
        Certifica
      </router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#publicNav"
        aria-controls="publicNav" aria-expanded="false" aria-label="Abrir menu">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div id="publicNav" class="collapse navbar-collapse">
        <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Inicio</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/registro">Registro</router-link>
          </li>
          <li class="nav-item">
            <router-link class="btn btn-outline-primary" to="/login">Ingresar</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

