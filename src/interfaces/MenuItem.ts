export interface MenuItem {
  label: string
  to?: string | { path: string; query?: Record<string, string | number> }
  icon?: string
  menuId?: string
  children?: MenuItem[]
  isModules?: boolean
  isPorModulos?: boolean
  disabled?: boolean
  /** Permiso requerido para mostrar el ítem (e.g. '5.validador.dashboard.listar') */
  permission?: string
  /** Si es true, el ítem se renderiza como encabezado de sección */
  isHeader?: boolean
}
