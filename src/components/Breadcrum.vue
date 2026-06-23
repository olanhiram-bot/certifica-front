<template>
  <nav aria-label="breadcrumb" v-if="crumbs.length > 0">
    <ol class="breadcrumb">
      <li class="breadcrumb-item">
        <router-link :to="inicioLink">{{ inicioLabel }}</router-link>
      </li>
      <li
        v-for="(crumb, index) in crumbs"
        :key="index"
        class="breadcrumb-item"
        :class="{ active: index === crumbs.length - 1 }"
        :aria-current="index === crumbs.length - 1 ? 'page' : undefined"
      >
        <router-link v-if="crumb.to && index < crumbs.length - 1" :to="crumb.to">
          {{ crumb.label }}
        </router-link>
        <span v-else>{{ crumb.label }}</span>
      </li>
    </ol>
  </nav>
</template>



<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useBreadcrumbStore } from '@/stores/breadcrumb'
import { AuthMethod } from '@/enums/AuthMethod'

interface Crumb {
  label: string
  to?: string
}

const route = useRoute()
const authStore = useAuthStore()
const breadcrumbStore = useBreadcrumbStore()

const inicioLink = computed(() => {
  const authMethodId = authStore.user?.auth_method_id
  if (authMethodId === AuthMethod.ADMIN) return '/admin'
  if (authMethodId === AuthMethod.PROVEEDOR) return '/usuario'
  return '/'
})

const inicioLabel = computed(() => {
  const authMethodId = authStore.user?.auth_method_id
  if (authMethodId === AuthMethod.ADMIN) return 'Administrador'
  if (authMethodId === AuthMethod.PROVEEDOR) return 'Usuario'
  return 'Inicio'
})

const routeLabels: Record<string, string> = {
  usuario: 'Usuario',
  validator: 'Validador',
  admin: 'Administrador',
  solicitudes: 'Solicitudes',
  evidencias: 'Evidencias',
  perfil: 'Perfil',
  confirmacion: 'Confirmación',
  dashboard: 'Panel Principal',
  'programa-modulos': 'Programa de Módulos',
  'modulo-curso': 'Curso',
  'curso-evidencia': 'Evidencia del Curso',
  'expediente-detalle': 'Detalle de Expediente',
  ExpedienteDetalle: 'Detalle de Expediente',
  protocolo: 'Evaluación documental',
  protocolos: 'Evaluación documental',
  modulos: 'Módulos',
  instrucciones: 'Instrucciones',
}

const formatLabel = (segment: string): string => {
  const label = routeLabels[segment]
  if (label) return label
  return segment
    .replace(/-/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (l) => l.toUpperCase())
}

const truncateToWords = (text: string, maxWords: number = 7): string => {
  const words = text.split(' ')
  if (words.length <= maxWords) return text
  return words.slice(0, maxWords).join(' ') + '...'
}

const crumbs = computed<Crumb[]>(() => {
  const pathSegments = route.path.split('/').filter(Boolean)
  const result: Crumb[] = []

  const authMethodId = authStore.user?.auth_method_id
  const isProvider = authMethodId === AuthMethod.PROVEEDOR || pathSegments[0] === 'usuario'
  const isValidator = authMethodId === AuthMethod.ADMIN && pathSegments[0] === 'admin'

  if (isProvider) {
    // Si estamos en cualquier ruta de usuario que no sea la raíz o el dashboard
    if (pathSegments.length > 1 && !pathSegments.includes('dashboard')) {
      result.push({ label: 'Panel Principal', to: '/usuario/dashboard' })
    }

    // Si estamos en curso o evidencia desde protocolos, mostramos Evaluación documental
    if (pathSegments.includes('modulo-curso') || pathSegments.includes('curso-evidencia')) {
      if (breadcrumbStore.previousRoute === 'protocolos' || route.query.from === 'protocolos') {
        result.push({ label: 'Evaluación documental', to: '/usuario/protocolos' })
      } else {
        result.push({ label: 'Programa de Módulos', to: '/usuario/programa-modulos' })
      }
    }
  }

  if (isValidator) {
    // Si estamos en la vista de evidencia del validador, inyectar crumb de regreso a Módulos
    if (pathSegments.includes('curso-evidencia')) {
      const stampId = breadcrumbStore.validatorStampId
        ?? (route.query.stampId ? Number(route.query.stampId) : null)

      const modulosTo = stampId
        ? `/admin/modulos?stampId=${stampId}`
        : '/admin/modulos'

      result.push({ label: 'Módulos', to: modulosTo })
    }
  }

  // Segmentos basados en la URL
  for (let i = 0; i < pathSegments.length; i++) {
    const segment = pathSegments[i]
    if (!segment || ['usuario', 'validator', 'admin'].includes(segment)) continue

    let label = formatLabel(segment)

    // Si tenemos un label personalizado en el store para este segmento, lo usamos
    // (Útil para reemplazar IDs numéricos por nombres reales de cursos, expedientes, etc.)
    if (breadcrumbStore.customLabels[segment]) {
      label = truncateToWords(breadcrumbStore.customLabels[segment])
    }

    if (result.some(c => c.label === label)) continue

    result.push({ label: truncateToWords(label.trim()) })
  }

  return result
})
</script>
