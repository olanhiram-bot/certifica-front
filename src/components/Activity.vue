<template>
  <div class="caja_tarjeta h-100 d-flex flex-column">
    <div class="imagen_tarjeta">
      <img decoding="async" :src="path + image" alt="" />
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
      <div class="w-100 d-flex justify-content-end align-self-end mt-auto default">
        <button v-if="isEdit" type="button" class="boton boton_terciario solo_icono" @click="$emit('edit')">
          <span class="material-icons">edit</span>
        </button>
        <button v-if="isDelete" type="button" class="boton boton_terciario solo_icono" @click="$emit('delete')">
          <span class="material-icons">delete</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type PropType } from 'vue'

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
</script>
