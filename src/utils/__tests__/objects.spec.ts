import { describe, it, expect } from 'vitest'
import { removeNulls, convertToFormData } from '../objects'

describe('Objects Utils', () => {
  describe('removeNulls', () => {
    it('debe eliminar valores nulos del objeto', () => {
      const input = {
        name: 'John',
        age: null,
        email: 'john@example.com',
      }
      const result = removeNulls(input)

      expect(result).toEqual({
        name: 'John',
        email: 'john@example.com',
      })
      expect(result).not.toHaveProperty('age')
    })

    it('debe eliminar valores indefinidos del objeto', () => {
      const input = {
        name: 'John',
        age: undefined,
        email: 'john@example.com',
      }
      const result = removeNulls(input)

      expect(result).toEqual({
        name: 'John',
        email: 'john@example.com',
      })
      expect(result).not.toHaveProperty('age')
    })

    it('debe eliminar tanto valores nulos como indefinidos', () => {
      const input = {
        a: 'value',
        b: null,
        c: undefined,
        d: 'another value',
      }
      const result = removeNulls(input)

      expect(result).toEqual({
        a: 'value',
        d: 'another value',
      })
    })

    it('debe conservar los valores cero', () => {
      const input = {
        name: 'John',
        age: 0,
        score: 0,
      }
      const result = removeNulls(input)

      expect(result).toEqual({
        name: 'John',
        age: 0,
        score: 0,
      })
    })

    it('debe conservar los valores de cadena vacía', () => {
      const input = {
        name: 'John',
        email: '',
        address: null,
      }
      const result = removeNulls(input)

      expect(result).toEqual({
        name: 'John',
        email: '',
      })
    })

    it('debe conservar los valores booleanos falsos', () => {
      const input = {
        name: 'John',
        active: false,
        deleted: null,
      }
      const result = removeNulls(input)

      expect(result).toEqual({
        name: 'John',
        active: false,
      })
    })

    it('debe manejar objeto vacío', () => {
      const input = {}
      const result = removeNulls(input)

      expect(result).toEqual({})
    })

    it('debe manejar objeto con solo valores nulos', () => {
      const input = {
        a: null,
        b: null,
        c: undefined,
      }
      const result = removeNulls(input)

      expect(result).toEqual({})
    })
  })

  describe('convertToFormData', () => {
    it('debe convertir objeto simple a FormData', () => {
      const input = {
        name: 'John',
        email: 'john@example.com',
        age: '30',
      }
      const result = convertToFormData(input)

      expect(result).toBeInstanceOf(FormData)
      expect(result.get('name')).toBe('John')
      expect(result.get('email')).toBe('john@example.com')
      expect(result.get('age')).toBe('30')
    })

    it('debe omitir valores nulos', () => {
      const input = {
        name: 'John',
        email: null,
        age: '30',
      }
      const result = convertToFormData(input)

      expect(result.get('name')).toBe('John')
      expect(result.get('email')).toBeNull()
      expect(result.get('age')).toBe('30')
    })

    it('debe manejar valores de arreglos añadiéndolos con sufijo []', () => {
      const input = {
        name: 'John',
        tags: ['tag1', 'tag2', 'tag3'],
      }
      const result = convertToFormData(input)

      expect(result.get('name')).toBe('John')
      expect(result.getAll('tags[]')).toEqual(['tag1', 'tag2', 'tag3'])
    })

    it('debe manejar múltiples arreglos', () => {
      const input = {
        categories: ['cat1', 'cat2'],
        permissions: ['perm1', 'perm2', 'perm3'],
      }
      const result = convertToFormData(input)

      expect(result.getAll('categories[]')).toEqual(['cat1', 'cat2'])
      expect(result.getAll('permissions[]')).toEqual(['perm1', 'perm2', 'perm3'])
    })

    it('debe manejar arreglos vacíos', () => {
      const input = {
        name: 'John',
        tags: [],
      }
      const result = convertToFormData(input)

      expect(result.get('name')).toBe('John')
      expect(result.getAll('tags[]')).toEqual([])
    })

    it('debe manejar tipos mixtos', () => {
      const input = {
        name: 'John',
        age: 30,
        active: true,
        tags: ['tag1', 'tag2'],
      }
      const result = convertToFormData(input)

      expect(result.get('name')).toBe('John')
      expect(result.get('age')).toBe('30')
      expect(result.get('active')).toBe('true')
      expect(result.getAll('tags[]')).toEqual(['tag1', 'tag2'])
    })

    it('debe manejar objeto vacío', () => {
      const input = {}
      const result = convertToFormData(input)

      expect(result).toBeInstanceOf(FormData)
      // FormData should be empty
      let hasEntries = false
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const _ of result.entries()) {
        hasEntries = true
        break
      }
      expect(hasEntries).toBe(false)
    })

    it('debe manejar objeto con solo valores nulos', () => {
      const input = {
        name: null,
        email: null,
        age: null,
      }
      const result = convertToFormData(input)

      expect(result).toBeInstanceOf(FormData)
      // FormData should be empty since all values are null
      let hasEntries = false
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const _ of result.entries()) {
        hasEntries = true
        break
      }
      expect(hasEntries).toBe(false)
    })

    it('debe manejar arreglos con valores nulos', () => {
      const input = {
        tags: ['tag1', null, 'tag2'],
      }
      const result = convertToFormData(input)

      // Should append all values including null
      expect(result.getAll('tags[]').length).toBe(3)
    })

    it('debe convertir números a cadenas de texto', () => {
      const input = {
        count: 42,
        price: 99.99,
      }
      const result = convertToFormData(input)

      expect(result.get('count')).toBe('42')
      expect(result.get('price')).toBe('99.99')
    })

    it('debe convertir booleanos a cadenas de texto', () => {
      const input = {
        active: true,
        deleted: false,
      }
      const result = convertToFormData(input)

      expect(result.get('active')).toBe('true')
      expect(result.get('deleted')).toBe('false')
    })
  })
})
