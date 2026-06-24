<template>
  <div class="caja_tarjeta h-100 d-flex flex-column">
    <div class="imagen_tarjeta">
    <img decoding="async" :src="imageSrc" alt="" />
    </div>
    <div class="cuerpo_tarjeta d-flex flex-column flex-grow-1">
      <h4 class="titulo_tarjeta">{{ title }}</h4>
      <p class="texto_tarjeta">
        {{ description }}
      </p>

      <div v-if="status" class="boton_etiqueta" :style="{
        background: `linear-gradient(135deg, ${status?.color}30, ${status?.color}20)`,
        borderColor: status?.color }">
        {{ status?.name }}
      </div>

      <!-- Action buttons -->
      <div v-if="isEvidence || isSupportMaterial || isValidate" class="d-grid gap-2 mt-auto w-100">
        <button v-if="isEvidence" type="button" class="boton boton_primario w-100" style="margin-left: 0px;"
          :disabled="disabledEvidence" @click="$emit('click-evidence')">
          <span class="material-icons">{{ evidenceIcon }}</span> {{ evidenceLabel }}
        </button>
        <button v-if="isSupportMaterial" type="button" class="boton boton_secundario w-100" style="margin-left: 0px;"
          :disabled="disabledSupportMaterial" @click="$emit('click-support-material')">
          Ver material de apoyo
        </button>
        <button v-if="isValidate" type="button" class="boton boton_primario w-100" style="margin-left: 0px;"
          :disabled="disabledValidate" @click="$emit('click-validate')">
          <span class="material-icons">visibility</span> Revisar evidencia
        </button>
      </div>

      <!-- Admin buttons -->
      <div class="activity-actions">
        <button v-if="isEdit" type="button" class="activity-action" aria-label="Editar actividad" @click="$emit('edit')">
          <i class="bi bi-pencil"></i>
        </button>
        <button v-if="isDelete" type="button" class="activity-action activity-action--danger" aria-label="Eliminar actividad" @click="$emit('delete')">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue'
import protocolCardImage from '@/assets/images/standard/protocol-card.png'

const path = import.meta.env.VITE_STORAGE_URL

defineEmits<{
  (e: 'edit'): void
  (e: 'delete'): void
  (e: 'click-evidence'): void
  (e: 'click-support-material'): void
  (e: 'click-validate'): void
}>()

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  image: {
    type: String,
    required: false
  },
  status: {
    type: Object as PropType<{ name: string; color: string }>,
    required: false
  },

  // Mostrar u ocultar botones de acción
  isEvidence: {
    type: Boolean,
    required: false
  },
  isSupportMaterial: {
    type: Boolean,
    required: false
  },
  isValidate: {
    type: Boolean,
    required: false
  },
  isEdit: {
    type: Boolean,
    required: false
  },
  isDelete: {
    type: Boolean,
    required: false
  },
  disabledEvidence: {
    type: Boolean,
    required: false
  },
  disabledSupportMaterial: {
    type: Boolean,
    required: false
  },
  disabledValidate: {
    type: Boolean,
    required: false
  },
  evidenceLabel: {
    type: String,
    default: 'Subir evidencia'
  },
  evidenceIcon: {
    type: String,
    default: 'upload'
  }
})

const imageSrc = computed(() => {
  if (!props.image) return protocolCardImage
  if (/^(https?:)?\/\//.test(props.image) || props.image.startsWith('/src/')) return props.image
  return `${path}${props.image}`
})
</script>

<style scoped>
.caja_tarjeta {
  min-width: 0;
  overflow: hidden;
}

.imagen_tarjeta {
  aspect-ratio: 16 / 9;
  background: #eef2f7;
  border-radius: 6px;
  flex: 0 0 auto;
  margin-bottom: 1rem;
  overflow: hidden;
  width: 100%;
}

.imagen_tarjeta img {
  display: block;
  height: 100%;
  object-fit: cover;
  object-position: center;
  width: 100%;
}

.titulo_tarjeta,
.texto_tarjeta {
  overflow-wrap: anywhere;
}

.activity-actions {
  display: flex;
  gap: 0.4rem;
  justify-content: flex-end;
  margin-top: auto;
  padding-top: 1rem;
  width: 100%;
}

.activity-action {
  align-items: center;
  background: #f5f8ff;
  border: 1px solid #d8e3ff;
  border-radius: 999px;
  color: #2563eb;
  display: inline-flex;
  height: 34px;
  justify-content: center;
  padding: 0;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  width: 34px;
}

.activity-action:hover,
.activity-action:focus-visible {
  background: #e8f0ff;
  border-color: #b8cbff;
  color: #1d4ed8;
}

.activity-action--danger {
  background: #fff7f7;
  border-color: #ffd6d6;
  color: #dc2626;
}

.activity-action--danger:hover,
.activity-action--danger:focus-visible {
  background: #fff0f0;
  border-color: #ffb8b8;
  color: #b91c1c;
}

.activity-action i {
  font-size: 0.95rem;
  line-height: 1;
}
</style>
