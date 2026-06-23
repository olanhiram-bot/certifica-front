import { Tooltip } from 'bootstrap'

export default {
  mounted: (el: HTMLElement, binding: { arg?: string; value?: string }) => {
    const tooltip = new Tooltip(el, {
      placement: (binding.arg ?? 'bottom') as 'bottom' | 'top' | 'left' | 'right' | 'auto',
      title: binding.value || '',
      trigger: 'hover',
    })

    const handleClick = () => {
      tooltip?.hide()
    }

    el.addEventListener('click', handleClick)
  },
}
