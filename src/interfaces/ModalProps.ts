export interface ModalProps {
  modalId: string
  title?: string
  dialogExtraClass?: string
  dialogHeaderExtraClass?: string
  btnClosed?: boolean
  dialogBtnClose?: string
  dialogModalContent?: string
  overflow?: boolean
  iconHeader?: string
  iconHeaderClass?: string
  buttons?: ModalButton[]
  size?: 'sm' | 'lg' | 'xl' | 'fullscreen'
}

export interface ModalButton {
  text: string
  action: () => void
  variant?: 'primario' | 'secundario' | 'terciario' | 'peligro'
  dismiss?: boolean
  disabled?: boolean
  loading?: boolean
}
