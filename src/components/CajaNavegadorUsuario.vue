<template>
  <div class="area_navegadores">
    <div class="caja_navegador">
      <div class="d-flex justify-content-between align-items-center w-100">
        <div class="text-start">
          <span>{{ labels?.[0] ?? 'Nuevos' }}</span>
      <div class="numero" style="font-size:3rem; font-weight:700; line-height:1">{{ displayData.news }}</div>
        </div>
        <div class="icono_caja">
          <img src="@/assets/images/cajanavegador_calendar.png" :alt="labels?.[0] ?? 'Nuevos'" style="width:4rem; height:auto" />
        </div>
      </div>
    </div>
    <div class="caja_navegador">
      <div class="d-flex justify-content-between align-items-center w-100">
        <div class="text-start">
          <span>{{ labels?.[1] ?? 'Comentarios' }}</span>
      <div class="numero" style="font-size:3rem; font-weight:700; line-height:1">{{ displayData.comments }}</div>
        </div>
        <div class="icono_caja">
          <img src="@/assets/images/cajanavegador_comments.png" :alt="labels?.[1] ?? 'Comentarios'" style="width:4rem; height:auto" />
        </div>
      </div>
    </div>
    <div class="caja_navegador">
      <div class="d-flex justify-content-between align-items-center w-100">
        <div class="text-start">
          <span>{{ labels?.[2] ?? 'Evidencias' }}</span>
      <div class="numero" style="font-size:3rem; font-weight:700; line-height:1">{{ displayData.evidencias }}</div>
        </div>
        <div class="icono_caja">
          <img src="@/assets/images/cajanavegador_evidence.png" :alt="labels?.[2] ?? 'Evidencias'" style="width:4rem; height:auto" />
        </div>
      </div>
    </div>
    <div class="caja_navegador">
      <div class="d-flex justify-content-between align-items-center w-100">
        <div class="text-start">
          <span>{{ labels?.[3] ?? 'Evaluación documental' }}</span>
      <div class="numero" style="font-size:3rem; font-weight:700; line-height:1">{{ displayData.protocolos }}</div>
        </div>
        <div class="icono_caja">
          <img src="@/assets/images/cajanavegador_upload.png" :alt="labels?.[3] ?? 'Evaluación documental'" style="width:4rem; height:auto" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import httpClient from '@/api/http'
import { computed, onMounted, ref } from 'vue'

interface ResumeData {
  days_remaining?: number
  comments?: number
  evidences_to_upload?: number
  protocols_to_upload?: number
  news?: number
  evidences?: number
  protocols?: number
}

const props = defineProps<{
  endpoint?: string
  labels?: string[]
}>()

const datos = ref<ResumeData | null>(null)
const loaded = ref(false)

const fetchDatos = async () => {
  if (!props.endpoint) return

  try {
    const response = await httpClient.get(props.endpoint)
    datos.value = response.data
    loaded.value = true
  } catch (error) {
    console.error('Error fetching datos:', error)
  }
}

onMounted(() => {
  fetchDatos()
})

const isUsuario = computed(() => props.endpoint === '/dashboard/resume')

const displayData = computed(() => {
  if (!loaded.value || !datos.value) {
    return { news: 0, comments: 0, evidencias: 0, protocolos: 0 }
  }
  const d = datos.value

  if (isUsuario.value) {
    return {
      news: d.days_remaining ?? 0,
      comments: d.comments ?? 0,
      evidencias: d.evidences_to_upload ?? 0,
      protocolos: d.protocols_to_upload ?? 0
    }
  }

  return {
    news: d.news ?? 0,
    comments: d.comments ?? 0,
    evidencias: d.evidences ?? 0,
    protocolos: d.protocols ?? 0
  }
})
</script>

<style scoped>
/* Estado deshabilitado: reduce el número y bloquea interacción */
.caja_navegador.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.caja_navegador.disabled .numero {
  font-size: 1.5rem;
}
</style>
