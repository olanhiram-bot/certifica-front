import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBreadcrumbStore = defineStore('breadcrumb', () => {
  const customLabels = ref<Record<string, string>>({})

  /** stampId del expediente que está revisando el validador actualmente */
  const validatorStampId = ref<number | null>(null)

  /** Ruta anterior del usuario para determinar el breadcrumb correcto */
  const previousRoute = ref<string | null>(null)

  const setCustomLabel = (segment: string, label: string) => {
    customLabels.value[segment] = label
  }

  const clearCustomLabels = () => {
    customLabels.value = {}
  }

  const setValidatorStampId = (id: number | null) => {
    validatorStampId.value = id
  }

  const setPreviousRoute = (route: string | null) => {
    previousRoute.value = route
  }

  return {
    customLabels,
    validatorStampId,
    previousRoute,
    setCustomLabel,
    clearCustomLabels,
    setValidatorStampId,
    setPreviousRoute
  }
})
