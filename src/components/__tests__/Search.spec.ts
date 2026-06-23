import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import Search from '../Search.vue'
import { Field } from 'vee-validate'

describe('Search.vue', () => {
  it('debe renderizar el campo de búsqueda', () => {
    const wrapper = mount(Search, {
      props: {
        lastValue: '',
      },
    })

    const input = wrapper.find('input[type="search"]')
    expect(input.exists()).toBe(true)
    expect(input.attributes('id')).toBe('search')
  })

  it('debe renderizar el botón de búsqueda', () => {
    const wrapper = mount(Search, {
      props: {
        lastValue: '',
      },
    })

    const button = wrapper.find('button[type="submit"]')
    expect(button.exists()).toBe(true)
  })

  it('debe renderizar el icono de búsqueda', () => {
    const wrapper = mount(Search, {
      props: {
        lastValue: '',
      },
    })

    const icon = wrapper.find('.material-icons')
    expect(icon.exists()).toBe(true)
    expect(icon.text()).toBe('search')
  })

  it('debe tener texto de marcador de posición', () => {
    const wrapper = mount(Search, {
      props: {
        lastValue: '',
      },
    })

    const input = wrapper.find('input')
    expect(input.attributes('placeholder')).toBe('Buscar')
  })

  it('debe poblar el campo con la prop lastValue', async () => {
    const wrapper = mount(Search, {
      props: {
        lastValue: 'test search',
      },
    })

    await flushPromises()

    const input = wrapper.find('input')
    expect(input.element.value).toBe('test search')
  })

  it('debe emitir el evento on-search al enviar el formulario', async () => {
    const wrapper = mount(Search, {
      props: {
        lastValue: '',
      },
    })

    const input = wrapper.find('input')
    await input.setValue('my search query')

    const form = wrapper.find('form')
    await form.trigger('submit')

    await flushPromises()

    expect(wrapper.emitted('on-search')).toBeTruthy()
  })

  it('debe emitir el valor de búsqueda al enviar', async () => {
    const wrapper = mount(Search, {
      props: {
        lastValue: '',
      },
    })

    const input = wrapper.find('input')
    await input.setValue('test query')

    const form = wrapper.find('form')
    await form.trigger('submit')

    await flushPromises()

    const emitted = wrapper.emitted('on-search')
    expect(emitted).toBeTruthy()
    expect(emitted?.[0]).toEqual(['test query'])
  })

  it('debe manejar el envío de búsqueda vacía', async () => {
    const wrapper = mount(Search, {
      props: {
        lastValue: '',
      },
    })

    const form = wrapper.find('form')
    await form.trigger('submit')

    await flushPromises()

    expect(wrapper.emitted('on-search')).toBeTruthy()
  })

  it('debe tener la estructura de formulario correcta', () => {
    const wrapper = mount(Search, {
      props: {
        lastValue: '',
      },
    })

    expect(wrapper.find('.caja_busqueda').exists()).toBe(true)
    expect(wrapper.find('.input-group').exists()).toBe(true)
  })

  it('debe tener las clases correctas del botón', () => {
    const wrapper = mount(Search, {
      props: {
        lastValue: '',
      },
    })

    const button = wrapper.find('button[type="submit"]')
    expect(button.classes()).toContain('input-group-text')
  })

  it('debe tener el atributo title en el botón', () => {
    const wrapper = mount(Search, {
      props: {
        lastValue: '',
      },
    })

    const button = wrapper.find('button[type="submit"]')
    expect(button.attributes('title')).toBe('buscar')
  })

  it('debe manejar caracteres especiales en la búsqueda', async () => {
    const wrapper = mount(Search, {
      props: {
        lastValue: '',
      },
    })

    const input = wrapper.find('input')
    await input.setValue('test@#$%')

    const form = wrapper.find('form')
    await form.trigger('submit')

    await flushPromises()

    const emitted = wrapper.emitted('on-search')
    expect(emitted?.[0]).toEqual(['test@#$%'])
  })

  it('debe manejar cadenas de búsqueda largas', async () => {
    const longString = 'a'.repeat(500)
    const wrapper = mount(Search, {
      props: {
        lastValue: '',
      },
    })

    const input = wrapper.find('input')
    await input.setValue(longString)

    const form = wrapper.find('form')
    await form.trigger('submit')

    await flushPromises()

    const emitted = wrapper.emitted('on-search')
    expect(emitted?.[0]).toEqual([longString])
  })

  it('debe usar el componente Field de vee-validate', () => {
    const wrapper = mount(Search, {
      props: {
        lastValue: '',
      },
    })

    // Verificar que el componente Field está siendo usado
    expect(wrapper.findComponent(Field).exists()).toBe(true)
  })

  it('debe tener el nombre de campo correcto para vee-validate', () => {
    const wrapper = mount(Search, {
      props: {
        lastValue: '',
      },
    })

    const field = wrapper.findComponent(Field)
    expect(field.props('name')).toBe('search')
  })
})
