import beneficios_2 from '@/assets/images/beneficios_2.png'
import beneficios_empresa_3 from '@/assets/images/beneficios_empresa_3.png'
import certificacion from '@/assets/images/certificacion.png'
import impulsa_cambios from '@/assets/images/impulsa_cambios.png'
import type { TarjetaData } from '@/interfaces/TarjetaData'

export type { TarjetaData }

export const tarjetaData1: TarjetaData = {
  titulo: '¿Qué es el Certifica?',
  descripcion: 'El Certifica es un reconocimiento otorgado por el organizacion, a través de la equipo evaluador de Administración, a los usuarios que acreditan acciones y prácticas orientadas a la organización documental, mejora continua y seguimiento de procesos en el entorno laboral. \n\nSu objetivo es impulsar culturas laborales más seguras, respetuosas y con oportunidades equitativas para todas las personas.',
  boton: 'Acción',
  imagen: certificacion,
  alt: 'Certifica reconocimiento oficial',
  imagenWidth: 1280,
  imagenHeight: 960,
  altura_imagen: 'auto',
  es_horizontal: true,
  es_invertida: false,
  sin_sombras: false,
  redonda_horizontal: true,
  alineacion: 'izquierda',
  mostrar_boton: false,
  tamano_titulo: 'font-32'
}

export const tarjetaData2: TarjetaData = {
  titulo: '¿Quién puede obtener el Certifica?',
  descripcion: 'Cualquier usuario inscrito o persona en proceso de inscripción en el registro de usuarios del organizacion.',
  vinetas_titulo: 'Para personas físicas',
  vinetas: [
    'Que la persona o empresa cuente con datos de registro completos y una operación verificable.'
  ],
  vinetas2_titulo: 'Para personas morales',
  vinetas2: [
    'Que cuente con documentación básica de operación, responsables asignados y evidencias disponibles.'
  ],
  boton: 'Acción',
  imagen: beneficios_2,
  alt: 'Usuarioes con operaciones formales y políticas laborales',
  imagenWidth: 1280,
  imagenHeight: 854,
  altura_imagen: 'auto',
  es_horizontal: true,
  es_invertida: true,
  sin_sombras: true,
  redonda_horizontal: false,
  alineacion: 'izquierda',
  mostrar_boton: false,
  tamano_titulo: 'font-32'
}

export const tarjetaData3: TarjetaData = {
  titulo: 'Beneficios para tu empresa',
  vinetas: [
    'Impulsar la creación y fortalecimiento de políticas internas de operación.',
    'Fomentar procesos claros de seguimiento, documentación y mejora continua.',
    'Mejora de reputación institucional y ventaja competitiva.',
    'Refuerzo de políticas internas de equidad y bienestar laboral.'
  ],
  boton: 'Acción',
  imagen: beneficios_empresa_3,
  alt: 'Beneficios para empresas comprometidas con la igualdad',
  imagenWidth: 1280,
  imagenHeight: 854,
  altura_imagen: 'auto',
  es_horizontal: true,
  es_invertida: false,
  sin_sombras: false,
  redonda_horizontal: true,
  alineacion: 'izquierda',
  mostrar_boton: false,
  tamano_titulo: 'font-32'
}

export const tarjetaData4: TarjetaData = {
  titulo: 'Impulsa el cambio en tu organización.',
  descripcion: 'Únete a las empresas que ya están construyendo espacios laborales más seguros y equitativos. \n ¿Tienes dudas sobre el proceso o los requisitos? Nuestro equipo puede orientarte antes de iniciar.',
  boton: 'contacto@certifica.local',
  imagen: impulsa_cambios,
  alt: 'Impulsa el cambio organizacional hacia la equidad',
  imagenWidth: 1280,
  imagenHeight: 960,
  altura_imagen: 'auto',
  es_completo: false,
  es_horizontal: true,
  es_balanceada: true,
  es_invertida: true,
  tiene_fondo_gris: false,
  sin_sombras: false,
  redonda_horizontal: false,
  alineacion: 'izquierda',
  mostrar_boton: true,
  padding: 'p-5',
  color_fondo: '#dae5e7',
  tamano_titulo: 'font-32'
}
