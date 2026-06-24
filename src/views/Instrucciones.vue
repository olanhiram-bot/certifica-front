<template>
  <div class="container_app">
    <section class="user-summary mb-4">
      <div class="user-summary__avatar">{{ userInitials }}</div>
      <div class="user-summary__identity">
        <span class="user-summary__role">{{ userRole }}</span>
        <strong>{{ userEmail }}</strong>
        <span class="user-summary__area">
          <i class="bi bi-building"></i>
          Dependencia o area: {{ userArea }}
        </span>
      </div>
      <span class="user-summary__status">
        <i class="bi bi-shield-check"></i>
        {{ stampStore.hasStamp ? 'Expediente activo' : 'Sin expediente' }}
      </span>
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

const userEmail = computed(() => {
  const raw = authStore.user?.user as Record<string, unknown> | undefined
  return String(raw?.email ?? authStore.user?.email ?? authStore.user?.username ?? displayName.value)
})

const userRole = computed(() => {
  const raw = authStore.user?.user as Record<string, unknown> | undefined
  return String(raw?.role ?? authStore.user?.role ?? 'Validador').toUpperCase()
})

const userArea = computed(() => {
  const raw = authStore.user?.user as Record<string, unknown> | undefined
  const providerInfo = raw?.provider_info as Record<string, unknown> | undefined
  return String(providerInfo?.nombre_comercial ?? providerInfo?.rfc ?? '-')
})

const userInitials = computed(() => {
  return displayName.value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || 'U'
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
.user-summary {
  align-items: center;
  background: linear-gradient(110deg, #234b78 0%, #1f5fc8 70%, #2f66de 100%);
  border-radius: 10px;
  color: #fff;
  display: flex;
  gap: 1.25rem;
  min-height: 98px;
  padding: 1.5rem 1.75rem;
}

.user-summary__avatar {
  align-items: center;
  background: rgb(255 255 255 / 14%);
  border: 1px solid rgb(255 255 255 / 42%);
  border-radius: 50%;
  display: inline-flex;
  flex: 0 0 48px;
  font-size: 1.1rem;
  font-weight: 800;
  height: 48px;
  justify-content: center;
  width: 48px;
}

.user-summary__identity {
  display: flex;
  flex: 1;
  flex-direction: column;
  line-height: 1.25;
  min-width: 0;
}

.user-summary__identity strong {
  font-size: 1.02rem;
  overflow-wrap: anywhere;
}

.user-summary__role {
  color: rgb(255 255 255 / 72%);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.user-summary__area {
  align-items: center;
  color: rgb(255 255 255 / 78%);
  display: inline-flex;
  font-size: 0.78rem;
  gap: 0.35rem;
  margin-top: 0.25rem;
}

.user-summary__status {
  align-items: center;
  background: rgb(255 255 255 / 12%);
  border: 1px solid rgb(255 255 255 / 28%);
  border-radius: 999px;
  display: inline-flex;
  flex: 0 0 auto;
  font-size: 0.8rem;
  font-weight: 700;
  gap: 0.35rem;
  padding: 0.45rem 0.75rem;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .user-summary {
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 0.85rem;
    padding: 1.25rem;
  }

  .user-summary__status {
    margin-left: 60px;
  }
}
</style>
