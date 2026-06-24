import type { CajaTituloData } from '@/interfaces/CajaTituloData'

import imagenLineamientos from '@/assets/images/Igualdad_tema1.png'

export const cajaLineamientosData: CajaTituloData = {
  titulo: 'Revisa los lineamientos de capacitación',
  descripcion: 'Antes de elegir tu modalidad de capacitación, revisa los lineamientos para conocer los requisitos y tiempos de cada opción.',
  imagen: imagenLineamientos,
  color: '#e9def4'
}

export const cajaModulosData: CajaTituloData = {
  titulo: 'Módulos',
  descripcion: 'En este módulo revisaste conceptos operativos básicos y aprendiste cómo aplicarlos para organizar mejor el expediente y las evidencias.',
  imagen:'' ,
}

export const cajaProtocoloData: CajaTituloData = {
  titulo: 'Evaluación documental',
  descripcion: 'En este módulo incorporaste los documentos requerida para tu Evaluación documental y diste cumplimiento a los criterios establecidos para demostrar el cumplimiento de los requisitos.',
  imagen:'' ,
}

export const cajaRevisionExpedienteData: CajaTituloData = {
  titulo: 'Revisión de expediente',
  descripcion: 'Revisa la información cargada por la empresa, valida su cumplimiento y emite observaciones o aprobaciones según corresponda.',
  imagen: '',
}
