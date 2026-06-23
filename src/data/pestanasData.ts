import acredita from '@/assets/images/acredita.png'
import capacitate from '@/assets/images/capacitate.png'
import evidencia from '@/assets/images/evidencia.png'
import inscribete from '@/assets/images/inscribete.png'
import recibe from '@/assets/images/recibe.png'
import type { ContenidoPestana, PestanaData } from '@/interfaces/PestanaData'

export type { ContenidoPestana, PestanaData }

export const pestanasData: PestanaData[] = [
  {
    titulo: '1. Inscribete',
    contenido: {
      imagen: inscribete,
      titulo: 'Etapa 1. Registro y Preevaluación en la plataforma del registro de usuarios',
      descripcion: 'Registra a tu empresa en la convocatoria del Certifica y confirma tu interés en participar.\n\nDurante este paso deberás validar tus datos y elegir la modalidad en la que realizarás la capacitación.\n\nEste registro te permitirá acceder a la plataforma y dar seguimiento a todo tu proceso.'
    }
  },
  {
    titulo: '2. Acredita el curso',
    contenido: {
      imagen: acredita,
      titulo: 'Etapa 2. Curso Introductorio:',
      descripcion: 'Los participantes deben acceder y aprobar un curso, mismo que se llevará a cabo en modalidad digital y a distancia, titulado "Introducción a prácticas laborales con perspectiva de género y una vida libre de violencia contra las mujeres". La aprobación de este curso es un requisito para continuar con el proceso.'
    }
  },
  {
    titulo: '3. Capacítate',
    contenido: {
      imagen: capacitate,
      titulo: 'Etapa 3. Programa de Formación',
      descripcion: 'Se debe participar y concluir satisfactoriamente el Programa de Formación, que consta de 12 horas. Este programa es impartido por la Plataforma Certifica, o se puede realizar con un agente externo que ofrezca un contenido equivalente, y es indispensable para avanzar a la evaluación documental.'
    }
  },
  {
    titulo: '4. Evidencias',
    contenido: {
      imagen: evidencia,
      titulo: 'Etapa 4. Evaluación Documental',
      descripcion: 'En esta fase, se recopila y presenta la documentación que evidencia el cumplimiento de los criterios y prácticas requeridos. La documentación se envía por correo electrónico a la Plataforma Certifica, que la revisa y, si procede, emite la Constancia de Acreditación de documentación para el Certifica.'
    }
  },
  {
    titulo: '5. Recibe tu certificacion',
    contenido: {
      imagen: recibe,
      titulo: 'Etapa 5. Carga de Constancia y Emisión del Certificacion',
      descripcion: 'El usuario deberá cargar la Constancia de Acreditación de documentación para el Certifica en la plataforma del registro de usuarios. La Dirección General de Adquisiciones y Servicios revisará el documento y, en caso de que sea correcto, emitirá y entregará el Certifica.'
    }
  }
]
