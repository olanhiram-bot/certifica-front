import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Footer from '../FooterM.vue'

describe('Footer.vue', () => {
  it('debe renderizar el componente', () => {
    const wrapper = mount(Footer)
    expect(wrapper.exists()).toBe(true)
  })

  it('debe renderizar la sección con la clase correcta', () => {
    const wrapper = mount(Footer)
    expect(wrapper.find('.seccion_leyenda').exists()).toBe(true)
  })

  it('debe renderizar el texto "Certifica"', () => {
    const wrapper = mount(Footer)
    const firstLegend = wrapper.find('.primera_leyenda')

    expect(firstLegend.exists()).toBe(true)
    expect(firstLegend.text()).toContain('Certifica')
    expect(firstLegend.text()).toContain('certifica')
  })

  it('debe renderizar la imagen del logo', () => {
    const wrapper = mount(Footer)
    const logo = wrapper.find('.logo_leyenda img')

    expect(logo.exists()).toBe(true)
    expect(logo.attributes('src')).toBe(
      'https://assets.certifica.local/assets/img/logos/logo_leondorado.svg',
    )
    expect(logo.attributes('alt')).toBe('logo de león dorado')
  })

  it('debe renderizar el texto "Un nuevo Certifica"', () => {
    const wrapper = mount(Footer)
    const secondLegend = wrapper.find('.segunda_leyenda')

    expect(secondLegend.exists()).toBe(true)
    expect(secondLegend.text()).toContain('Un')
    expect(secondLegend.text()).toContain('nuevo')
    expect(secondLegend.text()).toContain('certifica')
  })

  it('debe tener tres secciones principales', () => {
    const wrapper = mount(Footer)

    expect(wrapper.find('.primera_leyenda').exists()).toBe(true)
    expect(wrapper.find('.logo_leyenda').exists()).toBe(true)
    expect(wrapper.find('.segunda_leyenda').exists()).toBe(true)
  })
})
