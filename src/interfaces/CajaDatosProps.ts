export interface CajaDatosButton {
  text: string
  variant?: 'primario' | 'secundario' | 'terciario' | 'peligro'
  disabled?: boolean
  action?: () => void
}

export interface CajaDatosProps {
  titulo?: string
  subtitulo?: string
  showProgress?: boolean
  progressValue?: number | string
  progressLabel?: string
  diasVigencia?: number
  buttons?: CajaDatosButton[]
  showHeaderInfo?: boolean
  showProgressText?: boolean
  showModalidad?: boolean
  vigenciaInicio?: string | null
  vigenciaFin?: string | null
  percent?: number
  modalityName?: string
  stampStatus?: { id: number; name: string; color?: string } | null
}
