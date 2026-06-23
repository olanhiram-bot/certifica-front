export interface FilterOption {
  label: string
  value: string | number
}

export interface FilterDropdownProps {
  label?: string
  placeholder?: string
  selectId?: string
  ariaLabel?: string
  options: FilterOption[]
  modelValue?: string | number
}
