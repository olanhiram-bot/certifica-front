

export interface AlertaData {
  titulo?: string
  descripcion?: string
  textoBoton?: string
  icon?: string
}

export interface AlertaProps {
  tipo?: 'info' | 'success' | 'error' | 'warning' | 'informativo' | 'primario'
  data?: AlertaData
  mostrarCerrar?: boolean
  mostrarIcono?: boolean
  esCompleta?: boolean
  icon?: string
}
