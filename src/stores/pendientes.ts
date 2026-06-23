import { defineStore } from 'pinia'
import {
  getDashboardPendientes,
  getDashboardResume,
  getDashboardStampStatuses,
  type ProviderStamp,
  type LinkPaginateMeta,
  type DashboardResume,
  type StampStatusWithCount,
} from '@/api/pendientes'

export interface TabCounts {
  todos: number
}

export interface ResumenCards {
  nuevos:      number
  comentarios: number
  evidencias:  number
  protocolos:  number
}

export const usePendientesStore = defineStore('pendientes', {
  state: () => ({
    pendientes:    [] as ProviderStamp[],
    links:         [] as LinkPaginateMeta[],
    currentPage:   1,
    lastPage:      1,
    perPage:       8,
    total:         0,
    to:            null as number | null,
    loading:       false,
    error:         null as string | null,
    activeFilters: {} as Record<string, string | number>,
    tabCounts:       { todos: 0 } as TabCounts,
    stampStatuses:   [] as StampStatusWithCount[],
    loadingStatuses: true,
    resumenCards:  { nuevos: 0, comentarios: 0, evidencias: 0, protocolos: 0 } as ResumenCards,
  }),

  actions: {
    async fetchPendientes(page = 1) {
      this.loading = true
      this.error   = null
      try {
        const response = await getDashboardPendientes({ ...this.activeFilters, page })
        const { data, meta } = response.data
        this.pendientes  = data
        this.links       = meta.links
        this.currentPage = meta.current_page
        this.lastPage    = meta.last_page
        this.perPage     = meta.per_page
        this.total       = meta.total
        this.to          = meta.to
        // Actualiza el conteo del tab "Todos" con el total real
        if (Object.keys(this.activeFilters).length === 0) {
          this.tabCounts.todos = meta.total
        }
      } catch {
        this.error      = 'Error al obtener los expedientes pendientes'
        this.pendientes = []
      } finally {
        this.loading = false
      }
    },

    async fetchTabCounts() {
      this.loadingStatuses = true
      try {
        const [resumeRes, statusesRes] = await Promise.all([
          getDashboardResume(),
          getDashboardStampStatuses(),
        ])

        const resume: DashboardResume            = resumeRes.data
        const statuses: StampStatusWithCount[]   = statusesRes.data

        this.tabCounts = { todos: this.total }
        this.stampStatuses = statuses

        this.resumenCards = {
          nuevos:      resume.news,
          comentarios: resume.comments,
          evidencias:  resume.evidences,
          protocolos:  resume.protocols,
        }
      } catch {
        // no bloquea el flujo principal
      } finally {
        this.loadingStatuses = false
      }
    },

    setFilter(filters: Record<string, string | number>) {
      this.activeFilters = filters
    },
  },
})
