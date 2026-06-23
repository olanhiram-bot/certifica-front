import httpClient from '@/api/http'
import type { LoginResponse } from '@/interfaces/Auth'
import type { AxiosResponse } from 'axios'

const login = (username: string, password: string): Promise<AxiosResponse<LoginResponse>> =>
  httpClient.post('/login/username', { username, password })

const loginSSO = (authorizationCode: string): Promise<AxiosResponse<LoginResponse>> =>
  httpClient.post('/login/sso', { authorization_code: authorizationCode })

const loginByEfirma = (
  cer: File,
  key: File,
  password: string
): Promise<AxiosResponse<LoginResponse>> => {
  const formData = new FormData()
  formData.append('cer', cer)
  formData.append('key', key)
  formData.append('password', password)

  return httpClient.post('/login/efirma', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

const register = (
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string,
): Promise<AxiosResponse<LoginResponse>> =>
  httpClient.post('/register', {
    name,
    email,
    password,
    password_confirmation: passwordConfirmation,
  })

export { login, loginSSO, loginByEfirma, register }
