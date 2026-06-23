import { getSections } from '@/api/sections'
import type { SectionResource } from '@/interfaces/Section'
import { defineStore } from 'pinia'

export const useSectionsStore = defineStore('sections', {
  state: () => ({
    sections: [] as SectionResource[],
    loading: false,
  }),
  actions: {
    async fetchSections(sectionTypeId: number, stampId?: number) {
      if (this.loading) return
      this.loading = true
      try {
        const response = await getSections(sectionTypeId, stampId)
        this.sections = response.data.data
      } finally {
        this.loading = false
      }
    },
    clearSections() {
      this.sections = []
    },
  },
})
