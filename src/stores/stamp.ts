import { activateStamp, createStamp, createStampActivity, deleteStamp, getCurrentByProvider, getStampActivities, getStampActivity } from '@/api/stamp'
import { getStamp as getStampAsAdmin } from '@/api/validator'
import type { Stamp, StampActivityResource } from '@/interfaces/Stamp'
import { defineStore } from 'pinia'

export const useStampStore = defineStore('stamp', {
  state: () => ({
    currentStamp: null as Stamp | null,
    stampActivities: [] as StampActivityResource[],
    currentActivity: null as StampActivityResource | null,
    loading: false,
    loaded: false,
    error: null as string | null,
    currentProvider: null as {
      id: number
      name: string | null
      username: string
      email: string | null
      rfc: string | null
    } | null,
  }),
  getters: {
    isActive: (state) => {
      const active = state.currentStamp?.is_active
      return active === '1' || active === true
    },
    isEditable: (state) => {
      const statusId = state.currentStamp?.stamp_status_id ?? state.currentStamp?.stamp_status?.id
      return statusId === 1 || statusId === 6
    },
    isRechazado: (state) => {
      const statusId = state.currentStamp?.stamp_status_id ?? state.currentStamp?.stamp_status?.id
      return statusId === 6
    },
    isAprobado: (state) => {
      const statusId = state.currentStamp?.stamp_status_id ?? state.currentStamp?.stamp_status?.id
      return statusId === 4
    },
    isEnRevision: (state) => {
      const statusId = state.currentStamp?.stamp_status_id ?? state.currentStamp?.stamp_status?.id
      return statusId === 3
    },
    isVencido: (state) => {
      const statusId = state.currentStamp?.stamp_status_id ?? state.currentStamp?.stamp_status?.id
      return statusId === 5
    },
    percent: (state) => parseFloat(String(state.currentStamp?.percent ?? 0)),
    percentModuls: (state) => parseFloat(String(state.currentStamp?.percent_moduls ?? 0)),
    percentEvaluations: (state) => parseFloat(String(state.currentStamp?.percent_evaluations ?? 0)),
    isModulesComplete: (state) => {
      const percent = parseFloat(String(state.currentStamp?.percent_moduls ?? 0))
      return percent >= 100
    },
    isEvaluationsComplete: (state) => {
      const percent = parseFloat(String(state.currentStamp?.percent_evaluations ?? 0))
      return percent >= 100
    },
    canAccessProtocols: (state) => {
      const percent = parseFloat(String(state.currentStamp?.percent_moduls ?? 0))
      return percent >= 100
    },
    vigenciaInicio: (state) => state.currentStamp?.vigency_start_date ?? null,
    vigenciaFin: (state) => state.currentStamp?.vigency_end_date ?? null,
    isExpired: (state) => {
      const remainingDays = state.currentStamp?.remaining_days
      if (remainingDays === undefined || remainingDays === null) return false
      return remainingDays <= 0
    },
    remainingDays: (state) => state.currentStamp?.remaining_days ?? null,
    hasStamp: (state) => state.currentStamp !== null,
    modalityTypeId: (state) => state.currentStamp?.modality_type_id ?? null,
    modalityName: (state) => {
      const modalityId = state.currentStamp?.modality_type_id
      if (modalityId === 1) {
        return 'Capacitación en Plataforma Certifica'
      }
      if (modalityId === 2) {
        return 'Capacitación por Usuario Externo'
      }
      return 'Capacitación por Usuario (Externo)'
    }
  },
  actions: {
    async fetchCurrentStamp() {
      if (this.loading) return
      this.loading = true
      this.error = null
      try {
        const response = await getCurrentByProvider()
        this.currentStamp = response.data.data
      } catch (e: unknown) {
        console.error('[STAMP] fetchCurrentStamp - error:', e)
        const axiosError = e as { response?: { status?: number } }
        if (axiosError.response?.status === 404 || axiosError.response?.status === 500) {
          this.currentStamp = null
        } else {
          this.error = 'Error al obtener la certificacion actual'
        }
      } finally {
        this.loaded = true
        this.loading = false
      }
    },
    async createNewStamp(modalityTypeId: number) {
      this.loading = true
      this.error = null
      try {
        const response = await createStamp(modalityTypeId)
        this.currentStamp = response.data.data
        return this.currentStamp
      } catch (e) {
        console.error('[STAMP] createNewStamp - error:', e)
        this.error = 'Error al crear la certificacion'
        throw e
      } finally {
        this.loading = false
      }
    },
    async fetchStampActivities(stampId: number) {
      this.loading = true
      this.error = null
      try {
        const response = await getStampActivities(stampId)
        this.stampActivities = response.data.data
      } catch (e) {
        console.error('[STAMP] fetchStampActivities - error:', e)
        this.error = 'Error al obtener las actividades de la certificacion'
        this.stampActivities = []
      } finally {
        this.loading = false
      }
    },
    async addActivityToStamp(activityId: number) {
      if (!this.currentStamp) {
        this.error = 'No hay certificacion activa para agregar actividades'
        return
      }
      this.loading = true
      this.error = null
      try {
        const response = await createStampActivity(this.currentStamp.id, activityId)
        const newActivity = response.data.data
        const existingIndex = this.stampActivities.findIndex(sa => sa.activity_id === activityId)
        if (existingIndex >= 0) {
          this.stampActivities[existingIndex] = newActivity
        } else {
          this.stampActivities.push(newActivity)
        }
        return newActivity
      } catch (e) {
        console.error('[STAMP] addActivityToStamp - error:', e)
        this.error = 'Error al agregar la actividad al certificacion'
        throw e
      } finally {
        this.loading = false
      }
    },
    async activateCurrentStamp() {
      if (!this.currentStamp) {
        this.error = 'No hay certificacion activo para activar'
        return
      }
      this.loading = true
      this.error = null
      try {
        const response = await activateStamp(this.currentStamp.id)
        this.currentStamp = response.data.data
      } catch (e) {
        console.error('[STAMP] activateCurrentStamp - error:', e)
        this.error = 'Error al activar el certificacion'
        throw e
      } finally {
        this.loading = false
      }
    },
    clearStamp() {
      this.currentStamp = null
      this.stampActivities = []
      this.currentActivity = null
      this.error = null
      this.loaded = false
    },
    async fetchStampActivityById(stampActivityId: number) {
      this.loading = true
      this.error = null
      try {
        const response = await getStampActivity(stampActivityId)
        this.currentActivity = response.data.data
        return this.currentActivity
      } catch (e) {
        console.error('[STAMP] fetchStampActivityById - error:', e)
        this.error = 'Error al obtener la actividad'
        throw e
      } finally {
        this.loading = false
      }
    },
    async fetchStampByIdAsAdmin(stampId: number) {
      this.loading = true
      this.error = null
      try {
        const response = await getStampAsAdmin(stampId)
        const validatorStamp = response.data.data
        // Map ValidatorStamp → Stamp (compatible shape, cast to keep store typed)
        this.currentStamp = validatorStamp as unknown as Stamp
        // Populate currentProvider from the embedded provider relation
        if (validatorStamp.provider) {
          this.currentProvider = {
            id: validatorStamp.provider.id,
            name: validatorStamp.provider.name ?? null,
            username: validatorStamp.provider.username,
            email: validatorStamp.provider.email ?? null,
            rfc: validatorStamp.provider.rfc ?? null,
          }
        }
        return validatorStamp
      } catch (e) {
        console.error('[STAMP] fetchStampByIdAsAdmin - error:', e)
        this.error = 'Error al obtener el certificacion'
        throw e
      } finally {
        this.loading = false
      }
    },
    async deleteCurrentStamp(deletedReason?: string) {
      if (!this.currentStamp) {
        this.error = 'No hay certificacion activo para eliminar'
        return
      }
      this.loading = true
      this.error = null
      try {
        await deleteStamp(this.currentStamp.id, deletedReason)
        this.clearStamp()
      } catch (e: unknown) {
        console.error('[STAMP] deleteCurrentStamp - error:', e)
        const axiosError = e as { response?: { status?: number } }
        if (axiosError.response?.status === 204 || axiosError.response?.status === 200) {
          this.clearStamp()
          return
        }
        this.error = 'Error al eliminar la certificacion'
        throw e
      } finally {
        this.loading = false
      }
    },

    setCurrentProvider(provider: { id: number; name: string | null; username: string; email: string | null; rfc: string | null } | null) {
      this.currentProvider = provider
    },

    clearCurrentProvider() {
      this.currentProvider = null
    },
  }
})
