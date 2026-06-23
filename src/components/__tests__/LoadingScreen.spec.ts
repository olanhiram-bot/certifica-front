import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LoadingScreen from '../LoadingScreen.vue'

describe('LoadingScreen.vue', () => {
  it('debe renderizar el mensaje', () => {
    const wrapper = mount(LoadingScreen, {
      props: { msg: 'Procesando información...' }
    })
    expect(wrapper.text()).toContain('Procesando información...')
  })

  it('debe renderizar el spinner', () => {
    const wrapper = mount(LoadingScreen, {
      props: { msg: 'Test' }
    })
    expect(wrapper.find('.spinner-border').exists()).toBe(true)
  })

  it('debe tener la clase sup-loader', () => {
    const wrapper = mount(LoadingScreen, {
      props: { msg: 'Test' }
    })
    expect(wrapper.find('.sup-loader').exists()).toBe(true)
  })

  it('debe renderizar mensaje vacío', () => {
    const wrapper = mount(LoadingScreen, {
      props: { msg: '' }
    })
    const p = wrapper.find('p.mt-3')
    expect(p.exists()).toBe(true)
    expect(p.text()).toBe('')
  })
})
