import type { RouteRecordRaw } from 'vue-router'

const adminRoutes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'admin-dashboard',
    component: () => import('@/views/admin/Dashboard.vue'),
    meta: { title: 'Panel de Control' },
  },
  {
    path: 'expediente/:id',
    name: 'admin-expediente-detalle',
    component: () => import('@/views/admin/ExpedienteDetalle.vue'),
    meta: { title: 'Detalle Expediente' },
  },
  {
    path: 'modulos',
    name: 'admin-modulos',
    component: () => import('@/views/curso/ProgramaModulos.vue'),
    meta: { title: 'Módulos' },
  },
  {
    path: 'modulo-curso/:id',
    name: 'admin-modulo-curso',
    component: () => import('@/views/curso/ModuloCurso.vue'),
    meta: { title: 'Módulo del Curso' },
  },
  {
    path: 'curso-evidencia/:id',
    name: 'admin-curso-evidencia',
    component: () => import('@/views/curso/CursoEvidencia.vue'),
    meta: { title: 'Evidencia' },
  },
  {
    path: 'mi-expediente',
    name: 'admin-mi-expediente',
    component: () => import('@/views/admin/ExpedienteDetalle.vue'),
    meta: { title: 'Mi Expediente' },
  },
  {
    path: 'protocolos',
    name: 'admin-protocolos',
    component: () => import('@/views/curso/Protocolo.vue'),
    meta: { title: 'Evaluación documental' },
  },

  // Administración
  {
    path: 'content/landing',
    name: 'admin-content',
    component: () => import('@/views/admin/Content.vue'),
    meta: { title: 'Administración de Contenido' },
  },
  {
    path: 'content/modulos',
    name: 'admin-modules',
    component: () => import('@/views/admin/Modules.vue'),
    meta: { title: 'Administración de Módulos' },
  },
  {
    path: 'content/protocolos',
    name: 'admin-protocols',
    component: () => import('@/views/admin/Protocols.vue'),
    meta: { title: 'Gestión documental' },
  },
]

export default adminRoutes
