import type { AlertaData } from '@/interfaces/AlertaProps'

export const confirmacionData: AlertaData = {
  titulo: '¿Estás seguro de continuar por Usuario Externo?',
  descripcion: `Antes de elegir esta modalidad, revisa cuidadosamente los requisitos.
Al seleccionar Usuario Externo, confirmas que tu empresa cumple con todos los puntos solicitados y que cuentas con las evidencias necesarias para acreditar la capacitación.

Importante
Una vez seleccionada esta modalidad no será posible cambiarla durante el proceso.`,
}

export const continuarUsuarioData: AlertaData = {
  titulo: '¿Estás seguro de continuar por Usuario Externo?',
  descripcion: `Una vez iniciado este proceso, no podrás cambiar de modalidad ni regresar a Certifica.”`,
}