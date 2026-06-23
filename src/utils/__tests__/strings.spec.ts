import { describe, it, expect } from 'vitest'
import { normalizeString, findByNormalizedString } from '../strings'

describe('String Utils', () => {
  describe('normalizeString', () => {
    it('debe eliminar acentos de la cadena', () => {
      expect(normalizeString('José García')).toBe('jose garcia')
      expect(normalizeString('Ñoño')).toBe('nono')
      expect(normalizeString('Ángel Fernández')).toBe('angel fernandez')
    })

    it('debe convertir a minúsculas', () => {
      expect(normalizeString('UPPERCASE')).toBe('uppercase')
      expect(normalizeString('MixedCase')).toBe('mixedcase')
    })

    it('debe eliminar espacios en blanco al inicio y al final', () => {
      expect(normalizeString('  spaces  ')).toBe('spaces')
      expect(normalizeString('   ')).toBe('')
    })

    it('debe reemplazar múltiples espacios por uno solo', () => {
      expect(normalizeString('multiple   spaces   here')).toBe('multiple spaces here')
      expect(normalizeString('test    string')).toBe('test string')
    })

    it('debe manejar cadena vacía', () => {
      expect(normalizeString('')).toBe('')
    })

    it('debe manejar caracteres especiales con acentos', () => {
      expect(normalizeString('Málaga, España')).toBe('malaga, espana')
      expect(normalizeString("Côte d'Ivoire")).toBe("cote d'ivoire")
    })

    it('debe manejar operaciones combinadas', () => {
      expect(normalizeString('  José   GARCÍA  ')).toBe('jose garcia')
      expect(normalizeString('ÁNGEL   Fernández  ')).toBe('angel fernandez')
    })
  })

  describe('findByNormalizedString', () => {
    const testItems = [
      { id: 1, name: 'José García', category: 'A' },
      { id: 2, name: 'María López', category: 'B' },
      { id: 3, name: 'Ángel Fernández', category: 'A' },
      { id: 4, name: 'Pedro Sánchez', category: 'C' },
    ]

    it('debe encontrar elemento por coincidencia normalizada exacta', () => {
      const result = findByNormalizedString(testItems, 'jose garcia')
      expect(result).toBe(1)
    })

    it('debe encontrar elemento ignorando acentos', () => {
      const result = findByNormalizedString(testItems, 'Angel Fernandez')
      expect(result).toBe(3)
    })

    it('debe encontrar elemento ignorando mayúsculas y minúsculas', () => {
      const result = findByNormalizedString(testItems, 'MARIA LOPEZ')
      expect(result).toBe(2)
    })

    it('debe encontrar elemento con coincidencia parcial', () => {
      const result = findByNormalizedString(testItems, 'garcia')
      expect(result).toBe(1)
    })

    it('debe retornar null si no se encuentra', () => {
      const result = findByNormalizedString(testItems, 'No Existe')
      expect(result).toBeNull()
    })

    it('debe retornar null para valor de búsqueda vacío', () => {
      const result = findByNormalizedString(testItems, '')
      expect(result).toBeNull()
    })

    it('debe retornar null para arreglo vacío', () => {
      const result = findByNormalizedString([], 'test')
      expect(result).toBeNull()
    })

    it('debe usar nombre de campo personalizado', () => {
      const result = findByNormalizedString(testItems, 'B', 'category')
      expect(result).toBe(2)
    })

    it('debe retornar valor de campo personalizado', () => {
      const result = findByNormalizedString(testItems, 'jose garcia', 'name', 'category')
      expect(result).toBe('A')
    })

    it('debe manejar diferencias de espacios en blanco', () => {
      const result = findByNormalizedString(testItems, '  jose   garcia  ')
      expect(result).toBe(1)
    })

    it('debe encontrar con coincidencia parcial inversa', () => {
      // buscar "garcía" cuando el array tiene "josé garcía"
      const result = findByNormalizedString(testItems, 'sanchez')
      expect(result).toBe(4)
    })

    it('debe funcionar con valores de búsqueda acentuados', () => {
      const result = findByNormalizedString(testItems, 'María López')
      expect(result).toBe(2)
    })

    it('debe retornar la primera coincidencia cuando hay múltiples', () => {
      // Varios items con categoría 'A'
      const result = findByNormalizedString(testItems, 'A', 'category')
      expect(result).toBe(1) // Debe retornar el primero encontrado
    })

      describe('con diferentes tipos de datos', () => {
      const customItems = [
        { code: 'ABC123', description: 'Item One', value: 100 },
        { code: 'DEF456', description: 'Item Two', value: 200 },
        { code: 'GHI789', description: 'Item Three', value: 300 },
      ]

      it('debe encontrar por campos personalizados', () => {
        const result = findByNormalizedString(customItems, 'item two', 'description', 'value')
        expect(result).toBe(200)
      })

      it('debe encontrar y retornar el código', () => {
        const result = findByNormalizedString(customItems, 'Item Three', 'description', 'code')
        expect(result).toBe('GHI789')
      })
    })
  })
})
