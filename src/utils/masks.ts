/**
 * Función para formatear un número como moneda mexicana (MXN).

/**
 * Función para formatear un número como moneda mexicana (MXN).
 *
 * @param amount
 * @returns string
 */
export function currency(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount)
}
