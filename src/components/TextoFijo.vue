<template>
  <div class="my-3">
    <h3 v-if="data.titulo" class="fs-5 fw-semibold mb-3 text-dark">{{ data.titulo }}</h3>
    <div v-if="data.contenidoHtml" class="lh-base" v-html="data.contenidoHtml"></div>
    <div v-else class="lh-base">
      <template v-for="(bloque, index) in contenidoProcesado" :key="index">
        <p v-if="bloque.tipo === 'parrafo'" class="mb-3">
          <template v-for="(parte, i) in bloque.partes" :key="i">
            <RouterLink v-if="parte.tipo === 'link' && parte.url" :to="parte.url" class="texto-fijo-link">
              {{ parte.texto }}
            </RouterLink>
            <span v-else>{{ parte.texto }}</span>
          </template>
        </p>
        <ul v-else-if="bloque.tipo === 'lista'" class="my-2 ps-4">
          <li v-for="(item, i) in bloque.items" :key="i" class="mb-2">
            <template v-for="(parte, j) in item.partes" :key="j">
              <RouterLink v-if="parte.tipo === 'link' && parte.url" :to="parte.url" class="texto-fijo-link">
                {{ parte.texto }}
              </RouterLink>
              <span v-else>{{ parte.texto }}</span>
            </template>
          </li>
        </ul>
      </template>

      <div v-if="data.checkbox" class="elemento_forma caja_checkbox mt-3">
        <label class="checkbox">
          <input
            type="checkbox"
            :id="data.checkbox.id"
            :checked="data.checkbox.modelValue"
            @change="emit('update:checkbox', ($event.target as HTMLInputElement).checked)"
          />
          {{ data.checkbox.texto }}
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TextoFijoProps } from '@/interfaces/TextoFijoProps'

const props = defineProps<{
  data: TextoFijoProps
}>()

const emit = defineEmits<{
  'update:checkbox': [value: boolean]
}>()

interface Parte {
  tipo: 'texto' | 'link'
  texto: string
  url?: string
}

interface Bloque {
  tipo: 'parrafo' | 'lista'
  texto?: string
  partes?: Parte[]
  items?: { texto: string; partes: Parte[] }[]
}

const esViñeta = (texto: string): boolean => {
  const trimmed = texto.trim()
  return trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')
}

const contenidoProcesado = computed(() => {
  const lineas = props.data.contenido.split('\n')
  const bloques: Bloque[] = []

  let parrafoActual: string[] = []
  let listaActual: string[] = []

  const agregarParrafo = () => {
    if (parrafoActual.length > 0) {
      const texto = parrafoActual.join(' ').trim()
      if (texto) {
        bloques.push({
          tipo: 'parrafo',
          texto,
          partes: [{ tipo: 'texto', texto }]
        })
      }
      parrafoActual = []
    }
  }

  const agregarLista = () => {
    if (listaActual.length > 0) {
      const items = listaActual.map(linea => {
        const texto = linea.trim().replace(/^[•\-*]\s*/, '')
        return { texto, partes: [{ tipo: 'texto', texto }] as Parte[] }
      })
      bloques.push({ tipo: 'lista', items })
      listaActual = []
    }
  }

  const procesarLinks = (texto: string): Parte[] => {
    if (!props.data.links || props.data.links.length === 0) {
      return [{ tipo: 'texto', texto }]
    }

    const partes: Parte[] = []
    let restante = texto
    const linksOrdenados = [...props.data.links].sort((a, b) => b.texto.length - a.texto.length)

    while (restante.length > 0) {
      let linkEncontrado = false
      for (const link of linksOrdenados) {
        const index = restante.indexOf(link.texto)
        if (index !== -1) {
          if (index > 0) {
            partes.push({ tipo: 'texto', texto: restante.substring(0, index) })
          }
          partes.push({ tipo: 'link', texto: link.texto, url: link.url })
          restante = restante.substring(index + link.texto.length)
          linkEncontrado = true
          break
        }
      }
      if (!linkEncontrado) {
        partes.push({ tipo: 'texto', texto: restante })
        break
      }
    }
    return partes
  }

  for (const linea of lineas) {
    const trimmed = linea.trim()

    if (trimmed === '') {
      agregarParrafo()
      agregarLista()
    } else if (esViñeta(linea)) {
      agregarParrafo()
      listaActual.push(linea)
    } else {
      agregarLista()
      parrafoActual.push(linea)
    }
  }

  agregarParrafo()
  agregarLista()

  for (const bloque of bloques) {
    if (bloque.tipo === 'parrafo' && bloque.texto) {
      bloque.partes = procesarLinks(bloque.texto)
    } else if (bloque.tipo === 'lista' && bloque.items) {
      for (const item of bloque.items) {
        item.partes = procesarLinks(item.texto)
      }
    }
  }

  return bloques
})
</script>


