<template>
  <!-- ───────── ADMIN MODE ───────── -->
  <div v-if="isAdmin" class="banner-admin mb-4">
    <div class="banner-admin__body">

      <!-- Avatar -->
      <div class="banner-admin__avatar">
        <span class="banner-admin__initials">{{ initials }}</span>
      </div>

      <!-- Info principal -->
      <div class="banner-admin__info">
        <p class="banner-admin__role">{{ bannerLabel1 }}</p>
        <h2 class="banner-admin__name">{{ bannerValue1 }}</h2>
        <p class="banner-admin__sub">
          <i class="bi bi-building me-1"></i>{{ bannerLabel2 }}: <strong>{{ bannerValue2 }}</strong>
        </p>
      </div>

      <!-- Divider + stat extra si hay proveedor activo -->
      <template v-if="stampStore.currentProvider">
        <div class="banner-admin__divider"></div>
        <div class="banner-admin__stat">
          <span class="banner-admin__stat-label">RFC</span>
          <span class="banner-admin__stat-value">{{ stampStore.currentProvider.rfc ?? '—' }}</span>
        </div>
        <div class="banner-admin__divider"></div>
        <div class="banner-admin__stat">
          <span class="banner-admin__stat-label">Correo</span>
          <span class="banner-admin__stat-value">{{ stampStore.currentProvider.email ?? '—' }}</span>
        </div>
      </template>

      <!-- Badge rol -->
      <div class="ms-auto">
        <span class="banner-admin__badge">
          <i class="bi bi-shield-check me-1"></i>
          {{ stampStore.currentProvider ? 'Empresa activa' : 'Validador' }}
        </span>
      </div>
    </div>
  </div>

  <!-- ───────── USER MODE ───────── -->
  <div v-else class="banner-user mb-4">
    <div class="banner-user__body">

      <!-- Left: avatar + identity -->
      <div class="banner-user__left">
        <div class="banner-user__avatar">
          <span class="banner-user__initials">{{ providerInitials }}</span>
        </div>
        <div>
          <p class="banner-user__label" v-if="showHeaderInfo">
            <span class="d-none d-md-inline">Bienvenida al proceso del Certifica</span>
            <span class="d-inline d-md-none">Bienvenida</span>
          </p>
          <h2 class="banner-user__name">{{ providerName }}</h2>
          <p class="banner-user__company">
            <i class="bi bi-building me-1"></i>{{ companyName }}
          </p>
        </div>
      </div>

      <!-- Divider -->
      <div class="banner-user__divider d-none d-md-block"></div>

      <!-- Progress section -->
      <div v-if="showProgress" class="banner-user__progress">
        <div class="d-flex justify-content-between align-items-end mb-2">
          <div>
            <p class="banner-user__label mb-0">Progreso general</p>
            <span class="banner-user__percent">{{ progressValue }}<small>%</small></span>
          </div>
          <div class="text-end">
            <p class="banner-user__label mb-0">Vigencia</p>
            <span v-if="vigenciaFin" class="banner-user__vigencia">{{ formatDate(vigenciaFin) }}</span>
            <span v-else-if="stampStore.remainingDays !== null" class="banner-user__vigencia" :class="remainingDaysClass">
              {{ stampStore.remainingDays }} días restantes
            </span>
            <span v-else class="banner-user__vigencia text-muted">—</span>
          </div>
        </div>
        <div class="banner-user__bar-track">
          <div class="banner-user__bar-fill" :style="{ width: `${progressValue}%` }"></div>
        </div>
        <p v-if="showProgressText" class="banner-user__motivacion">
          Cada paso que das contribuye a un ambiente laboral más seguro para todas las personas.
        </p>
        <p v-if="showModalidad !== false" class="banner-user__modalidad">
          <i class="bi bi-tag me-1"></i>{{ modalityName }}
        </p>
      </div>

      <!-- Buttons / Status badge -->
      <div v-if="buttons && buttons.length > 0" class="banner-user__actions">
        <button
          v-for="(button, index) in buttons"
          :key="index"
          :class="['btn', getBtnClass(button.variant)]"
          :disabled="button.disabled"
          @click="button.action"
        >
          {{ button.text }}
        </button>
      </div>
      <div v-else-if="stampStatus" class="banner-user__actions">
        <span
          class="badge px-3 py-2 fs-6"
          :style="{
            background: `linear-gradient(135deg, ${stampStatus.color}28, ${stampStatus.color}14)`,
            borderColor: stampStatus.color,
            color: stampStatus.color,
            border: '1.5px solid'
          }"
        >
          {{ stampStatus.name }}
        </span>
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

// ── Admin computed ─────────────────────────────────────────────────────────
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

const initials = computed(() => {
  const name = bannerValue1.value ?? ''
  return name
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase() ?? '')
    .join('')
})

// ── User computed ──────────────────────────────────────────────────────────
const providerName = computed(() => {
  const user = authStore.user as any
  if (!user) return 'Usuario'
  return user.user?.provider_info?.nombre_completo
    ?? user.provider_info?.nombre_completo
    ?? user.name
    ?? user.username
    ?? 'Usuario'
})

