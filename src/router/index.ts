import auth from '@/middlewares/auth'
import guest from '@/middlewares/guest'
import { createRouter, createWebHistory } from 'vue-router'
import adminRoutes from './admin'
import providerRoutes from './provider'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (from.matched.length === 0) {
      return { top: 0 }
    }
    if (to.path !== from.path) {
      return { top: 0, left: 0 }
    }
    return savedPosition ?? { top: 0 }
  },
  routes: [
    {
      path: '/:catchAll(.*)',
      name: 'error',
      component: () => import('@/views/Error.vue'),
      meta: {
        title: 'Error',
      },
    },
    // Rutas guest
    {
      path: '/',
      name: 'welcome',
      component: () => import('@/views/Welcome.vue'),
      meta: {
        title: 'Bienvenida',
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: {
        title: 'Iniciar Sesión',
        middleware: guest,
        requiresValidation: true,
      },
    },
    {
      path: '/recuperar-cuenta',
      name: 'forgot-password',
      component: () => import('@/views/ForgotPassword.vue'),
      meta: {
        title: 'Recuperar cuenta',
        middleware: guest,
      },
    },
    {
      path: '/recuperar-cuenta/restablecer',
      name: 'reset-password',
      component: () => import('@/views/ResetPassword.vue'),
      meta: {
        title: 'Restablecer contrasena',
        middleware: guest,
      },
    },
    {
      path: '/registro',
      name: 'register',
      component: () => import('@/views/Register.vue'),
      meta: {
        title: 'Registro',
        middleware: guest,
      },
    },
    {
      path: '/admin/login',
      name: 'login-admin',
      component: () => import('@/views/LoginAdmin.vue'),
      meta: {
        title: 'Admin - Iniciar Sesión',
        middleware: guest,
        requiresValidation: true,
      },
    },
    {
      path: '/_auth',
      name: 'authRedirect',
      component: () => import('@/views/AuthRedirect.vue'),
      meta: {
        title: 'Autenticación SSO',
      },
    },
    // Rutas de Usuario
    {
      path: '/usuario',
      component: () => import('@/layouts/AppLayout.vue'),
      props: () => ({ role: 'PROVIDER' as const }),
      meta: {
        role: 'PROVIDER',
        requiredAuthMethod: 1,
        middleware: auth,
      },
      children: providerRoutes,
    },
    // Rutas de Admin (Administrador + Validador)
    {
      path: '/admin',
      component: () => import('@/layouts/AppLayout.vue'),
      props: () => ({ role: 'ADMIN' as const }),
      meta: {
        role: 'ADMIN',
        requiredAuthMethod: 2,
        middleware: auth,
      },
      children: adminRoutes,
    },
  ],
})

/**
 * @author Jared Dmz
 * Ejecuta una función especificada en to.meta.middleware `/src/middlewares`
 */
router.beforeEach(async (to, from) => {
  if (to.meta && to.meta.middleware) {
    const middleware = to.meta.middleware
    if (typeof middleware === 'function') {
      return await middleware(to, from)
    }
  }
})

/**
 * @author Jared Dmz
 * Cambia el titulo por lo obtenido en la propiedad to.meta.title
 */
router.afterEach((to) => {
  const title: string =
    typeof to.meta.title !== 'undefined' ? to.meta.title + ' | Certifica' : 'Certifica'
  document.querySelector('title')!.innerText = title
})

export default router
