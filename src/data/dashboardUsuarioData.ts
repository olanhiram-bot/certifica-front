import type { TarjetaModalidadData } from '@/interfaces/TarjetaModalidadData'

import imagenLineamientos from '@/assets/Igualdad_tema1.png'
import imagenModalidad from '@/assets/modalidad_certifica.png'

export const modalidad1Data: TarjetaModalidadData = {
  titulo: 'Modalidad 1',
  descripcion: 'Descripción de la primera modalidad.',
  imagen: imagenLineamientos,
  color: '#ff8c00',
  botonTexto: 'Ver más'
}

export const modalidad2Data: TarjetaModalidadData = {
  titulo: 'Modalidad 2',
  descripcion: 'Descripción de la segunda modalidad.',
  imagen: imagenModalidad,
  color: '#4CAF50',
  botonTexto: 'Inscribirse'
}
