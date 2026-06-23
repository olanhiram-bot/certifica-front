export interface TabItem {
  id: string
  label: string
  icon?: string
  count?: number
  filters?: Record<string, string | number>
}

export interface PestanasSimplesProps {
  tabs?: TabItem[]
  modelValue?: string
}
