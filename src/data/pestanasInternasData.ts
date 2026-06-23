import capacitateInterna from '@/assets/images/capacitate_interna.png'
import evidenciaInterna from '@/assets/images/evidencia_interna.png'
import recibeInterna from '@/assets/images/recibe_interna.png'
import type { PestanaData } from '@/interfaces/PestanaData'

export const pestanasInternasData: PestanaData[] = [
  {
    titulo: '1. Capacítate',
    contenido: {
      imagen: capacitateInterna,
      titulo: 'Etapa 1. Programa de Formación',
      descripcion: 'Se debe participar y concluir satisfactoriamente el Programa de Formación, que consta de 12 horas. Este programa es impartido por la Plataforma Certifica, o se puede realizar con un agente externo que ofrezca un contenido equivalente, y es indispensable para avanzar a la evaluación documental.'
    }
  },
  {
    titulo: '2. Evidencias',
    contenido: {
      imagen: evidenciaInterna,
      titulo: 'Etapa 2. Evaluación Documental',
      descripcion: 'En esta fase, se recopila y presenta la documentación que evidencia el cumplimiento de los criterios y prácticas requeridos. La documentación se envía por correo electrónico a la Plataforma Certifica, que la revisa y, si procede, emite la Constancia de Acreditación de documentación para el Certifica.'
    }
  },
  {
    titulo: '3. Recibe tu certificacion',
    contenido: {
      imagen: recibeInterna,
      titulo: 'Etapa 3. Carga de Constancia y Emisión del Certificacion',
      descripcion: 'El usuario deberá cargar la Constancia de Acreditación de documentación para el Certifica en la plataforma del registro de usuarios. La Dirección General de Adquisiciones y Servicios revisará el documento y, en caso de que sea correcto, emitirá y entregará el Certifica.'
    }
  }
]
