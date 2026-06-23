/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const component: DefineComponent<object, object, any>
  export default component
}

import type { PersistedStateOptions } from 'pinia-plugin-persistedstate'

declare module 'pinia' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface DefineStoreOptions<Id, S, G, A> {
    persist?: boolean | PersistedStateOptions
  }
}
