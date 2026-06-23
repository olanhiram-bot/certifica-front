<template>
  <div class="caja_navtab">
    <nav>
      <div class="nav nav-tabs es_completo es_landing" id="nav-tab" role="tablist">
        <button
          v-for="(pestana, index) in data"
          :key="index"
          class="nav-link"
          :class="{ 'active': index === pestanaActiva }"
          :id="`pestana-${index}-tab`"
          data-bs-toggle="tab"
          :data-bs-target="`#pestana-${index}`"
          type="button"
          role="tab"
          :aria-controls="`pestana-${index}`"
          :aria-selected="index === pestanaActiva ? 'true' : 'false'"
          @click="handlePestanaClick(index)"
        >
          {{ obtenerTituloPestana(pestana.titulo, index) }}
        </button>
      </div>
    </nav>
    <div class="tab-content" id="nav-tabContent1">
      <div
        v-for="(pestana, index) in data"
        :key="index"
        class="tab-pane fade"
        :class="{ 'active show': index === pestanaActiva }"
        :id="`pestana-${index}`"
        role="tabpanel"
        :aria-labelledby="`pestana-${index}-tab`"
      >
        <div class="contenido_pestana d-flex" v-if="pestana.contenido">
          <img
            v-if="pestana.contenido.imagen"
            :src="pestana.contenido.imagen"
            :alt="pestana.contenido.alt || ''"
            class="imagen_pestana me-3"
            style="max-width: 50%; height: auto;"
          />
          <div class="texto_pestana text-start my-auto">
            <h4 v-if="pestana.contenido.titulo">{{ pestana.contenido.titulo }}</h4>
            <div v-if="pestana.contenido.descripcion">
              <template v-for="(linea, i) in pestana.contenido.descripcion.split('\n').map(l => l.trim()).filter(l => l)" :key="i">
                <ul v-if="linea.startsWith('• ') || linea.startsWith('- ')" class="vinetas" style="margin: 0; padding-left: 20px;">
                  <li style="font-size: 16px">{{ linea.replace(/^[•\-]\s*/, '') }}</li>
                </ul>
                <p v-else style="font-size: 16px; margin: 0 0 8px 0;">{{ linea }}</p>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { PestanaData } from '@/interfaces/PestanaData'

defineProps<{
  data?: PestanaData[]
}>()

const pestanaActiva = ref(0)
const isMobile = ref(false)

const verificarMobile = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  verificarMobile()
  window.addEventListener('resize', verificarMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', verificarMobile)
})

const obtenerTituloPestana = (titulo: string, index: number) => {
  if (isMobile.value && index !== pestanaActiva.value) {
    return titulo.charAt(0)
  }
  return titulo
}

const handlePestanaClick = (index: number) => {
  pestanaActiva.value = index
}
</script>

<style scoped>
@media (max-width: 767px) {
  .caja_navtab .nav-tabs {
    display: flex !important;
    flex-direction: row !important;
    justify-content: space-between;
    white-space: nowrap;
    gap: 0;
  }

  .caja_navtab .nav-tabs .nav-link {
    flex: 1;
    text-align: center;
    padding: 0.5rem 0.25rem;
    font-size: 14px;
  }

  .caja_navtab .tab-content {
    margin-top: 1rem;
  }

  .caja_navtab .contenido_pestana {
    flex-direction: column-reverse !important;
  }

  .caja_navtab .imagen_pestana {
    max-width: 100% !important;
    width: 100% !important;
    margin-bottom: 1rem !important;
    margin-right: 0 !important;
  }
}
</style>
