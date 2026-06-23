<template>
  <div class="caja_datos container-fluid">
    <div class="row flex-nowrap" :class="{ 'sin-progreso align-items-stretch': !showProgress }">
      <div class="col-1">
        <div class="imagen_container">
          <img src="@/assets/images/certifica_caja_datos.png" alt="Imagen" class="img-fluid w-100" />
        </div>
      </div>
      <div class="col-11">
        <div class="renglon_boleto" v-if="showHeaderInfo">
          <template v-if="isAdmin">
            <div class="caja_boleto">
              <span>{{ bannerLabel1 }}</span>
              <h4>{{ bannerValue1 }}</h4>
            </div>
            <div class="caja_boleto">
              <span>{{ bannerLabel2 }}</span>
              <h4>{{ bannerValue2 }}</h4>
            </div>
          </template>
          <template v-else>
            <div class="caja_boleto">
              <span class="d-block d-md-none">Bienvenida</span>
              <span class="d-none d-md-block">Bienvenida al proceso del Certifica.</span>
              <h4> {{ providerName }} </h4>
            </div>
            <div class="caja_boleto">
              <span>Empresa</span>
              <h4> {{ companyName }}</h4>
            </div>
          </template>
        </div>
        <br v-if="showProgress && showHeaderInfo !== false">
        <div v-if="showProgress && showProgressText !== false" class="renglon_boleto">
          <span>Cada paso que das contribuye a un ambiente laboral más seguro para todas las personas.</span>
        </div>
        <br v-if="showProgress">

          <div v-if="showProgress" class="renglon_boleto">
          <div class="w-100">
            <h5 v-if="showModalidad !== false">Modalidad: {{ modalityName }}</h5>
            <div class="d-flex justify-content-between align-items-center">
              <div class="d-flex flex-column gap-2 flex-grow-1 me-4">
                <span>Progreso {{ progressValue }}%</span>
                <div class="progress" style="height:8px; border-radius:4px">
                  <div
                    class="progress-bar"
                    role="progressbar"
                    :style="{ width: `${progressValue}%`, backgroundColor: 'var(--color_primario)' }"
                    :aria-valuenow="progressValue"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <h5></h5>
              </div>
              <div class="text-nowrap small text-secondary">
                <h5 v-if="vigenciaFin">Finaliza el {{ formatDate(vigenciaFin) }}</h5>
                <h5 v-else-if="stampStore.remainingDays !== null" :class="remainingDaysClass">{{ stampStore.remainingDays }} días restantes</h5>
                <h5 v-else>Fecha de vigencia no disponible</h5>
              </div>
            </div>
          </div>
        </div>

        <div v-if="buttons && buttons.length > 0" class="renglon_boleto d-flex justify-content-end gap-3 mt-3">
          <div></div>
          <button v-for="(button, index) in buttons" :key="index" :class="['boton', getButtonClass(button.variant)]"
            :disabled="button.disabled" @click="button.action">
            {{ button.text }}
          </button>
        </div>
        <div v-else-if="stampStatus" class="renglon_boleto d-flex justify-content-end mt-3">
          <div class="boton_etiqueta" :style="{
            background: `linear-gradient(135deg, ${stampStatus.color}30, ${stampStatus.color}20)`,
            borderColor: stampStatus.color }">
            {{ stampStatus.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CajaDatosProps } from '@/interfaces/CajaDatosProps'
import { AuthMethod } from '@/enums/AuthMethod'
import { useAuthStore } from '@/stores/auth'
import { useStampStore } from '@/stores/stamp'
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { es } from 'date-fns/locale'
import { computed } from 'vue'

const props = withDefaults(defineProps<CajaDatosProps>(), {
  showProgress: false,
  progressValue: 0,
  showHeaderInfo: true,
  showProgressText: true,
  showModalidad: true,
  vigenciaInicio: null,
  vigenciaFin: null,
  percent: 0,
  modalityName: 'Capacitación por Usuario (Externo)'
})

const authStore = useAuthStore()
const stampStore = useStampStore()

const isAdmin = computed(() => authStore.user?.auth_method_id === AuthMethod.ADMIN)

const bannerLabel1 = computed(() => {
  if (!isAdmin.value) return null
  return stampStore.currentProvider ? 'Empresa' : 'Validador'
})

const bannerLabel2 = computed(() => {
  if (!isAdmin.value) return null
  return stampStore.currentProvider ? 'RFC' : 'Dependencia o área'
})

const bannerValue1 = computed(() => {
  if (!isAdmin.value) return null
  if (stampStore.currentProvider) {
    return stampStore.currentProvider.name ?? stampStore.currentProvider.username
  }
  const user = authStore.user as any
  return user?.user?.user_info?.names ?? user?.username ?? '—'
})

const bannerValue2 = computed(() => {
  if (!isAdmin.value) return null
  if (stampStore.currentProvider) {
    return stampStore.currentProvider.rfc ?? stampStore.currentProvider.username ?? '—'
  }
  const user = authStore.user as any
  return user?.user?.user_info?.Dependencia ?? '—'
})

const formatDate = (date: string): string => {
  const zonedDate = toZonedTime(new Date(date), 'America/Monterrey')
  return format(zonedDate, 'dd MMM. yyyy', { locale: es })
}

const providerName = computed(() => {
  const user = authStore.user as any
  if (!user) return 'Usuario'
  if (user.user?.provider_info?.nombre_completo) {
    return user.user.provider_info.nombre_completo
  }
  if (user.provider_info?.nombre_completo) {
    return user.provider_info.nombre_completo
  }
  return user.name || user.username || 'Usuario'
})

const companyName = computed(() => {
  const user = authStore.user as any
  if (!user) return 'Empresa'
  if (user.user?.provider_info?.nombre_comercial) {
    return user.user.provider_info.nombre_comercial
  }
  if (user.provider_info?.nombre_comercial) {
    return user.provider_info.nombre_comercial
  }
  return user.user?.rfc || user.rfc || 'Empresa'
})

const remainingDaysClass = computed(() => {
  const days = stampStore.remainingDays
  if (days === null) return ''
  if (days === 0) return 'es_error_important'
  if (days <= 3) return 'es_alerta_important'
  if (days <= 10) return 'es_exito_important'
  return ''
})

const getButtonClass = (variant?: string): string => {
  switch (variant) {
    case 'primario':
      return 'boton_primario'
    case 'secundario':
      return 'boton_secundario'
    case 'peligro':
      return 'boton_peligro'
    case 'terciario':
    default:
      return 'boton_terciario'
  }
}
</script>

<style scoped>
/* Columnas: Bootstrap col-1/col-11 no tiene el ratio 20/80 en móvil, se sobrescribe */
@media (max-width: 768px) {
  .caja_datos {
    padding: 0.5rem;
  }

  .caja_datos .col-1 {
    width: 20%;
    max-width: 20%;
  }

  .caja_datos .col-11 {
    width: 80%;
    max-width: 80%;
  }

  .renglon_boleto {
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .caja_boleto {
    width: 100%;
    min-width: 100%;
    margin-bottom: 0.5rem;
  }

  .caja_boleto h4 {
    font-size: 1rem;
    margin: 0;
  }

  .caja_boleto span {
    font-size: 0.875rem;
  }

  .d-flex.justify-content-between {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .renglon_boleto.d-flex.justify-content-end {
    flex-direction: column;
    width: 100%;
  }

  .renglon_boleto.d-flex.justify-content-end .boton {
    width: 100%;
  }
}
</style>
