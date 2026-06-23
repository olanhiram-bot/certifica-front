import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    active: <boolean>false,
    msg: <string>'',
  }),
  actions: {
    setLoading(msg: string) {
      this.active = true
      this.msg = msg
    },
    clearLoading() {
      this.active = false
      this.msg = ''
    },
  },
})