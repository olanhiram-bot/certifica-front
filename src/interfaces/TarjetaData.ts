export interface TarjetaData {
  imagen?: string
  alt?: string
  imagenWidth?: number
  imagenHeight?: number
  titulo?: string
  descripcion?: string
  boton?: string
  boton2?: string
  boton3?: string
  link?: string
  tipo_boton?: string
  iconos?: string[]
  es_horizontal?: boolean
  redonda_horizontal?: boolean
  es_invertida?: boolean
  es_balanceada?: boolean
  sin_sombras?: boolean
  tiene_fondo_gris?: boolean
  es_completo?: boolean
  es_redonda?: boolean
  es_vertical_iconos?: boolean
  altura_imagen?: string
  alineacion?: string
  mostrar_boton?: boolean
  padding?: string
  color_fondo?: string
  alineado_izquierda?: boolean
  tamano_titulo?: string
  es_vineta?: boolean
  vinetas?: string[]
  vinetas_titulo?: string
  vinetas2?: string[]
  vinetas2_titulo?: string
  tres_columnas?: boolean
  estado?: string
  estadoHexadecimal?: string
  estadoColor?: string
  disabled?: boolean
  disabledBoton?: boolean
  disabledBoton2?: boolean
  disabledBoton3?: boolean
  es_archivo?: boolean
  archivos?: TarjetaArchivo[]
  columnas?: '3_columnas' | '4_columnas'
}

export interface TarjetaArchivo {
  titulo: string
  descripcion?: string
  icono?: string
  downloadUrl?: string
}
