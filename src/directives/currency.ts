export default {
  beforeMount(el: HTMLInputElement) {
    el.addEventListener('input', () => {
      let value = el.value.replace(/\D/g, '')
      value = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
      }).format(Number(value) / 100)
      el.value = value
    })
    el.addEventListener('td', () => {
      let value = el.textContent.replace(/\D/g, '')
      value = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
      }).format(Number(value) / 100)
      el.value = value
    })
  },
}
