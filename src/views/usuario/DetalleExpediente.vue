<template>
  <div class="contenedor_general">
    <Breadcrum />

    <div v-if="loading" class="estado_pagina">Cargando expediente...</div>
    <div v-else-if="error" class="estado_pagina estado_pagina--error">{{ error }}</div>

    <template v-else-if="stamp">
      <div class="cabecera_detalle">
        <div class="cabecera_info">
          <h4 class="titulo_seccion">Expediente #{{ stamp.id }}</h4>
          <span
            class="badge_estado"
            :style="{
              background: stamp.stamp_status?.color + '33',
              borderColor: stamp.stamp_status?.color,
              color: '#000'
            }"
          >
            {{ stamp.stamp_status?.name }}
          </span>
        </div>
        <button class="btn-regresar" @click="router.back()">
          <span class="material-symbols-outlined">arrow_back</span>
          Regresar
        </button>
      </div>

      <div class="grid_detalle">

        <div class="tarjeta_detalle elevacion_5">
          <h6 class="tarjeta_titulo">Usuario</h6>
          <div class="campo">
            <span class="campo_label">Nombre</span>
            <span class="campo_valor">{{ stamp.provider?.name ?? stamp.provider?.username ?? '—' }}</span>
          </div>
          <div class="campo">
            <span class="campo_label">Usuario</span>
            <span class="campo_valor">{{ stamp.provider?.username ?? '—' }}</span>
          </div>
          <div class="campo">
            <span class="campo_label">RFC</span>
            <span class="campo_valor">{{ stamp.provider?.rfc ?? '—' }}</span>
          </div>
          <div class="campo">
            <span class="campo_label">Correo</span>
            <span class="campo_valor">{{ stamp.provider?.email ?? '—' }}</span>
          </div>
        </div>

        <div class="tarjeta_detalle elevacion_5">
          <h6 class="tarjeta_titulo">Certificacion</h6>
          <div class="campo">
            <span class="campo_label">Folio</span>
            <span class="campo_valor">{{ stamp.id }}</span>
          </div>
          <div class="campo">
            <span class="campo_label">Avance</span>
            <span class="campo_valor">{{ stamp.percent }}%</span>
          </div>
          <div class="campo">
            <span class="campo_label">Fecha de creación</span>
            <span class="campo_valor">{{ stamp.created_at ? new Date(stamp.created_at).toLocaleDateString('es-MX') : '—' }}</span>
          </div>
          <div class="campo">
            <span class="campo_label">Vigencia inicio</span>
            <span class="campo_valor">{{ stamp.vigency_start_date ? new Date(stamp.vigency_start_date).toLocaleDateString('es-MX') : '—' }}</span>
          </div>
          <div class="campo">
            <span class="campo_label">Vigencia fin</span>
            <span class="campo_valor">{{ stamp.vigency_end_date ? new Date(stamp.vigency_end_date).toLocaleDateString('es-MX') : '—' }}</span>
          </div>
          <div class="campo">
            <span class="campo_label">Días restantes</span>
            <span class="campo_valor">{{ stamp.remaining_days !== null ? stamp.remaining_days + ' días' : '—' }}</span>
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

<style scoped>
.estado_pagina         { padding: 40px; text-align: center; color: #6c757d; }
.estado_pagina--error  { color: #e53e3e; }

.cabecera_detalle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.cabecera_info { display: flex; align-items: center; gap: 14px; }
.titulo_seccion { font-size: 20px; font-weight: 700; color: #111827; margin: 0; }

.badge_estado {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  border: 2px solid;
}

.btn-regresar {
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 2px solid orange;
  color: orange;
  border-radius: 6px;
  padding: 8px 16px;
  font-weight: 500;
  cursor: pointer;
}
.btn-regresar .material-symbols-outlined { font-size: 18px; }

.grid_detalle {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.tarjeta_detalle {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
}
.tarjeta_titulo {
  font-size: 14px;
  font-weight: 700;
  color: #f57c00;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f5f5f5;
}

.campo { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f9f9f9; }
.campo:last-child { border-bottom: none; }
.campo_label { font-size: 13px; color: #6c757d; }
.campo_valor  { font-size: 13px; color: #111827; font-weight: 500; text-align: right; }
</style>
