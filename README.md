# Certifica - Frontend

Frontend del sistema **Certifica**, que permite a usuarios certificarse con el certificacion, subir evidencias por módulos y protocolos, y ser validados por servidores públicos.

## Tecnologías

| Categoría | Tecnología |
|---|---|
| Framework | Vue 3 (Composition API) + TypeScript + Vite |
| Estado global | Pinia con persistencia (`pinia-plugin-persistedstate`) |
| Enrutamiento | Vue Router |
| UI | Bootstrap 5 + Bootstrap Icons |
| HTTP | Axios |
| Formularios | Vee-Validate + @vee-validate/rules + @vee-validate/i18n |
| Encriptación | Crypto-JS |
| Fechas | Moment.js + moment-timezone |
| Notificaciones | Vue Toast Notification |
| Pruebas | Vitest + @vue/test-utils |
| Linting / Formato | oxlint + Prettier |

## Estructura del proyecto

```
src/
├── api/            # Cliente HTTP (Axios)
├── assets/         # Imágenes y estilos globales
├── components/     # Header, Footer, Modal, Table, Pagination...
│   └── forms/      # LoginForm
├── directives/     # currency, tooltip
├── interfaces/     # Auth, PaginateResponse, LinkPaginateResponse
├── middlewares/    # auth (rutas protegidas), guest (rutas públicas)
├── router/         # Definición de rutas
├── stores/         # auth, loading
├── utils/          # encryption, masks, objects, permissions, strings
└── views/          # Login, Welcome, Error
```

## Instalación

```bash
npm install
```

Crea el archivo `.env` a partir de `.env.example`.

## Scripts

```bash
npm run dev          # Servidor de desarrollo (http://localhost:5173)
npm run build        # Build de producción
npm run preview      # Previsualizar build
npm run test:unit    # Pruebas con Vitest
npm run type-check   # Verificación de tipos TypeScript
npm run lint         # Linting con oxlint
npm run format       # Formateo con Prettier
```

## Buenas prácticas

- Componentes en **PascalCase**; eventos emitidos en **kebab-case**.
- Siempre usar `:key` en `v-for`; no combinar `v-for` con `v-if` en el mismo elemento.
- Interfaces definidas en `interfaces/` y reutilizadas en componentes, stores y API.
- Interfaces abstraidas para usar una por archivo.
- Lazy loading en rutas: `component: () => import('@/views/MyView.vue')`.
- Ejecutar `npm run check-type` antes de cada commit.
- Ejecutar `npm run lint` antes de cada commit.
- Ejecutar `npm run test:unit` antes de cada commit.

## Navegadores soportados

Chromium (Chrome, Edge, Brave) y Firefox.

## Licencia

Software propiedad del organizacion.