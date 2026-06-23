import type { RouteRecordRaw } from 'vue-router'
import hasStamp from '@/middlewares/hasStamp'

const providerRoutes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'usuario-instrucciones',
    component: () => import('@/views/Instrucciones.vue'),
    props: () => ({ role: 'PROVIDER' }),
    meta: { title: 'Instrucciones' },
  },
  {
    path: 'dashboard',
    name: 'usuario-dashboard',
    component: () => import('@/views/usuario/DashboardUsuario.vue'),
    meta: { title: 'Mi Dashboard', middleware: hasStamp },
  },
  {
    path: 'confirmacion',
    name: 'usuario-confirmacion',
    component: () => import('@/views/usuario/ConfirmacionUsuario.vue'),
    meta: { title: 'Confirmación' },
  },
  {
    path: 'programa-modulos',
    name: 'usuario-programa-modulos',
    component: () => import('@/views/curso/ProgramaModulos.vue'),
    meta: { title: 'Programa de Módulos', middleware: hasStamp },
  },
  {
    path: 'modulo-curso/:id?',
    name: 'usuario-modulo-curso',
    component: () => import('@/views/curso/ModuloCurso.vue'),
    meta: { title: 'Módulo del Curso', middleware: hasStamp },
  },
  {
    path: 'curso-evidencia/:id?',
    name: 'usuario-curso-evidencia',
    component: () => import('@/views/curso/CursoEvidencia.vue'),
    meta: { middleware: hasStamp },
  },
  {
    path: 'protocolos',
    name: 'usuario-protocolos',
    component: () => import('@/views/curso/Protocolo.vue'),
    meta: { title: 'Evaluación documental', middleware: hasStamp },
  },
  {
    path: 'evidencias-protocolos',
    name: 'usuario-evidencias-protocolos',
    component: () => import('@/views/usuario/EvidenciasProtocolos.vue'),
    meta: { title: 'Evidencias y Evaluación documental', middleware: hasStamp },
  },
]

export default providerRoutes
