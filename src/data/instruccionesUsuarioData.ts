import type { TarjetaModalidadData } from '@/interfaces/TarjetaModalidadData'

import imagenModalidad1 from '@/assets/images/modalidad_certifica.png'
import imagenModalidad2 from '@/assets/images/modalidad_usuario.png'

export const modalidad1Data: TarjetaModalidadData = {
  titulo: 'Por Plataforma Certifica',
  descripcion: 'Completa la capacitación oficial desde la plataforma.',
  imagen: imagenModalidad1,
  botonTexto: 'Comenzar formación'
}

export const modalidad2Data: TarjetaModalidadData = {
  titulo: 'Por usuario externo',
  descripcion: 'Realiza la capacitación en tu empresa y sube evidencias.',
  imagen: imagenModalidad2,
  botonTexto: 'Acreditar formación'
}
