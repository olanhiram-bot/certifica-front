import { describe, it, expect, vi } from 'vitest'
import { encryptData, decryptData } from '../encryption'

// Mock del environment variable
vi.mock('import.meta.env', () => ({
  VITE_KEY: 'test-secret-key',
}))

describe('Encryption Utils', () => {
  const testData = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
  }

  describe('encryptData', () => {
    it('debe cifrar los datos correctamente', () => {
      const encrypted = encryptData(testData)

      expect(encrypted).toBeTruthy()
      expect(typeof encrypted).toBe('string')
      expect(encrypted).not.toEqual(JSON.stringify(testData))
    })

    it('debe cifrar datos diferentes de forma distinta', () => {
      const data1 = { value: 'test1' }
      const data2 = { value: 'test2' }

      const encrypted1 = encryptData(data1)
      const encrypted2 = encryptData(data2)

      expect(encrypted1).not.toEqual(encrypted2)
    })

    it('debe manejar datos de tipo cadena', () => {
      const stringData = 'simple string'
      const encrypted = encryptData(stringData)

      expect(encrypted).toBeTruthy()
      expect(typeof encrypted).toBe('string')
    })

    it('debe manejar datos de tipo arreglo', () => {
      const arrayData = [1, 2, 3, 4, 5]
      const encrypted = encryptData(arrayData)

      expect(encrypted).toBeTruthy()
      expect(typeof encrypted).toBe('string')
    })

    it('debe manejar null e indefinido', () => {
      const encryptedNull = encryptData(null)
      const encryptedUndefined = encryptData(undefined)

      expect(encryptedNull).toBeTruthy()
      expect(encryptedUndefined).toBeTruthy()
    })
  })

  describe('decryptData', () => {
    it('debe descifrar datos previamente cifrados', () => {
      const encrypted = encryptData(testData)
      const decrypted = decryptData(encrypted)

      expect(decrypted).toEqual(testData)
    })

    it('debe manejar el cifrado/descifrado de cadenas', () => {
      const originalString = 'test string'
      const encrypted = encryptData(originalString)
      const decrypted = decryptData(encrypted)

      expect(decrypted).toEqual(originalString)
    })

    it('debe manejar el cifrado/descifrado de arreglos', () => {
      const originalArray = [1, 2, 3, 'test', { nested: 'object' }]
      const encrypted = encryptData(originalArray)
      const decrypted = decryptData(encrypted)

      expect(decrypted).toEqual(originalArray)
    })

    it('debe manejar datos cifrados inválidos de forma elegante', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result = decryptData('invalid-encrypted-string')

      expect(result).toBeUndefined()
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it('debe manejar cadena vacía', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      decryptData('')

      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('Cifrado de ida y vuelta', () => {
    it('debe mantener la integridad de los datos durante el cifrado y descifrado', () => {
      const complexData = {
        id: 123,
        user: {
          name: 'John Doe',
          email: 'john@example.com',
          roles: ['admin', 'user'],
        },
        timestamp: new Date().toISOString(),
        active: true,
        count: 42,
      }

      const encrypted = encryptData(complexData)
      const decrypted = decryptData(encrypted)

      expect(decrypted).toEqual(complexData)
    })
  })
})
