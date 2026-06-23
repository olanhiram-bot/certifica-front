import { describe, it, expect } from 'vitest'
import { currency } from '../masks'

describe('Masks Utils', () => {
  describe('currency', () => {
    it('debe formatear números positivos como moneda mexicana', () => {
      expect(currency(1000)).toBe('$1,000.00')
      expect(currency(1234.56)).toBe('$1,234.56')
      expect(currency(999.99)).toBe('$999.99')
    })

    it('debe formatear cero como moneda', () => {
      expect(currency(0)).toBe('$0.00')
    })

    it('debe formatear números negativos como moneda', () => {
      expect(currency(-100)).toBe('-$100.00')
      expect(currency(-1234.56)).toBe('-$1,234.56')
    })

    it('debe formatear números grandes con separadores de miles', () => {
      expect(currency(1000000)).toBe('$1,000,000.00')
      expect(currency(9999999.99)).toBe('$9,999,999.99')
    })

    it('debe redondear a dos decimales', () => {
      expect(currency(10.123)).toBe('$10.12')
      expect(currency(10.126)).toBe('$10.13')
      expect(currency(10.999)).toBe('$11.00')
    })

    it('debe manejar números decimales correctamente', () => {
      expect(currency(0.01)).toBe('$0.01')
      expect(currency(0.99)).toBe('$0.99')
      expect(currency(1.5)).toBe('$1.50')
    })

    it('debe formatear números muy pequeños', () => {
      expect(currency(0.001)).toBe('$0.00')
      expect(currency(0.005)).toBe('$0.01')
    })

    it('debe formatear números muy grandes', () => {
      expect(currency(1000000000)).toBe('$1,000,000,000.00')
    })

    it('debe manejar números sin decimales', () => {
      expect(currency(100)).toBe('$100.00')
      expect(currency(5000)).toBe('$5,000.00')
    })
  })
})
