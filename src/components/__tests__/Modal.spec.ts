import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { mount } from '@vue/test-utils'
import Modal from '../Modal.vue'

// Define types for the mock
interface MockModalInstance {
  show: Mock
  hide: Mock
  toggle: Mock
  handleUpdate: Mock
  dispose: Mock
}

// Mock the bootstrap module with a factory function
vi.mock('bootstrap', () => {
  const mockShow = vi.fn()
  const mockHide = vi.fn()
  const mockToggle = vi.fn()
  const mockHandleUpdate = vi.fn()
  const mockDispose = vi.fn()

  return {
    Modal: vi.fn(function () {
      return {
        show: mockShow,
        hide: mockHide,
        toggle: mockToggle,
        handleUpdate: mockHandleUpdate,
        dispose: mockDispose,
      }
    }),
  }
})

describe('Modal.vue', () => {
  const defaultProps = {
    modalId: 'test-modal',
  }

  beforeEach(() => {
    // Clean up any existing modal elements
    document.body.innerHTML = ''
  })

  it('debe exponer los métodos showModal y hideModal', () => {
    const wrapper = mount(Modal, {
      props: defaultProps,
      attachTo: document.body,
    })

    expect(typeof wrapper.vm.showModal).toBe('function')
    expect(typeof wrapper.vm.hideModal).toBe('function')
    wrapper.unmount()
  })

  it('debe emitir el evento execute', async () => {
    const wrapper = mount(Modal, {
      props: defaultProps,
      attachTo: document.body,
    })

    await wrapper.vm.execute()

    expect(wrapper.emitted('execute')).toBeTruthy()
    wrapper.unmount()
  })

  it('debe llamar al método show de bootstrap cuando se invoca showModal', async () => {
    const wrapper = mount(Modal, {
      props: defaultProps,
      attachTo: document.body,
    })

    // Wait for onMounted to complete
    await wrapper.vm.$nextTick()

    await wrapper.vm.showModal()

    const { Modal: ModalMock } = await import('bootstrap')
    const modalInstance = (ModalMock as unknown as Mock).mock.results[0]?.value as MockModalInstance
    expect(modalInstance.show).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('debe llamar al método hide de bootstrap cuando se invoca hideModal', async () => {
    const { Modal: ModalMock } = await import('bootstrap')
    vi.clearAllMocks()

    const wrapper = mount(Modal, {
      props: defaultProps,
      attachTo: document.body,
    })

    // Wait for onMounted to complete
    await wrapper.vm.$nextTick()

    await wrapper.vm.hideModal()

    const modalInstance = (ModalMock as unknown as Mock).mock.results[0]?.value as MockModalInstance
    expect(modalInstance.hide).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('debe renderizar el botón de cierre cuando btnClosed es true', async () => {
    const wrapper = mount(Modal, {
      props: defaultProps,
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()
    const closeButton = document.querySelector('.btn-close')
    expect(closeButton).not.toBeNull()
    wrapper.unmount()
  })

  it('no debe renderizar el botón de cierre cuando btnClosed es false', () => {
    const wrapper = mount(Modal, {
      props: {
        ...defaultProps,
        btnClosed: false,
      },
      attachTo: document.body,
    })

    const closeButtons = document.querySelectorAll('.d-grid .boton')
    expect(closeButtons.length).toBe(0)
    wrapper.unmount()
  })

  it('debe renderizar el título en el encabezado del modal', () => {
    const wrapper = mount(Modal, {
      props: {
        ...defaultProps,
        title: 'Test Title',
      },
      attachTo: document.body,
    })

    const title = document.querySelector('.modal-title')
    expect(title).not.toBeNull()
    expect(title?.textContent).toBe('Test Title')
    wrapper.unmount()
  })

  it('debe aplicar dialogExtraClass al diálogo del modal', () => {
    const wrapper = mount(Modal, {
      props: {
        ...defaultProps,
        dialogExtraClass: 'modal-lg',
      },
      attachTo: document.body,
    })

    const dialog = document.querySelector('.modal-dialog')
    expect(dialog?.classList.contains('modal-lg')).toBe(true)
    wrapper.unmount()
  })

  it('debe renderizar el iconHeader cuando se proporciona', () => {
    const wrapper = mount(Modal, {
      props: {
        ...defaultProps,
        iconHeader: 'check_circle',
      },
      attachTo: document.body,
    })

    const icon = document.querySelector('.material-symbols-outlined')
    expect(icon).not.toBeNull()
    expect(icon?.textContent).toBe('check_circle')
    wrapper.unmount()
  })

  it('debe establecer el id del modal correctamente', () => {
    const wrapper = mount(Modal, {
      props: defaultProps,
      attachTo: document.body,
    })

    const modal = document.querySelector('.modal')
    expect(modal?.getAttribute('id')).toBe('test-modal')
    wrapper.unmount()
  })

  it('debe aplicar dialogHeaderExtraClass al encabezado del modal', () => {
    const wrapper = mount(Modal, {
      props: {
        ...defaultProps,
        dialogHeaderExtraClass: 'bg-primary',
      },
      attachTo: document.body,
    })

    const header = document.querySelector('.modal-header')
    expect(header?.classList.contains('bg-primary')).toBe(true)
    wrapper.unmount()
  })

  it('debe aplicar iconHeaderClass al icono', () => {
    const wrapper = mount(Modal, {
      props: {
        ...defaultProps,
        iconHeader: 'check_circle',
        iconHeaderClass: 'text-success',
      },
      attachTo: document.body,
    })

    const icon = document.querySelector('.material-symbols-outlined')
    expect(icon?.classList.contains('text-success')).toBe(true)
    wrapper.unmount()
  })

  it('debe aplicar dialogBtnClose al botón de cierre', async () => {
    const wrapper = mount(Modal, {
      props: {
        ...defaultProps,
        dialogBtnClose: 'custom-close',
      },
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()
    const closeBtn = document.querySelector('.btn-close')
    expect(closeBtn?.classList.contains('custom-close')).toBe(true)
    wrapper.unmount()
  })

  it('debe aplicar dialogModalContent al cuerpo del modal', () => {
    const wrapper = mount(Modal, {
      props: {
        ...defaultProps,
        dialogModalContent: 'custom-content',
      },
      attachTo: document.body,
    })

    const content = document.querySelector('.modal-content')
    expect(content?.classList.contains('custom-content')).toBe(true)
    wrapper.unmount()
  })

  it('debe aplicar la clase overflow cuando overflow es true', () => {
    const wrapper = mount(Modal, {
      props: { ...defaultProps, overflow: true },
      attachTo: document.body,
    })

    const body = document.querySelector('.modal-body')
    expect(body?.classList.contains('modal-body-overflow')).toBe(true)
    wrapper.unmount()
  })

  it('no debe aplicar la clase overflow cuando overflow es false', () => {
    const wrapper = mount(Modal, {
      props: {
        ...defaultProps,
        overflow: false,
      },
      attachTo: document.body,
    })

    const body = document.querySelector('.modal-body')
    expect(body?.classList.contains('modal-body-overflow')).toBe(false)
    wrapper.unmount()
  })

  it('debe tener la clase de animación fade', () => {
    const wrapper = mount(Modal, {
      props: defaultProps,
      attachTo: document.body,
    })

    const modal = document.querySelector('.modal')
    expect(modal?.classList.contains('fade')).toBe(true)
    wrapper.unmount()
  })

  it('debe tener los atributos aria correctos cuando se proporciona el título', () => {
    const wrapper = mount(Modal, {
      props: {
        ...defaultProps,
        title: 'Test Title',
      },
      attachTo: document.body,
    })

    const modal = document.querySelector('.modal')
    expect(modal?.getAttribute('aria-labelledby')).toBe('test-modalLabel')

    const title = document.querySelector('.modal-title')
    expect(title?.getAttribute('id')).toBe('test-modalLabel')
    wrapper.unmount()
  })

  it('debe tener data-bs-dismiss en el botón de cierre', async () => {
    const wrapper = mount(Modal, {
      props: defaultProps,
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()
    const closeBtn = document.querySelector('.btn-close')
    expect(closeBtn?.getAttribute('data-bs-dismiss')).toBe('modal')
    wrapper.unmount()
  })
})
