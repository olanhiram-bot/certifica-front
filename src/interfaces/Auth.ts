export interface LoginResponse {
  data: {
    user: {
      id: number
      username: string
      email: string
      role: string
      rfc?: string
      user?: Record<string, unknown>
    }
    token: string
    permissions: string[]
  }
}