const companyName = computed(() => {
  const user = authStore.user as any
  if (!user) return 'Empresa'
  return user.user?.provider_info?.nombre_comercial
    ?? user.provider_info?.nombre_comercial
    ?? user.user?.rfc
    ?? user.rfc
    ?? 'Empresa'
})

const providerInitials = computed(() =>
  providerName.value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase() ?? '')
    .join('')
)

const remainingDaysClass = computed(() => {
  const days = stampStore.remainingDays
  if (days === null) return ''
  if (days <= 0) return 'text-danger fw-bold'
  if (days <= 3) return 'text-warning fw-bold'
  if (days <= 10) return 'text-success fw-semibold'
  return ''
})

const formatDate = (date: string): string => {
  const zonedDate = toZonedTime(new Date(date), 'America/Monterrey')
  return format(zonedDate, 'dd MMM. yyyy', { locale: es })
}

const getBtnClass = (variant?: string): string => {
  switch (variant) {
    case 'primario': return 'btn-primary'
    case 'secundario': return 'btn-outline-secondary'
    case 'peligro': return 'btn-danger'
    default: return 'btn-outline-primary'
  }
}
</script>

<style scoped>
/* ─── ADMIN BANNER ─────────────────────────────────────────────────────────── */
.banner-admin {
  background: linear-gradient(135deg, #1e3a5f 0%, #1a56a0 60%, #2563eb 100%);
  border-radius: 14px;
  padding: 1.5rem 2rem;
  color: #fff;
  box-shadow: 0 8px 32px rgb(37 99 235 / 20%);
}

.banner-admin__body {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.banner-admin__avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgb(255 255 255 / 20%);
  border: 2px solid rgb(255 255 255 / 40%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.banner-admin__initials {
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.02em;
}

.banner-admin__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.banner-admin__role {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgb(255 255 255 / 65%);
  margin: 0;
}

.banner-admin__name {
  font-size: 1.15rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.banner-admin__sub {
  font-size: 0.8rem;
  color: rgb(255 255 255 / 70%);
  margin: 0;
}

.banner-admin__divider {
  width: 1px;
  height: 40px;
  background: rgb(255 255 255 / 25%);
  flex-shrink: 0;
}

.banner-admin__stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.banner-admin__stat-label {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgb(255 255 255 / 60%);
}

.banner-admin__stat-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
}

.banner-admin__badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  background: rgb(255 255 255 / 15%);
  border: 1px solid rgb(255 255 255 / 30%);
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
}

/* ─── USER BANNER ──────────────────────────────────────────────────────────── */
.banner-user {
  background: linear-gradient(110deg, #234b78 0%, #1f5fc8 70%, #2f66de 100%);
  border: 0;
  border-radius: 10px;
  box-shadow: none;
  color: #fff;
  padding: 1.45rem 1.75rem;
}

.banner-user__body {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.banner-user__left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.banner-user__avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgb(255 255 255 / 14%);
  border: 1px solid rgb(255 255 255 / 42%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.banner-user__initials {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
}

.banner-user__label {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgb(255 255 255 / 72%);
  margin: 0;
}

.banner-user__name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 2px;
}

.banner-user__company {
  font-size: 0.8rem;
  color: rgb(255 255 255 / 78%);
  margin: 0;
}

.banner-user__divider {
  width: 1px;
  height: 60px;
  background: rgb(255 255 255 / 24%);
  flex-shrink: 0;
}

.banner-user__progress {
  flex: 1;
  min-width: 220px;
}

.banner-user__percent {
  font-size: 2rem;
  font-weight: 800;
  color: #fff;
  line-height: 1;
}

.banner-user__percent small {
  font-size: 1rem;
  font-weight: 600;
}

.banner-user__vigencia {
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
}

.banner-user__bar-track {
  height: 8px;
  border-radius: 999px;
  background: rgb(255 255 255 / 22%);
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.banner-user__bar-fill {
  height: 100%;
  border-radius: 999px;
  background: #fff;
  transition: width 0.5s ease;
}

.banner-user__motivacion {
  font-size: 0.75rem;
  color: rgb(255 255 255 / 78%);
  margin: 0 0 4px;
}

.banner-user__modalidad {
  font-size: 0.75rem;
  color: rgb(255 255 255 / 78%);
  margin: 0;
}

.banner-user__actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
  margin-left: auto;
}

/* ─── Responsive ───────────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .banner-admin,
  .banner-user {
    padding: 1rem 1.25rem;
  }

  .banner-admin__body,
  .banner-user__body {
    gap: 0.75rem;
  }

  .banner-admin__divider,
  .banner-user__divider {
    display: none;
  }

  .banner-user__actions {
    width: 100%;
    align-items: stretch;
    margin-left: 0;
  }

  .banner-admin__badge {
    margin-left: 0;
  }
}
</style>
