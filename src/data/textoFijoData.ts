import type { TextoFijoProps } from '@/interfaces/TextoFijoProps'

export const requisitosminimos: TextoFijoProps = {
  titulo: 'Requisitos mínimos',
  contenido: `Antes de continuar, lee cuidadosamente los siguientes requisitos. Para avanzar, debes marcar cada casilla solo si cumples con el requisito:
• La capacitación cubre todos los módulos requeridos por el programa Certifica.
• Cuento con evidencia documental verificable de la capacitación (constancias, listas, material).
• La capacitación fue impartida por una institución válida conforme a los lineamientos del programa.`
}

export const instituciones: TextoFijoProps = {
  titulo: 'Instituciones aceptadas',
  contenido: `La capacitación externa debe haber sido impartida por una institución válida, conforme a los lineamientos del programa Certifica.`
}

export const criterios: TextoFijoProps = {
  titulo: 'Criterios de validación de la capacitación externa',
  contenido: `La capacitación externa debe haber sido impartida por una institución válida, conforme a los lineamientos del programa Certifica.`,
}

export const cumplir: TextoFijoProps = {
  titulo: '',
  contenido: `Si no estás seguro de cumplir con estos requisitos, te recomendamos realizar la capacitación con Certifica.`
}

export const confirmacion: TextoFijoProps = {
  titulo: 'Confirmación',
  contenido: ``,
  checkbox: {
    id: 'confirmo-requisitos',
    texto: 'Confirmo que cumplo con todos los requisitos para continuar por Usuario Externo.',
    modelValue: false
  }


}

export const observacionesglobales: TextoFijoProps = {
  titulo: 'Observaciones globales',
  contenido: `Aquí encontrarás las observaciones pendientes en tus módulos. Resuelve cada una para avanzar en tu expediente.`
}
