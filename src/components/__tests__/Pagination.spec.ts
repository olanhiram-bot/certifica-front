import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Pagination from '../Pagination.vue'

describe('Pagination.vue', () => {
  const defaultProps = {
    links: [
      { url: '', label: 'Previous', active: false },
      { url: 'page=1', label: '1', active: true },
      { url: 'page=2', label: '2', active: false },
      { url: 'page=3', label: '3', active: false },
      { url: '', label: 'Next', active: false },
    ],
    currentPage: 1,
    perPage: 10,
    total: 30,
  }

  it('debe renderizar el componente', () => {
    const wrapper = mount(Pagination, {
      props: defaultProps,
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('debe mostrar el total de elementos', () => {
    const wrapper = mount(Pagination, {
      props: defaultProps,
    })

    expect(wrapper.text()).toContain('10 de 30')
  })

  it('debe mostrar el valor "to" personalizado cuando se proporciona', () => {
    const wrapper = mount(Pagination, {
      props: {
        ...defaultProps,
        to: 25,
      },
    })

    expect(wrapper.text()).toContain('25 de 30')
  })

  it('debe renderizar los botones de número de página', () => {
    const wrapper = mount(Pagination, {
      props: defaultProps,
    })

    const pageButtons = wrapper.findAll('a')
    // Excluye Previous (label no es número) y Next
    expect(pageButtons.filter((btn) => !isNaN(parseInt(btn.text())))).toHaveLength(3)
  })

  it('debe resaltar la página activa', () => {
    const wrapper = mount(Pagination, {
      props: defaultProps,
    })

    const activeButton = wrapper.find('.boton_primario')
    expect(activeButton.exists()).toBe(true)
    expect(activeButton.text()).toBe('1')
  })

  it('debe renderizar el botón anterior cuando no está en la primera página', () => {
    const wrapper = mount(Pagination, {
      props: {
        ...defaultProps,
        currentPage: 2,
      },
    })

    const prevButton = wrapper.find('button:first-of-type')
    expect(prevButton.exists()).toBe(true)
    expect(prevButton.text()).toBe('<')
  })

  it('no debe renderizar el botón anterior en la primera página', () => {
    const wrapper = mount(Pagination, {
      props: {
        ...defaultProps,
        currentPage: 1,
      },
    })

    const buttons = wrapper.findAll('button')
    const prevButton = buttons.find((btn) => btn.text() === '<')
    expect(prevButton).toBeUndefined()
  })

  it('debe renderizar el botón siguiente cuando no está en la última página', () => {
    const wrapper = mount(Pagination, {
      props: {
        ...defaultProps,
        currentPage: 1,
        links: [
          { url: '', label: 'Previous', active: false },
          { url: 'page=1', label: '1', active: true },
          { url: 'page=2', label: '2', active: false },
          { url: 'page=3', label: '3', active: false },
          { url: 'page=2', label: 'Next', active: false },
        ],
      },
    })

    const nextButton = wrapper.findAll('button').find((btn) => btn.text() === '>')
    expect(nextButton).toBeDefined()
  })

  it('no debe renderizar el botón siguiente en la última página', () => {
    const wrapper = mount(Pagination, {
      props: {
        ...defaultProps,
        currentPage: 3,
      },
    })

    const buttons = wrapper.findAll('button')
    const nextButton = buttons.find((btn) => btn.text() === '>')
    expect(nextButton).toBeUndefined()
  })

  it('debe emitir el evento on-page cuando se hace clic en una página', async () => {
    const wrapper = mount(Pagination, {
      props: defaultProps,
    })

    const pageButtons = wrapper.findAll('a')
    const page2Button = pageButtons.find((btn) => btn.text() === '2')

    await page2Button?.trigger('click')

    expect(wrapper.emitted('on-page')).toBeTruthy()
    expect(wrapper.emitted('on-page')?.[0]).toEqual([2])
  })

  it('debe emitir el evento update:currentPage cuando cambia la página', async () => {
    const wrapper = mount(Pagination, {
      props: defaultProps,
    })

    const pageButtons = wrapper.findAll('a')
    const page3Button = pageButtons.find((btn) => btn.text() === '3')

    await page3Button?.trigger('click')

    expect(wrapper.emitted('update:currentPage')).toBeTruthy()
    expect(wrapper.emitted('update:currentPage')?.[0]).toEqual([3])
  })

  it('debe emitir on-page cuando se hace clic en el botón anterior', async () => {
    const wrapper = mount(Pagination, {
      props: {
        ...defaultProps,
        currentPage: 2,
      },
    })

    const prevButton = wrapper.find('button:first-of-type')
    await prevButton.trigger('click')

    expect(wrapper.emitted('on-page')).toBeTruthy()
    expect(wrapper.emitted('on-page')?.[0]).toEqual([1])
  })

  it('debe emitir on-page cuando se hace clic en el botón siguiente', async () => {
    const wrapper = mount(Pagination, {
      props: {
        ...defaultProps,
        currentPage: 1,
        links: [
          { url: '', label: 'Previous', active: false },
          { url: 'page=1', label: '1', active: true },
          { url: 'page=2', label: '2', active: false },
          { url: 'page=3', label: '3', active: false },
          { url: 'page=2', label: 'Next', active: false },
        ],
      },
    })

    const nextButton = wrapper.findAll('button').find((btn) => btn.text() === '>')
    await nextButton?.trigger('click')

    expect(wrapper.emitted('on-page')).toBeTruthy()
    expect(wrapper.emitted('on-page')?.[0]).toEqual([2])
  })

  it('debe manejar correctamente perPage menor al total', () => {
    const wrapper = mount(Pagination, {
      props: {
        ...defaultProps,
        perPage: 5,
        total: 30,
      },
    })

    expect(wrapper.text()).toContain('5 de 30')
  })

  it('debe manejar correctamente perPage mayor al total', () => {
    const wrapper = mount(Pagination, {
      props: {
        ...defaultProps,
        perPage: 50,
        total: 30,
      },
    })

    expect(wrapper.text()).toContain('30 de 30')
  })

  it('no debe renderizar botones de página para etiquetas no numéricas', () => {
    const wrapper = mount(Pagination, {
      props: defaultProps,
    })

    // Previous y Next no deben aparecer como botones de página
    const pageButtons = wrapper.findAll('a')
    const textButtons = pageButtons.filter(
      (btn) => btn.text() === 'Previous' || btn.text() === 'Next',
    )
    expect(textButtons).toHaveLength(0)
  })

  it('debe aplicar las clases CSS correctas al contenedor de paginación', () => {
    const wrapper = mount(Pagination, {
      props: defaultProps,
    })

    expect(wrapper.find('.seccion_paginacion').exists()).toBe(true)
    expect(wrapper.find('.paginacion_paginas').exists()).toBe(true)
    expect(wrapper.find('.justify-content-end').exists()).toBe(true)
  })

  it('debe manejar un arreglo de enlaces vacío', () => {
    const wrapper = mount(Pagination, {
      props: {
        ...defaultProps,
        links: [],
      },
    })

    const pageButtons = wrapper.findAll('a')
    expect(pageButtons).toHaveLength(0)
  })

  it('debe manejar el escenario de una sola página', () => {
    const wrapper = mount(Pagination, {
      props: {
        links: [
          { url: '', label: 'Previous', active: false },
          { url: 'page=1', label: '1', active: true },
          { url: '', label: 'Next', active: false },
        ],
        currentPage: 1,
        perPage: 10,
        total: 5,
      },
    })

    // No debería haber botones prev/next
    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(0)
  })

  it('debe renderizar el número correcto de enlaces de página', () => {
    const manyLinks = [
      { url: '', label: 'Previous', active: false },
      ...Array.from({ length: 10 }, (_, i) => ({
        url: `page=${i + 1}`,
        label: `${i + 1}`,
        active: i === 0,
      })),
      { url: '', label: 'Next', active: false },
    ]

    const wrapper = mount(Pagination, {
      props: {
        ...defaultProps,
        links: manyLinks,
        total: 100,
      },
    })

    const pageButtons = wrapper.findAll('a')
    expect(pageButtons).toHaveLength(10)
  })
})
