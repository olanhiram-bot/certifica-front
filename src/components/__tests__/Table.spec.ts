import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Table from '../Table.vue'

describe('Table.vue', () => {
  const defaultProps = {
    thead: ['Nombre', 'Email', 'Acciones'],
  }

  it('debe renderizar el elemento tabla', () => {
    const wrapper = mount(Table, {
      props: defaultProps,
    })

    expect(wrapper.find('table').exists()).toBe(true)
  })

  it('debe tener las clases correctas de la tabla', () => {
    const wrapper = mount(Table, {
      props: defaultProps,
    })

    expect(wrapper.find('.tabla_encabezado').exists()).toBe(true)
    expect(wrapper.find('.estilo_tabla').exists()).toBe(true)
  })

  it('debe renderizar el thead con los encabezados proporcionados', () => {
    const wrapper = mount(Table, {
      props: defaultProps,
    })

    const headers = wrapper.findAll('th')
    expect(headers).toHaveLength(3)
    expect(headers[0]!.text()).toBe('Nombre')
    expect(headers[1]!.text()).toBe('Email')
    expect(headers[2]!.text()).toBe('Acciones')
  })

  it('debe renderizar un único encabezado', () => {
    const wrapper = mount(Table, {
      props: {
        thead: ['Solo Uno'],
      },
    })

    const headers = wrapper.findAll('th')
    expect(headers).toHaveLength(1)
    expect(headers[0]!.text()).toBe('Solo Uno')
  })

  it('debe aplicar el estilo personalizado del thead', () => {
    const wrapper = mount(Table, {
      props: {
        thead: ['Nombre'],
        theadStyle: 'custom-header-class',
      },
    })

    const tr = wrapper.find('thead tr')
    expect(tr.classes()).toContain('custom-header-class')
  })

  it('no debe aplicar el estilo del thead cuando no se proporciona', () => {
    const wrapper = mount(Table, {
      props: {
        thead: ['Nombre'],
      },
    })

    const tr = wrapper.find('thead tr')
    expect(tr.attributes('class')).toBe('')
  })

  it('debe renderizar el tbody', () => {
    const wrapper = mount(Table, {
      props: defaultProps,
    })

    expect(wrapper.find('tbody').exists()).toBe(true)
  })

  it('debe renderizar el contenido del slot en el tbody', () => {
    const wrapper = mount(Table, {
      props: defaultProps,
      slots: {
        default: '<tr><td>Test Row</td></tr>',
      },
    })

    const tbody = wrapper.find('tbody')
    expect(tbody.html()).toContain('Test Row')
  })

  it('debe renderizar múltiples filas en el slot', () => {
    const wrapper = mount(Table, {
      props: defaultProps,
      slots: {
        default: `
          <tr><td>Row 1</td></tr>
          <tr><td>Row 2</td></tr>
          <tr><td>Row 3</td></tr>
        `,
      },
    })

    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(3)
  })

  it('debe manejar un arreglo thead vacío', () => {
    const wrapper = mount(Table, {
      props: {
        thead: [],
      },
    })

    const headers = wrapper.findAll('th')
    expect(headers).toHaveLength(0)
  })

  it('debe tener el atributo scope en los elementos th', () => {
    const wrapper = mount(Table, {
      props: defaultProps,
    })

    const headers = wrapper.findAll('th')
    headers.forEach((header) => {
      expect(header.attributes('scope')).toBe('col')
    })
  })

  it('debe conservar el orden del thead', () => {
    const orderedHeaders = ['First', 'Second', 'Third', 'Fourth']
    const wrapper = mount(Table, {
      props: {
        thead: orderedHeaders,
      },
    })

    const headers = wrapper.findAll('th')
    headers.forEach((header, index) => {
      expect(header.text()).toBe(orderedHeaders[index])
    })
  })

  it('debe manejar encabezados con caracteres especiales', () => {
    const wrapper = mount(Table, {
      props: {
        thead: ['Nombre & Apellido', 'Email / Teléfono', 'Opciones > Acciones'],
      },
    })

    const headers = wrapper.findAll('th')
    expect(headers).toHaveLength(3)
    expect(headers[0]!.text()).toBe('Nombre & Apellido')
    expect(headers[1]!.text()).toBe('Email / Teléfono')
    expect(headers[2]!.text()).toBe('Opciones > Acciones')
  })

  it('debe manejar cadenas vacías en el arreglo thead', () => {
    const wrapper = mount(Table, {
      props: {
        thead: ['', 'Valid', ''],
      },
    })

    const headers = wrapper.findAll('th')
    expect(headers).toHaveLength(3)
    expect(headers[0]!.text()).toBe('')
    expect(headers[1]!.text()).toBe('Valid')
  })
})
