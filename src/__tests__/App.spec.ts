import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { setActivePinia, createPinia } from 'pinia'
import App from '../App.vue'
import type { Router } from 'vue-router'
import { useLoadingStore } from '@/stores/loading'

const RouterViewMock = {
  name: 'RouterView',
  template: '<div class="router-view-mock"><slot /></div>',
}

describe('App.vue', () => {
  let router: Router

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

  it('debe renderizar el componente', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router],
        stubs: { 'router-view': RouterViewMock },
      },
    })
    await flushPromises()
    expect(wrapper.exists()).toBe(true)
  })

  it('no debe mostrar el loading por defecto', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router],
        stubs: {
          'router-view': RouterViewMock,
          LoadingScreen: { 
            template: '<div class="loading-screen">Loading...</div>',
            props: ['msg']
          },
        },
      },
    })
    await flushPromises()
    expect(wrapper.find('.loading-screen').exists()).toBe(false)
  })

  it('debe mostrar el loading cuando esta activo', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router],
        stubs: {
          'router-view': RouterViewMock,
          LoadingScreen: { 
            template: '<div class="loading-screen">{{ $attrs.msg }}</div>',
            props: ['msg']
          },
        },
      },
    })
    await flushPromises()
    const loadingStore = useLoadingStore()
    loadingStore.setLoading('Cargando datos...')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.loading-screen').exists()).toBe(true)
  })

  it('debe pasar el mensaje al store', async () => {
    const loadingStore = useLoadingStore()
    loadingStore.setLoading('Procesando información...')
    expect(loadingStore.active).toBe(true)
    expect(loadingStore.msg).toBe('Procesando información...')
  })

  it('debe ocultar el loading al limpiar', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router],
        stubs: {
          'router-view': RouterViewMock,
          LoadingScreen: { 
            template: '<div class="loading-screen">Loading</div>',
            props: ['msg']
          },
        },
      },
    })
    await flushPromises()
    const loadingStore = useLoadingStore()
    loadingStore.setLoading('Test')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.loading-screen').exists()).toBe(true)
    loadingStore.clearLoading()
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.loading-screen').exists()).toBe(false)
  })
})