import CryptoJS from 'crypto-js'

// Clave secreta para encriptar y desencriptar los datos en el Local Storage
const secretKey = import.meta.env.VITE_KEY

/**
 * Función para encriptar los datos antes de almacenarlos en el Local Storage
 *
 * @param data
 * @returns string
 */
export function encryptData(data: unknown): string {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString()
}

/**
 * Función para desencriptar los datos
 *
 * @param encryptedData
 * @returns unknown
 */
export function decryptData(encryptedData: string): unknown {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey)
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8)
    return JSON.parse(decryptedData)
  } catch (error) {
    console.error('Error to decrypt data', 'Posible clave corrupta', error)
  }
}
