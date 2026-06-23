<template>
  <div class="container_app">
    <section class="card border-0 shadow-sm mb-4">
      <div class="card-body p-4">
        <div class="row align-items-center g-4">
          <div class="col-lg-8">
            <span class="badge text-bg-primary mb-3">Inicio del proceso</span>
            <h1 class="h3 mb-2">Bienvenido, {{ displayName }}</h1>
            <p class="text-muted mb-0">
              Revisa los lineamientos, elige una modalidad de capacitacion y comienza tu expediente.
            </p>
          </div>
          <div class="col-lg-4">
            <div class="progress-panel">
              <i class="bi bi-list-check"></i>
              <div>
                <span>Estado</span>
                <strong>{{ stampStore.hasStamp ? 'Expediente activo' : 'Sin expediente' }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="row g-4 mb-4">
      <div class="col-lg-4">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body p-4">
            <i class="bi bi-person-check fs-2 text-primary"></i>
            <h2 class="h5 mt-3">1. Registro</h2>
            <p class="text-muted mb-0">Tu cuenta local queda vinculada a un expediente dentro de esta plataforma.</p>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body p-4">
            <i class="bi bi-journal-text fs-2 text-primary"></i>
            <h2 class="h5 mt-3">2. Capacitacion</h2>
            <p class="text-muted mb-0">Consulta los modulos disponibles y entrega evidencias cuando aplique.</p>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body p-4">
            <i class="bi bi-clipboard2-check fs-2 text-primary"></i>
            <h2 class="h5 mt-3">3. Validacion</h2>
            <p class="text-muted mb-0">El equipo validador revisa tu expediente y registra observaciones.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="card border-0 shadow-sm mb-4">
      <div class="card-body p-4">
        <h2 class="h4 mb-3">Lineamientos</h2>
        <div class="accordion" id="guidelinesAccordion">
          <div class="accordion-item">
            <h3 class="accordion-header">
              <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#guidelineOne">
                Capacitacion dentro de la plataforma
              </button>
            </h3>
            <div id="guidelineOne" class="accordion-collapse collapse show" data-bs-parent="#guidelinesAccordion">
              <div class="accordion-body text-muted">
                Completa los modulos publicados, revisa los recursos y sube las evidencias solicitadas dentro del periodo definido.
              </div>
            </div>
          </div>
          <div class="accordion-item">
            <h3 class="accordion-header">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#guidelineTwo">
                Capacitacion externa
              </button>
            </h3>
            <div id="guidelineTwo" class="accordion-collapse collapse" data-bs-parent="#guidelinesAccordion">
              <div class="accordion-body text-muted">
                Si ya realizaste capacitacion equivalente, registra el expediente y carga la documentacion que lo acredite.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="row g-4">
      <div class="col-lg-6">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body p-4 d-flex flex-column">
            <i class="bi bi-play-circle fs-2 text-primary"></i>
            <h2 class="h5 mt-3">Comenzar formacion</h2>
            <p class="text-muted">Crea tu expediente y avanza por los modulos de capacitacion.</p>
            <button class="btn btn-primary mt-auto" type="button" :disabled="creating" @click="startStamp(1)">
              {{ creating ? 'Creando expediente...' : 'Comenzar formacion' }}
            </button>
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-body p-4 d-flex flex-column">
            <i class="bi bi-upload fs-2 text-primary"></i>
            <h2 class="h5 mt-3">Acreditar formacion externa</h2>
            <p class="text-muted">Crea tu expediente para cargar constancias y evidencias de capacitacion externa.</p>
            <button class="btn btn-outline-primary mt-auto" type="button" :disabled="creating" @click="startStamp(2)">
              {{ creating ? 'Creando expediente...' : 'Acreditar formacion' }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
import { useAuthStore } from '@/stores/auth'
import { useStampStore } from '@/stores/stamp'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const stampStore = useStampStore()
const creating = ref(false)

const displayName = computed(() => {
  const raw = authStore.user?.user as Record<string, unknown> | undefined
  const providerInfo = raw?.provider_info as Record<string, unknown> | undefined
  return String(providerInfo?.nombre_completo ?? raw?.name ?? authStore.user?.username ?? 'Usuario')
})

const startStamp = async (modalityTypeId: number) => {
  creating.value = true
  try {
    await stampStore.createNewStamp(modalityTypeId)
    toast.success('Expediente creado correctamente.')
    router.push('/usuario/dashboard')
  } catch {
    toast.error('No fue posible crear el expediente.')
  } finally {
    creating.value = false
  }
}
</script>

<style scoped>
.progress-panel {
  align-items: center;
  background: linear-gradient(135deg, #2563eb, #0ea5e9);
  border-radius: 10px;
  color: #fff;
  display: flex;
  gap: 1rem;
  padding: 1rem;
}

.progress-panel i {
  font-size: 2rem;
}

.progress-panel span {
  color: rgb(255 255 255 / 78%);
  display: block;
  font-size: 0.9rem;
}
</style>

