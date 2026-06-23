import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import LoginForm from '../LoginForm.vue'
import { defineRule } from 'vee-validate'
import { required, min, max } from '@vee-validate/rules'

vi.mock('vue-toast-notification', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
}))

beforeAll(() => {
  defineRule('required', required)
  defineRule('min', min)
  defineRule('max', max)
})

describe('LoginForm.vue', () => {
  let router: ReturnType<typeof createRouter>

  beforeEach(() => {
    setActivePinia(createPinia())
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
        { path: '/login', name: 'login', component: { template: '<div>Login</div>' } },
      ],
    })
  })

  it('debe renderizar un elemento formulario', () => {
    const wrapper = mount(LoginForm, { global: { plugins: [router] } })
    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('debe renderizar los campos de usuario y contraseña', () => {
    const wrapper = mount(LoginForm, { global: { plugins: [router] } })
    expect(wrapper.find('#username').exists()).toBe(true)
    expect(wrapper.find('#password').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
  })

  it('debe renderizar un botón de envío con el texto correcto', () => {
    const wrapper = mount(LoginForm, { global: { plugins: [router] } })
    const button = wrapper.find('button[type="submit"]')
    expect(button.exists()).toBe(true)
    expect(button.text()).toContain('Iniciar sesión')
  })
})
