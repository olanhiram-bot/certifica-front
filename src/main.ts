import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '@/assets/styles/app.css'
// Toast
import 'vue-toast-notification/dist/theme-bootstrap.css'

/**
 * Definir las reglas de validación de forma global para vee-validate
 */
import { defineRule, configure } from 'vee-validate'
import * as AllRules from '@vee-validate/rules'
import { localize, setLocale } from '@vee-validate/i18n'
import es from '@vee-validate/i18n/dist/locale/es.json'

// Directives
import tooltip from '@/directives/tooltip'
import currency from '@/directives/currency'

// Define validation rules individually to avoid importing non-function exports
Object.keys(AllRules.all).forEach((rule) => {
  const ruleFunction = AllRules.all[rule]
  // Only define the rule if it's actually a function
  if (typeof ruleFunction === 'function') {
    defineRule(rule, ruleFunction)
  }
})
// Instanciar los idiomas que estarán disponibles en la app para vee-validate (formularios)
configure({
  generateMessage: localize({
    es,
  }),
})
/**
 * Instanciar de forma global el idioma español por default para la bolsa de errores de formulario vee-validate
 * En caso de manejar diferentes idiomas el setLocale se instanciará en la vista o dinámicamente
 */
setLocale('es')

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

// Directives
app.directive('tooltip', tooltip)
app.directive('currency', currency)

app.mount('#app')
