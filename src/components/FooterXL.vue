<template>
  <footer class="bg-dark text-white py-5">
    <div class="container">
      <div class="row g-4">
        <div class="col-md-6">
          <h2 class="h5">Certifica</h2>
          <p class="mb-0 text-white-50">
            Plataforma abierta para capacitacion, entrega de evidencias y validacion de expedientes.
          </p>
        </div>
        <div class="col-md-3">
          <h3 class="h6">Acceso</h3>
          <ul class="list-unstyled mb-0">
            <li><router-link class="link-light link-underline-opacity-0" to="/registro">Registro</router-link></li>
            <li><router-link class="link-light link-underline-opacity-0" to="/login">Ingreso</router-link></li>
          </ul>
        </div>
        <div class="col-md-3">
          <h3 class="h6">Local</h3>
          <p class="mb-0 text-white-50">Sin dependencias SSO ni servicios externos de usuarios.</p>
        </div>
      </div>
    </div>
  </footer>
</template>

