import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Header from '../Header.vue'

describe('Header.vue', () => {
  it('debe renderizar la estructura del acordeón', () => {
    const wrapper = mount(Header)

    expect(wrapper.find('.caja_verificador').exists()).toBe(true)
    expect(wrapper.find('.accordion').exists()).toBe(true)
    expect(wrapper.find('#verificador').exists()).toBe(true)
  })

  it('debe renderizar el botón del acordeón con el texto correcto', () => {
    const wrapper = mount(Header)
    const button = wrapper.find('#verificador_boton')

    expect(button.exists()).toBe(true)
    expect(button.text()).toContain(
      'Este es un sitio web oficial del Certifica',
    )
    expect(button.text()).toContain('Aprende a identificarlo')
  })

  it('debe tener el acordeón cerrado por defecto', () => {
    const wrapper = mount(Header)
    const button = wrapper.find('#verificador_boton')

    expect(button.classes()).toContain('collapsed')
    expect(button.attributes('aria-expanded')).toBe('false')
  })

  it('debe renderizar el contenido del acordeón', () => {
    const wrapper = mount(Header)
    const content = wrapper.find('#verificador_contenido')

    expect(content.exists()).toBe(true)
    expect(content.classes()).toContain('collapse')
  })

  it('debe renderizar ambas columnas de información', () => {
    const wrapper = mount(Header)
    const columns = wrapper.findAll('.col')

    expect(columns).toHaveLength(2)
  })

  it('debe renderizar el logo de la plataforma', () => {
    const wrapper = mount(Header)
    const logo = wrapper.find('.logo_verificar')

    expect(logo.exists()).toBe(true)
    expect(logo.attributes('src')).toBe(
      'https://assets.certifica.local/assets/img/logos/logo_circular.svg',
    )
  })

  it('debe renderizar el icono de sitio seguro', () => {
    const wrapper = mount(Header)
    const icon = wrapper.find('.logo_sitio_seguro')

    expect(icon.exists()).toBe(true)
    expect(icon.attributes('src')).toBe(
      'https://assets.certifica.local/assets/img/iconos/sitio_seguro.svg',
    )
  })

  it('debe renderizar el enlace certifica.local', () => {
    const wrapper = mount(Header)
    const link = wrapper.find('a.link[href="https://www.certifica.local/"]')

    expect(link.exists()).toBe(true)
    expect(link.attributes('target')).toBe('_blank')
  })

  it('debe contener información sobre el sitio oficial', () => {
    const wrapper = mount(Header)
    const text = wrapper.text()

    expect(text).toContain('certifica.local')
    expect(text).toContain('certificado de seguridad')
  })

  it('debe tener los atributos correctos del acordeón Bootstrap', () => {
    const wrapper = mount(Header)
    const button = wrapper.find('#verificador_boton')

    expect(button.attributes('data-bs-toggle')).toBe('collapse')
    expect(button.attributes('data-bs-target')).toBe('#verificador_contenido')
  })

  it('debe tener las etiquetas aria correctas', () => {
    const wrapper = mount(Header)
    const content = wrapper.find('#verificador_contenido')

    expect(content.attributes('aria-labelledby')).toBe('verificador_boton')
    expect(content.attributes('data-bs-parent')).toBe('#verificador')
  })
})
