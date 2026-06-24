<template>
  <div class="container_app">
    <Breadcrum />

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando expediente...</span>
      </div>
    </div>
    <div v-else-if="error" class="alert alert-danger shadow-sm" role="alert">{{ error }}</div>

    <template v-else-if="stamp">
      <!-- Cabecera -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div class="d-flex align-items-center gap-3">
          <h2 class="h4 mb-0 fw-bold text-dark">Expediente #{{ stamp.id }}</h2>
          <span
            class="badge px-3 py-2"
            :style="{
              backgroundColor: stamp.stamp_status?.color + '22',
              borderColor: stamp.stamp_status?.color,
              color: '#1f2937',
              border: '1px solid'
            }"
          >
            {{ stamp.stamp_status?.name }}
          </span>
        </div>
        <button class="btn btn-outline-secondary d-inline-flex align-items-center gap-2 px-3" @click="router.back()">
          <i class="bi bi-arrow-left"></i>
          Regresar
        </button>
      </div>

      <!-- Grid detalle -->
      <div class="row g-4">
        <!-- Card Usuario -->
        <div class="col-md-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body p-4">
              <h5 class="card-title text-primary fw-bold text-uppercase fs-6 mb-3 pb-2 border-bottom">Usuario</h5>
              <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
                  <span class="text-muted small">Nombre</span>
                  <span class="fw-semibold text-dark">{{ stamp.provider?.name ?? stamp.provider?.username ?? '—' }}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
                  <span class="text-muted small">Usuario</span>
                  <span class="fw-semibold text-dark">{{ stamp.provider?.username ?? '—' }}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
                  <span class="text-muted small">RFC</span>
                  <span class="fw-semibold text-dark">{{ stamp.provider?.rfc ?? '—' }}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent border-0">
                  <span class="text-muted small">Correo</span>
                  <span class="fw-semibold text-dark">{{ stamp.provider?.email ?? '—' }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Card Certificación -->
        <div class="col-md-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body p-4">
              <h5 class="card-title text-primary fw-bold text-uppercase fs-6 mb-3 pb-2 border-bottom">Certificación</h5>
              <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
                  <span class="text-muted small">Folio</span>
                  <span class="fw-semibold text-dark">{{ stamp.id }}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
                  <span class="text-muted small">Avance</span>
                  <span class="fw-bold text-primary">{{ stamp.percent }}%</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
                  <span class="text-muted small">Fecha de creación</span>
                  <span class="fw-semibold text-dark">{{ stamp.created_at ? new Date(stamp.created_at).toLocaleDateString('es-MX') : '—' }}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
                  <span class="text-muted small">Vigencia inicio</span>
                  <span class="fw-semibold text-dark">{{ stamp.vigency_start_date ? new Date(stamp.vigency_start_date).toLocaleDateString('es-MX') : '—' }}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
                  <span class="text-muted small">Vigencia fin</span>
                  <span class="fw-semibold text-dark">{{ stamp.vigency_end_date ? new Date(stamp.vigency_end_date).toLocaleDateString('es-MX') : '—' }}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent border-0">
                  <span class="text-muted small">Días restantes</span>
                  <span class="fw-semibold text-dark">{{ stamp.remaining_days !== null ? stamp.remaining_days + ' días' : '—' }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Breadcrum from '@/components/Breadcrum.vue'
import { getStamp, type StampDetalle } from '@/api/stamps'

const route  = useRoute()
const router = useRouter()

const stamp   = ref<StampDetalle | null>(null)
const loading = ref(true)
const error   = ref<string | null>(null)

onMounted(async () => {
  try {
    const id = Number(route.params.id)
    const res = await getStamp(id)
    stamp.value = res.data.data
  } catch {
    error.value = 'No se pudo cargar el expediente.'
  } finally {
    loading.value = false
  }
})
</script>
