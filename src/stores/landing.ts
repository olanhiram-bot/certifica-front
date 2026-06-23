import { defineStore } from 'pinia'
import type { LandingContent } from '@/interfaces/LandingContent'
import { getCarouselItems, getFaqItems, getAccordionItems, getAccordionUsuarioItems, getInstituciones } from '@/api/landingContent'

export const useLandingStore = defineStore('landing', {
  state: () => ({
    carouselImages: [] as LandingContent[],
    faqItems: [] as LandingContent[],
    accordionItems: [] as LandingContent[],
    accordionUsuarioItems: [] as LandingContent[],
    instituciones: [] as LandingContent[],
    carouselLoading: true,
    faqLoading: true,
    loading: false,
    error: null as string | null
  }),
  actions: {
    async fetchCarouselItems() {
      this.carouselLoading = true
      this.loading = true
      this.error = null
      try {
        const response = await getCarouselItems()
        this.carouselImages = response.data.data
      } catch {
        this.error = 'Error al cargar el carrusel'
      } finally {
        this.carouselLoading = false
        this.loading = false
      }
    },
    async fetchFaqItems() {
      this.faqLoading = true
      this.loading = true
      this.error = null
      try {
        const response = await getFaqItems()
        this.faqItems = response.data.data
      } catch {
        this.error = 'Error al cargar las preguntas frecuentes'
      } finally {
        this.faqLoading = false
        this.loading = false
      }
    },
    async fetchAccordionItems() {
      if (this.accordionItems.length > 0) return
      this.loading = true
      this.error = null
      try {
        const response = await getAccordionItems()
        this.accordionItems = response.data.data
      } catch {
        this.error = 'Error al cargar el acordeón'
      } finally {
        this.loading = false
      }
    },
    async fetchAccordionUsuarioItems() {
      if (this.accordionUsuarioItems.length > 0) return
      this.loading = true
      this.error = null
      try {
        const response = await getAccordionUsuarioItems()
        this.accordionUsuarioItems = response.data.data
      } catch {
        this.error = 'Error al cargar el acordeón de usuario'
      } finally {
        this.loading = false
      }
    },
    async fetchInstituciones() {
      this.loading = true
      this.error = null
      try {
        const response = await getInstituciones()
        this.instituciones = response.data.data
      } catch {
        this.error = 'Error al cargar las instituciones'
      } finally {
        this.loading = false
      }
    }
  }
})
