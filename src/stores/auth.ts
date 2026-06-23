import { defineStore } from 'pinia'
import type { AuthUser, UserResponse } from '@/interfaces/User'
import { loginSSO } from '@/api/auth'
import { useStampStore } from '@/stores/stamp'

/**
 * @author JaredDmz
 * Storage session app
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    logged: false,
    token: '',
    user: null as AuthUser | UserResponse | null,
    permissions: [] as string[],
  }),
  actions: {
    logout() {
      this.logged = false
      this.token = ''
      this.user = null
      this.permissions = []
      useStampStore().clearStamp()
    },

    setSession(token: string, user: AuthUser | UserResponse, permissions: string[]) {
      this.logged = true
      this.token = token
      this.user = user
      this.permissions = permissions
    },

    async handleSSOCallback(authorizationCode: string): Promise<void> {
      const response = await loginSSO(authorizationCode)
      const { token, user, permissions } = response.data.data

      this.setSession(token, user, permissions)
    },
  },
  persist: true,
})
