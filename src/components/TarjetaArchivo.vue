<template>


  <div class="seccion_tarjetas">
    <div class="caja_tarjeta p-3 ">
      <div class=" col-12">
        <div v-if="imagen" class="archivo_imagen">
          <img :src="imagen" :alt="titulo" loading="lazy" />
        </div>
        <div v-else class="icono_seccion row-12">
          <i class="bi bi-file-earmark-pdf fs-1 text-danger"></i>
        </div>
        <h4>{{ tituloCorto }}</h4>
        <small v-if="nombreArchivo" class="nombre_archivo text-muted" v-tooltip="nombreArchivo">{{ nombreArchivoCorto }}</small>
      </div>
      <div class="descripcion_archivo mt-2 mb-2">{{ descripcion }}</div>
      <div v-if="estado" class="text-start mt-2 mb-2">
        <span class="boton_etiqueta" :style="estado === 'Sin Iniciar' ? {
          background: '#F3F4F6',
          borderColor: '#D1D5DB',
          color: '#6B7280'
        } : {
          background: `linear-gradient(135deg, ${estadoColor}30, ${estadoColor}20)`,
          borderColor: estadoColor
        }">
          {{ estado }}
        </span>
      </div>

      <div class="mt-auto">
        <div class="d-grid gap-2">

          <a v-if="descargarUrl" :href="descargarUrl" target="_blank" rel="noopener noreferrer" class="boton boton_secundario">
            <span class="material-icons-outlined">visibility</span> Ver
          </a>
          <button v-else-if="esVisualizacion" type="button" class="boton boton_primario" @click="$emit('click')">
            <span class="material-icons-outlined">visibility</span> Ver
          </button>
          <button v-else-if="boton" type="button" class="boton boton_primario" :disabled="disabledBoton"
            @click="handleButtonClick">
            <span class="material-icons-outlined">{{ botonIcon }}</span> {{ boton }}
          </button>

        </div>
        <div class="d-flex gap-2 mt-2">
          <button v-if="mostrarVistaPrevia" type="button" class="boton boton_secundario flex-fill"
            @click="$emit('vista-previa')">
            <span class="material-icons">visibility</span> Vista Previa
          </button>
          <button v-if="mostrarBorrar" type="button" class="boton boton_secundario solo_icono flex-fill" @click="$emit('borrar')">
            <span class="material-icons">delete</span>
          </button>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  titulo: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  boton: {
    type: String,
    default: ''
  },
  mostrarBorrar: {
    type: Boolean,
    default: false
  },
  estado: {
    type: String,
    default: ''
  },
  estadoColor: {
    type: String,
    default: ''
  },
  descargarUrl: {
    type: String,
    default: ''
  },
  esVisualizacion: {
    type: Boolean,
    default: false
  },
  disabledBoton: {
    type: Boolean,
    default: false
  },
  mostrarVistaPrevia: {
    type: Boolean,
    default: false
  },
  mostrarBotonesSecundarios: {
    type: Boolean,
    default: false
  },
  nombreArchivo: {
    type: String,
    default: ''
  },
  imagen: {
    type: String,
    default: ''
  }
})

const botonIcon = computed(() => {
  const label = props.boton.toLowerCase()
  if (label.includes('volver') || label.includes('enviar')) return 'u_turn_left'
  if (label.includes('revisar')) return 'visibility'
  if (label.includes('ver')) return 'visibility'
  return 'file_upload'
})

const tituloCorto = computed(() => props.titulo ?? '')

const nombreArchivoCorto = computed(() => {
  const nombre = props.nombreArchivo ?? ''
  if (!nombre) return ''
  const dotIndex = nombre.lastIndexOf('.')
  if (dotIndex <= 0) {
    return nombre.length > 30 ? nombre.slice(0, 30) + '...' : nombre
  }
  const base = nombre.slice(0, dotIndex)
  const ext = nombre.slice(dotIndex)
  return base.length > 30 ? base.slice(0, 30) + '...' + ext : nombre
})

const emit = defineEmits(['click', 'borrar', 'vista-previa'])

const handleButtonClick = () => {
  if (props.disabledBoton) return
  emit('click')
}

</script>

<style scoped>
.seccion_tarjetas {
  display: block;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.caja_tarjeta {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  min-width: 0;
}

.archivo_imagen {
  aspect-ratio: 16 / 9;
  background: #eef2f7;
  border-radius: 6px;
  margin-bottom: 1rem;
  overflow: hidden;
  width: 100%;
}

.archivo_imagen img {
  display: block;
  height: 100%;
  object-fit: cover;
  object-position: center;
  width: 100%;
}
</style>
